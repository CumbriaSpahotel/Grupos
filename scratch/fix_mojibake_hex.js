const fs = require('fs');
const path = 'c:\\Users\\comun\\Documents\\GitHub\\Grupos\\Fac Prof.html';

let buffer = fs.readFileSync(path);

// Common corrupted sequences in UTF-8 represented as hex
const replacements = [
    [Buffer.from([0xC3, 0x83, 0xC2, 0xAD]), Buffer.from('í')],
    [Buffer.from([0xC3, 0x83, 0xC2, 0xB3]), Buffer.from('ó')],
    [Buffer.from([0xC3, 0x83, 0xC2, 0xA1]), Buffer.from('á')],
    [Buffer.from([0xC3, 0x83, 0xC2, 0xA9]), Buffer.from('é')],
    [Buffer.from([0xC3, 0x83, 0xC2, 0xBA]), Buffer.from('ú')],
    [Buffer.from([0xC3, 0x83, 0xC2, 0xB1]), Buffer.from('ñ')],
    [Buffer.from([0xC3, 0x83, 0xE2, 0x80, 0x9A]), Buffer.from('á')],
    [Buffer.from([0xC3, 0x83, 0xE2, 0x80, 0xA0]), Buffer.from('é')],
    [Buffer.from([0xC3, 0x83, 0x21]), Buffer.from('í')],
    [Buffer.from([0xC3, 0x83, 0x22]), Buffer.from('ó')],
    [Buffer.from([0xC3, 0x83, 0xBA]), Buffer.from('ú')],
    [Buffer.from([0xC3, 0x83, 0x81]), Buffer.from('Á')],
    [Buffer.from([0xC3, 0x83, 0x89]), Buffer.from('É')],
    [Buffer.from([0xC3, 0x83, 0x8D]), Buffer.from('Í')],
    [Buffer.from([0xC3, 0x83, 0x93]), Buffer.from('Ó')],
    [Buffer.from([0xC3, 0x83, 0x9A]), Buffer.from('Ú')],
    [Buffer.from([0xC3, 0x83, 0x91]), Buffer.from('Ñ')],
    [Buffer.from([0xC3, 0x82, 0xBF]), Buffer.from('¿')],
    [Buffer.from([0xC3, 0x82, 0xA1]), Buffer.from('¡')],
    [Buffer.from([0xC3, 0x83, 0xA1]), Buffer.from('á')],
    [Buffer.from([0xC3, 0x83, 0xA9]), Buffer.from('é')],
    [Buffer.from([0xC3, 0x83, 0xAD]), Buffer.from('í')],
    [Buffer.from([0xC3, 0x83, 0xB3]), Buffer.from('ó')],
    [Buffer.from([0xC3, 0x83, 0xBA]), Buffer.from('ú')],
    [Buffer.from([0xC3, 0x83, 0xB1]), Buffer.from('ñ')],
    [Buffer.from('á'), Buffer.from('á')],
    [Buffer.from('é'), Buffer.from('é')],
    [Buffer.from('Ã\xad'), Buffer.from('í')],
    [Buffer.from('ó'), Buffer.from('ó')],
    [Buffer.from('ú'), Buffer.from('ú')],
    [Buffer.from('ñ'), Buffer.from('ñ')],
    [Buffer.from('Ã‰'), Buffer.from('É')],
    [Buffer.from('Â¿'), Buffer.from('¿')],
    [Buffer.from('Â¡'), Buffer.from('¡')],
    [Buffer.from('ón'), Buffer.from('ón')],
    [Buffer.from('Ã\xad'), Buffer.from('í')],
    [Buffer.from('Página'), Buffer.from('Página')],
    [Buffer.from('número'), Buffer.from('número')],
    [Buffer.from('régimen'), Buffer.from('régimen')],
    [Buffer.from('confirmación'), Buffer.from('confirmación')],
    [Buffer.from('GarantÃ\xada'), Buffer.from('Garantía')],
    [Buffer.from('Liquidación'), Buffer.from('Liquidación')],
    [Buffer.from('TÃ‰RMINOS'), Buffer.from('TÉRMINOS')]
];

function replaceAll(buf, target, replacement) {
    let result = [];
    let i = 0;
    while (i < buf.length) {
        if (buf.slice(i, i + target.length).equals(target)) {
            result.push(...replacement);
            i += target.length;
        } else {
            result.push(buf[i]);
            i++;
        }
    }
    return Buffer.from(result);
}

replacements.forEach(([target, replacement]) => {
    buffer = replaceAll(buffer, target, replacement);
});

// Final check for the specific ones in the screenshot
let s = buffer.toString('utf8');
s = s.replace(/GarantÃaa/g, 'Garantía');
s = s.replace(/LĂMITE/g, 'LÍMITE');
s = s.replace(/TÃ%RMINOS/g, 'TÉRMINOS');
s = s.replace(/âœ•/g, '✖');
s = s.replace(/Pǭgina/g, 'Página');
s = s.replace(/nǧmero/g, 'número');
s = s.replace(/rǸgimen/g, 'régimen');
s = s.replace(/cortǸs/g, 'cortés');
s = s.replace(/confirmacin/g, 'confirmación');
s = s.replace(/informacin/g, 'información');
s = s.replace(/mdulos/g, 'módulos');
s = s.replace(/habitacin/g, 'habitación');
s = s.replace(/dinǭmicos/g, 'dinámicos');

// Fix "no se ve todo" - Layout adjustments
s = s.replace(/text-\[7\.5px\] font-black text-slate-400 uppercase tracking-\[0\.2em\]/g, "text-[9.5px] font-black text-slate-400 uppercase tracking-[0.1em]");
s = s.replace(/text-\[7\.5px\] font-bold \$\{isPaid \? 'text-emerald-700' : 'text-slate-500'\} uppercase editable/g, "text-[9px] font-bold ${isPaid ? 'text-emerald-700' : 'text-slate-500'} uppercase editable");

fs.writeFileSync(path, s, 'utf8');
console.log('Hex-based cleanup complete');
