const MAX_ROWS_PER_SLIDE = 8;

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
  const maxVisibleRows = Math.min(rowCount, MAX_ROWS_PER_SLIDE);
  const availableBodyHeight = 4.75;
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
    warning: ''
  };
}

function splitRows(rows, size = MAX_ROWS_PER_SLIDE) {
  const chunks = [];
  for (let start = 0; start < rows.length; start += size) chunks.push(rows.slice(start, start + size));
  return chunks;
}

function expandTableSlides(content) {
  const planned = cloneJson(content);
  const expanded = [];
  (planned.slides || []).forEach((slide) => {
    const rows = Array.isArray(slide.rows) ? slide.rows : [];
    if (!['table', 'compliance_matrix'].includes(slide.type) || rows.length <= MAX_ROWS_PER_SLIDE) {
      expanded.push(slide);
      return;
    }

    const chunks = splitRows(rows);
    chunks.forEach((chunk, index) => {
      const part = index + 1;
      const continuation = part > 1;
      const originalTitle = slide.title || (slide.type === 'compliance_matrix' ? 'Compliance Matrix' : 'Table');
      expanded.push({
        ...slide,
        id: continuation && slide.id ? `${slide.id}-continued-${part}` : slide.id,
        title: continuation ? `${originalTitle} (continued ${part}/${chunks.length})` : originalTitle,
        rows: chunk,
        _tableContinuation: { part, totalParts: chunks.length, sourceTitle: originalTitle }
      });
    });
  });
  planned.slides = expanded;
  return planned;
}

function applyTableFormatting(content) {
  const planned = expandTableSlides(content);
  planned._tableFormatting = {
    generatedBy: 'src/tableFormatter.js',
    maxRowsPerSlide: MAX_ROWS_PER_SLIDE,
    tables: []
  };
  planned.slides = (planned.slides || []).map((slide, idx) => {
    if (!['table', 'compliance_matrix'].includes(slide.type)) return slide;
    const format = estimateTableFormat(slide);
    planned._tableFormatting.tables.push({
      slideNumber: idx + 1,
      title: slide.title || '',
      continuation: slide._tableContinuation || null,
      ...format
    });
    return { ...slide, _tableFormat: format };
  });
  return planned;
}

module.exports = {
  MAX_ROWS_PER_SLIDE,
  applyTableFormatting,
  estimateTableFormat,
  expandTableSlides
};
