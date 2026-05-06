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
    var db = firebase.firestore();

    // Compatibilidad de red/proxy: reduce errores 400 en canal Listen (WebChannel)
    // Debe ejecutarse antes de usar lecturas/escrituras.
    try {
        db.settings({
            experimentalAutoDetectLongPolling: true,
            useFetchStreams: false
        });
    } catch (e) {
        // Si Firestore ya fue usado antes de aplicar settings, ignoramos para no romper la app.
        console.warn("[Firebase] No se pudo aplicar settings de red:", e && e.message ? e.message : e);
    }

    window.db = db;

})();
