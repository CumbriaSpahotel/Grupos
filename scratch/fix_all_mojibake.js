const fs = require('fs');
const path = require('path');

const files = [
    'Admin.html',
    'AltaEmail.html',
    'Configuracion.html',
    'Fac Prof.html',
    'Gestion-de-Grupos.html',
    'index.html',
    'Orden Servicio.html',
    'Presupuestos.html',
    'Proformas.html'
];

const dir = 'c:\\Users\\comun\\Documents\\GitHub\\Grupos';

const replacements = [
    [/Análisis IA/g, 'Análisis IA'],
    [/Menús/g, 'Menús'],
    [/Turísticos/g, 'Turísticos'],
    [/Cócteles/g, 'Cócteles'],
    [/Configuración/g, 'Configuración'],
    [/Análisis/g, 'Análisis'],
    [/GarantÃaa/g, 'Garantía'],
    [/Liquidación/g, 'Liquidación'],
    [/confirmación/g, 'confirmación'],
    [/Información/g, 'Información'],
    [/RAZÃ“N SOCIAL/g, 'RAZÓN SOCIAL'],
    [/Dirección/g, 'Dirección'],
    [/Población/g, 'Población'],
    [/á/g, 'á'],
    [/é/g, 'é'],
    [/í/g, 'í'],
    [/ó/g, 'ó'],
    [/ú/g, 'ú'],
    [/ñ/g, 'ñ'],
    [/Ã‰/g, 'É'],
    [/Â¿/g, '¿'],
    [/Â¡/g, '¡']
];

files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        let changed = false;
        replacements.forEach(([reg, rep]) => {
            if (reg.test(content)) {
                content = content.replace(reg, rep);
                changed = true;
            }
        });
        if (changed) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Fixed mojibake in ${file}`);
        }
    }
});
