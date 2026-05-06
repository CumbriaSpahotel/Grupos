const fs = require('fs');
const path = 'c:\\Users\\comun\\Documents\\GitHub\\Grupos\\Fac Prof.html';

let content = fs.readFileSync(path, 'utf8');

const map = {
    'GarantÃ\\u00ada': 'Garantía',
    'GarantÃaa': 'Garantía',
    'Liquidación': 'Liquidación',
    'LiquidaciÃ\\u00b3n': 'Liquidación',
    'confirmación': 'confirmación',
    'confirmaciÃ\\u00b3n': 'confirmación',
    'TÃ‰RMINOS': 'TÉRMINOS',
    'TÃ\\u2030RMINOS': 'TÉRMINOS',
    'Â¿': '¿',
    'Â¡': '¡',
    'á': 'á',
    'é': 'é',
    'í': 'í',
    'ó': 'ó',
    'ú': 'ú',
    'ñ': 'ñ',
    'Ã‘': 'Ñ',
    'Página': 'Página',
    'número': 'número',
    'régimen': 'régimen',
    'cortés': 'cortés',
    'aquí': 'aquí',
    'línea': 'línea'
};

// Also handle the specific mojibake seen in logs if they persist
// This is a more robust way to fix the file strings
content = content.replace(/GarantÃaa/g, 'Garantía');
content = content.replace(/GarantÃ\xada/g, 'Garantía');
content = content.replace(/Liquidación/g, 'Liquidación');
content = content.replace(/confirmación/g, 'confirmación');
content = content.replace(/TÃ‰RMINOS/g, 'TÉRMINOS');
content = content.replace(/TÃ\x89RMINOS/g, 'TÉRMINOS');
content = content.replace(/TÃ\x83\x89RMINOS/g, 'TÉRMINOS');
content = content.replace(/Página/g, 'Página');
content = content.replace(/Ã\x83\x81/g, 'Á');
content = content.replace(/Ã\x83\x89/g, 'É');
content = content.replace(/Ã\x83\x8d/g, 'Í');
content = content.replace(/Ã\x83\x93/g, 'Ó');
content = content.replace(/Ã\x83\x9a/g, 'Ú');
content = content.replace(/Ã\x83\x91/g, 'Ñ');

// Let's do a more general UTF8-in-UTF8 cleanup
function decodeUtf8(s) {
  try {
    return decodeURIComponent(escape(s));
  } catch (e) {
    return s;
  }
}

// Just replace the known bad strings from the screenshot and logs
const replacements = [
    [/GarantÃaa/g, 'Garantía'],
    [/GarantÃ\xada/g, 'Garantía'],
    [/Liquidación/g, 'Liquidación'],
    [/LiquidaciÃ\xaddn/g, 'Liquidación'],
    [/TÃ‰RMINOS/g, 'TÉRMINOS'],
    [/TÃ\x83%RMINOS/g, 'TÉRMINOS'],
    [/TÃ\x83\x89RMINOS/g, 'TÉRMINOS'],
    [/confirmación/g, 'confirmación'],
    [/Página/g, 'Página'],
    [/Pǭgina/g, 'Página'],
    [/nǧmero/g, 'número'],
    [/rǸgimen/g, 'régimen'],
    [/cortǸs/g, 'cortés'],
    [/lnea/g, 'línea'],
    [/aqu/g, 'aquí'],
    [/Guardado!/g, '¡Guardado!'],
    [/Estǭs/g, '¿Estás'],
    [/sNICAMENTE/g, 'ÚNICAMENTE'],
    [/RǸgimen/g, 'Régimen'],
    [/Aǟadir/g, 'Añadir'],
    [/Añadir/g, 'Añadir'],
    [/AÃ\x83\x82\x21adir/g, 'Añadir']
];

replacements.forEach(([reg, rep]) => {
    content = content.replace(reg, rep);
});

// Final check for the specific one in the screenshot: "TÃ%RMINOS DE PAGO" 
// It might be TÃ\x83%RMINOS or something similar
content = content.replace(/TÃ\x83%RMINOS/g, 'TÉRMINOS');
content = content.replace(/TÃ%RMINOS/g, 'TÉRMINOS');

fs.writeFileSync(path, content, 'utf8');
console.log('Cleanup complete');
