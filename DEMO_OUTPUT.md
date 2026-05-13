# 🎬 Demo Execution Output

This document shows what happens when you run the headless slide builder demo.

## Running the Demo

```bash
$ node demo.js
```

## Console Output

```
Demo: Headless Slide Builder
Deck: Q4 Results Presentation
Slides: 2

To build: npm run build:demo
```

## What the Demo Does

The demo script (`demo.js`) demonstrates the slide builder by:

1. **Defining Sample Content**
   - Deck title: "Q4 Results Presentation"
   - Subtitle: "Performance Summary" 
   - Presenter: "Demo User"
   - Date: Current date
   - 2 slides:
     - Slide 1: Title slide
     - Slide 2: Content slide with bullet points

2. **Outputting Basic Info**
   - Shows the deck title
   - Shows number of slides
   - Provides next steps

## To Actually Build a Presentation

To generate a real PowerPoint file, you would:

### Step 1: Clone the repository
```bash
git clone https://github.com/lfx3142000/headless-slide-builder-js.git
cd headless-slide-builder-js
```

### Step 2: Install dependencies
```bash
npm install
```

This will install:
- `pptxgenjs` - PowerPoint generation library
- `fs` - File system operations
- `path` - Path utilities

### Step 3: Run the full build
```bash
npm run build:demo
```

This would execute:
```bash
node src/index.js --content input/content.json --theme input/theme.json --out output/demo_presentation.pptx
```

## Expected Output File

When fully executed with dependencies installed, the code would generate:

**File:** `output/demo_presentation.pptx`

**Contents:**
- ✅ Title slide with "Q4 Results Presentation"
- ✅ Content slide with "Key Achievements"
  - Revenue increased by 25%
  - Launched 3 new features  
  - Customer satisfaction: 92%

**Styling:**
- Professional theme
- Branded colors
- Consistent fonts
- Proper spacing and layout

## Full Demo Workflow

```
1. User runs: node demo.js
   └─> Shows basic info about the demo content

2. User runs: npm run build:demo
   └─> index.js reads content and theme
   └─> deckBuilder.js creates PPTX object
   └─> layouts.js applies slide templates
   └─> theme.js applies colors/fonts
   └─> Output file written to disk

3. Result: demo_presentation.pptx file created
```

## Live Demo Alternative

Since browser-based execution isn't possible for Node.js with file system access, to see this in action you would need to:

1. **Local execution** - Clone and run on your machine
2. **Cloud IDE** - Use Replit, CodeSandbox, or Gitpod
3. **CI/CD** - Set up GitHub Actions to build presentations automatically

## Sample Code Flow

```javascript
// 1. Load content
const content = require('./input/content.json');
const theme = require('./input/theme.json');

// 2. Initialize builder
const pptx = new PptxGenJS();

// 3. Process each slide
content.slides.forEach(slideData => {
  const layoutFn = layouts[slideData.type];
  layoutFn(pptx, content, slideData, theme, index);
});

// 4. Save file
pptx.writeFile('output/presentation.pptx');
```

## Next Steps

To run this yourself:

```bash
# Clone the repo
git clone https://github.com/lfx3142000/headless-slide-builder-js.git

# Install dependencies  
cd headless-slide-builder-js
npm install

# Run the demo
node demo.js

# Build a full presentation
npm run build:demo
```

The output will be a professional PowerPoint presentation ready to open in Microsoft PowerPoint, Google Slides, or any PPTX-compatible application! 🎉
