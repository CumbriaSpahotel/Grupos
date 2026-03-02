/**
 * ═══════════════════════════════════════════════════════════
 * NEXUS GROUPS — Integración con Gemini AI
 * ═══════════════════════════════════════════════════════════
 * Función centralizada para llamadas a la API de Gemini.
 * Sustituye las 4+ copias duplicadas en los HTML.
 *
 * Dependencias: Firebase debe estar inicializado antes.
 * Uso: <script src="js/gemini.js"></script>
 *      await window.callGemini("tu prompt aquí");
 * ═══════════════════════════════════════════════════════════
 */

(function () {
    "use strict";

    /**
     * Llama a la API de Gemini con un prompt personalizado.
     * Intenta primero obtener la API key y modelo de Firestore (settings/main),
     * y usa la API key de Firebase como fallback.
     *
     * @param {string} customPrompt - El texto del prompt
     * @returns {Promise<string>} - La respuesta generada por Gemini
     */
    async function callGemini(customPrompt) {
        var apiKey = window.firebaseConfig ? window.firebaseConfig.apiKey : null;
        var model = "gemini-1.5-flash";

        // Intentar obtener configuración dinámica de Firestore
        try {
            var db = firebase.firestore();
            var settingsDoc = await db.collection("settings").doc("main").get();
            if (settingsDoc.exists) {
                var s = settingsDoc.data().system || {};
                if (s.geminiApiKey) apiKey = s.geminiApiKey;
                if (s.geminiModel) model = s.geminiModel;
            }
        } catch (e) {
            console.warn("[Gemini] No se pudo cargar config de Firestore, usando fallback.");
        }

        if (!apiKey || apiKey === "TU_API_KEY_AQUI") {
            return "⚠️ ERROR: No se ha configurado la API Key de Gemini en el panel de Configuración.";
        }

        var url =
            "https://generativelanguage.googleapis.com/v1/models/" +
            model +
            ":generateContent?key=" +
            apiKey;

        try {
            var response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: customPrompt }] }],
                }),
            });

            if (!response.ok) {
                var error = await response.json();
                var msg = (error.error && error.error.message) || "";

                if (msg.includes("blocked") || msg.includes("PERMISSION_DENIED")) {
                    return "🚫 ACCESO DENEGADO: Tu API Key está bloqueada o no tiene los permisos necesarios (Generative Language API) en Google AI Studio.";
                }
                if (msg.includes("leaked")) {
                    return "⚠️ Tu API Key ha sido desactivada por seguridad (leaked). Por favor, introduce una nueva en el panel de Configuración.";
                }
                throw new Error("Error en servidor IA: " + (msg || JSON.stringify(error)));
            }

            var data = await response.json();
            return data.candidates[0].content.parts[0].text;
        } catch (err) {
            console.error("[Gemini] Error en llamada IA:", err);
            return "Hubo un error al conectar con la IA estratégica. Por favor, verifica tu conexión y la API Key en Configuración.";
        }
    }

    // Exportar al scope global
    window.callGemini = callGemini;

})();
