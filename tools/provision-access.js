#!/usr/bin/env node
'use strict';
// One-time privileged provisioning for Nexus Groups.
// Uses Google Application Default Credentials on a trusted administrator's
// computer. NEVER execute from a web browser or embed credentials in git.
// By default this program runs in dry-run mode.
const admin = require('firebase-admin');
const projectId = 'gest-grupos-hotel';
const args = process.argv.slice(2);
const uid = args[0], role = args[1];
const commit = args.includes('--apply');
const active = !args.includes('--revoke');
if (!uid || !['admin', 'direction', 'commercial'].includes(role)) {
  console.error('Usage: node tools/provision-access.js <UID> <admin|direction|commercial> [--apply] [--revoke]');
  process.exit(2);
}
if (!/^[a-zA-Z0-9_-]{6,128}$/.test(uid)) {
  console.error('Invalid Firebase UID');
  process.exit(2);
}
async function main() {
  if (!commit) {
    console.log('DRY RUN ONLY:', { projectId, uid, role, active });
    console.log('Run again with --apply only after verifying UID and role.');
    return;
  }
  admin.initializeApp({ projectId, credential: admin.credential.applicationDefault() });
  const authUser = await admin.auth().getUser(uid);
  if (authUser.disabled) throw new Error('Firebase Authentication user is disabled');
  const data = {
    active, role,
    email: authUser.email || null,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };
  await admin.firestore().collection('access_members').doc(uid).set(data, { merge: true });
  console.log('Membership updated:', { uid, role, active });
}
main().catch(err => { console.error(err.message); process.exit(1); });
