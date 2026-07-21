const fs = require('fs');
const path = require('path');
const { formatSpeakerNotes } = require('./speakerNotes');

function exportSpeakerNotes(content, outputPath) {
  const lines = [];
  lines.push(`# ${content.deckTitle || 'Speaker Notes'}`);
  if (content.subtitle) lines.push(`\n_${content.subtitle}_`);
  lines.push('');
  (content.slides || []).forEach((slide, idx) => {
    lines.push(`\n## Slide ${idx + 1}: ${slide.title || slide.type || 'Untitled'}`);
    const notes = formatSpeakerNotes(slide.speakerNotes);
    if (notes) lines.push(`\n${notes}`);
    else lines.push('\n_No speaker notes provided._');
  });
  const resolved = path.resolve(outputPath);
  fs.mkdirSync(path.dirname(resolved), { recursive: true });
  fs.writeFileSync(resolved, lines.join('\n'), 'utf8');
  return resolved;
}

module.exports = { exportSpeakerNotes };
