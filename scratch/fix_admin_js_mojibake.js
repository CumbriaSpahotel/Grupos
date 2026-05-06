const fs = require('fs');
const path = require('path');

const file = 'js/Admin.js';
const dir = 'c:\\Users\\comun\\Documents\\GitHub\\Grupos';

const replacements = [
    [/Análisis IA/g, 'Análisis IA'],
    [/Menús/g, 'Menús'],
    [/Turísticos/g, 'Turísticos'],
    [/Cócteles/g, 'Cócteles'],
    [/Configuración/g, 'Configuración'],
    [/Análisis/g, 'Análisis'],
    [/Crítico/g, 'Crítico'],
    [/Atención/g, 'Atención'],
    [/Ocupación/g, 'Ocupación'],
    [/está/g, 'está'],
    [/Próximas/g, 'Próximas'],
    [/Próximos/g, 'Próximos'],
    [/días/g, 'días'],
    [/Gestión/g, 'Gestión'],
    [/Sugerencia/g, 'Sugerencia'],
    [/á/g, 'á'],
    [/é/g, 'é'],
    [/í/g, 'í'],
    [/ó/g, 'ó'],
    [/ú/g, 'ú'],
    [/ñ/g, 'ñ'],
    [/Ã‰/g, 'É'],
    [/Â¿/g, '¿'],
    [/Â¡/g, '¡'],
    [/âš ï¸ /g, '⚠️'],
    [/ðŸš«/g, '🚫']
];

const filePath = path.join(dir, file);
if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    replacements.forEach(([reg, rep]) => {
        content = content.replace(reg, rep);
    });
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed mojibake in ${file}`);
}
