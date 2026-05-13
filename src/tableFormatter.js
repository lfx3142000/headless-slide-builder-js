function cloneJson(value) {
  return JSON.parse(JSON.stringify(value || {}));
}

function cellLength(value) {
  if (Array.isArray(value)) return value.join(' ').length;
  if (value && typeof value === 'object') return Object.values(value).join(' ').length;
  return String(value || '').length;
}

function estimateTableFormat(slide) {
  const rows = slide.rows || [];
  const headers = slide.headers || slide.columns || [];
  const colCount = Math.max(headers.length, Array.isArray(rows[0]) ? rows[0].length : Object.keys(rows[0] || {}).length, 1);
  const rowCount = rows.length;
  const longestCell = Math.max(0, ...rows.flatMap((row) => Array.isArray(row) ? row.map(cellLength) : Object.values(row).map(cellLength)), ...headers.map(cellLength));
  const availableBodyHeight = 4.75;
  const maxVisibleRows = rowCount > 10 ? 10 : rowCount > 8 ? 8 : rowCount;
  const rowH = Math.max(0.36, Math.min(0.62, availableBodyHeight / Math.max(maxVisibleRows + 1, 1)));
  const fontSize = longestCell > 80 || colCount > 5 || rowCount > 8 ? 7.1 : longestCell > 50 || colCount > 4 ? 8.0 : 9.0;
  return {
    colCount,
    rowCount,
    longestCell,
    maxVisibleRows,
    rowH,
    fontSize,
    headerFontSize: Math.max(6.8, fontSize - 0.2),
    emphasizeFirstColumn: true,
    alternateRows: true,
    warning: rowCount > maxVisibleRows ? `${rowCount - maxVisibleRows} rows not displayed by this slide layout.` : ''
  };
}

function applyTableFormatting(content) {
  const planned = cloneJson(content);
  planned._tableFormatting = {
    generatedBy: 'src/tableFormatter.js',
    tables: []
  };
  planned.slides = (planned.slides || []).map((slide, idx) => {
    if (!['table', 'compliance_matrix'].includes(slide.type)) return slide;
    const format = estimateTableFormat(slide);
    planned._tableFormatting.tables.push({ slideNumber: idx + 1, title: slide.title || '', ...format });
    return { ...slide, _tableFormat: format };
  });
  return planned;
}

module.exports = {
  applyTableFormatting,
  estimateTableFormat
};
