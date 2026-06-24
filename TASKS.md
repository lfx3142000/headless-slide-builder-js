# Headless Slide Builder (JS) - Task List

## Project Summary

This JavaScript slide-generation engine converts structured content JSON and theme JSON into formatted PowerPoint decks. It is intended to support health-physics training content and other structured presentations with repeatable layouts, reports, and review artifacts.

**Owner:** lfx3142000

**Status:** Active - core builder and code-only reliability workflow verified; real-content validation is next

**Tech stack:** JavaScript, Node.js, PptxGenJS, JSON inputs, LibreOffice/Poppler/Pillow for previews
**Working approach:** AI can be used manually to draft content or review contact sheets, but no AI API integration is in scope

## Verified State - 2026-06-23

- The full-feature demo builds successfully as a 28-slide `.pptx` deck.
- The builder exports planned content, speaker notes, quality, deck-summary, reference, and visual-review reports.
- Oversized tables and compliance matrices are split into continuation slides, avoiding data loss.
- `--deck` builds a self-contained deck package; `--strict-assets` and `--strict-provenance` enable production-oriented validation.
- The repository includes a prebuilt demo deck, slide PNGs, and a one-page contact sheet under `demo-outputs/`; a refreshed 28-slide output was rendered and inspected on 2026-06-23.
- Local preview generation supports `SOFFICE_PATH`, `PDFTOPPM_PATH`, and `PYTHON_PATH` overrides. GitHub Actions installs the required renderer dependencies for its demo run.
- The four images used by the full demo are present locally, generated with Codex on 2026-06-24, and include prompt provenance. The full demo passes strict asset and provenance validation.

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
| 17 | Add deck-specific input folders and a `--deck` CLI option | Done | Deck-folder mode writes all artifacts under the package `output/` directory. |
| 18 | Enforce strict asset validation and image provenance | Done | `--strict-assets` and `--strict-provenance` fail on unresolved images or missing source/prompt metadata. |
| 19 | Make preview and contact-sheet generation predictable | Done | Renderer paths are configurable and missing dependencies produce clear instructions. |
| 20 | Fix unsafe table overflow handling | Done | Tables and compliance matrices are split into eight-row continuation slides. |
| 21 | Add automated tests and a deterministic dependency lockfile | Done | `node --test` covers deck mode, table pagination, validation, quality reporting, and provenance. |
| 22 | Harden GitHub Actions delivery | Done | CI uses `npm ci`, strict assets, read-only permissions, and workflow artifacts without auto-commits. |
| 23 | Refresh the documentation after each verified build change | Done | Documentation updated after the 2026-06-23 code build and visual QA. |
| 24 | Replace legacy demo images with attributable assets | Done | Four purpose-built image assets added with generation-prompt provenance and visually reviewed in the full demo. |
| 25 | Replace or remove unused legacy image-manifest entries | Pending | Keep manifests aligned with actual, approved assets. |

## Current Architecture

- **Inputs:** `content.json`, `theme.json`, and local image assets/manifests; optionally packaged under `decks/<deck-id>/`.
- **Planning:** slide IDs, deck-type rules, image resolution, layout planning, design pass, fallbacks, and table formatting.
- **Output:** `.pptx`, planned-content JSON, speaker notes, quality report, deck summary, references, and visual-review prompt.
- **Optional render output:** slide PNGs and a contact-sheet PDF, with configurable renderer executable paths.
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
