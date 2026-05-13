const fs = require('fs');
const path = require('path');

function notesToString(notes) {
  if (!notes) return '';
  if (Array.isArray(notes)) return notes.map((n) => `- ${n}`).join('\n');
  if (typeof notes === 'object') {
    const labels = { talkTrack: 'Talk track', facilitatorPrompt: 'Facilitator prompt', expectedAnswer: 'Expected answer', transition: 'Transition', decisionPoint: 'Decision point' };
    return Object.entries(notes).filter(([, v]) => v).map(([k, v]) => `**${labels[k] || k}:**\n${Array.isArray(v) ? v.map(x => `- ${x}`).join('\n') : String(v)}`).join('\n\n');
  }
  return String(notes);
}

function exportSpeakerNotes(content, outputPath) {
  const lines = [];
  lines.push(`# ${content.deckTitle || 'Speaker Notes'}`);
  if (content.subtitle) lines.push(`\n_${content.subtitle}_`);
  lines.push('');
  (content.slides || []).forEach((slide, idx) => {
    lines.push(`\n## Slide ${idx + 1}: ${slide.title || slide.type || 'Untitled'}`);
    const notes = notesToString(slide.speakerNotes);
    if (notes) lines.push(`\n${notes}`);
    else lines.push('\n_No speaker notes provided._');
  });
  const resolved = path.resolve(outputPath);
  fs.mkdirSync(path.dirname(resolved), { recursive: true });
  fs.writeFileSync(resolved, lines.join('\n'), 'utf8');
  return resolved;
}

module.exports = { exportSpeakerNotes };
