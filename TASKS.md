# Headless Slide Builder (JS) — Task List

## Project Summary

AI-assisted PowerPoint / slide deck generation engine built in JavaScript. Takes a content JSON (slide bullets) and theme JSON as inputs and outputs formatted .pptx files. Designed to support the HP Training Website project by automating slide deck creation for health physics courses. Code developed in ChatGPT project, stored in GitHub, deployed via Comet for content application.

**Owner:** lfx3142000
**Status:** Active — core vibe-coded, testing content workflow
**Tech Stack:** JavaScript (pptxgenjs or similar), JSON-driven content and theme
**Notion Reference:** Comet Notebook → Slide builder page, HP Auto

---

## Task List

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | Determine language (JS chosen) | Done | |
| 2 | Set up ChatGPT project | Done | |
| 3 | Vibe code core slide generator | Done | |
| 4 | JSON content input working | Done | |
| 5 | JSON theme input working | Done | |
| 6 | Well-formatted output | Done | |
| 7 | Theme and layout options | Done | |
| 8 | Image placement support | Done | |
| 9 | Test with real HP training content | In Progress | |
| 10 | Test editing output in PowerPoint | In Progress | |
| 11 | Density/format options (instructor-led vs online) | Pending | |
| 12 | Image generation prompting workflow | Pending | |
| 13 | Quality formatting prompting | Pending | |
| 14 | Automate in Comet (run from GitHub) | Pending | Comet can't run zip; using ChatGPT |
| 15 | Determine competition and differentiation | Pending | |
| 16 | Marketing and AEO for the tool | Pending | |

---

## Current Architecture

- Input: `content.json` (slide text, bullets per slide)
- Input: `theme.json` (colors, fonts, layout preferences)
- Output: `.pptx` file
- Engine: JavaScript (run in ChatGPT Python/JS compiler or Node.js)
- Storage: This GitHub repo

---

## Location of Deliverables

- Core Generator Code: This repo (root or /src/)
- Example Content JSON: This repo under /examples/
- Example Theme JSON: This repo under /examples/
- Output PPTX Files: Google Drive + local
- Notion Project Notes: Comet Notebook → Slide builder
- Related: hp-training-website repo for course content
