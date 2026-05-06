const fs = require('fs');
const path = 'c:\\Users\\comun\\Documents\\GitHub\\Grupos\\Fac Prof.html';

let content = fs.readFileSync(path, 'utf8');

// Fix remaining obvious mojibake patterns
const patterns = [
    [/P\?GINA/g, 'PÁGINA'],
    [/PÃGINA/g, 'PÁGINA'],
    [/PÃ\x81GINA/g, 'PÁGINA'],
    [/N Reserva/g, 'Nº Reserva'],
    [/N Factura/g, 'Nº Factura'],
    [/N Bono/g, 'Nº Bono'],
    [/D\?AS/g, 'DÍAS'],
    [/DÃ\x8dAS/g, 'DÍAS'],
    [/Inscripcin/g, 'Inscripción'],
    [/confirmacin/g, 'confirmación'],
    [/Confirmacin/g, 'Confirmación'],
    [/Informacin/g, 'Información'],
    [/RAZ"N SOCIAL/g, 'RAZÓN SOCIAL'],
    [/sNICAMENTE/g, 'ÚNICAMENTE'],
    [/lnea/g, 'línea'],
    [/aqu/g, 'aquí'],
    [/estǭs/g, 'estás'],
    [/Estǭs/g, 'Estás'],
    [/o/g, '✨'],
    [/s?/g, '❌'],
    [/ŧ/g, '↩'],
    [//g, ' '], // Replace unknown with space as a last resort
];

patterns.forEach(([reg, rep]) => {
    content = content.replace(reg, rep);
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
