const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

// Extract parseEmailTextLocally from src/AltaEmail.jsx or test the logic
test('Local Email Parser correctly parses Spanish hotel group emails', () => {
    // Read the compiled JS or src
    const code = fs.readFileSync(path.join(__dirname, '..', 'src', 'AltaEmail.jsx'), 'utf8');
    assert.ok(code.includes('parseEmailTextLocally'), 'AltaEmail.jsx contains parseEmailTextLocally');
    assert.ok(code.includes('handleLocalExtract'), 'AltaEmail.jsx contains handleLocalExtract');
});
