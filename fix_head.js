const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'Fac Prof.html');
let content = fs.readFileSync(filePath, 'utf8');

// Remove the orphaned old panel content between '<!-- old panel removed -->' and the CONTENEDOR DE LA PÁGINA comment
const startMarker = '    <!-- old panel removed -->';
const endMarker = '    <!-- CONTENEDOR DE LA PÁGINA -->';

const startIdx = content.indexOf(startMarker);
const endIdx = content.indexOf(endMarker);

if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    content = content.slice(0, startIdx) + '\n' + content.slice(endIdx);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Done. Old panel removed. Lines:', content.split('\n').length);
} else {
    console.log('Markers not found:', {startIdx, endIdx});
}
