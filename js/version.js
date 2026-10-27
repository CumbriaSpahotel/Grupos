/**
 * NEXUS GROUPS — VERSIÓN ÚNICA GLOBAL DEL SISTEMA
 * ═════════════════════════════════════════════════════════════
 * Versión única compartida por todos los módulos de la aplicación.
 * Cada vez que se realice un cambio de programación en el sistema,
 * se incrementará esta versión única.
 */
(function (root) {
    "use strict";

    var versionInfo = {
        version: "V2.5.0",
        buildDate: "27/10/2026 18:25",
        name: "Nexus Groups"
    };

    root.NEXUS_VERSION = versionInfo.version;
    root.NEXUS_SYSTEM_INFO = versionInfo;

    if (typeof module !== "undefined" && module.exports) {
        module.exports = versionInfo;
    }
})(typeof window !== "undefined" ? window : globalThis);
