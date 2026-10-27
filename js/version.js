/**
 * NEXUS GROUPS — REGISTRO CENTRAL DE VERSIONES DEL SISTEMA
 * ═════════════════════════════════════════════════════════════
 * Este archivo centraliza la versión activa de cada módulo.
 * Todas las aplicaciones actualizadas al día de hoy: 27/10/2026 18:20
 */
(function (root) {
    "use strict";

    var registry = {
        system: "2.9.0",
        lastBuild: "27/10/2026 18:20",
        modules: {
            "admin.html": { code: "PANEL", name: "Panel de Control", version: "v2.9.0", date: "27/10/2026 18:20" },
            "gestion-de-grupos.html": { code: "GRUPOS", name: "Directorio Grupos", version: "v2.5.0", date: "27/10/2026 18:20" },
            "depositos.html": { code: "DEPOSITOS", name: "Depósitos y Saldos", version: "v1.1.0", date: "27/10/2026 18:20" },
            "presupuestos.html": { code: "PRESUPUESTOS", name: "Seguimiento Presupuestos", version: "v2.4.0", date: "27/10/2026 18:20" },
            "proformas.html": { code: "PROFORMAS", name: "Facturas Proforma", version: "v1.6.0", date: "27/10/2026 18:20" },
            "objetivos-grupos.html": { code: "OBJETIVOS", name: "Objetivos y Tarifas", version: "v1.5.0", date: "27/10/2026 18:20" },
            "calendario.html": { code: "CALENDARIO", name: "Calendario Operativo", version: "v2.0.0", date: "27/10/2026 18:20" },
            "configuracion.html": { code: "CONFIG", name: "Configuración", version: "v1.7.0", date: "27/10/2026 18:20" },
            "altaemail.html": { code: "ALTA_EMAIL", name: "Alta por Email", version: "v1.3.0", date: "27/10/2026 18:20" },
            "peticiones.html": { code: "PETICIONES", name: "Peticiones", version: "v1.4.0", date: "27/10/2026 18:20" },
            "fac prof.html": { code: "FAC_PROF", name: "Factura Proforma Doc", version: "v1.5.0", date: "27/10/2026 18:20" },
            "orden servicio.html": { code: "ORDEN_SERV", name: "Orden de Servicio", version: "v1.8.0", date: "27/10/2026 18:20" },
            "rooming-servicios.html": { code: "ROOMING", name: "Rooming y Servicios", version: "v1.3.0", date: "27/10/2026 18:20" }
        },
        getCurrentModule: function () {
            var path = (typeof window !== "undefined" && window.location) ? window.location.pathname : "";
            var page = "";
            try {
                page = decodeURIComponent(path.substring(path.lastIndexOf('/') + 1)).toLowerCase();
            } catch (e) {
                page = path.substring(path.lastIndexOf('/') + 1).toLowerCase();
            }
            page = page.split('?')[0].split('#')[0];
            if (!page) page = "admin.html";
            return this.modules[page] || { code: "NEXUS", name: "Nexus Groups", version: "v" + this.system, date: this.lastBuild };
        }
    };

    if (typeof module !== "undefined" && module.exports) {
        module.exports = registry;
    }
    root.NexusVersionRegistry = registry;
})(typeof window !== "undefined" ? window : globalThis);
