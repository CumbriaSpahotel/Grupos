const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const utils = require('../js/utils.js');
const source = fs.readFileSync('src/Presupuestos.jsx', 'utf8');
const start = source.indexOf('    const calcStayDays =');
const end = source.indexOf('    const addStayDays =', start);
const context = {generateDates: utils.generateDates};
vm.createContext(context);
vm.runInContext(source.slice(start, end) + ';this.count = calcStayDays;', context);
test('invalid dates in the reported screenshot do not become one night', () => {
  assert.equal(context.count('2026-11-05', '2026-10-08'), 0);
  assert.equal(context.count('2026-11-05', ''), 0);
  assert.equal(context.count('2026-11-05', '2026-11-05'), 0);
});
test('November 5 to 8 uses the three occupied dates, excluding checkout', () => {
  assert.equal(context.count('2026-11-05', '2026-11-08'), 3);
  assert.deepEqual(utils.generateDates('2026-11-05', '2026-11-08'), ['2026-11-05', '2026-11-06', '2026-11-07']);
});
test('night count is stable across the daylight-saving transition', () => {
  assert.equal(context.count('2026-10-24', '2026-10-26'), 2);
});
