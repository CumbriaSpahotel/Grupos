/* Nexus Groups access gate — staging, no production deployment.
 * Covers direct navigation to modules, not just the login page.
 * This is UI gating only: real authorization belongs to Firestore Rules
 * and privileged Cloud Functions.
 */
(function () {
  'use strict';
  const roleNames = { admin: 'Administrador', direction: 'Dirección', commercial: 'Comercial' };
  function deny(message) {
    const text = encodeURIComponent(message || 'Acceso no autorizado');
    // Never fall back to a local PIN or an offline privileged session.
    window.location.replace('index.html?authError=' + text);
  }
  if (!window.firebase || typeof firebase.auth !== 'function' ||
      !window.db || typeof window.db.collection !== 'function') {
    deny('No se puede verificar Firebase Authentication');
    return;
  }
  let sequence = 0;
  firebase.auth().onAuthStateChanged(async user => {
    const run = ++sequence;
    if (!user) { deny('Inicia sesión con Firebase'); return; }
    try {
      const snapshot = await window.db.collection('access_members').doc(user.uid).get();
      if (run !== sequence) return;
      const access = snapshot.exists ? snapshot.data() : null;
      if (!access || access.active !== true || !Object.hasOwn(roleNames, access.role)) {
        deny('Tu cuenta no tiene permiso para Nexus Groups'); return;
      }
      // UI state only; never accepted as proof of a role by the server.
      sessionStorage.setItem('nexus_session', JSON.stringify({
        uid: user.uid, id: user.uid, email: user.email,
        name: access.name || user.displayName || user.email,
        role: roleNames[access.role], loginTime: Date.now()
      }));
      localStorage.removeItem('nexus_user');
      document.documentElement.classList.remove('nexus-auth-pending');
      document.documentElement.classList.add('nexus-auth-verified');
      window.dispatchEvent(new CustomEvent('nexus-auth-verified', { detail: { uid: user.uid } }));
    } catch (error) {
      if (run !== sequence) return;
      deny('No fue posible verificar los permisos de tu cuenta');
    }
  }, () => deny('Error de verificación de identidad'));
})();
