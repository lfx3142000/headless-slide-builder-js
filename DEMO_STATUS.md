# Demo Build Status

## Current Status

**Working - verified 2026-06-23.** The previously reported `src/layouts.js` syntax error is no longer present. The complete builder and its supporting modules are in the repository, and the full-feature demo builds successfully.

The verified build produced a 27-slide PowerPoint deck and these supporting artifacts:

- planned content JSON
- speaker-notes Markdown
- quality report
- deck summary
- references report
- visual-review prompt

The repository also includes a pre-rendered demo deck, slide PNGs, and a one-page contact sheet in `demo-outputs/`.

## Verified Build Command

```bash
npm install
npm run build:demo
```

`npm run build:demo` runs `src/index.js` with the demo content and theme and writes the deck to `output/generated_deck.pptx`.

`node demo.js` is intentionally smaller: it prints a two-slide example to the console and tells the user how to run the full build. It does not write a `.pptx` file.

## Known Limitations

### Missing local sample images

The checked-in image manifest references sample files such as `assets/images/test-hero.png`, `test-meeting.png`, `test-workspace.png`, and `test-data-flow.png`, but those PNGs are not currently committed. A local build therefore warns and uses placeholders for the affected image slides.

The GitHub Actions workflow downloads temporary Picsum images for its demo build. Those images are suitable only for testing: their provenance and usage rights are not recorded for production use.

### Local preview dependencies

Preview rendering requires all of the following on `PATH`:

- LibreOffice (`soffice`) to convert PowerPoint to PDF
- Poppler (`pdftoppm`) to create slide PNGs
- Python with Pillow to make the contact sheet

If those dependencies are unavailable, deck generation still succeeds but preview and contact-sheet generation are skipped. GitHub Actions installs them for the demo workflow.

### Content-quality warnings in the current full demo

- The "Supported Slide Types Reference" table has 14 rows; the current layout displays only eight and warns that remaining rows may not render.
- Most demo slides do not contain speaker notes.
- Placeholder image rendering is allowed today; strict missing-asset failure is planned.

## GitHub Actions

`.github/workflows/demo.yml` is configured to:

1. check out the repository;
2. install Node.js, LibreOffice, Poppler, and Pillow;
3. download temporary demo images;
4. run `npm run build:demo`;
5. upload `output/` as a workflow artifact; and
6. currently copy generated output to `demo-outputs/` and commit it back to the repository.

The last behavior is acceptable for the demo but is not the intended production delivery model. The code-only backlog calls for artifact-first delivery and removal of automatic commits to `main`.

## Next Code Work

1. Add deck-specific input folders and a `--deck` command-line option.
2. Make asset validation strict and store image provenance.
3. Make local rendering/contact-sheet support predictable and diagnosable.
4. Prevent table truncation through pagination, splitting, or a clear build failure.
5. Add automated build and validation tests.

See `TASKS.md` for the source-of-truth backlog and `DEMO_OUTPUT.md` for the current build outputs.
