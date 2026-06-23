const assert = require('node:assert/strict');
const test = require('node:test');
const { applyTableFormatting, MAX_ROWS_PER_SLIDE } = require('../src/tableFormatter');

test('large tables are split into continuation slides without losing rows', () => {
  const rows = Array.from({ length: 14 }, (_, index) => [`Row ${index + 1}`, `Value ${index + 1}`]);
  const result = applyTableFormatting({
    slides: [{ type: 'table', id: 'reference', title: 'Reference', headers: ['Name', 'Value'], rows }]
  });

  assert.equal(result.slides.length, 2);
  assert.deepEqual(result.slides.map((slide) => slide.rows.length), [MAX_ROWS_PER_SLIDE, 6]);
  assert.equal(result.slides[0].title, 'Reference');
  assert.equal(result.slides[1].title, 'Reference (continued 2/2)');
  assert.equal(result.slides[1]._tableContinuation.part, 2);
  assert.equal(result._tableFormatting.tables.every((table) => table.warning === ''), true);
});
