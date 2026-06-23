# Demo Build Status

## Current Status

**Working - verified 2026-06-23.** The previously reported `src/layouts.js` syntax error is no longer present. The complete builder and its supporting modules are in the repository, and the full-feature demo builds successfully.

The verified build produced a 28-slide PowerPoint deck and these supporting artifacts:

- planned content JSON
- speaker-notes Markdown
- quality report
- deck summary
- references report
- visual-review prompt
- rendered slide PNGs and a one-page PDF contact sheet

The table reference that previously warned about dropped rows now renders as two continuation slides. The final contact sheet was visually inspected after rendering.

The repository also includes an earlier pre-rendered demo deck, slide PNGs, and a one-page contact sheet in `demo-outputs/`.

## Verified Build Command

```bash
npm install
npm run build:demo
```

`npm run build:demo` runs `src/index.js` with the demo content and theme and writes the deck to `output/generated_deck.pptx`.

Build a self-contained deck package with automatic reports:

```bash
npm run build-deck -- --deck decks/<deck-id>
```

Add `--strict-assets` to fail if an image cannot be resolved, and `--strict-provenance` to fail if available image assets have no source or generation prompt metadata.

`node demo.js` is intentionally smaller: it prints a two-slide example to the console and tells the user how to run the full build. It does not write a `.pptx` file.

## Known Limitations

### Missing local sample images

The checked-in image manifest references sample files such as `assets/images/test-hero.png`, `test-meeting.png`, `test-workspace.png`, and `test-data-flow.png`, but those PNGs are not currently committed. A normal local build therefore warns and uses placeholders for the affected image slides. `--strict-assets` makes the same missing files a build error.

The GitHub Actions workflow downloads temporary Picsum images for its demo build. Those images are suitable only for testing: their provenance and usage rights are not recorded for production use.

### Local preview dependencies

Preview rendering requires all of the following on `PATH`:

- LibreOffice (`soffice`) to convert PowerPoint to PDF
- Poppler (`pdftoppm`) to create slide PNGs
- Python with Pillow to make the contact sheet

If those dependencies are unavailable, deck generation still succeeds but preview and contact-sheet generation are skipped. Set `SOFFICE_PATH`, `PDFTOPPM_PATH`, and `PYTHON_PATH` to explicit executable paths when tools are installed outside `PATH`. GitHub Actions installs them for the demo workflow.

### Content-quality warnings in the current full demo

- Four image-layout slides use placeholders because the local sample PNG files are absent.
- Most demo slides do not contain speaker notes.
- Placeholder image rendering is allowed in normal mode; strict missing-asset failure is available with `--strict-assets`.

## GitHub Actions

`.github/workflows/demo.yml` is configured to:

1. check out the repository;
2. install Node.js, LibreOffice, Poppler, and Pillow;
3. download temporary demo images;
4. run `npm run build:demo`;
5. build in strict-asset mode; and
6. upload `output/` as a workflow artifact.

The workflow uses `npm ci`, read-only repository permissions, and artifact-first delivery. It does not commit generated files back to `main`.

## Next Code Work

1. Test the builder with real health-physics training content.
2. Replace the legacy demo images with approved, attributed assets.
3. Verify editing behavior in Microsoft PowerPoint with representative course decks.
4. Add instructor-led and online delivery variants where the course content requires them.

See `TASKS.md` for the source-of-truth backlog and `DEMO_OUTPUT.md` for the current build outputs.
