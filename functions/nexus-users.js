'use strict';
// Nexus Groups — privileged identity management through Firebase Admin SDK.
// Cloud Functions callable endpoints. No Admin SDK credentials are sent to clients.
// App Check can be enforced after clients are enrolled; authentication + role
// are mandatory regardless of the caller's origin.
const admin = require('firebase-admin');
const crypto = require('node:crypto');
const { onCall, HttpsError } = require('firebase-functions/v2/https');
if (!admin.apps.length) admin.initializeApp();
const db = admin.firestore();
const auth = admin.auth();
const options = { region: 'us-central1' };
const roles = ['admin', 'direction', 'commercial'];
const members = db.collection('access_members');
const clean = s => String(s || '').trim();
const emailOf = s => clean(s).toLowerCase();

async function requireAdmin(request) {
  if (!request.auth?.uid) throw new HttpsError('unauthenticated', 'Identificación obligatoria.');
  const actor = await members.doc(request.auth.uid).get();
  if (!actor.exists || actor.data()?.active !== true || actor.data()?.role !== 'admin')
    throw new HttpsError('permission-denied', 'Solo el administrador puede gestionar cuentas.');
  const record = await auth.getUser(request.auth.uid);
  if (record.disabled) throw new HttpsError('permission-denied', 'Cuenta deshabilitada.');
  return request.auth.uid;
}
function input(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data))
    throw new HttpsError('invalid-argument', 'Solicitud incorrecta.');
  return data;
}
function ensureRole(role) {
  if (!roles.includes(role)) throw new HttpsError('invalid-argument', 'Perfil no válido.');
  return role;
}
function ensureEmail(email) {
  const value = emailOf(email);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || value.length > 254)
    throw new HttpsError('invalid-argument', 'Correo electrónico no válido.');
  return value;
}
function ensureName(name) {
  const value = clean(name);
  if (value.length < 2 || value.length > 100)
    throw new HttpsError('invalid-argument', 'Nombre no válido.');
  return value;
}
async function ensureExisting(uid) {
  const user = await auth.getUser(uid);
  const doc = await members.doc(uid).get();
  if (!doc.exists) throw new HttpsError('not-found', 'No existe permiso de usuario.');
  return { user, data: doc.data() };
}
async function activeAdminCount() {
  const q = await members.where('role', '==', 'admin').where('active', '==', true).get();
  return q.size;
}

exports.nexusListUsers = onCall(options, async request => {
  await requireAdmin(request);
  const snap = await members.limit(150).get();
  const results = await Promise.all(snap.docs.map(async d => {
    try {
      const u = await auth.getUser(d.id);
      const v = d.data();
      return { uid: u.uid, email: u.email || '', name: v.name || u.displayName || '',
        role: v.role, active: v.active === true && !u.disabled, disabled: u.disabled,
        linked: true };
    } catch (err) {
      return { uid: d.id, email: '', name: d.data().name || '',
        role: d.data().role || 'unknown', active: false, disabled: true, linked: false };
    }
  }));
  return { users: results };
});

exports.nexusCreateUser = onCall(options, async request => {
  await requireAdmin(request);
  const data = input(request.data);
  const email = ensureEmail(data.email);
  const name = ensureName(data.name);
  const role = ensureRole(data.role);
  // Never accept a password from the administrator's browser.
  // A random password remains unknown; the user sets their own via reset.
  const randomPassword = crypto.randomBytes(36).toString('base64url') + 'Aa1!';
  let created;
  try {
    created = await auth.createUser({ email, displayName: name, password: randomPassword,
      emailVerified: false, disabled: false });
    await members.doc(created.uid).set({ name, email, role, active: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp() });
    const setupLink = await auth.generatePasswordResetLink(email);
    // Link is sensitive, supplied once to authorized admin for secure delivery.
    return { uid: created.uid, email, name, role, setupLink };
  } catch (err) {
    if (created) {
      await members.doc(created.uid).delete().catch(() => {});
      await auth.deleteUser(created.uid).catch(() => {});
    }
    if (err instanceof HttpsError) throw err;
    if (err.code === 'auth/email-already-exists')
      throw new HttpsError('already-exists', 'Este correo ya existe en Firebase Authentication.');
    throw new HttpsError('internal', 'No se pudo crear la cuenta.');
  }
});

exports.nexusUpdateUser = onCall(options, async request => {
  const actor = await requireAdmin(request);
  const { uid, role, active, name } = input(request.data);
  if (typeof uid !== 'string' || !uid || uid.length > 128)
    throw new HttpsError('invalid-argument', 'UID no válido.');
  const { user, data } = await ensureExisting(uid);
  if (user.email?.toLowerCase() === 'demo@hotel.com')
    throw new HttpsError('failed-precondition', 'La cuenta demo no puede reactivarse desde Nexus.');
  const newRole = role === undefined ? data.role : ensureRole(role);
  const newActive = active === undefined ? data.active === true : active;
  if (typeof newActive !== 'boolean')
    throw new HttpsError('invalid-argument', 'Estado no válido.');
  const newName = name === undefined ? data.name : ensureName(name);
  if (uid === actor && (newRole !== 'admin' || !newActive))
    throw new HttpsError('failed-precondition', 'No puedes retirar tu propio acceso de administrador.');
  if (data.role === 'admin' && data.active === true && (newRole !== 'admin' || !newActive)
    && await activeAdminCount() <= 1)
    throw new HttpsError('failed-precondition', 'Es necesario conservar un administrador activo.');
  // Prefer disabling credentials first for revocations; membership denies access
  // even to tokens that have not yet expired.
  if (!newActive) await members.doc(uid).update({ active: false,
    updatedAt: admin.firestore.FieldValue.serverTimestamp() });
  await auth.updateUser(uid, { disabled: !newActive, displayName: newName });
  await members.doc(uid).set({ role: newRole, active: newActive, name: newName,
    email: user.email || data.email || '',
    updatedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
  if (!newActive) await auth.revokeRefreshTokens(uid);
  return { ok: true, uid };
});

exports.nexusResetUser = onCall(options, async request => {
  await requireAdmin(request);
  const { uid } = input(request.data);
  if (typeof uid !== 'string' || !uid) throw new HttpsError('invalid-argument', 'UID no válido.');
  const { user, data } = await ensureExisting(uid);
  if (!data.active || user.disabled) throw new HttpsError('failed-precondition', 'Cuenta inhabilitada.');
  if (!user.email) throw new HttpsError('failed-precondition', 'La cuenta no tiene correo.');
  const resetLink = await auth.generatePasswordResetLink(user.email);
  return { email: user.email, resetLink };
});
