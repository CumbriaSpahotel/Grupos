/**
 * NEXUS GROUPS — REGISTRO CENTRAL DE VERSIONES DEL SISTEMA
 * ═════════════════════════════════════════════════════════════
 * Este archivo centraliza la versión activa de cada módulo.
 * Siempre que se realice un cambio de programación en cualquier módulo,
 * se incrementa su versión y la fecha de build en este archivo.
 */
(function (root) {
    "use strict";

    var registry = {
        system: "2.8.6",
        lastBuild: "27/10/2026 18:15",
        modules: {
            "admin.html": { code: "PANEL", name: "Panel de Control", version: "v2.8.6", date: "27/10/2026 18:15" },
            "gestion-de-grupos.html": { code: "GRUPOS", name: "Directorio Grupos", version: "v2.4.1", date: "27/10/2026 18:15" },
            "depositos.html": { code: "DEPOSITOS", name: "Depósitos y Saldos", version: "v1.1.0", date: "27/10/2026 18:15" },
            "presupuestos.html": { code: "PRESUPUESTOS", name: "Seguimiento Presupuestos", version: "v2.3.0", date: "22/10/2026 18:15" },
            "proformas.html": { code: "PROFORMAS", name: "Facturas Proforma", version: "v1.5.0", date: "24/10/2026 15:00" },
            "objetivos-grupos.html": { code: "OBJETIVOS", name: "Objetivos y Tarifas", version: "v1.4.1", date: "22/10/2026 14:00" },
            "calendario.html": { code: "CALENDARIO", name: "Calendario Operativo", version: "v1.9.0", date: "22/10/2026 16:55" },
            "configuracion.html": { code: "CONFIG", name: "Configuración", version: "v1.6.0", date: "24/10/2026 15:54" },
            "altaemail.html": { code: "ALTA_EMAIL", name: "Alta por Email", version: "v1.2.0", date: "24/10/2026 15:54" },
            "peticiones.html": { code: "PETICIONES", name: "Peticiones", version: "v1.3.0", date: "24/10/2026 15:54" },
            "fac prof.html": { code: "FAC_PROF", name: "Factura Proforma Doc", version: "v1.4.0", date: "20/10/2026 19:18" },
            "orden servicio.html": { code: "ORDEN_SERV", name: "Orden de Servicio", version: "v1.7.0", date: "16/10/2026 16:09" },
            "rooming-servicios.html": { code: "ROOMING", name: "Rooming y Servicios", version: "v1.2.0", date: "12/10/2026 21:54" }
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
