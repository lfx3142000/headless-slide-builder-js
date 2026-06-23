# Headless Slide Builder (JS)

Headless PowerPoint generation with Node.js and PptxGenJS. The builder takes structured content and a theme, then produces a `.pptx` deck plus planning and quality artifacts.

## Current Status

The core builder is working. On 2026-06-23, the full-feature demo built successfully as a 27-slide PowerPoint deck with planned-content, speaker-notes, quality, reference, and visual-review reports.

The current focus is code-only reliability: deck-specific input packaging, strict asset validation, predictable preview/contact-sheet generation, and test coverage. AI APIs are not part of the current implementation scope; content drafting and visual review may be done manually with an AI tool outside the codebase.

## What It Does

- Generates title, section, content, comparison, metric, chart, process, timeline, table, image, quote, closing, and reference slides.
- Applies theme colors, fonts, layout variants, and deck-level visual rhythm.
- Validates content and theme JSON, reports fit warnings, and exports planned content.
- Exports speaker notes, quality, reference, deck-summary, and visual-review reports.
- Renders slide PNGs and a one-page contact sheet when LibreOffice, Poppler, and Pillow are available.

## Requirements

- Node.js 18 or later
- npm
- Optional preview tooling: LibreOffice (`soffice`), Poppler (`pdftoppm`), and Python with Pillow

## Install

```bash
npm install
```

## Build the Full Demo

```bash
npm run build:demo
```

The full demo reads `input/content.json` and `input/theme.json` and writes artifacts to `output/`, including:

- `generated_deck.pptx`
- `planned_content.json`
- `speaker_notes.md`
- `quality_report.md`
- `deck_summary.md`
- `references.md`
- `visual_self_review_prompt.md`
- `preview/` and `contact_sheet.pdf` when preview dependencies are available

`node demo.js` is a lightweight console demonstration only; it does not create a PowerPoint file.

## Build with Custom Inputs

```bash
node src/index.js \
  --content path/to/content.json \
  --theme path/to/theme.json \
  --out output/my-deck.pptx \
  --plan-out output/planned_content.json \
  --notes output/speaker_notes.md
```

Validate without writing a deck:

```bash
npm run validate
```

## Inputs and Assets

- `content.json` contains deck metadata and the ordered `slides` array.
- `theme.json` contains colors, fonts, layout preferences, and asset configuration.
- Image slides reference files under `assets/images/`; `assets/images/images.json` describes the available images.

The repository currently contains the image manifest but not all referenced sample PNG files. A local build therefore warns and renders placeholders for those missing images. The GitHub Actions demo downloads temporary sample images before rendering; these are demonstration assets, not approved or attributed production visuals.

## Review Loop

1. Prepare or revise content and image assets.
2. Run the build.
3. Inspect the generated deck and contact sheet.
4. Use `visual_self_review_prompt.md` for a manual AI design review if desired.
5. Apply approved content, theme, asset, or layout edits and rebuild.

## Project Structure

```text
src/                 Builder, layouts, validation, reporting, and rendering modules
input/               Demo content and theme JSON
assets/images/       Image manifest and local image assets
scripts/             Contact-sheet helper
demo-outputs/        Prebuilt demo deck, previews, reports, and contact sheet
.github/workflows/   Demo build workflow
TASKS.md             Project backlog and code-only priorities
DEMO_STATUS.md       Verified demo status and known limitations
DEMO_OUTPUT.md       Build commands and generated-artifact guide
```

## GitHub Actions

`.github/workflows/demo.yml` installs the rendering dependencies, downloads temporary demo images, builds the demo, and uploads `output/` as a workflow artifact. It currently also commits refreshed demo outputs; moving generated output to artifacts-only delivery is a planned reliability improvement.

## License

MIT
