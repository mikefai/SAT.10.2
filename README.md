# Math Lab — OCT1.2

A calm, step-by-step SAT Math practice app for students who freeze up around math. Four tools: three small, low-pressure ones, and one full-length mock exam. Wrong answers are treated as clues.

- **Trap Decoder** — five classic Digital SAT-style questions. Pick a wrong answer and the app shows the exact slip that produced it, with the fix and a habit to remember. A 3-step Socratic walkthrough and a visual anchor are always one tap away.
- **Twin Question Drill** — study a solved sample (step-by-step accordion), then solve its structurally identical "twin" in three guided steps. Type a number (forgiving: `−3`, `-3`, `4/5`, `0.8`, `49π`) or choose from three options. Known mistakes get a specific explanation.
- **Formula Anchors** — slope-intercept, vertex form, the quadratic formula and the Pythagorean theorem. Move the sliders and the formula, the substituted numbers, and the picture all change together.
- **Mock Exam** — a full adaptive Math practice test matching the real 2026 Digital SAT structure: two 22-question, 35-minute modules, where your Module 1 score routes you to an easier or harder Module 2 (same multistage-adaptive design as the real exam, and the harder branch is the only one that can reach the full 800). 66 original questions across both branches, weighted to the official blueprint (Algebra, Advanced Math, Problem-Solving & Data Analysis, Geometry & Trigonometry). Flag questions, jump around freely within a module, and the timer can be hidden. The score report gives an estimated 200–800, a skill-area breakdown, every question reviewed, and a direct link back into the Trap Decoder for your weakest area.

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
| `src/content/exam/` | The 66 mock-exam questions (Module 1, easier/harder Module 2). `content.test.tsx` re-derives every answer key independently. |
| `src/lib/math/` | Pure helpers: number formatting, answer parsing, expressions, quadratics, plotting. |
| `src/lib/exam/` | Pure exam logic: adaptive routing, 200–800 scoring curve, grading and domain tallies. |
| `src/lib/progress/` | The progress reducer (including the exam sub-reducer), the localStorage-backed store, selectors. |
| `src/components/` | UI, grouped by module (`decoder`, `twins`, `anchors`, `exam`, `home`, `shell`, `visuals`). |
| `docs/superpowers/plans/` | The spec and implementation plan this app was built from. |

## Progress and privacy

Progress, the current question and the theme are stored in your browser's `localStorage` only. Nothing is sent anywhere. "Reset progress" on the Home screen clears it (two taps to confirm).

## Content provenance

All questions and passages are original SAT-style practice written for this app. They are not taken from College Board materials. Not affiliated with or endorsed by College Board. SAT® is a registered trademark of College Board.
