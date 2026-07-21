# Agent Working Agreement

## Mission

Work as autonomously as practical to advance this repository's documented slide-builder work. Treat the repository's GitHub task documents as the working backlog and complete the highest-value in-scope work without waiting for approval for routine implementation, testing, or documentation updates.

## Source of Truth

Use this order when deciding what to do:

1. The user's current request.
2. `TASKS.md` for project goals, priorities, and completion status.
3. `README.md`, `package.json`, and the current source code for the supported interface and architecture.
4. `DEMO_STATUS.md` and generated reports for historical context only; verify their claims against the current code and an actual build before relying on them.

When the task documents conflict with observed behavior, trust a reproducible build and update the stale documentation as part of the work.

## Autonomy Mandate

Do not ask for approval for normal, in-scope work. Make reasonable decisions and proceed with reading task documents, selecting tasks, editing code and documentation, installing repository-local dependencies, running builds and tests, and updating task status.

Pause only when a decision would materially expand the user's request or create an external or irreversible commitment, such as publishing outside the authorized repository scope, changing access permissions, spending money, exposing credentials, or deleting user data. State the decision needed and why it changes scope.

## Default Scope

Prioritize the code-only delivery pipeline:

- per-deck content, theme, and asset inputs;
- validation, image resolution, layout safety, and quality reporting;
- PPTX generation, preview rendering, and contact-sheet output;
- reproducible local and GitHub Actions builds;
- tests, clear CLI documentation, and accurate task status.

Do not add AI API integrations, API keys, autonomous publishing, or external image downloads unless the user explicitly asks. AI may remain a manual upstream author and downstream reviewer of the generated artifacts.

## Autonomous Execution Rules

- Select the next incomplete task that is clearly implementable from the repository context without waiting for confirmation.
- Inspect the relevant code and task documents before changing behavior.
- Make focused, backwards-compatible changes; preserve existing CLI use where reasonable.
- Add or update tests when behavior changes, and run the most relevant validation/build commands.
- Update `TASKS.md` or related documentation when work materially changes project status or assumptions.
- Report concrete results, verification performed, known limitations, and the next recommended task.

## Deck and Asset Standards

- Keep deck content, themes, assets, and generated outputs traceable to a deck-specific input set.
- Validate missing or unresolved image paths clearly. Never imply that placeholder artwork is approved final content.
- Preserve image provenance when available: source or generation prompt, rights/license information, intended slide role, and local path.
- Treat content accuracy, accessibility, and editable PowerPoint output as quality requirements.
- Render and inspect slide previews/contact sheets when rendering tools are available; otherwise state the limitation plainly.

## GitHub and Safety Boundaries

- Do not push, create pull requests, publish artifacts, alter repository permissions, or make external service changes unless the user explicitly requests it.
- Do not overwrite user changes or generated artifacts without checking repository status and explaining any conflict.
- Keep secrets out of source control and do not introduce credentials or API keys into the repository.
- Prefer workflow artifacts for generated decks rather than automatically committing generated output to `main`.

## Definition of Done

A task is done when the implementation matches the current task documents, relevant tests or build checks pass, outputs are inspectable, and documentation reflects the new state. If an environmental dependency blocks a check, complete every available verification step and record the exact limitation.
