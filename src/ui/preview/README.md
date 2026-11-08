# Creative Quest UI design preview

This is a **standalone layout fixture**, not game code. The Game Director has not approved the look and HQ has not published the UIBridge or Engine pause/resume APIs.

Open `first-world.html` directly in a browser or through a local static server. Each query renders a fixture:

| URL query | UI state |
| --- | --- |
| `?screen=hud` | first-world HUD + action area |
| `?screen=challenge` | observation evidence + writing dialog |
| `?screen=weak` | weak reasoning feedback, explanation and retry |
| `?screen=success` | successful reasoning and **fictional** reward example |
| `?screen=boss` | Boss phase 2 of 3; phase 3 locked |
| `?screen=loading` | no fake loading percentage |
| `?screen=offline` | honest local/offline messaging |
| `?screen=locked` | not-implemented feature state |

## Interaction demonstration

The HUD **افحص** button opens Level 01 Evidence Lens inspection. Select **exactly two** witnessed-behavior cards; an unsupported assumption card is a plausible distractor. The demo uses a **local, hard-coded fixture branch** to show success/weak Feedback examples and is **NOT real grading**. Hint reveals explanation; Escape / × closes the native dialog and restores focus. Boss phase 2 has proposed hypothesis/evidence selects and a feedback-only fixture; phase 3 remains locked. No save, unlock, XP or authoritative Boss state changes occur.

## Suggested QA screenshots (pending actual browser run)

Test and capture the *actual standalone files*, not a generated artist mock-up:

- `360×800` Android narrow portrait — `hud`, `challenge`, `weak`, `boss`
- `390×844` Android portrait — `challenge`, `boss`
- `740×360` landscape fallback — `hud`, `challenge`
- `1280×800` desktop — `hud`, `challenge`
- `360×800` with browser zoom at 200% and enlarged Arabic text — `challenge`

Example when Chromium is installed, run from this directory:

```bash
chromium --headless --no-sandbox --disable-gpu --hide-scrollbars \
  --window-size=360,800 --screenshot=ui-hud-360.png \
  "file://$(pwd)/first-world.html?screen=hud"
```

Do **not** call the above a completed test until a screenshot has been captured and inspected. For a focus check: open `?screen=hud`, Tab to **تفاعل**, press Enter, check that focus is inside the dialog; select evidence using Space, Tab through the two-choice counter and inspect the disabled third card; press Escape and ensure focus returns to **افحص**. In Boss preview, keyboard-select both fields and confirm that phase 3 stays locked. Verify read order with keyboard and assistive technology. Test on real Android after integration.

## Creative direction linkage

The UI fixture was reconciled against Game Director PR #11 (`cq/director/w01-creative-signoff-20261108`): W01 L01 = **inspect two witnessed behaviors**; W01 Boss phase 2 = **tentative interpretation + evidence to test**; XP is secondary on narrow phones. PR #11 approves prototyping direction, not canonical UI colors or Engine/Boss events. This preview deliberately contains **no canonical hero sprite**, world collision data, or authored environment artwork.

## Non-goals

No Engine imports, no `window` event bridge, no localStorage access, no world/character assets, no progression logic, no hidden state. UI values (`120 XP`, `+20 XP`, `2/3`) are clearly marked visual fixtures.

See `../UX-STATE-MAP.md` for audited legacy states, conceptual event map, accessibility requirements and signoff gates.
