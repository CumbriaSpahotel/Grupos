const fs = require('fs');
const content = fs.readFileSync('Presupuestos.html', 'utf8');
const scriptMatch = content.match(/<script type="text\/babel">([\s\S]*?)<\/script>/);
if (!scriptMatch) {
    console.log("No script found");
    process.exit(1);
}
const script = scriptMatch[1];
const lines = script.split('\n');

let balance = 0;
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const open = (line.match(/{/g) || []).length;
    const close = (line.match(/}/g) || []).length;
    balance += open;
    balance -= close;
    if (balance === 0 && i > 305) {
        console.log(`FIRST BALANCE 0 at line ${i + 163}: ${line.trim()}`);
        // Log previous lines for context
        for (let j = Math.max(0, i-5); j <= i; j++) {
            console.log(`  ${j + 163}: ${lines[j].trim()}`);
        }
        break;
    }
}
