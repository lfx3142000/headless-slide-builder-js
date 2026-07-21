function textValue(value) {
  if (value == null) return '';
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) return value.map(textValue).filter(Boolean).join('; ');
  if (typeof value === 'object') {
    const parts = [];
    if (value.title) parts.push(textValue(value.title));
    if (value.label) parts.push(textValue(value.label));
    if (value.value) parts.push(textValue(value.value));
    if (value.body) parts.push(textValue(value.body));
    if (value.note) parts.push(textValue(value.note));
    if (value.description) parts.push(textValue(value.description));
    return parts.filter(Boolean).join(': ');
  }
  return String(value).trim();
}

function compact(items, limit = 4) {
  return (items || [])
    .map(textValue)
    .map((item) => item.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .slice(0, limit);
}

function sentenceFragment(value) {
  return textValue(value).replace(/[.!?]+$/g, '').trim();
}

function hasSpeakerNotes(notes) {
  if (notes == null) return false;
  if (typeof notes === 'string') return notes.trim().length > 0;
  if (Array.isArray(notes)) return notes.some(hasSpeakerNotes);
  if (typeof notes === 'object') return Object.values(notes).some(hasSpeakerNotes);
  return Boolean(notes);
}

function formatSpeakerNotes(notes) {
  if (!hasSpeakerNotes(notes)) return '';
  if (Array.isArray(notes)) return compact(notes, notes.length).map((n) => `- ${n}`).join('\n');
  if (typeof notes === 'object') {
    const labels = {
      talkTrack: 'Talk track',
      facilitatorPrompt: 'Facilitator prompt',
      expectedAnswer: 'Expected answer',
      transition: 'Transition',
      decisionPoint: 'Decision point',
      reviewStatus: 'Review status'
    };
    return Object.entries(notes)
      .filter(([, value]) => hasSpeakerNotes(value))
      .map(([key, value]) => {
        const body = Array.isArray(value)
          ? compact(value, value.length).map((item) => `- ${item}`).join('\n')
          : textValue(value);
        return `${labels[key] || key}:\n${body}`;
      })
      .join('\n\n');
  }
  return textValue(notes);
}

function collectSlideCues(slide) {
  const cues = [];
  cues.push(slide.keyMessage, slide.callout, slide.body, slide.subtitle);
  cues.push(...compact(slide.bullets, 4));
  cues.push(...compact(slide.leftBullets, 2));
  cues.push(...compact(slide.rightBullets, 2));
  cues.push(...compact(slide.steps, 4));
  cues.push(...compact(slide.cards, 4));
  cues.push(...compact(slide.metrics, 4));
  cues.push(...compact(slide.items, 4));
  if (slide.quote) cues.push(`Quote: ${textValue(slide.quote)}`);
  if (slide.caption) cues.push(slide.caption);
  return compact(cues, 4);
}

function synthesizeSpeakerNotes(slide, index = 0, content = {}) {
  if (hasSpeakerNotes(slide.speakerNotes)) return slide.speakerNotes;

  const title = textValue(slide.title || slide.type || `Slide ${index + 1}`);
  const cues = collectSlideCues(slide);
  let talkTrack;

  switch (slide.type) {
    case 'title':
      talkTrack = `Open by framing "${title}"${content.subtitle ? `: ${textValue(content.subtitle)}` : ''}.`;
      break;
    case 'section':
    case 'module_intro':
      talkTrack = `Use this divider to signal the transition into "${title}".`;
      break;
    case 'comparison':
    case 'two_column':
      talkTrack = `Compare the two sides of "${title}" and call out the practical difference for the audience.`;
      break;
    case 'bar_chart':
    case 'line_chart':
    case 'metric_grid':
    case 'big_number':
      talkTrack = `Orient the audience to what the data on "${title}" is meant to show.`;
      break;
    case 'table':
    case 'compliance_matrix':
      talkTrack = `Walk the audience across the table in "${title}" by focusing on the most decision-relevant rows.`;
      break;
    case 'process':
    case 'timeline':
      talkTrack = `Explain the sequence on "${title}" from left to right or top to bottom.`;
      break;
    case 'closing':
      talkTrack = `Close the deck by reinforcing the action implied by "${title}".`;
      break;
    case 'references':
      talkTrack = `Acknowledge the source material collected for "${title}".`;
      break;
    default:
      talkTrack = `Use this slide to explain "${title}" clearly and keep the discussion anchored to the visible content.`;
  }

  if (cues.length) talkTrack += ` Emphasize: ${cues.map(sentenceFragment).filter(Boolean).join('; ')}.`;

  return {
    talkTrack,
    transition: 'Before advancing, pause for questions or confirm the audience is ready for the next point.',
    reviewStatus: 'Auto-generated from existing slide content; review before using in a live delivery.'
  };
}

module.exports = { formatSpeakerNotes, hasSpeakerNotes, synthesizeSpeakerNotes };
