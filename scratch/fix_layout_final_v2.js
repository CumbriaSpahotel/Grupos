const fs = require('fs');
const path = 'c:\\Users\\comun\\Documents\\GitHub\\Grupos\\Fac Prof.html';

let content = fs.readFileSync(path, 'utf8');

// Fix remaining obvious mojibake patterns using safe strings
const patterns = [
    ["P?GINA", "PÁGINA"],
    ["PÃGINA", "PÁGINA"],
    ["N Reserva", "Nº Reserva"],
    ["N Factura", "Nº Factura"],
    ["N Bono", "Nº Bono"],
    ["D?AS", "DÍAS"],
    ["Inscripcin", "Inscripción"],
    ["confirmacin", "confirmación"],
    ["Confirmacin", "Confirmación"],
    ["Informacin", "Información"],
    ["RAZ\"N SOCIAL", "RAZÓN SOCIAL"],
    ["sNICAMENTE", "ÚNICAMENTE"],
    ["lnea", "línea"],
    ["aqu", "aquí"],
    ["estǭs", "estás"],
    ["Estǭs", "Estás"]
];

patterns.forEach(([target, replacement]) => {
    content = content.split(target).join(replacement);
});

// Layout improvements for "no se ve todo"
// 1. Increase card padding and minimum height
content = content.replace(/class="p-2 relative z-10 flex flex-col h-full justify-between"/g, 'class="p-3 relative z-10 flex flex-col h-full justify-between" style="min-height: 80px;"');

// 2. Adjust grid gap
content = content.replace(/class="grid grid-cols-2 gap-3 mb-3"/g, 'class="grid grid-cols-2 gap-4 mb-4"');

// 3. Ensure the footer-totals container doesn't cut off
content = content.replace(/id="footer-totals"/g, 'id="footer-totals" style="padding-bottom: 20px;"');

fs.writeFileSync(path, content, 'utf8');
console.log('Final layout and string cleanup complete');
