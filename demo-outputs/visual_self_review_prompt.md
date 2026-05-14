# Visual Self-Review Prompt

Use this prompt after generating a deck preview/contact sheet. Review the slide images visually and propose edits to content JSON, theme JSON, or layout variants.

## Guardrails

- Do not change factual content unless the user explicitly asks.
- Prefer design edits: layout variant, image role, image query, theme token, spacing, font scaling, or speaker notes.
- Be specific about slide number and target JSON field.
- Keep recommendations executable by an AI coding agent.

## Deck Context

Deck: AI Presentation Design Engine Demo v10
Theme: Executive Blue Designer
Deck type: technical_explainer
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

1. title/executive_cover: AI Presentation Design Engine
2. content/card_bullets: What this version adds
3. content/card_bullets: The system has four layers
4. references: References

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
