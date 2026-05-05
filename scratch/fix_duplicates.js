const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '../src/GestionGrupos.jsx');
let content = fs.readFileSync(file, 'utf8');

// Remove the lines containing 'setDebouncedSearchTerm'
const lines = content.split('\n');
const newLines = lines.filter(line => !line.includes('setDebouncedSearchTerm'));

fs.writeFileSync(file, newLines.join('\n'), 'utf8');
console.log('Fixed duplicates.');
