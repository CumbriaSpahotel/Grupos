const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\comun\\Documents\\GitHub\\Grupos';

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            if (!file.includes('.git') && !file.includes('node_modules')) {
                results = results.concat(walk(file));
            }
        } else {
            if (file.endsWith('.html') || file.endsWith('.js')) {
                results.push(file);
            }
        }
    });
    return results;
}

const allFiles = walk(dir);

const replacements = [
    { target: Buffer.from([0xC3, 0xA1]), replacement: Buffer.from('á') }, // á
    { target: Buffer.from([0xC3, 0xA9]), replacement: Buffer.from('é') }, // é
    { target: Buffer.from([0xC3, 0xAD]), replacement: Buffer.from('í') }, // í
    { target: Buffer.from([0xC3, 0xB3]), replacement: Buffer.from('ó') }, // ó
    { target: Buffer.from([0xC3, 0xBA]), replacement: Buffer.from('ú') }, // ú
    { target: Buffer.from([0xC3, 0xB1]), replacement: Buffer.from('ñ') }, // ñ
    { target: Buffer.from([0xC3, 0x81]), replacement: Buffer.from('Á') }, // Á
    { target: Buffer.from([0xC3, 0x89]), replacement: Buffer.from('É') }, // É
    { target: Buffer.from([0xC3, 0x8D]), replacement: Buffer.from('Í') }, // Í
    { target: Buffer.from([0xC3, 0x93]), replacement: Buffer.from('Ó') }, // Ó
    { target: Buffer.from([0xC3, 0x9A]), replacement: Buffer.from('Ú') }, // Ú
    { target: Buffer.from([0xC3, 0x91]), replacement: Buffer.from('Ñ') }  // Ñ
];

// However, the issue is that the file contains the characters "á" literally in some cases, 
// or it's double-encoded.
// The screenshot shows "Análisis". This is "á" which is C3 83 C2 A1 in UTF-8 if it was double-encoded.

const literalReplacements = [
    [/Análisis/g, 'Análisis'],
    [/Menús/g, 'Menús'],
    [/Turísticos/g, 'Turísticos'],
    [/Cócteles/g, 'Cócteles'],
    [/Configuración/g, 'Configuración'],
    [/Garantía/g, 'Garantía'],
    [/Liquidación/g, 'Liquidación'],
    [/confirmación/g, 'confirmación'],
    [/Información/g, 'Información'],
    [/Próximas/g, 'Próximas'],
    [/Crítico/g, 'Crítico'],
    [/Atención/g, 'Atención'],
    [/á/g, 'á'],
    [/é/g, 'é'],
    [/í/g, 'í'],
    [/ó/g, 'ó'],
    [/ú/g, 'ú'],
    [/ñ/g, 'ñ']
];

allFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;
    literalReplacements.forEach(({0: reg, 1: rep}) => {
        if (reg.test(content)) {
            content = content.replace(reg, rep);
            changed = true;
        }
    });
    if (changed) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Fixed: ${file}`);
    }
});
