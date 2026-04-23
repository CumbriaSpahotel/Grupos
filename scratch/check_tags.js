const fs = require('fs');
const content = fs.readFileSync('Presupuestos.html', 'utf8');

let stack = [];
let regex = /<([a-zA-Z0-9]+)|<\/([a-zA-Z0-9]+)>/g;
let match;

while ((match = regex.exec(content)) !== null) {
  if (match[1]) {
    // Opening tag
    let tag = match[1];
    if (['img', 'br', 'hr', 'input', 'link', 'meta'].includes(tag.toLowerCase())) continue;
    stack.push({ tag, line: content.substring(0, match.index).split('\n').length });
  } else if (match[2]) {
    // Closing tag
    let tag = match[2];
    if (stack.length === 0) {
      console.log(`Extra </${tag}> at line ${content.substring(0, match.index).split('\n').length}`);
    } else {
      let last = stack.pop();
      if (last.tag !== tag) {
        console.log(`Mismatch: <${last.tag}> at line ${last.line} closed by </${tag}> at line ${content.substring(0, match.index).split('\n').length}`);
      }
    }
  }
}
if (stack.length > 0) {
  console.log(`Unclosed tags: ${stack.length}`);
  stack.forEach(s => console.log(`  <${s.tag}> at line ${s.line}`));
} else {
  console.log("Balanced tags");
}
