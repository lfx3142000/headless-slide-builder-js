# Demo Build Status

## Current Status

**Working - verified 2026-07-21.** The previously reported `src/layouts.js` syntax error is no longer present. The complete builder and its supporting modules are in the repository, and the editorial full-feature demo builds successfully.

The verified build produced a 28-slide PowerPoint deck and these supporting artifacts:

- planned content JSON
- speaker-notes Markdown
- quality report
- deck summary
- references report
- visual-review prompt
- rendered slide PNGs and a one-page PDF contact sheet

The table reference that previously warned about dropped rows now renders as two continuation slides. The final contact sheet was visually inspected after rendering.

The latest generated quality report scores 100/100, with 0 slides missing speaker notes, 0 missing image assets, and 0 layout fallback events. Speaker notes are deterministically synthesized from existing slide content when source-authored notes are absent.

The repository also includes an earlier pre-rendered demo deck, slide PNGs, and a one-page contact sheet in `demo-outputs/`.

## Verified Build Command

```bash
npm install
npm run build:demo-package
```

`npm run build:demo-package` runs `src/index.js` with the demo content and theme, strict asset/provenance checks, preview rendering, and contact-sheet output. It writes the current editorial deck to `output/visual-demo-editorial/headless-slide-builder-editorial-demo.pptx`.

Build a self-contained deck package with automatic reports:

```bash
npm run build-deck -- --deck decks/<deck-id>
```

Add `--strict-assets` to fail if an image cannot be resolved, and `--strict-provenance` to fail if available image assets have no source or generation prompt metadata.

`node demo.js` is intentionally smaller: it prints a two-slide example to the console and tells the user how to run the full build. It does not write a `.pptx` file.

## Known Limitations

### Missing local sample images

The four images used by the full demo (`test-hero.png`, `test-meeting.png`, `test-workspace.png`, and `test-data-flow.png`) are present in `assets/images/`. They were purpose-built with Codex image generation on 2026-06-24, and their prompt provenance is recorded in `assets/images/images.json`. The full demo passes `--strict-assets` and `--strict-provenance` without placeholders.

The GitHub Actions workflow downloads temporary Picsum images for its demo build. Those images are suitable only for testing: their provenance and usage rights are not recorded for production use.

### Local preview dependencies

Preview rendering requires all of the following on `PATH`:

- LibreOffice (`soffice`) to convert PowerPoint to PDF
- Poppler (`pdftoppm`) to create slide PNGs
- Python with Pillow to make the contact sheet

If those dependencies are unavailable, deck generation still succeeds but preview and contact-sheet generation are skipped. Set `SOFFICE_PATH`, `PDFTOPPM_PATH`, and `PYTHON_PATH` to explicit executable paths when tools are installed outside `PATH`. GitHub Actions installs them for the demo workflow.

### Content-quality notes in the current full demo

- The four image-layout slides use generated, crop-safe visuals and were visually reviewed after rendering.
- Demo slides now contain either authored or deterministic speaker notes. Auto-generated notes are marked for human review before live delivery.
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
2. Verify editing behavior in Microsoft PowerPoint with representative course decks.
3. Add instructor-led and online delivery variants where the course content requires them.
4. Add a stronger automated visual-review rubric for image crop, spacing, and hierarchy beyond the current deterministic checks.

See `TASKS.md` for the source-of-truth backlog and `DEMO_OUTPUT.md` for the current build outputs.
