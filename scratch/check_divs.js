const fs = require('fs');
const content = fs.readFileSync('Presupuestos.html', 'utf8');

let stack = [];
let tags = content.match(/<div|<\/div/g);
if (tags) {
  tags.forEach((tag, i) => {
    if (tag === '<div') stack.push(tag);
    if (tag === '</div>') {
      if (stack.length === 0) {
        console.log(`Extra </div> at index ${i}`);
      } else {
        stack.pop();
      }
    }
  });
}
console.log(`Unclosed <div> : ${stack.length}`);
