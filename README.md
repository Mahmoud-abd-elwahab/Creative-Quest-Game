# Creative Quest 2D — Independent Game Repository

The 2D Creative Thinking adventure has moved from the portfolio repository into this independent repository. Baseline is v0.4, with 100 authored levels, 10 themed worlds, sprite animation and Boss encounters. The current version is still a prototype; no reliable AI-based free-text grading without an integration.

- **Source:** previously `Mahmoud-abd-elwahab/portfolio/creative-quest-2d/`; migrated to this repository's root.
- **Development specs:** `docs/PROJECT-BIBLE.md`, `docs/AGENT-ROLES.md`, `docs/SHARED-CONTRACTS.md`.
- **Play (once GitHub Pages is enabled):** https://mahmoud-abd-elwahab.github.io/Creative-Quest-Game/
- **Important:** GitHub Pages deployment must be enabled in Settings → Pages → Deploy from a branch → main → /(root). Until Pages is confirmed, the above address is only the expected URL.
- **Save data:** localStorage key `creative-quest-2d-v02` is retained in code. Old/new GitHub Pages use the same `mahmoud-abd-elwahab.github.io` origin and can share localStorage in the same browser/profile. Installed PWA or different browsing contexts may vary. Do NOT delete the original game yet.
- **Navigation:** `index.html` is self-contained, with relative `./manifest.webmanifest`, `./icon.svg` and `./service-worker.js`.

**Migration state:** files copied; live site verification and full mobile regression are pending.
