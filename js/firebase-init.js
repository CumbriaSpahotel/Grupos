/**
 * ═══════════════════════════════════════════════════════════
 * NEXUS GROUPS — Inicialización Firebase Centralizada
 * ═══════════════════════════════════════════════════════════
 * Inicializa Firebase App y Firestore automáticamente.
 * Expone `window.db` para uso global en todas las páginas.
 *
 * Dependencias: Firebase SDK (compat), js/firebase-config.js
 * Uso: <script src="js/firebase-init.js"></script>
 *      // window.db ya está disponible
 * ═══════════════════════════════════════════════════════════
 */

(function () {
    "use strict";

    var config = window.firebaseConfig;

    if (!config) {
        console.error("[Firebase] firebaseConfig no encontrado. ¿Se cargó js/firebase-config.js?");
        return;
    }

    // Inicialización robusta — evitar duplicados
    if (!firebase.apps.length) {
        firebase.initializeApp(config);
    }

    // Exponer Firestore globalmente
    window.db = firebase.firestore();

})();
