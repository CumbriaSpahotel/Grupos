const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '../src/GestionGrupos.jsx');
let content = fs.readFileSync(file, 'utf8');

// The fragment is literally "      React.\n\n\n"
content = content.replace(/React\.\r?\n\r?\n\r?\n\r?\n/g, '\n');
content = content.replace(/React\.\r?\n\r?\n/g, '\n');

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed syntax error.');
