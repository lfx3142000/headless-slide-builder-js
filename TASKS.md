# Headless Slide Builder (JS) - Task List

## Project Summary

This JavaScript slide-generation engine converts structured content JSON and theme JSON into formatted PowerPoint decks. It is intended to support health-physics training content and other structured presentations with repeatable layouts, reports, and review artifacts.

**Owner:** lfx3142000

**Status:** Active - core builder verified; code-only reliability and workflow packaging are next

**Tech stack:** JavaScript, Node.js, PptxGenJS, JSON inputs, LibreOffice/Poppler/Pillow for previews
**Working approach:** AI can be used manually to draft content or review contact sheets, but no AI API integration is in scope

## Verified State - 2026-06-23

- The full-feature demo builds successfully as a 27-slide `.pptx` deck.
- The builder exports planned content, speaker notes, quality, deck-summary, reference, and visual-review reports.
- The repository includes a prebuilt demo deck, slide PNGs, and a one-page contact sheet under `demo-outputs/`.
- Local preview generation requires LibreOffice, Poppler, and Pillow. GitHub Actions installs these dependencies for its demo run.
- Missing local sample images currently render as placeholders; source provenance for the bundled demo visuals is not recorded.

## Existing Product Tasks

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | Determine language (JavaScript) | Done | |
| 2 | Set up ChatGPT project | Done | |
| 3 | Build core slide generator | Done | |
| 4 | Support JSON content input | Done | |
| 5 | Support JSON theme input | Done | |
| 6 | Produce formatted PowerPoint output | Done | Full-feature demo build verified on 2026-06-23. |
| 7 | Provide theme and layout options | Done | |
| 8 | Support image placement | Done | Missing paths currently fall back to placeholders. |
| 9 | Test with real HP training content | In Progress | The demo is verified; course-specific content still needs validation. |
| 10 | Test editing output in PowerPoint | In Progress | Requires human review in PowerPoint. |
| 11 | Density/format options for instructor-led vs. online delivery | Pending | |
| 12 | Image-generation prompting workflow | Deferred | Keep manual; no AI API work is currently planned. |
| 13 | Quality-formatting prompting workflow | Deferred | Keep manual contact-sheet review; no AI API work is currently planned. |
| 14 | Automate through Comet | Deferred | GitHub Actions provides the current reproducible build path. |
| 15 | Determine competition and differentiation | Pending | Product strategy work. |
| 16 | Marketing and AEO | Pending | Product strategy work. |

## Code-Only Reliability Backlog

| # | Task | Status | Notes |
|---|------|--------|-------|
| 17 | Add deck-specific input folders and a `--deck` CLI option | Pending | Replace the global demo-input assumption while retaining backwards compatibility. |
| 18 | Enforce strict asset validation and image provenance | Pending | Fail by default for missing image files; record source, rights, prompt, and slide role. |
| 19 | Make preview and contact-sheet generation predictable | Pending | Detect missing local dependencies clearly and document a supported renderer path. |
| 20 | Fix unsafe table overflow handling | Pending | Split, paginate, or fail rather than silently dropping rows. |
| 21 | Add automated tests and a deterministic dependency lockfile | Pending | Cover build, validation, assets, previews, and layout edge cases. |
| 22 | Harden GitHub Actions delivery | Pending | Use workflow artifacts by default; do not auto-commit generated output to `main`. |
| 23 | Refresh the documentation after each verified build change | In Progress | README, demo status, demo output guide, and agent instructions updated on 2026-06-23. |

## Current Architecture

- **Inputs:** `content.json`, `theme.json`, and local image assets/manifests.
- **Planning:** slide IDs, deck-type rules, image resolution, layout planning, design pass, fallbacks, and table formatting.
- **Output:** `.pptx`, planned-content JSON, speaker notes, quality report, deck summary, references, and visual-review prompt.
- **Optional render output:** slide PNGs and a contact-sheet PDF.
- **Engine:** Node.js and PptxGenJS.
- **Storage:** this GitHub repository and workflow artifacts; local builds write to `output/`.

## Deliverables and References

- Core generator: `src/`
- Demo inputs: `input/`
- Image manifest: `assets/images/images.json`
- Prebuilt demo artifacts: `demo-outputs/`
- Workflow: `.github/workflows/demo.yml`
- Project notes: Comet Notebook -> Slide builder page, HP Auto
- Related content source: `hp-training-website` repository
