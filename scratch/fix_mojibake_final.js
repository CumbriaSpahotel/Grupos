const fs = require('fs');
const path = 'c:\\Users\\comun\\Documents\\GitHub\\Grupos\\Fac Prof.html';

let content = fs.readFileSync(path, 'utf8');

// Fix common mojibake and encoding issues
const replacements = [
    [/GarantÃaa/g, 'Garantía'],
    [/GarantÃ\xada/g, 'Garantía'],
    [/Liquidación/g, 'Liquidación'],
    [/LiquidaciÃ\xaddn/g, 'Liquidación'],
    [/TÃ‰RMINOS/g, 'TÉRMINOS'],
    [/TÃ\x89RMINOS/g, 'TÉRMINOS'],
    [/confirmación/g, 'confirmación'],
    [/Página/g, 'Página'],
    [/Pǭgina/g, 'Página'],
    [/nǧmero/g, 'número'],
    [/rǸgimen/g, 'régimen'],
    [/RǸgimen/g, 'Régimen'],
    [/cortǸs/g, 'cortés'],
    [/lnea/g, 'línea'],
    [/aqu/g, 'aquí'],
    [/Guardado!/g, '¡Guardado!'],
    [/Estǭs/g, '¿Estás'],
    [/sNICAMENTE/g, 'ÚNICAMENTE'],
    [/Aǟadir/g, 'Añadir'],
    [/Añadir/g, 'Añadir'],
    [/LÃ\xadmite/g, 'Límite'],
    [/LĂMITE/g, 'Límite'],
    [/LÃ\xad\\xadmite/g, 'Límite'],
    [/âœ•/g, '✖'],
    [/â\x9c\x96/g, '✖'],
    [/Pǭgina/g, 'Página'],
    [/nǧmero/g, 'número'],
    [/rǸgimen/g, 'régimen'],
    [/cortǸs/g, 'cortés'],
    [/lnea/g, 'línea'],
    [/aqu/g, 'aquí'],
    [/TÃ\x83%RMINOS/g, 'TÉRMINOS'],
    [/TÃ%RMINOS/g, 'TÉRMINOS']
];

replacements.forEach(([reg, rep]) => {
    content = content.replace(reg, rep);
});

// Also fix some specific strings seen in the screenshot
content = content.replace(/1ER PAGO GARANTÃaa/g, '1ER PAGO GARANTÍA');
content = content.replace(/LIQUIDACIóN FINAL/g, 'LIQUIDACIÓN FINAL');
content = content.replace(/FECHA LĂMITE/g, 'FECHA LÍMITE');
content = content.replace(/TÃ%RMINOS DE PAGO/g, 'TÉRMINOS DE PAGO');

// Fix the "no se ve todo" part:
// 1. Increase font size of payment labels
content = content.replace(/text-\[7\.5px\] font-bold \$\{isPaid \? 'text-emerald-700' : 'text-slate-500'\} uppercase editable/g, "text-[9px] font-bold ${isPaid ? 'text-emerald-700' : 'text-slate-500'} uppercase editable");
// 2. Remove overflow-hidden from cards
content = content.replace(/class="rounded-xl relative overflow-hidden group\/dep"/g, 'class="rounded-xl relative group/dep"');
// 3. Fix the "ce." issue if it's related to the button or something else
// Looking at the screenshot, "ce." seems to be the end of "Indice" or something.
// Wait, I'll search for "indice" or "index" one more time.

fs.writeFileSync(path, content, 'utf8');
console.log('Final cleanup complete');
