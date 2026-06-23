# Deck Packages

Use a deck package when building a presentation outside the repository's shared demo inputs. A package keeps its source content, theme, assets, and generated artifacts together.

```text
decks/
  <deck-id>/
    content.json
    theme.json
    assets/
      images/
    output/
```

Build a package from the repository root:

```bash
npm run build-deck -- --deck decks/<deck-id>
```

Deck mode writes the PowerPoint, planned-content JSON, notes, image catalog, quality report, reference report, visual-review prompt, and—when rendering dependencies are available—slide previews and a contact-sheet PDF under that package's `output/` directory.

Use `--strict-assets` for production builds so missing image references fail the build. Use `--strict-provenance` when every available image asset must include either a source or a generation prompt in its manifest metadata.
