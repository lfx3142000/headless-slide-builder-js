# headless-slide-builder-js
Headless AI-assisted PowerPoint slide builder using Node.js and pptxgenjs

## Overview

This is a headless PowerPoint presentation builder that uses Node.js and pptxgenjs to generate professional slide decks programmatically. It supports multiple layout types, themes, and design systems.

## Features

- 🎨 **Multiple Layout Types**: Title, content, two-column, image slides, charts, and more
- 🎭 **Theme Support**: Customizable colors, fonts, and styling
- 📊 **Data Visualization**: Built-in chart and metric layouts
- 🔧 **Modular Design**: Clean separation of layouts, themes, and content
- ✅ **Quality Checking**: Built-in validation and quality reporting

## Installation

```bash
npm install
```

## Quick Start - Run the Demo

### Option 1: Run the demo script

```bash
node demo.js
```

### Option 2: Build a presentation using npm scripts

```bash
# Build demo presentation
npm run build:demo

# Build with custom files
npm run build-deck

# Validate only
npm run validate
```

### Option 3: Use programmatically

```javascript
const buildDeck = require('./src/index');

const content = {
  deckTitle: "My Presentation",
  slides: [
    { type: "title", title: "Welcome" },
    { type: "content", title: "Overview", bullets: ["Point 1", "Point 2"] }
  ]
};

const theme = { /* theme config */ };

buildDeck(content, theme, 'output/my-deck.pptx');
```

## Project Structure

```
├── src/
│   ├── index.js           # Main entry point
│   ├── deckBuilder.js     # Deck building logic
│   ├── layouts.js         # All slide layout functions
│   ├── theme.js           # Theme processing
│   └── helpers.js         # Utility functions
├── input/
│   ├── content.json       # Sample content
│   └── theme.json         # Sample theme
├── demo.js                # Demo script
└── package.json           # Dependencies and scripts
```

## Available Slide Types

- `title` - Title slide
- `section` - Section divider
- `content` - Content with bullets
- `two_column` - Two-column layout
- `image_side` - Image with text
- `comparison` - Side-by-side comparison
- `process` - Step-by-step process
- `quote` - Quote slide
- `closing` - Closing slide
- `big_number` - Metric/statistic display
- And many more...

## License

MIT
