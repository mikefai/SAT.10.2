# Math Lab — OCT1.2

A calm, step-by-step SAT Math practice app for students who freeze up around math. Three small tools, no timers, and wrong answers are treated as clues.

- **Trap Decoder** — five classic Digital SAT-style questions. Pick a wrong answer and the app shows the exact slip that produced it, with the fix and a habit to remember. A 3-step Socratic walkthrough and a visual anchor are always one tap away.
- **Twin Question Drill** — study a solved sample (step-by-step accordion), then solve its structurally identical "twin" in three guided steps. Type a number (forgiving: `−3`, `-3`, `4/5`, `0.8`, `49π`) or choose from three options. Known mistakes get a specific explanation.
- **Formula Anchors** — slope-intercept, vertex form, the quadratic formula and the Pythagorean theorem. Move the sliders and the formula, the substituted numbers, and the picture all change together.

Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4 and Lucide icons. Math is typeset with small React components (no LaTeX library). Light and dark themes.

## Run it

```bash
npm install
```

```bash
npm run dev
```

Then open <http://localhost:4182>.

Fonts (Inter and STIX Two Text) are fetched by `next/font` at build time, so the first build needs an internet connection.

## Check it

```bash
npm run verify
```

Runs ESLint, the TypeScript compiler, the Vitest suite and a production build. The suite covers the math library, the progress reducer and storage layer (including corrupted or unavailable storage), and re-derives every answer key and trap value in the content files.

## Where things live

| Path | What it holds |
| --- | --- |
| `src/content/` | All questions, traps, twin sets and anchors as typed data. `content.test.tsx` re-checks every answer. |
| `src/lib/math/` | Pure helpers: number formatting, answer parsing, expressions, quadratics, plotting. |
| `src/lib/progress/` | The progress reducer, the localStorage-backed store, selectors. |
| `src/components/` | UI, grouped by module (`decoder`, `twins`, `anchors`, `home`, `shell`, `visuals`). |
| `docs/superpowers/plans/` | The spec and implementation plan this app was built from. |

## Progress and privacy

Progress, the current question and the theme are stored in your browser's `localStorage` only. Nothing is sent anywhere. "Reset progress" on the Home screen clears it (two taps to confirm).

## Content provenance

All questions and passages are original SAT-style practice written for this app. They are not taken from College Board materials. Not affiliated with or endorsed by College Board. SAT® is a registered trademark of College Board.
