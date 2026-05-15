# Visual Self-Review Prompt

Use this prompt after generating a deck preview/contact sheet. Review the slide images visually and propose edits to content JSON, theme JSON, or layout variants.

## Guardrails

- Do not change factual content unless the user explicitly asks.
- Prefer design edits: layout variant, image role, image query, theme token, spacing, font scaling, or speaker notes.
- Be specific about slide number and target JSON field.
- Keep recommendations executable by an AI coding agent.

## Deck Context

Deck: Headless Slide Builder — Full Feature Demo
Theme: Executive Blue Designer
Deck type: project_status
Design tokens: {
  "titleSlideMood": "premium",
  "cardDensity": "airy",
  "sectionDividerEnergy": "bold",
  "imageStyle": "editorial",
  "chartStyle": "minimal",
  "tableStyle": "regulatory_clean",
  "footerStyle": "thin_rule",
  "cornerStyle": "soft",
  "iconStyle": "badge",
  "visualReviewMode": "contact_sheet"
}

## Slide List

1. title/executive_cover: Full Feature Demo
2. section/bold: Content & Bullet Layouts
3. content/standard: Standard Bullet Slide
4. content/key_message: Key Message Layout
5. content/numbered_insights: Numbered Insights
6. content/cards: Card Grid Layout
7. section/bold: Two-Column & Comparison
8. two_column/standard: Two-Column Layout
9. comparison/two_cards: Headless Builder vs Manual Design
10. section/bold: Metrics & Data Slides
11. big_number/standard: Key Performance Indicator
12. metric_grid/standard: Platform at a Glance
13. bar_chart/standard: Slide Types Usage Distribution
14. line_chart/standard: Decks Generated Per Month
15. section/bold: Process, Timeline & Tables
16. process/compact_steps: How the Builder Works
17. timeline/standard: Project Roadmap
18. table/standard: Supported Slide Types Reference
19. section/bold: Quotes & Closing
20. quote/standard: (untitled)
21. closing/executive_next_steps: Get Started Today
22. references: References

## Required Output

Return JSON only:

{
  "overallAssessment": "",
  "themeEdits": [],
  "contentEdits": [
    {
      "slideNumber": 1,
      "issue": "",
      "editTarget": "content.json | theme.json | layout code",
      "recommendedChange": "",
      "reason": ""
    }
  ],
  "priorityFixes": []
}
