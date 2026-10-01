# Oct1.2 · SAT Math Lab — Spec + Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans. The user chose **Native** execution: build every task in this session, then run one fresh whole-project review. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Create `C:\Users\mike\Desktop\SAT\Oct1.2`, a single-page SAT Math app for students with severe math anxiety. It has three modules: the Trap Decoder, the Twin Question Drill, and Interactive Formula Anchors.

**Architecture:**
- Next.js 16 App Router with one static route `/`. A client shell switches views by URL hash.
- Progress is a pure reducer inside a localStorage-backed external store, read with `useSyncExternalStore`. This is hydration-safe and passes the React Compiler lint rules.
- Math is typeset with small React components (no LaTeX). Visuals are hand-built SVG/CSS, driven by typed content files.

**Tech Stack:** Next.js 16.3.8 · React 19.3.0 · TypeScript ^5 (5.9.3) · Tailwind CSS ^4 · lucide-react ^1.49.0 · ESLint ^9 + eslint-config-next 16.3.8 · Vitest ^5

**Spec:** Part A below. Task 1 copies this whole file into the project as `Oct1.2/docs/superpowers/plans/2026-10-01-sat-math-lab.md`.

## Context
- **What exists:** `C:\Users\mike\Desktop\SAT` holds 8 official Digital SAT practice-test PDFs (tests 4–11). It also holds `OCT1.1/` "Verbal Lab": a framework-free Reading & Writing app with its own git repo, localStorage autosave, a content-validation script, and port 4181. There is no math tool yet.
- **Why:** the teacher wants a sibling math app for students who freeze up. It should show few words per screen and use small steps. It should explain each wrong answer as a specific trap and make abstract formulas concrete.
- **Outcome:** a typed, lint-clean, tested Next.js app in `Oct1.2` at `http://localhost:4182`, verified in light and dark mode on desktop and phone widths.

**Findings that shape the plan:**
- **Folder name:** `create-next-app` rejects the folder name `Oct1.2`, because npm names can't contain capitals. So the files of its 16.3.8 `app-tw/ts` template are recreated by hand (Task 1).
- **Pinned versions:** create-next-app 16.3.8 pins **TypeScript ^5 and ESLint ^9**. The registry's latest versions are TS 7.0.2 and ESLint 10.11; follow the template, not the latest.
- **Node types:** Vitest 5 needs `@types/node` ≥ 22, so use `^24` (Node 24.21 is installed).
- **Lint rules:** eslint-config-next 16.3.8 ships eslint-plugin-react-hooks 7. Its React Compiler rules forbid calling setState synchronously in an effect and reading refs during render. So progress, theme and hash state all use `useSyncExternalStore`.

## Decisions confirmed with the user
| Topic | Decision |
|---|---|
| Questions | Original SAT-style items, where each wrong choice comes from exactly one mistake. The official PDFs are not used. |
| Look | Fresh neutral design: slate + indigo, Inter for the UI, STIX Two Text for math. Amber is used only for traps. |
| Twin answers | Both modes: type one number (default) or pick from 3. One tap switches, and the choice is saved as a preference. A typed value that matches a known mistake gets that mistake's message. |
| Execution | Native, then one fresh reviewer over the whole project. |
| Git | `git init` inside `Oct1.2`, one commit per task. Never push, and add no attribution lines. |

## Global Constraints
- **Location:** `C:\Users\mike\Desktop\SAT\Oct1.2` (exact case). package.json `name`: `oct1-2-sat-math-lab`.
- **Exact pins:** `next@16.3.8`, `react@19.3.0`, `react-dom@19.3.0`, `eslint-config-next@16.3.8`.
- **Ranges:** `lucide-react@^1.49.0`, `typescript@^5`, `eslint@^9`, `tailwindcss@^4`, `@tailwindcss/postcss@^4`, `@types/node@^24`, `@types/react@^19`, `@types/react-dom@^19`, `vitest@^5`.
- **No other dependencies:** no KaTeX/MathJax, state, theme or chart libraries.
- **Routing and port:** one route `/`. Views are chosen by hash: `#home`, `#decoder`, `#twins`, `#anchors`. Dev and start both use port **4182**.
- **localStorage keys:** `oct1.2-math-lab/progress` (schema `version: 1`) and `oct1.2-math-lab/theme`.
- **Copy rules:**
  - Never say "wrong", "incorrect" or "fail" (except the one Home subline in A2).
  - At most 2 short sentences per instruction. No timers.
  - In JSX text, use typographic ’ “ ” to satisfy `react/no-unescaped-entities`.
  - Displayed math uses the real minus sign U+2212 (−).
- **Steps:** every problem has exactly 3 Socratic steps, enforced by `Triple<>` types.
- **Accessibility:** targets ≥ 44 px, WCAG AA contrast in both themes, and animation only behind `motion-safe:`.
- **Verify:** `npm run verify` (lint + typecheck + test + build) must end with 0 errors and 0 ESLint warnings.

## Review Focus
These are the input classes the spec implies but most likely to bite a real user. Each one is pinned by a test in the owning task.
1. **Corrupt, old or half-broken saved progress.** The app must still load: keep valid entries, drop bad ones, never crash. (Task 4 store tests)
2. **Storage unavailable** (private mode, blocked storage, full quota). Everything still works in memory for the session. (Task 4: `getItem`/`setItem` throw)
3. **Messy typed answers.**
   - These parse: Unicode-minus `−3`, spaces, `+3`, `.8`, `4/5`, `49π`, `1,000`.
   - These don't: `""`, `abc`, `4/0`, `--3`. They show a format hint and do **not** count as a miss. (Task 3 parse tests; Task 9 browser check)
4. **Slider extremes:** `a = 0`, `D < 0`, `D = 0`, `m = 0`, steep lines, a vertex at the edge of the graph. Formulas must format correctly and SVG paths must never contain `NaN`/`Infinity`. (Task 3 expression, quadratic and plot tests)
5. **Repeated or out-of-order actions:** double clicks, re-picking a choice, answering a locked step, spamming "Show me". State must change once, in order. (Task 4 reducer tests)

Browser-only checks (theme flash on first paint, 320 px width, keyboard-only use) are in **Final verification**.

---

# Part A — Spec

## A1. Audience rules (every screen)
- **Focus:** one job per screen region and one primary button.
- **Socratic order:** show the question first ("What does the −2 multiply?"), then reveal the move.
- **Visuals:** visual anchors build up step by step.
- **Tone:** "Not quite", "Trap spotted", "Decoded", "Nice catch". Show progress as dots and "2 of 5". No red error states.
- **Readability:** 17 px base (`html { font-size: 106.25% }`), line-height 1.6, max ~65ch.

## A2. Shell, navigation, Home
**Top bar** (sticky):
- Brand "◆ Math Lab" with a small "OCT1.2" tag.
- On md+ screens, nav buttons: Home · Trap Decoder · Twin Drill · Formula Anchors. Lucide icons `House`, `ScanSearch`, `Copy`, `SlidersHorizontal`, with `aria-current="page"` on the active one.
- A theme toggle (`Sun`/`Moon`) on the right.

**Mobile nav** (< md): a fixed bottom bar with the same 4 items (icon + label) and safe-area padding. Main content gets `pb-28`.

**Navigation behaviour:** clicking nav sets `location.hash`, so the browser Back button moves between views. On a view change (not on first load), scroll to the top and focus the view's `h1` (`tabIndex={-1}`).

**Home** contains:
- **Hero:** "SAT Math, one small step at a time." The subline "Three tools. No timers. Wrong answers are clues, not failures." is the only allowed use of "wrong". Below it, an overall progress bar.
- **"Your path":** 3 numbered module cards. Each shows a progress line ("2 of 5 decoded" / "1 of 4 twins solved" / "2 of 4 explored") and a Start / Continue / Review button.
- **Trap Journal:** traps the student fell into, grouped by trap. Each entry shows the trap name, its habit, and buttons like "Caught you on Q2 · Linear Equations" that jump to that question. Empty state: "No traps yet. When one catches you, it lands here so you’ll spot it next time."
- **Reset progress:** a two-tap confirm. "Reset progress" turns into "Tap again to reset" for 4 s.

**Footer:** "Original SAT-style practice. Not affiliated with College Board. SAT® is a trademark of College Board."

## A3. Module 1 — The Trap Decoder (5 questions)
**Behavior**
- **Header:** "The SAT builds wrong answers from common slips. Pick an answer. If it’s a trap, you’ll see exactly how it caught you."
- **Pager:** `ProgressDots` (5 dots, filled = decoded) plus Prev/Next. Position is saved in `cursor.decoder`.
- **Card:** "Question N · {Topic}", the prompt, and choices A–D. The `lesson` title appears only after solving, so it doesn't give the trap away.
- **Wrong pick:**
  - The choice gets struck through, marked with `TriangleAlert`, and disabled.
  - An amber **TrapReveal** fades in with, in order:
    - "Trap spotted: {trap name}" and the headline sentence.
    - "How this answer happens:" — the work lines. The slip line gets an amber underline, a "the slip" tag, and its note.
    - "The fix:" and "Habit:" (the habit comes from the catalog).
  - Buttons: **Try again** (focuses the first open choice) and **Walk me through it** (reveals step 1).
  - Earlier traps on the same question stay visible as small chips.
- **Correct pick:**
  - Green check, "Decoded!", plus "First try!" when it was the first pick. The lesson title appears.
  - A collapsed "Traps you dodged" section lists each unpicked wrong choice's trap name and headline.
  - "Walk through it" and a primary "Next question →".
- **Walkthrough:**
  - 3 `SocraticSteps` revealed one at a time (ask → move → result).
  - Shown next to the question's visual anchor at `level = stepsRevealed`.
  - Available after the first pick, right or wrong.
- **Start over:** "Start this one over" (ghost button) dispatches `decoder/retry`.
- **Announcements:** a `role="status"` region announces "Trap spotted: …" or "Decoded!".

**Content.** Task 5 tests verify every value below. ⚠ marks the slip line. Choices ascend numerically, as on the SAT.

**D1 `distribute-negative` · linear · lesson "Distribute the negative"**
Prompt: If 5 − 2(x − 4) = 3x − 7, what is the value of x?
- A) 4/5 (value 0.8) — trap `negative-distribution` — "You distributed −2 to the x but not to the −4."
  - Work: `5 − 2x − 8 = 3x − 7` ⚠ "−2 · (−4) is +8, not −8" · `−3 − 2x = 3x − 7` · `4 = 5x → x = 4/5`
  - Fix: "−2 · (−4) = +8, so the left side is 13 − 2x."
- B) 4 ✓
- C) 20 — trap `sign-flip` — "You moved −2x to the right side without flipping its sign."
  - Work: `13 − 2x = 3x − 7` · `13 + 7 = 3x − 2x` ⚠ "−2x changed sides but kept its sign" · `x = 20`
  - Fix: "Add 2x to both sides: 13 = 5x − 7, so 20 = 5x."
- D) There is no solution. (value null) — trap `multiply-before-subtract` — "You subtracted 5 − 2 before multiplying."
  - Work: `3(x − 4) = 3x − 7` ⚠ "5 − 2(…) is not (5 − 2)(…)" · `3x − 12 = 3x − 7` · `−12 = −7` (note: "a false statement, so it looked like no solution")
  - Fix: "Multiply first: −2(x − 4) = −2x + 8."
- Steps:
  1. "What does the −2 multiply?" → "Every term inside: −2 · x = −2x and −2 · (−4) = +8." → `5 − 2x + 8 = 3x − 7`, so `13 − 2x = 3x − 7`
  2. "How do we get the x-terms together?" → "Add 2x to both sides, then add 7 to both sides." → `20 = 5x`
  3. "What’s left to undo?" → "Divide by 5, then check by substituting." → `x = 4` (check: 5 − 2(0) = 5 and 3(4) − 7 = 5)
- Visual: `distribution` {factor "−2", terms ["x","−4"], products ["−2x","+8"]}.

**D2 `answer-the-question` · linear · lesson "Hit the real target"**
Prompt: If 3x + 6 = 21, what is the value of x + 2?
- A) 3 — `partial-division` — "You divided the 21 by 3 but not the 6."
  - Work: `x + 6 = 7` ⚠ "the 6 wasn’t divided by 3" · `x = 1` · `x + 2 = 3`
  - Fix: "Divide every term by 3: x + 2 = 7. That’s already the answer!"
- B) 5 — `wrong-target` — "You found x, but the question asks for x + 2."
  - Work: `3x = 15` · `x = 5` · Answer: `5` ⚠ "that’s x, not x + 2"
  - Fix: "x = 5, so x + 2 = 7."
- C) 7 ✓
- D) 11 — `sign-flip` — "You added 6 to the right side instead of subtracting it."
  - Work: `3x = 21 + 6` ⚠ "subtract 6 from both sides" · `3x = 27 → x = 9` · `x + 2 = 11`
  - Fix: "Subtract 6 from both sides: 3x = 15."
- Steps:
  1. "What exactly does the question ask for?" → "Circle it: the value of x + 2, not x." → Target: `x + 2`
  2. "How do we undo the + 6?" → "Subtract 6 from both sides." → `3x = 15`
  3. "Finish the job, and hit the target." → "Divide by 3 to get x = 5. Then add 2." → `x + 2 = 7`
- Visual: `target` {chain ["x + 2", "3x = 15", "x = 5", "x + 2 = 7"]}.

**D3 `eliminate-carefully` · systems · lesson "Subtracting a negative"**
Prompt: system {2x + 3y = 12; 2x − y = 4}. If (x, y) is the solution to the system, what is the value of y?
- A) 2 ✓
- B) 3 — `wrong-target` — "You found x = 3, but the question asks for y."
  - Work: `y = 2x − 4` · `2x + 3(2x − 4) = 12 → x = 3` · Answer: `3` ⚠ "that’s x, not y"
  - Fix: "Put x = 3 back in: 2(3) − y = 4, so y = 2."
- C) 4 — `subtract-negative` — "You treated 3y − (−y) as 2y."
  - Work: `(2x + 3y) − (2x − y) = 12 − 4` · `2y = 8` ⚠ "3y − (−y) is 4y, not 2y" · `y = 4`
  - Fix: "3y − (−y) = 3y + y = 4y, so 4y = 8."
- D) 8 — `stopped-early` — "You found 4y = 8 and stopped."
  - Work: `(2x + 3y) − (2x − y) = 12 − 4` · `4y = 8` · Answer: `8` ⚠ "that’s 4y, not y"
  - Fix: "Divide by 4: y = 2."
- Steps:
  1. "Which variable can we knock out in one move?" → "Both equations start with 2x. Subtract the second equation from the first." → `(2x + 3y) − (2x − y) = 12 − 4`
  2. "What is 3y − (−y)?" → "Subtracting a negative means adding: 3y + y = 4y." → `4y = 8`
  3. "Is 4y the answer?" → "Not yet: divide by 4. Check that x = 3, y = 2 works in both equations." → `y = 2`
- Visual: `lines` {x [−2, 8], y [−4, 6], lines [{m −2/3, b 4, "2x + 3y = 12"}, {m 2, b −4, "2x − y = 4"}], point [3, 2]}.

**D4 `percent-change` · data · lesson "Percent of what?"**
Prompt: The price of a jacket increased from $40 to $50. By what percent did the price increase?
- A) 10% (10) — `raw-change` — "You used the $10 increase as if it were 10%."
  - Work: `50 − 40 = 10` · Answer: `10%` ⚠ "$10 is dollars, not a percent"
  - Fix: "Compare the change to the original: 10 ÷ 40 = 0.25 = 25%."
- B) 20% (20) — `wrong-base` — "You divided by the new price ($50) instead of the original ($40)."
  - Work: `50 − 40 = 10` · `10 ÷ 50 = 0.20 = 20%` ⚠ "divide by the original, $40"
  - Fix: "10 ÷ 40 = 0.25 = 25%."
- C) 25% (25) ✓
- D) 125% (125) — `ratio-not-change` — "You found the new price as a percent of the old price, not the increase."
  - Work: `50 ÷ 40 = 1.25` · `1.25 = 125%` ⚠ "that’s new ÷ old"
  - Fix: "125% − 100% = 25%."
- Steps:
  1. "How much did the price change?" → "New minus original." → `50 − 40 = 10`
  2. "Compared to what?" → "Percent change always compares to the original amount, $40." → `10/40 = 1/4`
  3. "How do we turn 1/4 into a percent?" → "Multiply by 100%." → `1/4 × 100% = 25%`
- Visual: `fraction-bar` {parts 4, partValue 10, prefix "$", highlight 0, extra 1, caption "The $10 increase is 1 of the original 4 parts: 1/4 = 25%"}.

**D5 `hypotenuse` · geometry · lesson "Square, add, root"**
Prompt: A right triangle has legs of length 6 and 8. What is the length of the hypotenuse?
- A) 2√7 (value √28 ≈ 5.29) — `wrong-side` — "You subtracted the squares. That finds a missing leg, not the hypotenuse."
  - Work: `8² − 6² = 64 − 36 = 28` ⚠ "the hypotenuse adds the squares" · `c = √28 = 2√7`
  - Fix: "c² = 6² + 8². (2√7 ≈ 5.3 is shorter than 8, but the hypotenuse is the longest side.)"
- B) 10 ✓
- C) 14 — `added-legs` — "You added the legs: 6 + 8. The theorem adds their squares."
  - Work: `c = 6 + 8` ⚠ "add the squares, not the sides" · `c = 14`
  - Fix: "6² + 8² = 36 + 64 = 100, so c = 10."
- D) 100 — `forgot-root` — "You found c² = 100 and stopped."
  - Work: `c² = 36 + 64` · `c² = 100` · Answer: `100` ⚠ "that’s c², not c"
  - Fix: "Take the square root: c = √100 = 10."
- Steps:
  1. "Which side is the hypotenuse?" → "The side across from the right angle. It’s always the longest." → Legs 6 and 8, hypotenuse c
  2. "What does the theorem say?" → "Leg² + leg² = hypotenuse²." → `6² + 8² = c²`, so `36 + 64 = 100`
  3. "We have c². How do we get c?" → "Take the square root." → `c = √100 = 10`
- Visual: `right-triangle` {a 6, b 8}.

**Trap catalog** (`TRAPS: Record<TrapId, Trap>`)
| id | name | habit |
|---|---|---|
| negative-distribution | The Negative-Distribution Trap | Draw an arrow from the outside number to every term inside, then multiply each one, signs included. |
| multiply-before-subtract | The Order-of-Operations Trap | Multiply into the parentheses first and subtract after. Treat 2(x − 4) as one chunk. |
| sign-flip | The Sign-Flip Trap | Don’t “move” terms. Write the same operation on both sides: −6 on the left, −6 on the right. |
| wrong-target | The Wrong-Target Trap | Circle what the question asks for before you start, and check it again before you answer. |
| partial-division | The Partial-Division Trap | When you divide, divide every term on both sides. |
| subtract-negative | The Double-Negative Trap | Rewrite “minus a negative” as “plus” before combining: 3y − (−y) = 3y + y. |
| stopped-early | The Stopped-Early Trap | You’re done only when the variable stands alone: 4y = 8 still needs ÷ 4. |
| raw-change | The Dollars-Aren’t-Percents Trap | A percent compares two numbers: change ÷ original × 100. |
| wrong-base | The Wrong-Base Trap | Percent change always divides by the original amount. Say “out of the original.” |
| ratio-not-change | The Whole-Ratio Trap | New ÷ old gives “percent of.” Subtract 100% to get the percent change. |
| added-legs | The Add-the-Sides Trap | Square first, add second, square-root last: a² + b² = c². |
| forgot-root | The Forgotten-Square-Root Trap | After adding the squares, ask: “Did I find c, or c²?” |
| wrong-side | The Wrong-Side Trap | The hypotenuse is the longest side, so its square is the sum of the other two. |

## A4. Module 2 — The Twin Question Drill (4 sets)
**Behavior**
- **Header:** "Study a solved problem, then solve its twin: same steps, new numbers."
- **Set chips:** 4 chips, each with a check when complete; the selection is saved in `cursor.twin`.
- **Pattern strip:** the 3 move names, with the active move highlighted.
- **Layout:** two panes (`lg:grid-cols-2`), stacked on mobile.

**Left pane — Sample (solved)**
- Shows the prompt, the visual at `level = highest opened step + 1`, and a 3-item accordion.
- Each header reads "Step n · {ask}"; the body shows the move and the result.
- The first time a step is opened, dispatch `twin/openSample`.
- The step that mirrors the twin's current step gets an indigo ring and a "Mirror step" tag.

**Right pane — Your twin**
- Shows the prompt, the visual at `level = stepsDone`, an `AnswerModeToggle` [Type it | Choose] (saved as `answerMode`), and 3 guided steps.
- Guided step states:
  - **done:** the line is filled in with a check, or with a "shown" tag if the student used Show me.
  - **active:** the context line sits above the step line.
  - **locked:** dimmed, with "Unlocks after step n".

**Active step**
- **Type mode:** an inline input sits in the line's blank (`inputMode="decimal"`, about 5ch wide, `aria-label` = the ask) with a **Check** button. Enter submits.
- **Choose mode:** the blank is an empty dashed slot, with 3 option buttons below; tapping one submits.
- A small link toggles the mode: "Show 3 choices" / "Type it instead".
- A "Peek at the sample" link opens the mirror sample step and scrolls to it.

**Feedback**
- **Unparseable input:** "Type a number, like 7, −3, or 4/5." Nothing is dispatched.
- **Known mistake:** an amber callout with that mistake's `why`.
- **Any other miss:** an indigo nudge.
- **After 2 misses:** show **Show me** (`twin/showMe`). In Type mode, also offer "Pick from 3 choices".

**Completion**
- Message: "Twin solved! Same 3 moves as the sample: A → B → C." followed by the check line.
- If any step used Show me, add "Try Practice again to do it solo."
- Buttons: **Practice again** (`twin/restart`) and **Next twin →**.

**Content.** `[ ]` = the blank. The context line is in parentheses. Options are listed in ascending order, and every wrong option has a mistake message.

**T1 `both-sides` · linear · "Variables on both sides" · pattern Gather · Isolate · Divide**
- Sample: Solve 4x − 7 = 2x + 9.
  1. "Where should the x-terms live?" → "Gather them on one side: subtract 2x from both sides." → `2x − 7 = 9`
  2. "What’s stuck to the x-term?" → "Isolate it: add 7 to both sides." → `2x = 16`
  3. "How do we get x alone?" → "Divide both sides by 2." → `x = 8`
  - Visual `balance`: `4x − 7 | 2x + 9` → (−2x) `2x − 7 | 9` → (+7) `2x | 16` → (÷2) `x | 8`.
- Twin: Solve 5x − 4 = 2x + 11.
  - **G1** "Gather: subtract 2x from both sides." (`5x − 4 = 2x + 11`) → `[ ]x − 4 = 11`
    - Answer 3. Options −3, 3, 7.
    - Mistakes: 7 "You added 2x instead of subtracting it: 5x − 2x = 3x." · −3 "Subtract 2x from 5x, not the other way: 5x − 2x = 3x."
    - Nudge: "How many x’s are left when you take 2x away from 5x?"
  - **G2** "Isolate: add 4 to both sides." (`3x − 4 = 11`) → `3x = [ ]`
    - Answer 15. Options 7, 11, 15.
    - Mistakes: 7 "You subtracted 4. To undo − 4, add 4: 11 + 4." · 11 "Do it to both sides: the right side becomes 11 + 4."
    - Nudge: "Undo the − 4 by adding 4 to both sides."
  - **G3** "Divide: get x alone." (`3x = 15`) → `x = [ ]`
    - Answer 5. Options 5, 12, 45.
    - Mistakes: 12 "3x means 3 times x, so divide: 15 ÷ 3." · 45 "You multiplied. Undo multiplication with division: 15 ÷ 3."
    - Nudge: "What number times 3 makes 15?"
  - Check: "5(5) − 4 = 21 and 2(5) + 11 = 21 ✓".
  - Visual `balance`: `5x − 4 | 2x + 11` → (−2x) `3x − 4 | 11` → (+4) `3x | 15` → (÷3) `x | 5`.

**T2 `substitution` · systems · "Substitution" · pattern Swap in · Solve · Back-substitute**
- Sample: system {y = 2x + 1; 3x + y = 16}. What is the solution (x, y)?
  1. "One equation already says what y equals. Where can we use that?" → "Swap 2x + 1 in for y in the other equation." → `3x + (2x + 1) = 16`, so `5x + 1 = 16`
  2. "Only x is left. Solve for it." → "Subtract 1, then divide by 5." → `x = 3`
  3. "We have x. How do we find y?" → "Put x = 3 back into y = 2x + 1." → `y = 7`, so the solution is (3, 7)
  - Visual `lines` {x [−2, 8], y [−2, 12], [{m 2, b 1, "y = 2x + 1"}, {m −3, b 16, "3x + y = 16"}], point [3, 7]}.
- Twin: system {y = x + 4; 2x + y = 19}. What is the value of y?
  - **G1** "Swap in: replace y with x + 4." (`2x + (x + 4) = 19`) → `[ ]x + 4 = 19`
    - Answer 3. Options 1, 2, 3.
    - Mistakes: 2 "y is the whole expression x + 4, not just 4: 2x + x + 4 = 3x + 4." · 1 "The parentheses don’t mean subtract: 2x + (x + 4) = 3x + 4."
    - Nudge: "Count the x’s: 2x plus one more x."
  - **G2** "Solve: get x alone." (`3x + 4 = 19`) → `x = [ ]`
    - Answer 5. Options 5, 23/3 (shown as a fraction), 15.
    - Mistakes: 15 "That’s 3x. Divide by 3 to get x." · 23/3 "You added 4. Undo + 4 by subtracting: 19 − 4 = 15."
    - Nudge: "Subtract 4 from both sides, then divide by 3."
  - **G3** "Back-substitute: find y." (`y = x + 4`) → `y = [ ]`
    - Answer 9. Options 1, 5, 9.
    - Mistakes: 5 "That’s x. The question asks for y = x + 4." · 1 "y = x + 4 means add 4 to x: 5 + 4."
    - Nudge: "Put x = 5 into y = x + 4."
  - Check: "2(5) + 9 = 19 ✓".
  - Visual `lines` {x [−2, 10], y [−2, 14], [{m 1, b 4, "y = x + 4"}, {m −2, b 19, "2x + y = 19"}], point [5, 9]}.

**T3 `percent-off` · data · "Percent off" · pattern Fraction · Part · Subtract**
- Sample: A $60 game is on sale for 25% off. What is the sale price?
  1. "What fraction is 25%?" → "25% = 25/100 = 1/4. Split the price into 4 equal parts." → `25% = 1/4`
  2. "How big is the discount?" → "One part out of 4: 60 ÷ 4." → Discount = $15
  3. "What do you actually pay?" → "Take the discount away from the original price." → $60 − $15 = $45
  - Visual `fraction-bar` {parts 4, partValue 15, prefix "$", highlight 1, caption "Discount: 1 of 4 parts = $15. You pay the other 3: $45"}.
- Twin: An $80 jacket is on sale for 20% off. What is the sale price?
  - **G1** "Turn the percent into a fraction." (20% = 20/100) → `20% = 1/[ ]` (the blank is the denominator)
    - Answer 5. Options 2, 5, 20.
    - Mistakes: 2 "1/2 is 50%. 20% = 20/100 = 1/5." · 20 "1/20 would be 5%. 20% = 20/100 = 1/5."
    - Nudge: "Simplify 20/100: divide the top and bottom by 20."
  - **G2** "Find the discount: one part." (1/5 of $80) → `Discount = $[ ]`
    - Answer 16. Options 4, 16, 20.
    - Mistakes: 4 "You divided 80 by 20. Use the fraction: 1/5 of 80 = 80 ÷ 5." · 20 "That’s 1/4 of 80 (25% off). 20% is 1/5: 80 ÷ 5."
    - Nudge: "Split $80 into 5 equal parts."
  - **G3** "Subtract: what do you pay?" ($80 − $16) → `Sale price = $[ ]`
    - Answer 64. Options 16, 64, 96.
    - Mistakes: 16 "That’s the discount. The question asks what you pay: 80 − 16." · 96 "“Off” means subtract: 80 − 16."
    - Nudge: "Take the discount away from $80."
  - Check: "$64 is 4 of the 5 parts: 4 × $16 = $64 ✓".
  - Visual `fraction-bar` {parts 5, partValue 16, prefix "$", highlight 1, caption "Discount: 1 of 5 parts = $16. You pay the other 4: $64"}.

**T4 `circle-area` · geometry · "Area from a diameter" · pattern Halve · Square · Times π**
- Sample: A circle has a diameter of 10. What is its area?
  1. "Area uses the radius. How do we get it from the diameter?" → "The radius is half the diameter." → `r = 10 ÷ 2 = 5`
  2. "A = πr². What comes next?" → "Square the radius." → `r² = 5 × 5 = 25`
  3. "Finish the formula." → "Multiply by π." → `A = 25π` (≈ 78.5)
  - Visual `circle` {diameter 10}.
- Twin: A circle has a diameter of 14. What is its area?
  - **G1** "Halve: find the radius." (d = 14) → `r = [ ]`
    - Answer 7. Options 7, 14, 28.
    - Mistakes: 14 "That’s the diameter. The radius is half: 14 ÷ 2." · 28 "You doubled it. The radius is half the diameter."
    - Nudge: "The radius runs from the center to the edge: half the diameter."
  - **G2** "Square the radius." (r = 7) → `r² = [ ]`
    - Answer 49. Options 14, 49, 196.
    - Mistakes: 14 "r² means 7 × 7, not 7 × 2." · 196 "That’s the diameter squared (14²). Square the radius: 7²."
    - Nudge: "r² = r × r."
  - **G3** "Multiply by π." (A = πr²) → `A = [ ]π`
    - Answer 49. Options 14, 49, 196.
    - Mistakes: 14 "14π is the circumference (π × diameter). Area uses r²." · 196 "196π uses the diameter in place of the radius, the classic SAT circle trap."
    - Nudge: "A = π × r², and you just found r²."
  - Check: "A = 49π ≈ 153.9".
  - Visual `circle` {diameter 14}.

## A5. Module 3 — Interactive Formula Anchors (4 anchors)
**Layout**
- lg screens: a list of anchor cards on the left (name, mini formula, explored check, `aria-current`) and the workspace on the right.
- Mobile: a horizontal row of chips.
- The selected anchor is saved in `cursor.anchor`.
- Every slider change dispatches `anchor/explore`. The action is idempotent.

**Workspace, top to bottom**
1. A big live formula with color-coded variables.
2. The same formula with the current numbers substituted in.
3. The SVG.
4. One `LabeledSlider` per variable: a variable chip in its color, the current value, −/+ steppers, a native range input, and `aria-valuetext`.
5. "What changed" sentences, in an `aria-live="polite"` region.
6. An amber "SAT trap" callout.

**Variable colors:** m and a → `v1` indigo; b and k → `v2` teal; h and c → `v3` pink.

| Anchor | Sliders (default) | Graph | Live sentences | Trap callout |
|---|---|---|---|---|
| **Slope · y = mx + b** | m −4…4 step 0.5 (2); b −6…6 step 1 (1) | [−8,8]² grid; the line; a y-intercept dot "(0, b)"; a rise/run staircase from (0, b) using `slopeRiseRun(m)`; a slope-formula panel `m = (y₂ − y₁)/(x₂ − x₁)` with P1 = (0, b) and P2 = (run, b + rise) substituted | the sign: rises / falls / flat ("Zero slope: a flat line"); "Every {run} step(s) right, y goes {up/down} {abs(rise)}"; "b = {b}: crosses the y-axis at (0, {b})" | "Slope is rise over run: the y-change goes on top." |
| **Vertex form · y = a(x − h)² + k** | a −3…3 step 0.5 (1); h −5…5 (2); k −5…5 (−3) | the parabola (the line y = k when a = 0); a vertex dot "(h, k)"; a dashed axis at x = h | if a = 0: "a = 0 erases the squared part, leaving the flat line y = k. That’s not a parabola."; otherwise: the vertex, whether it opens up/down (min/max), and whether it's narrower, wider, or the same as y = x² | if h ≠ 0: "Inside the parentheses the sign flips: (x + 3) means h = −3."; otherwise: "In y = (x + 3)² − 1 the vertex is (−3, −1), not (3, −1)." |
| **Quadratic formula · x = (−b ± √(b² − 4ac)) / 2a** | a ∈ {−3,−2,−1,1,2,3} (1); b −6…6 (−2); c −6…6 (−3) | x∈[−8,8], y∈[−10,10]; the parabola from `standardQuadraticTokens`; dots on the x-axis at the roots | the discriminant line "b² − 4ac = (b)² − 4(a)(c) = D"; D>0 "two real solutions: crosses the x-axis twice", D=0 "one: just touches", D<0 "none: never reaches the x-axis"; roots shown exactly when √D is an integer, otherwise in `simplifySqrt` form plus ≈ 2 decimal places | "−b means the opposite of b. If b = −2, then −b = 2." |
| **Pythagorean · a² + b² = c²** | a 1…12 (3); b 1…12 (4) | `RightTriangleSquares` (a square on each of the 3 sides, areas labeled) | "c² = a² + b² = {a²} + {b²} = {c²}"; then, if c is exact, "c = {c}" plus a "Pythagorean triple!" badge; otherwise "c = √{c²} = {simplified} ≈ {c}" | "a + b is never c: {a} + {b} = {a+b}, but c ≈ {c}." |

## A6. Visual anchors (shared)
Each visual takes a `level` from 0 to 3 that sets how much is revealed:

| kind | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| distribution | −2(x − 4) | + arrows and products (−2x, +8) | same | same |
| target | the "Asked for" chip | + chain item 2 | + item 3 | + item 4 |
| lines | both lines faint | lines solid, with labels | + dashed guide at x = px | + a point dot "(px, py)" |
| fraction-bar | the whole bar "$total" | split into parts, with values | highlight/extra parts in amber | + caption |
| right-triangle | the triangle, legs labeled | hypotenuse "c" highlighted | + squares on the legs (a², b²) | + square on c (c²) and the value of c |
| circle | circle + diameter label | radius highlighted | + an r × r square | area shaded + "Nπ" |
| balance | states[0] | states[1] + op badge | states[2] | states[3] |

Rules for every SVG:
- Use `viewBox` with `w-full h-auto`.
- Use `role="img"` with a full-sentence `aria-label`.
- Use token colors through `stroke-*` / `fill-*` utilities.
- Build `clipPath` ids from `useId()`, with non-alphanumeric characters stripped.

## A7. State & persistence
- **Shape:** `ProgressState` v1 = `{ decoder: Record<id, {picks, solved, stepsRevealed}>, twins: Record<id, {sampleOpened, stepsDone, misses, assisted}>, anchorsExplored, answerMode, cursor: {decoder, twin, anchor} }`.
- **Pure reducer:** all state changes go through one reducer.
- **Store factory:** storage is injected, so the store is testable. The app uses a singleton.
- **Hook:** `useProgress()` reads the store through `useSyncExternalStore`.
- **Hydration:**
  - The server snapshot is always `initialProgress`.
  - On the client, saved progress is loaded lazily from localStorage and sanitized.
  - Because of this split, server and client markup never mismatch.
- **Cross-tab sync:** changes made in another tab arrive through the `storage` event.
- **UI-only state** (accordion open, slider values, input text) stays in component `useState`.

## A8. Theme
- **Tokens** are defined on `:root` and `.dark`, then mapped through `@theme inline` to these utilities:
  - surfaces and text: `bg-bg`, `bg-surface`, `bg-surface-2`, `text-ink`, `text-muted`, `border-line`
  - accent: `text-accent`, `bg-accent-solid`, `text-on-accent`, `bg-accent-soft`
  - traps: `text-trap`, `bg-trap-soft`, `border-trap-line`
  - success: `text-ok`, `bg-ok-soft`
  - graphs: `stroke-grid`, `stroke-axis`, `text|stroke|fill-v1..v3`
- **Dark variant:** `@custom-variant dark (&:where(.dark, .dark *))`.
- **First paint:** a blocking inline script in `<head>` applies the stored theme, or the OS theme, before anything renders.
- **Toggle:** stores an explicit choice. With no stored choice, the app follows OS theme changes live.

## A9. Accessibility
- **Structure:** landmarks, and one `h1` per view that gets focus when the view changes.
- **Navigation:** `aria-current` on the active view.
- **Answer-mode toggle:** `aria-pressed`.
- **Choices:** `<button>`s whose state is shown as text, not only color.
- **Announcements:** each module has a `role="status"` live region.
- **Labels:** every input and slider is labeled.
- **Focus:** a 3 px indigo `:focus-visible` ring. No `autoFocus`; focus moves only from event handlers or effects.

---

# Part B — Implementation

## File structure (paths under `Oct1.2/`)
```
package.json · package-lock.json · next.config.ts · tsconfig.json · postcss.config.mjs
eslint.config.mjs · vitest.config.mts · .gitignore · README.md
docs/superpowers/plans/2026-10-01-sat-math-lab.md   copy of this plan
src/app/           layout.tsx (fonts, metadata, theme script) · page.tsx · globals.css · icon.svg
src/lib/           theme.ts(+test) · use-theme.ts · tabs.ts(+test) · use-active-tab.ts
src/lib/math/      numbers · parse · expressions · quadratic · geometry · plot   (each with .test.ts)
src/lib/progress/  types.ts · reducer.ts(+test) · store.ts(+test) · use-progress.ts · selectors.ts(+test)
src/content/       types.ts · traps.ts · decoder.tsx · twins.tsx · anchors.ts · content.test.tsx
src/components/math/      MathText.tsx (+test): Expr, V, Frac, Sqrt, System, eq()
src/components/ui/        Button · Card · Callout · ProgressDots · Pill
src/components/visuals/   CoordinatePlane · LinesGraph · FractionBar · RightTriangleSquares · CircleDiagram
                          BalanceSteps · DistributionArrows · TargetChain · VisualAnchor
src/components/shell/     MathLabApp · TopBar · BottomNav · ThemeToggle · ViewHeader · SiteFooter
src/components/home/      HomeOverview · ModuleCard · TrapJournal · ResetProgress
src/components/decoder/   TrapDecoder · DecoderQuestionCard · ChoiceButton · TrapReveal · SocraticSteps · DodgedTraps
src/components/twins/     TwinDrill · SampleAccordion · TwinPanel · GuidedStep · AnswerModeToggle
src/components/anchors/   FormulaAnchors · LabeledSlider · FormulaTokens · SlopeAnchor · VertexAnchor
                          QuadraticAnchor · PythagoreanAnchor
Workspace root:  C:\Users\mike\Desktop\SAT\.claude\launch.json   (Browser-pane preview config)
```
Commands below use `$P = "C:\Users\mike\Desktop\SAT\Oct1.2"` and run as `npm --prefix $P run <script>` (no `cd`).

---

### Task 1: Scaffold the project and toolchain
**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `eslint.config.mjs`, `vitest.config.mts`, `.gitignore`
- Create: `src/app/{layout.tsx,page.tsx,globals.css}`, `src/lib/smoke.test.tsx`
- Create: `docs/superpowers/plans/2026-10-01-sat-math-lab.md`
- Create: `..\.claude\launch.json` (in the workspace root)

**Interfaces — Produces:** the scripts `dev`, `build`, `start`, `lint`, `typecheck`, `test`, `verify`, and the alias `@/*` → `./src/*`.

- [ ] **Step 1:** Create the folder and run `git -C $P init`. Check that `git config user.name` and `git config user.email` resolve. If they don't, ask the user rather than inventing an identity.
- [ ] **Step 2:** Write `package.json`. The dependencies come from Step 3.
```json
{
  "name": "oct1-2-sat-math-lab",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 4182",
    "build": "next build",
    "start": "next start -p 4182",
    "lint": "eslint",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "verify": "npm run lint && npm run typecheck && npm run test && npm run build"
  }
}
```
- [ ] **Step 3:** Install the dependencies.
```powershell
npm --prefix $P install next@16.3.8 react@19.3.0 react-dom@19.3.0 lucide-react@^1.49.0
npm --prefix $P install -D typescript@^5 @types/node@^24 @types/react@^19 @types/react-dom@^19 tailwindcss@^4 @tailwindcss/postcss@^4 eslint@^9 eslint-config-next@16.3.8 vitest@^5
```
Expected: no ERESOLVE errors.
- [ ] **Step 4:** Write the config files. All except `vitest.config.mts` (new) copy the create-next-app 16.3.8 `app-tw/ts` template, captured during planning:
  - `postcss.config.mjs`: `const config = { plugins: { "@tailwindcss/postcss": {} } }; export default config;`
  - `next.config.ts`: `import type { NextConfig } from "next"; const nextConfig: NextConfig = {}; export default nextConfig;`
  - `.gitignore`: the template's list — `/node_modules`, `/.pnp`, `.pnp.*`, `.yarn/*` (with its `!` exceptions), `/coverage`, `/.next/`, `/out/`, `/build`, `.DS_Store`, `*.pem`, `npm-debug.log*`, `yarn-debug.log*`, `yarn-error.log*`, `.pnpm-debug.log*`, `.env*`, `.vercel`, `*.tsbuildinfo`, `next-env.d.ts`.
  - `tsconfig.json`: the template verbatim, except `"paths": { "@/*": ["./src/*"] }`. The template's compilerOptions are: target ES2017, lib [dom, dom.iterable, esnext], allowJs, skipLibCheck, strict, noEmit, esModuleInterop, module esnext, moduleResolution bundler, resolveJsonModule, isolatedModules, jsx react-jsx, incremental, and plugins [{name:"next"}]. Its include list is next-env.d.ts, `**/*.ts`, `**/*.tsx`, `.next/types/**/*.ts`, `.next/dev/types/**/*.ts`, `**/*.mts`; it excludes node_modules.
  - `eslint.config.mjs`:
```js
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "build/**", "coverage/**", "next-env.d.ts"]),
]);

export default eslintConfig;
```
  - `vitest.config.mts`:
```ts
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: { environment: "node", include: ["src/**/*.test.{ts,tsx}"] },
});
```
- [ ] **Step 5:** Write the minimal app and a smoke test.
  - `globals.css`: `@import "tailwindcss";`
  - `layout.tsx`: takes `{ children }: Readonly<{ children: ReactNode }>` and renders `<html lang="en"><body>{children}</body></html>`.
  - `page.tsx`: `<main className="p-8">Math Lab</main>`.
  - `src/lib/smoke.test.tsx`:
```tsx
import { isValidElement } from "react";
import { expect, it } from "vitest";
it("compiles TSX in tests", () => { expect(isValidElement(<span>ok</span>)).toBe(true); });
```
- [ ] **Step 6:** Run `npm --prefix $P run verify`.
  - Expected: lint clean, tsc clean, 1 test passed, and the build prints "✓ Compiled successfully" with `/` static.
  - If Vitest fails to parse JSX, set the automatic runtime for the installed Vite, then re-run. Vite 8: `oxc: { jsx: { runtime: "automatic" } }`. Vite ≤ 7: `esbuild: { jsx: "automatic" }`.
- [ ] **Step 7:** Check that these icon names exist in `node_modules/lucide-react/dist/lucide-react.d.ts`: House, ScanSearch, Copy, SlidersHorizontal, Sun, Moon, ChevronDown, ChevronLeft, ChevronRight, CircleCheck, TriangleAlert, Lightbulb, RotateCcw, Eye, NotebookPen, ArrowRight, Target, Info. Replace any missing name with its current equivalent and use that name everywhere.
- [ ] **Step 8:** Write the workspace-root `C:\Users\mike\Desktop\SAT\.claude\launch.json`. It runs `node` directly so the Windows `.cmd` shims don't matter.
```json
{ "version": "0.0.1", "configurations": [ { "name": "oct1.2-math-lab", "runtimeExecutable": "node",
  "runtimeArgs": ["Oct1.2/node_modules/next/dist/bin/next", "dev", "Oct1.2", "--port", "4182"], "port": 4182 } ] }
```
Run `preview_start` with the name `oct1.2-math-lab`. Expected: the page shows "Math Lab".
- [ ] **Step 9:** Copy this plan file to `Oct1.2/docs/superpowers/plans/2026-10-01-sat-math-lab.md`.
- [ ] **Step 10:** Commit: `git -C $P add -A` then `git -C $P commit -m "chore: scaffold Next.js 16, Tailwind 4, ESLint 9 and Vitest 5"`.

### Task 2: Design system — tokens, fonts, theme, math typography, UI primitives
**Files:**
- Modify: `src/app/globals.css`, `src/app/layout.tsx`, and `src/app/page.tsx` (it becomes a temporary specimen).
- Create: `src/app/icon.svg` — an indigo rounded square with a white ◆.
- Create: `src/lib/theme.ts`, `src/lib/theme.test.ts`, `src/lib/use-theme.ts`.
- Create: `src/components/shell/ThemeToggle.tsx`.
- Create: `src/components/math/MathText.tsx`, `src/components/math/MathText.test.tsx`.
- Create: `src/components/ui/{Button,Card,Callout,ProgressDots,Pill}.tsx`.

**Interfaces — Produces:**
```ts
// theme.ts (server-safe)
export type Theme = "light" | "dark";
export const THEME_KEY = "oct1.2-math-lab/theme";
export function resolveTheme(stored: string | null, prefersDark: boolean): Theme;
export const themeInitScript: string;
// use-theme.ts ("use client")
export function useTheme(): [Theme, () => void];
// MathText.tsx
Expr({ children, block?: boolean }) · V({ children }) · Frac({ n: ReactNode, d: ReactNode })
Sqrt({ children }) · System({ lines: string[] }) · eq(text: string, block?: boolean)  // italicizes single a–z letters
// ui
Button({ variant?: "primary" | "secondary" | "ghost"; size?: "md" | "lg" } & ButtonHTMLAttributes<HTMLButtonElement>)
Card({ as?: "section" | "div"; className?: string; children })
Callout({ tone: "trap" | "ok" | "info"; title?: ReactNode; icon?: LucideIcon; children })
ProgressDots({ total: number; current: number; done: boolean[]; label: (i: number) => string; onSelect?: (i: number) => void })
Pill({ tone?: "neutral" | "accent" | "trap" | "ok"; children })
```

- [ ] **Step 1: Write the failing tests.**
`src/lib/theme.test.ts`:
```ts
import { describe, expect, it } from "vitest";
import { resolveTheme, THEME_KEY, themeInitScript } from "./theme";

describe("resolveTheme", () => {
  it("uses an explicit stored choice", () => {
    expect(resolveTheme("light", true)).toBe("light");
    expect(resolveTheme("dark", false)).toBe("dark");
  });
  it("falls back to the OS preference", () => {
    expect(resolveTheme(null, true)).toBe("dark");
    expect(resolveTheme(null, false)).toBe("light");
  });
  it("ignores garbage", () => { expect(resolveTheme("purple", false)).toBe("light"); });
  it("init script reads the same storage key", () => {
    expect(themeInitScript).toContain(JSON.stringify(THEME_KEY));
  });
});
```
`src/components/math/MathText.test.tsx`:
```tsx
import { isValidElement, type ReactElement, type ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { eq, V } from "./MathText";

const kids = (el: ReactElement) => (el.props as { children: ReactNode[] }).children;

describe("eq", () => {
  it("wraps single letters in V and keeps everything else as text", () => {
    const parts = kids(eq("3x + 6"));
    expect(parts[0]).toBe("3");
    expect(isValidElement(parts[1]) && parts[1].type === V).toBe(true);
    expect(parts[2]).toBe(" + 6");
  });
  it("leaves numbers, symbols and π alone", () => {
    expect(kids(eq("10% of π")).filter((p) => isValidElement(p))).toHaveLength(2); // o, f
    expect(kids(eq("25%")).some((p) => isValidElement(p))).toBe(false);
  });
});
```
(The `eq("10% of π")` case documents why content never puts words inside `eq()`.)

- [ ] **Step 2:** Run `npm --prefix $P run test`. Expected: FAIL, because the modules don't exist yet.
- [ ] **Step 3:** Implement `src/lib/theme.ts`:
```ts
export type Theme = "light" | "dark";
export const THEME_KEY = "oct1.2-math-lab/theme";

export function resolveTheme(stored: string | null, prefersDark: boolean): Theme {
  if (stored === "light" || stored === "dark") return stored;
  return prefersDark ? "dark" : "light";
}

export const themeInitScript = `(function(){try{var s=localStorage.getItem(${JSON.stringify(THEME_KEY)});var d=s==="dark"||(s!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);var r=document.documentElement;r.classList.toggle("dark",d);r.style.colorScheme=d?"dark":"light"}catch(e){}})();`;
```
- [ ] **Step 4:** Implement `src/lib/use-theme.ts`:
```ts
"use client";
import { useSyncExternalStore } from "react";
import { resolveTheme, THEME_KEY, type Theme } from "./theme";

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((listener) => listener());
const read = (): Theme => (document.documentElement.classList.contains("dark") ? "dark" : "light");

function apply(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

function storedTheme(): string | null {
  try { return localStorage.getItem(THEME_KEY); } catch { return null; }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const onSystemChange = () => {
    if (storedTheme() !== null) return; // an explicit choice wins
    apply(resolveTheme(null, media.matches));
    emit();
  };
  media.addEventListener("change", onSystemChange);
  return () => {
    listeners.delete(listener);
    media.removeEventListener("change", onSystemChange);
  };
}

export function setTheme(theme: Theme) {
  apply(theme);
  try { localStorage.setItem(THEME_KEY, theme); } catch { /* storage blocked: theme still applies this session */ }
  emit();
}

export function useTheme(): [Theme, () => void] {
  const theme = useSyncExternalStore(subscribe, read, () => "light" as const);
  return [theme, () => setTheme(theme === "dark" ? "light" : "dark")];
}
```
- [ ] **Step 5:** Replace `globals.css` with the tokens below. Light-mode pairs that carry text are all ≥ 4.5:1, e.g. muted on bg 7.2, accent on white 6.3, trap on trap-soft 6.4, ok on ok-soft 5.2, v2 on white 5.4. Dark-mode text pairs are all ≥ 6.9.
```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

:root {
  --bg: #f8fafc; --surface: #ffffff; --surface-2: #f1f5f9; --ink: #0f172a; --muted: #475569; --line: #e2e8f0;
  --accent: #4f46e5; --accent-solid: #4f46e5; --on-accent: #ffffff; --accent-soft: #eef2ff;
  --trap: #92400e; --trap-soft: #fef3c7; --trap-line: #f59e0b; --ok: #047857; --ok-soft: #ecfdf5;
  --grid: #e2e8f0; --axis: #64748b; --v1: #4f46e5; --v2: #0f766e; --v3: #db2777;
}
.dark {
  --bg: #0b1020; --surface: #121a2e; --surface-2: #18223a; --ink: #e2e8f0; --muted: #94a3b8; --line: #243049;
  --accent: #a5b4fc; --accent-solid: #a5b4fc; --on-accent: #0b1020; --accent-soft: #1e2547;
  --trap: #fcd34d; --trap-soft: #3b2f0b; --trap-line: #b45309; --ok: #6ee7b7; --ok-soft: #0f2a22;
  --grid: #1e293b; --axis: #64748b; --v1: #a5b4fc; --v2: #5eead4; --v3: #f9a8d4;
}

@theme inline {
  --color-bg: var(--bg); --color-surface: var(--surface); --color-surface-2: var(--surface-2);
  --color-ink: var(--ink); --color-muted: var(--muted); --color-line: var(--line);
  --color-accent: var(--accent); --color-accent-solid: var(--accent-solid); --color-on-accent: var(--on-accent);
  --color-accent-soft: var(--accent-soft); --color-trap: var(--trap); --color-trap-soft: var(--trap-soft);
  --color-trap-line: var(--trap-line); --color-ok: var(--ok); --color-ok-soft: var(--ok-soft);
  --color-grid: var(--grid); --color-axis: var(--axis);
  --color-v1: var(--v1); --color-v2: var(--v2); --color-v3: var(--v3);
  --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
  --font-math: var(--font-stix), "Cambria Math", "Times New Roman", serif;
}

@theme {
  --animate-fade-up: fade-up 220ms ease-out both;
  @keyframes fade-up { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
}

html { font-size: 106.25%; }
body { line-height: 1.6; }
:focus-visible { outline: 3px solid var(--accent); outline-offset: 2px; }
```
- [ ] **Step 6:** Replace `layout.tsx`:
```tsx
import type { Metadata, Viewport } from "next";
import { Inter, STIX_Two_Text } from "next/font/google";
import type { ReactNode } from "react";
import { themeInitScript } from "@/lib/theme";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const stix = STIX_Two_Text({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-stix", display: "swap" });

export const metadata: Metadata = {
  title: "Math Lab · SAT Math, one step at a time",
  description: "Decode SAT math traps, drill twin problems, and explore formulas with sliders.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1020" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${stix.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-dvh bg-bg font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
```
  If any Next lint rule objects to `<head>`, move the `<script>` to be the first child of `<body>`. It still runs before the rest of the page paints.
- [ ] **Step 7:** Implement `MathText.tsx`.
  - `Expr`: a `span.font-math` (`block` → centered, `text-xl`, `overflow-x-auto`).
  - `V`: an italic `font-math` `<i>`.
  - `Frac`: a visual `inline-flex flex-col` with a `border-t` divider, marked `aria-hidden`, plus `<span className="sr-only">{n} over {d}</span>`.
  - `Sqrt`: a visual √ with a `border-t` vinculum over the children, plus sr-only "square root of …".
  - `System`: a large `{` beside the stacked `eq()` lines, plus sr-only "system: A and B".
  - `eq`:
```tsx
export function eq(text: string, block = false) {
  return <Expr block={block}>{text.split(/([a-z])/).map((part, i) => (i % 2 ? <V key={i}>{part}</V> : part))}</Expr>;
}
```
  The `eq()` rule: only pure math goes in `eq()`. Words like "so" or "Answer:" stay outside it, as plain text or the `label` field.
- [ ] **Step 8:** Implement the UI primitives and `ThemeToggle`.
  - Button: `min-h-11 rounded-xl px-4 font-semibold`, with variants:
    - primary: `bg-accent-solid text-on-accent`
    - secondary: `bg-surface border border-line`
    - ghost: `text-muted hover:bg-surface-2`
  - Card: `rounded-2xl border border-line bg-surface p-5 sm:p-6 shadow-sm`.
  - Callout tones:
    - trap: `bg-trap-soft text-trap border-trap-line`
    - ok: `bg-ok-soft text-ok`
    - info: `bg-accent-soft text-accent`
  - ProgressDots: buttons when `onSelect` is set, each `aria-label={label(i)}`; done dots are filled; the current dot gets a ring.
  - ThemeToggle: `aria-label="Switch to dark mode"` (or "…light mode"), showing `Moon` in light and `Sun` in dark.
- [ ] **Step 9:** Make `page.tsx` a temporary specimen. It should show every Button variant, each Callout tone, Pills, and ProgressDots. It should also show the math samples `eq("5 − 2(x − 4) = 3x − 7")`, `<Frac n="4" d="5"/>`, `2<Sqrt>7</Sqrt>` and `<System lines={["2x + 3y = 12","2x − y = 4"]}/>`, plus the ThemeToggle.
- [ ] **Step 10:** Verify.
  - Run `npm --prefix $P run verify`: all green, 6 tests.
  - In the browser:
    - Toggle to dark, then reload. It should stay dark with no light flash.
    - Clear the `oct1.2-math-lab/theme` key, then `resize_window colorScheme: "dark"` and reload. The page should be dark on first paint.
    - Math glyphs render in STIX with italic variables, and the console is clean.
- [ ] **Step 11:** Commit: `feat: design tokens, theme toggle, math typography and UI primitives`.

### Task 3: Math library (pure, TDD)
**Files:** Create `src/lib/math/{numbers,parse,expressions,quadratic,geometry,plot}.ts`, each with a sibling `.test.ts`.

**Interfaces — Produces:**
```ts
// numbers.ts
export const MINUS: "−";
export function formatNumber(n: number, maxDecimals?: number): string;      // U+2212 minus; no "−0"; trailing zeros dropped
export function range(min: number, max: number, step: number): number[];   // float-safe
export function isPerfectSquare(n: number): boolean;
export function simplifySqrt(n: number): { outside: number; inside: number }; // √72 → 6√2
// parse.ts
export function parseNumericAnswer(raw: string): number | null;
export function answersMatch(value: number, expected: number): boolean;
// expressions.ts
export type VarRole = "m" | "b" | "a" | "h" | "k" | "c";
export interface Token { text: string; role?: VarRole; italic?: boolean }
export function linearTokens(m: number, b: number): Token[];
export function vertexTokens(a: number, h: number, k: number): Token[];
export function standardQuadraticTokens(a: number, b: number, c: number): Token[]; // precondition a ≠ 0
export function tokensToText(tokens: Token[]): string;
// quadratic.ts
export function discriminant(a: number, b: number, c: number): number;
export type QuadraticSolution = { kind: "not-quadratic" } | { kind: "none"; d: number }
  | { kind: "one"; d: number; roots: [number] } | { kind: "two"; d: number; roots: [number, number] };
export function solveQuadratic(a: number, b: number, c: number): QuadraticSolution; // roots ascending
export function vertexOfStandard(a: number, b: number, c: number): { x: number; y: number };
// geometry.ts
export function hypotenuse(a: number, b: number): { cSquared: number; c: number; exact: boolean };
export function slopeRiseRun(m: number): { rise: number; run: number };
// plot.ts
export interface Viewport { xMin: number; xMax: number; yMin: number; yMax: number; width: number; height: number }
export function toSvgX(vp: Viewport, x: number): number;
export function toSvgY(vp: Viewport, y: number): number;
export function functionPath(fn: (x: number) => number, vp: Viewport, samples?: number): string;
export function lineSegment(m: number, b: number, vp: Viewport): [[number, number], [number, number]] | null;
export function linePath(m: number, b: number, vp: Viewport): string;
export function ticks(min: number, max: number, step: number): number[];
```

- [ ] **Step 1: Write the failing tests for `numbers` and `parse`.** (This step covers Review Focus #3.)
```ts
// numbers.test.ts
import { describe, expect, it } from "vitest";
import { formatNumber, isPerfectSquare, range, simplifySqrt } from "./numbers";

describe("formatNumber", () => {
  it("uses a true minus and trims zeros", () => {
    expect(formatNumber(-3)).toBe("−3");
    expect(formatNumber(2)).toBe("2");
    expect(formatNumber(0.5)).toBe("0.5");
    expect(formatNumber(1 / 3)).toBe("0.33");
  });
  it("never prints −0", () => { expect(formatNumber(-0)).toBe("0"); expect(formatNumber(-0.001)).toBe("0"); });
});
describe("range", () => {
  it("is float-safe", () => {
    const r = range(-4, 4, 0.5);
    expect(r).toHaveLength(17);
    expect(r[0]).toBe(-4); expect(r[16]).toBe(4); expect(r).toContain(0.5);
  });
});
describe("radicals", () => {
  it("detects perfect squares", () => {
    expect(isPerfectSquare(25)).toBe(true);
    expect([26, -4, 2.25].map(isPerfectSquare)).toEqual([false, false, false]);
  });
  it("simplifies square roots", () => {
    expect(simplifySqrt(28)).toEqual({ outside: 2, inside: 7 });
    expect(simplifySqrt(72)).toEqual({ outside: 6, inside: 2 });
    expect(simplifySqrt(49)).toEqual({ outside: 7, inside: 1 });
    expect(simplifySqrt(13)).toEqual({ outside: 1, inside: 13 });
  });
});
```
```ts
// parse.test.ts
import { describe, expect, it } from "vitest";
import { answersMatch, parseNumericAnswer as p } from "./parse";

describe("parseNumericAnswer", () => {
  it("accepts forgiving number formats", () => {
    expect(p("7")).toBe(7); expect(p(" 7 ")).toBe(7); expect(p("+3")).toBe(3);
    expect(p("-3")).toBe(-3); expect(p("−3")).toBe(-3); expect(p("– 3")).toBe(-3);
    expect(p("0.8")).toBe(0.8); expect(p(".8")).toBe(0.8); expect(p("3.")).toBe(3);
    expect(p("4/5")).toBe(0.8); expect(p("−4/5")).toBe(-0.8); expect(p("8/10")).toBe(0.8);
    expect(p("49π")).toBe(49); expect(p("49 pi")).toBe(49); expect(p("1,000")).toBe(1000);
  });
  it("rejects things that are not numbers", () => {
    for (const bad of ["", "   ", "abc", "4/0", "--3", "3-", "1/2/3", ".", "π", "0,8"]) expect(p(bad)).toBeNull();
  });
});
describe("answersMatch", () => {
  it("tolerates float noise only", () => {
    expect(answersMatch(0.1 + 0.2, 0.3)).toBe(true);
    expect(answersMatch(-0, 0)).toBe(true);
    expect(answersMatch(64.01, 64)).toBe(false);
  });
});
```
- [ ] **Step 2:** Run `npm --prefix $P run test`. Expected: FAIL (modules missing).
- [ ] **Step 3: Implement `numbers.ts` and `parse.ts`.**
```ts
// numbers.ts
export const MINUS = "−";

export function formatNumber(n: number, maxDecimals = 2): string {
  const factor = 10 ** maxDecimals;
  const rounded = Math.round(n * factor) / factor;
  if (rounded === 0) return "0";
  const text = String(Math.abs(rounded));
  return rounded < 0 ? `${MINUS}${text}` : text;
}

export function range(min: number, max: number, step: number): number[] {
  const count = Math.round((max - min) / step) + 1;
  return Array.from({ length: count }, (_, i) => Number((min + i * step).toFixed(6)));
}

export function isPerfectSquare(n: number): boolean {
  if (!Number.isInteger(n) || n < 0) return false;
  const root = Math.round(Math.sqrt(n));
  return root * root === n;
}

export function simplifySqrt(n: number): { outside: number; inside: number } {
  let outside = 1;
  let inside = n;
  for (let f = 2; f * f <= inside; f++) {
    while (inside % (f * f) === 0) { inside /= f * f; outside *= f; }
  }
  return { outside, inside };
}
```
```ts
// parse.ts
const DASHES = /[−‒–—]/g;

export function parseNumericAnswer(raw: string): number | null {
  let s = raw.trim().toLowerCase().replace(DASHES, "-").replace(/\s+/g, "");
  s = s.replace(/(π|pi)$/, "");
  if (/^[+-]?\d{1,3}(,\d{3})+(\.\d+)?$/.test(s)) s = s.replace(/,/g, "");
  const fraction = /^([+-]?)(\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/.exec(s);
  if (fraction) {
    const denominator = Number(fraction[3]);
    if (denominator === 0) return null;
    const magnitude = Number(fraction[2]) / denominator;
    return fraction[1] === "-" ? -magnitude : magnitude;
  }
  return /^[+-]?(\d+\.?\d*|\.\d+)$/.test(s) ? Number(s) : null;
}

export const answersMatch = (value: number, expected: number): boolean => Math.abs(value - expected) < 1e-9;
```
- [ ] **Step 4:** Run the tests. Expected: `numbers` and `parse` PASS.

- [ ] **Step 5: Write the failing tests for expressions, quadratic, geometry and plot.** (Covers Review Focus #4.)
```ts
// expressions.test.ts
import { describe, expect, it } from "vitest";
import { linearTokens, standardQuadraticTokens, tokensToText as t, vertexTokens } from "./expressions";

describe("linearTokens", () => {
  it.each([
    [2, 1, "y = 2x + 1"], [1, 0, "y = x"], [-1, -3, "y = −x − 3"], [0, 4, "y = 4"],
    [0, 0, "y = 0"], [0.5, -2, "y = 0.5x − 2"], [-0.5, 0, "y = −0.5x"],
  ])("m=%s b=%s → %s", (m, b, text) => expect(t(linearTokens(m, b))).toBe(text));
  it("tags slope and intercept roles for coloring", () => {
    expect(linearTokens(2, 1).filter((x) => x.role).map((x) => x.role)).toEqual(["m", "b"]);
  });
});
describe("vertexTokens", () => {
  it.each([
    [1, 2, -3, "y = (x − 2)² − 3"], [-1, -3, 0, "y = −(x + 3)²"], [2, 0, 1, "y = 2x² + 1"],
    [0, 4, 5, "y = 5"], [0.5, 0, 0, "y = 0.5x²"], [-2.5, 1, 4, "y = −2.5(x − 1)² + 4"],
  ])("a=%s h=%s k=%s → %s", (a, h, k, text) => expect(t(vertexTokens(a, h, k))).toBe(text));
});
describe("standardQuadraticTokens", () => {
  it.each([
    [1, -2, -3, "y = x² − 2x − 3"], [-2, 0, 5, "y = −2x² + 5"], [3, 1, 0, "y = 3x² + x"],
    [1, 0, 0, "y = x²"], [2, -1, -1, "y = 2x² − x − 1"],
  ])("a=%s b=%s c=%s → %s", (a, b, c, text) => expect(t(standardQuadraticTokens(a, b, c))).toBe(text));
});
```
```ts
// quadratic.test.ts
import { describe, expect, it } from "vitest";
import { discriminant, solveQuadratic, vertexOfStandard } from "./quadratic";

describe("quadratic", () => {
  it("computes the discriminant", () => expect(discriminant(1, -2, -3)).toBe(16));
  it("finds two ascending roots", () => {
    expect(solveQuadratic(1, -2, -3)).toEqual({ kind: "two", d: 16, roots: [-1, 3] });
    expect(solveQuadratic(2, 3, -2)).toEqual({ kind: "two", d: 25, roots: [-2, 0.5] });
    expect(solveQuadratic(-1, 0, 4)).toEqual({ kind: "two", d: 16, roots: [-2, 2] });
  });
  it("handles one, none, and not-quadratic", () => {
    expect(solveQuadratic(1, -2, 1)).toEqual({ kind: "one", d: 0, roots: [1] });
    expect(solveQuadratic(1, 0, 1)).toEqual({ kind: "none", d: -4 });
    expect(solveQuadratic(0, 2, 1)).toEqual({ kind: "not-quadratic" });
  });
  it("never returns −0", () => {
    const s = solveQuadratic(1, 0, 0);
    expect(s.kind === "one" && Object.is(s.roots[0], -0)).toBe(false);
  });
  it("finds the vertex", () => expect(vertexOfStandard(1, -2, -3)).toEqual({ x: 1, y: -4 }));
});
```
```ts
// geometry.test.ts
import { describe, expect, it } from "vitest";
import { hypotenuse, slopeRiseRun } from "./geometry";

it("hypotenuse marks exact triples", () => {
  expect(hypotenuse(3, 4)).toEqual({ cSquared: 25, c: 5, exact: true });
  expect(hypotenuse(6, 8)).toEqual({ cSquared: 100, c: 10, exact: true });
  expect(hypotenuse(2, 3)).toMatchObject({ cSquared: 13, exact: false });
});
describe("slopeRiseRun", () => {
  it.each([[2, 2, 1], [0.5, 1, 2], [-1.5, -3, 2], [0, 0, 1]])("m=%s → rise %s over run %s", (m, rise, run) =>
    expect(slopeRiseRun(m)).toEqual({ rise, run }));
});
```
```ts
// plot.test.ts
import { describe, expect, it } from "vitest";
import { functionPath, linePath, lineSegment, ticks, toSvgX, toSvgY, type Viewport } from "./plot";

const vp: Viewport = { xMin: -8, xMax: 8, yMin: -8, yMax: 8, width: 320, height: 320 };

describe("plot", () => {
  it("maps world corners to SVG corners", () => {
    expect([toSvgX(vp, -8), toSvgX(vp, 8), toSvgY(vp, 8), toSvgY(vp, -8)]).toEqual([0, 320, 0, 320]);
  });
  it("draws a parabola with no NaN/Infinity", () => {
    const d = functionPath((x) => 3 * x * x, vp);
    expect(d.startsWith("M")).toBe(true);
    expect(d).not.toMatch(/NaN|Infinity/);
  });
  it("returns an empty path for non-finite or far-away functions", () => {
    expect(functionPath(() => NaN, vp)).toBe("");
    expect(functionPath(() => 1000, vp)).toBe("");
  });
  it("breaks the pen at an asymptote", () => {
    expect((functionPath((x) => 1 / x, vp).match(/M/g) ?? []).length).toBeGreaterThanOrEqual(2);
  });
  it("clips straight lines to the viewport", () => {
    expect(lineSegment(4, 6, vp)).toEqual([[-3.5, -8], [0.5, 8]]); // steep
    expect(lineSegment(0, 3, vp)).toEqual([[-8, 3], [8, 3]]);      // flat, inside
    expect(lineSegment(0, 20, vp)).toBeNull();                     // flat, outside
    expect(linePath(0, 20, vp)).toBe("");
  });
  it("builds tick lists", () => {
    expect(ticks(-8, 8, 2)).toEqual([-8, -6, -4, -2, 0, 2, 4, 6, 8]);
    expect(ticks(-2, 8, 1)).toHaveLength(11);
  });
});
```
- [ ] **Step 6:** Run the tests. Expected: FAIL (the 4 new modules are missing).
- [ ] **Step 7: Implement the four modules.**
```ts
// expressions.ts
import { formatNumber, MINUS } from "./numbers";

export type VarRole = "m" | "b" | "a" | "h" | "k" | "c";
export interface Token { text: string; role?: VarRole; italic?: boolean }

const v = (text: string): Token => ({ text, italic: true });
const op = (text: string): Token => ({ text });
const mag = (n: number, role: VarRole): Token => ({ text: formatNumber(Math.abs(n)), role });
const sign = (n: number): Token => op(n > 0 ? " + " : ` ${MINUS} `);
const lead = (n: number, role: VarRole): Token[] =>
  n === 1 ? [] : n === -1 ? [{ text: MINUS, role }] : [{ text: formatNumber(n), role }];

export function linearTokens(m: number, b: number): Token[] {
  const out: Token[] = [v("y"), op(" = ")];
  if (m === 0) return [...out, { text: formatNumber(b), role: "b" }];
  out.push(...lead(m, "m"), v("x"));
  if (b !== 0) out.push(sign(b), mag(b, "b"));
  return out;
}

export function vertexTokens(a: number, h: number, k: number): Token[] {
  const out: Token[] = [v("y"), op(" = ")];
  if (a === 0) return [...out, { text: formatNumber(k), role: "k" }];
  out.push(...lead(a, "a"));
  if (h === 0) out.push(v("x"), op("²"));
  else out.push(op("("), v("x"), op(h > 0 ? ` ${MINUS} ` : " + "), mag(h, "h"), op(")²"));
  if (k !== 0) out.push(sign(k), mag(k, "k"));
  return out;
}

export function standardQuadraticTokens(a: number, b: number, c: number): Token[] {
  const out: Token[] = [v("y"), op(" = "), ...lead(a, "a"), v("x"), op("²")];
  if (b !== 0) {
    out.push(sign(b));
    if (Math.abs(b) !== 1) out.push(mag(b, "b"));
    out.push(v("x"));
  }
  if (c !== 0) out.push(sign(c), mag(c, "c"));
  return out;
}

export const tokensToText = (tokens: Token[]): string => tokens.map((token) => token.text).join("");
```
```ts
// quadratic.ts
export const discriminant = (a: number, b: number, c: number): number => b * b - 4 * a * c;

export type QuadraticSolution =
  | { kind: "not-quadratic" }
  | { kind: "none"; d: number }
  | { kind: "one"; d: number; roots: [number] }
  | { kind: "two"; d: number; roots: [number, number] };

export function solveQuadratic(a: number, b: number, c: number): QuadraticSolution {
  if (a === 0) return { kind: "not-quadratic" };
  const d = discriminant(a, b, c);
  if (d < 0) return { kind: "none", d };
  if (d === 0) return { kind: "one", d, roots: [-b / (2 * a) + 0] };
  const r1 = (-b - Math.sqrt(d)) / (2 * a) + 0;
  const r2 = (-b + Math.sqrt(d)) / (2 * a) + 0;
  return { kind: "two", d, roots: r1 < r2 ? [r1, r2] : [r2, r1] };
}

export function vertexOfStandard(a: number, b: number, c: number): { x: number; y: number } {
  const x = -b / (2 * a) + 0;
  return { x, y: a * x * x + b * x + c };
}
```
```ts
// geometry.ts
import { isPerfectSquare } from "./numbers";

export function hypotenuse(a: number, b: number): { cSquared: number; c: number; exact: boolean } {
  const cSquared = a * a + b * b;
  return { cSquared, c: Math.sqrt(cSquared), exact: isPerfectSquare(cSquared) };
}

// Slope sliders move in steps of 0.5, so a run of 2 always gives an integer rise.
export function slopeRiseRun(m: number): { rise: number; run: number } {
  const run = Number.isInteger(m) ? 1 : 2;
  return { rise: m * run + 0, run };
}
```
```ts
// plot.ts
export interface Viewport { xMin: number; xMax: number; yMin: number; yMax: number; width: number; height: number }

export const toSvgX = (vp: Viewport, x: number) => ((x - vp.xMin) / (vp.xMax - vp.xMin)) * vp.width;
export const toSvgY = (vp: Viewport, y: number) => ((vp.yMax - y) / (vp.yMax - vp.yMin)) * vp.height;
const r2 = (n: number) => Math.round(n * 100) / 100;

// Points may overshoot the view by one span so the clipPath trims curves cleanly; beyond that the pen lifts.
export function functionPath(fn: (x: number) => number, vp: Viewport, samples = 240): string {
  const span = vp.yMax - vp.yMin;
  let d = "";
  let penDown = false;
  for (let i = 0; i <= samples; i++) {
    const x = vp.xMin + ((vp.xMax - vp.xMin) * i) / samples;
    const y = fn(x);
    if (!Number.isFinite(y) || y < vp.yMin - span || y > vp.yMax + span) { penDown = false; continue; }
    d += `${penDown ? "L" : "M"}${r2(toSvgX(vp, x))} ${r2(toSvgY(vp, y))}`;
    penDown = true;
  }
  return d;
}

export function lineSegment(m: number, b: number, vp: Viewport): [[number, number], [number, number]] | null {
  let lo = vp.xMin;
  let hi = vp.xMax;
  if (m === 0) {
    if (b < vp.yMin || b > vp.yMax) return null;
  } else {
    const xa = (vp.yMin - b) / m;
    const xb = (vp.yMax - b) / m;
    lo = Math.max(lo, Math.min(xa, xb));
    hi = Math.min(hi, Math.max(xa, xb));
    if (lo > hi) return null;
  }
  return [[lo, m * lo + b], [hi, m * hi + b]];
}

export function linePath(m: number, b: number, vp: Viewport): string {
  const seg = lineSegment(m, b, vp);
  if (!seg) return "";
  const [[x1, y1], [x2, y2]] = seg;
  return `M${r2(toSvgX(vp, x1))} ${r2(toSvgY(vp, y1))}L${r2(toSvgX(vp, x2))} ${r2(toSvgY(vp, y2))}`;
}

export function ticks(min: number, max: number, step: number): number[] {
  const out: number[] = [];
  for (let t = Math.ceil(min / step) * step; t <= max + 1e-9; t += step) out.push(Number(t.toFixed(6)) + 0);
  return out;
}
```
- [ ] **Step 8:** Run `npm --prefix $P run test`. Expected: all math tests PASS. Then run `npm --prefix $P run lint` and `npm --prefix $P run typecheck`, both clean.
- [ ] **Step 9:** Commit: `feat: math library for parsing, formatting, quadratics, geometry and plotting`.

### Task 4: Progress state — types, reducer, persistent store (TDD)
**Files:** Create `src/lib/progress/{types.ts,reducer.ts,reducer.test.ts,store.ts,store.test.ts,use-progress.ts}`.

**Interfaces — Produces:** the types below, plus:
- from `reducer.ts`: `initialProgress`, `emptyDecoder()`, `emptyTwin()`, `MISSES_BEFORE_SHOW_ME = 2`, `progressReducer(state, action)`
- from `store.ts`: `PROGRESS_KEY`, `StorageLike`, `sanitizeProgress(value)`, `parseProgress(raw)`, `createProgressStore(storage)`
- from `use-progress.ts`: `progressStore`, `useProgress(): [ProgressState, (a: ProgressAction) => void]`

- [ ] **Step 1:** Write `types.ts`. It only declares types, so it has no test.
```ts
export type ChoiceLetter = "A" | "B" | "C" | "D";
export type StepIndex = 0 | 1 | 2;
export type Triple<T> = [T, T, T];
export type AnswerMode = "type" | "choose";

export interface DecoderProgress {
  picks: ChoiceLetter[]; // unique, in the order chosen; ends with the correct letter once solved
  solved: boolean;
  stepsRevealed: number; // 0–3 walkthrough steps shown
}

export interface TwinProgress {
  sampleOpened: Triple<boolean>;
  stepsDone: number; // 0–3 guided twin steps finished, strictly in order
  misses: Triple<number>;
  assisted: Triple<boolean>; // finished with “Show me”
}

export interface Cursor { decoder: number; twin: number; anchor: string }

export interface ProgressState {
  version: 1;
  decoder: Record<string, DecoderProgress>;
  twins: Record<string, TwinProgress>;
  anchorsExplored: string[];
  answerMode: AnswerMode;
  cursor: Cursor;
}

export type ProgressAction =
  | { type: "decoder/pick"; questionId: string; choice: ChoiceLetter; correct: boolean }
  | { type: "decoder/revealStep"; questionId: string }
  | { type: "decoder/retry"; questionId: string }
  | { type: "twin/openSample"; twinId: string; step: StepIndex }
  | { type: "twin/answer"; twinId: string; step: StepIndex; correct: boolean }
  | { type: "twin/showMe"; twinId: string; step: StepIndex }
  | { type: "twin/restart"; twinId: string }
  | { type: "anchor/explore"; anchorId: string }
  | { type: "settings/answerMode"; mode: AnswerMode }
  | { type: "cursor/set"; cursor: Partial<Cursor> }
  | { type: "progress/reset" };
```
- [ ] **Step 2: Write the failing reducer tests** (Review Focus #5):
```ts
// reducer.test.ts
import { describe, expect, it } from "vitest";
import { initialProgress as init, progressReducer as r } from "./reducer";
import type { ProgressAction, ProgressState } from "./types";

const run = (...actions: ProgressAction[]): ProgressState => actions.reduce(r, init);
const pick = (choice: "A" | "B" | "C" | "D", correct = false): ProgressAction =>
  ({ type: "decoder/pick", questionId: "q1", choice, correct });
const answer = (step: 0 | 1 | 2, correct: boolean): ProgressAction => ({ type: "twin/answer", twinId: "t1", step, correct });
const showMe = (step: 0 | 1 | 2): ProgressAction => ({ type: "twin/showMe", twinId: "t1", step });

describe("decoder", () => {
  it("records a wrong pick without solving", () => {
    expect(run(pick("A")).decoder.q1).toEqual({ picks: ["A"], solved: false, stepsRevealed: 0 });
  });
  it("ignores re-picking the same letter (same object back)", () => {
    const s = run(pick("A"));
    expect(r(s, pick("A"))).toBe(s);
  });
  it("solves on a correct pick and then ignores further picks", () => {
    const s = run(pick("A"), pick("B", true));
    expect(s.decoder.q1).toMatchObject({ picks: ["A", "B"], solved: true });
    expect(r(s, pick("C"))).toBe(s);
  });
  it("reveals walkthrough steps only after a pick, capped at 3", () => {
    const reveal: ProgressAction = { type: "decoder/revealStep", questionId: "q1" };
    expect(r(init, reveal)).toBe(init);
    expect(run(pick("A"), reveal, reveal, reveal, reveal).decoder.q1.stepsRevealed).toBe(3);
  });
  it("retry clears one question only", () => {
    const s = run(pick("A"), { type: "decoder/pick", questionId: "q2", choice: "C", correct: true },
      { type: "decoder/retry", questionId: "q1" });
    expect(s.decoder.q1).toEqual({ picks: [], solved: false, stepsRevealed: 0 });
    expect(s.decoder.q2.solved).toBe(true);
  });
});

describe("twins", () => {
  it("advances on a correct answer to the current step", () => {
    expect(run(answer(0, true)).twins.t1.stepsDone).toBe(1);
  });
  it("counts misses on the current step", () => {
    expect(run(answer(0, false), answer(0, false)).twins.t1.misses).toEqual([2, 0, 0]);
  });
  it("ignores answers to locked or finished steps", () => {
    expect(r(init, answer(1, true))).toBe(init);
    const done = run(answer(0, true), answer(1, true), answer(2, true));
    expect(done.twins.t1.stepsDone).toBe(3);
    expect(r(done, answer(2, true))).toBe(done);
  });
  it("allows Show me only after 2 misses, then marks assisted and advances", () => {
    const once = run(answer(0, false));
    expect(r(once, showMe(0))).toBe(once);
    const s = run(answer(0, false), answer(0, false), showMe(0));
    expect(s.twins.t1).toMatchObject({ stepsDone: 1, assisted: [true, false, false] });
    expect(r(s, showMe(0))).toBe(s);
  });
  it("opening a sample step is idempotent", () => {
    const open: ProgressAction = { type: "twin/openSample", twinId: "t1", step: 1 };
    const s = run(open);
    expect(s.twins.t1.sampleOpened).toEqual([false, true, false]);
    expect(r(s, open)).toBe(s);
  });
  it("restart resets guided steps but keeps sample views", () => {
    const s = run({ type: "twin/openSample", twinId: "t1", step: 0 }, answer(0, true), { type: "twin/restart", twinId: "t1" });
    expect(s.twins.t1).toEqual({ sampleOpened: [true, false, false], stepsDone: 0, misses: [0, 0, 0], assisted: [false, false, false] });
  });
});

describe("anchors, settings, cursor, reset", () => {
  it("adds each anchor once", () => {
    const explore: ProgressAction = { type: "anchor/explore", anchorId: "slope" };
    const s = run(explore);
    expect(s.anchorsExplored).toEqual(["slope"]);
    expect(r(s, explore)).toBe(s);
  });
  it("switches answer mode; the same mode is a no-op", () => {
    const s = run({ type: "settings/answerMode", mode: "choose" });
    expect(s.answerMode).toBe("choose");
    expect(r(s, { type: "settings/answerMode", mode: "choose" })).toBe(s);
  });
  it("merges the cursor, clamps negatives, and no-ops when unchanged", () => {
    const s = run({ type: "cursor/set", cursor: { decoder: 3, twin: -2 } });
    expect(s.cursor).toEqual({ decoder: 3, twin: 0, anchor: "slope" });
    expect(r(s, { type: "cursor/set", cursor: { decoder: 3 } })).toBe(s);
  });
  it("reset clears progress and cursor but keeps the answer mode", () => {
    const s = run(pick("A"), { type: "settings/answerMode", mode: "choose" }, { type: "cursor/set", cursor: { decoder: 2 } },
      { type: "progress/reset" });
    expect(s).toEqual({ ...init, answerMode: "choose" });
  });
});
```
- [ ] **Step 3:** Run `npm --prefix $P run test`. Expected: FAIL (`./reducer` is missing).
- [ ] **Step 4:** Implement `reducer.ts`:
```ts
import type { DecoderProgress, ProgressAction, ProgressState, Triple, TwinProgress } from "./types";

export const MISSES_BEFORE_SHOW_ME = 2;

export const initialProgress: ProgressState = {
  version: 1,
  decoder: {},
  twins: {},
  anchorsExplored: [],
  answerMode: "type",
  cursor: { decoder: 0, twin: 0, anchor: "slope" },
};

export const emptyDecoder = (): DecoderProgress => ({ picks: [], solved: false, stepsRevealed: 0 });
export const emptyTwin = (): TwinProgress => ({
  sampleOpened: [false, false, false], stepsDone: 0, misses: [0, 0, 0], assisted: [false, false, false],
});

const setAt = <T>(xs: Triple<T>, index: number, value: T): Triple<T> =>
  xs.map((x, i) => (i === index ? value : x)) as Triple<T>;
const withDecoder = (s: ProgressState, id: string, d: DecoderProgress): ProgressState => ({ ...s, decoder: { ...s.decoder, [id]: d } });
const withTwin = (s: ProgressState, id: string, t: TwinProgress): ProgressState => ({ ...s, twins: { ...s.twins, [id]: t } });
function assertNever(action: never): never { throw new Error(`Unknown action: ${JSON.stringify(action)}`); }

export function progressReducer(state: ProgressState, action: ProgressAction): ProgressState {
  switch (action.type) {
    case "decoder/pick": {
      const q = state.decoder[action.questionId] ?? emptyDecoder();
      if (q.solved || q.picks.includes(action.choice)) return state;
      return withDecoder(state, action.questionId, { ...q, picks: [...q.picks, action.choice], solved: action.correct });
    }
    case "decoder/revealStep": {
      const q = state.decoder[action.questionId];
      if (!q || q.picks.length === 0 || q.stepsRevealed >= 3) return state;
      return withDecoder(state, action.questionId, { ...q, stepsRevealed: q.stepsRevealed + 1 });
    }
    case "decoder/retry":
      return state.decoder[action.questionId] ? withDecoder(state, action.questionId, emptyDecoder()) : state;
    case "twin/openSample": {
      const t = state.twins[action.twinId] ?? emptyTwin();
      if (t.sampleOpened[action.step]) return state;
      return withTwin(state, action.twinId, { ...t, sampleOpened: setAt(t.sampleOpened, action.step, true) });
    }
    case "twin/answer": {
      const t = state.twins[action.twinId] ?? emptyTwin();
      if (action.step !== t.stepsDone) return state;
      return withTwin(state, action.twinId, action.correct
        ? { ...t, stepsDone: t.stepsDone + 1 }
        : { ...t, misses: setAt(t.misses, action.step, t.misses[action.step] + 1) });
    }
    case "twin/showMe": {
      const t = state.twins[action.twinId];
      if (!t || action.step !== t.stepsDone || t.misses[action.step] < MISSES_BEFORE_SHOW_ME) return state;
      return withTwin(state, action.twinId, { ...t, stepsDone: t.stepsDone + 1, assisted: setAt(t.assisted, action.step, true) });
    }
    case "twin/restart": {
      const t = state.twins[action.twinId];
      return t ? withTwin(state, action.twinId, { ...emptyTwin(), sampleOpened: t.sampleOpened }) : state;
    }
    case "anchor/explore":
      return state.anchorsExplored.includes(action.anchorId)
        ? state : { ...state, anchorsExplored: [...state.anchorsExplored, action.anchorId] };
    case "settings/answerMode":
      return state.answerMode === action.mode ? state : { ...state, answerMode: action.mode };
    case "cursor/set": {
      const merged = { ...state.cursor, ...action.cursor };
      const next = { ...merged, decoder: Math.max(0, Math.trunc(merged.decoder)), twin: Math.max(0, Math.trunc(merged.twin)) };
      const same = next.decoder === state.cursor.decoder && next.twin === state.cursor.twin && next.anchor === state.cursor.anchor;
      return same ? state : { ...state, cursor: next };
    }
    case "progress/reset":
      return { ...initialProgress, answerMode: state.answerMode };
    default:
      return assertNever(action);
  }
}
```
- [ ] **Step 5:** Run the tests. Expected: reducer PASS.

- [ ] **Step 6: Write the failing store tests** (Review Focus #1 and #2):
```ts
// store.test.ts
import { describe, expect, it, vi } from "vitest";
import { initialProgress, progressReducer } from "./reducer";
import { createProgressStore, PROGRESS_KEY, type StorageLike } from "./store";
import type { ProgressAction } from "./types";

const memory = (seed?: string): StorageLike & { data: Map<string, string> } => {
  const data = new Map<string, string>(seed === undefined ? [] : [[PROGRESS_KEY, seed]]);
  return { data, getItem: (k) => data.get(k) ?? null, setItem: (k, v) => void data.set(k, v) };
};
const pick: ProgressAction = { type: "decoder/pick", questionId: "q1", choice: "A", correct: false };
const saved = JSON.stringify(progressReducer(initialProgress, pick));

describe("createProgressStore", () => {
  it("starts from the initial state when storage is empty or missing", () => {
    expect(createProgressStore(memory()).getSnapshot()).toEqual(initialProgress);
    expect(createProgressStore(null).getSnapshot()).toEqual(initialProgress);
  });
  it("loads a valid saved state", () => {
    expect(createProgressStore(memory(saved)).getSnapshot().decoder.q1.picks).toEqual(["A"]);
  });
  it("ignores corrupted JSON and other schema versions", () => {
    expect(createProgressStore(memory("{bad json")).getSnapshot()).toEqual(initialProgress);
    expect(createProgressStore(memory(JSON.stringify({ ...initialProgress, version: 2 }))).getSnapshot()).toEqual(initialProgress);
  });
  it("drops malformed entries but keeps valid ones", () => {
    const messy = JSON.stringify({
      ...initialProgress,
      decoder: { good: { picks: ["B", "Z", "B"], solved: false, stepsRevealed: 9 }, bad: { picks: "A" } },
      twins: { bad: { sampleOpened: [true], stepsDone: 1 } },
      anchorsExplored: ["slope", 7, "slope"],
      answerMode: "weird",
      cursor: { decoder: -1, twin: 2, anchor: 5 },
    });
    const s = createProgressStore(memory(messy)).getSnapshot();
    expect(s.decoder).toEqual({ good: { picks: ["B"], solved: false, stepsRevealed: 3 } });
    expect(s.twins).toEqual({});
    expect(s.anchorsExplored).toEqual(["slope"]);
    expect(s.answerMode).toBe("type");
    expect(s.cursor).toEqual({ decoder: 0, twin: 2, anchor: "slope" });
  });
  it("works in memory when storage throws on read and write", () => {
    const throwing: StorageLike = {
      getItem: () => { throw new Error("SecurityError"); },
      setItem: () => { throw new Error("QuotaExceededError"); },
    };
    const store = createProgressStore(throwing);
    expect(store.getSnapshot()).toEqual(initialProgress);
    store.dispatch(pick);
    expect(store.getSnapshot().decoder.q1.picks).toEqual(["A"]);
  });
  it("persists, notifies on change, and stays silent on no-ops", () => {
    const storage = memory();
    const store = createProgressStore(storage);
    const listener = vi.fn();
    store.subscribe(listener);
    store.dispatch(pick);
    store.dispatch(pick); // same pick again → no-op
    expect(listener).toHaveBeenCalledTimes(1);
    expect(JSON.parse(storage.data.get(PROGRESS_KEY)!).decoder.q1.picks).toEqual(["A"]);
  });
  it("applies changes from another tab", () => {
    const store = createProgressStore(memory());
    const listener = vi.fn();
    store.subscribe(listener);
    store.syncFromStorage(saved);
    expect(store.getSnapshot().decoder.q1.picks).toEqual(["A"]);
    expect(listener).toHaveBeenCalledTimes(1);
  });
  it("always serves the initial state as the server snapshot", () => {
    expect(createProgressStore(memory(saved)).getServerSnapshot()).toBe(initialProgress);
  });
});
```
- [ ] **Step 7:** Run the tests. Expected: FAIL (`./store` is missing).
- [ ] **Step 8:** Implement `store.ts`:
```ts
import { initialProgress, progressReducer } from "./reducer";
import type { ChoiceLetter, Cursor, DecoderProgress, ProgressAction, ProgressState, Triple, TwinProgress } from "./types";

export const PROGRESS_KEY = "oct1.2-math-lab/progress";
export interface StorageLike { getItem(key: string): string | null; setItem(key: string, value: string): void }

const LETTERS: readonly string[] = ["A", "B", "C", "D"];
const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const isBool = (v: unknown): v is boolean => typeof v === "boolean";
const isCount = (v: unknown): v is number => Number.isInteger(v) && (v as number) >= 0;
const isTriple = <T>(v: unknown, guard: (x: unknown) => x is T): v is Triple<T> =>
  Array.isArray(v) && v.length === 3 && v.every(guard);

function toDecoder(v: unknown): DecoderProgress | null {
  if (!isRecord(v) || !Array.isArray(v.picks) || !isBool(v.solved) || !isCount(v.stepsRevealed)) return null;
  const picks = [...new Set(v.picks.filter((p): p is ChoiceLetter => typeof p === "string" && LETTERS.includes(p)))];
  return { picks, solved: v.solved && picks.length > 0, stepsRevealed: Math.min(v.stepsRevealed, 3) };
}

function toTwin(v: unknown): TwinProgress | null {
  if (!isRecord(v) || !isTriple(v.sampleOpened, isBool) || !isCount(v.stepsDone)
    || !isTriple(v.misses, isCount) || !isTriple(v.assisted, isBool)) return null;
  return { sampleOpened: v.sampleOpened, stepsDone: Math.min(v.stepsDone, 3), misses: v.misses, assisted: v.assisted };
}

function toCursor(v: unknown): Cursor {
  const d = initialProgress.cursor;
  if (!isRecord(v)) return d;
  return {
    decoder: isCount(v.decoder) ? v.decoder : d.decoder,
    twin: isCount(v.twin) ? v.twin : d.twin,
    anchor: typeof v.anchor === "string" ? v.anchor : d.anchor,
  };
}

export function sanitizeProgress(value: unknown): ProgressState | null {
  if (!isRecord(value) || value.version !== 1) return null;
  const decoder: Record<string, DecoderProgress> = {};
  if (isRecord(value.decoder)) {
    for (const [id, entry] of Object.entries(value.decoder)) { const d = toDecoder(entry); if (d) decoder[id] = d; }
  }
  const twins: Record<string, TwinProgress> = {};
  if (isRecord(value.twins)) {
    for (const [id, entry] of Object.entries(value.twins)) { const t = toTwin(entry); if (t) twins[id] = t; }
  }
  const explored = Array.isArray(value.anchorsExplored)
    ? value.anchorsExplored.filter((a): a is string => typeof a === "string") : [];
  return {
    version: 1,
    decoder,
    twins,
    anchorsExplored: [...new Set(explored)],
    answerMode: value.answerMode === "choose" ? "choose" : "type",
    cursor: toCursor(value.cursor),
  };
}

export function parseProgress(raw: string | null): ProgressState | null {
  if (!raw) return null;
  try { return sanitizeProgress(JSON.parse(raw)); } catch { return null; }
}

export function createProgressStore(storage: StorageLike | null) {
  let state: ProgressState = initialProgress;
  let loaded = false;
  const listeners = new Set<() => void>();
  const emit = () => listeners.forEach((listener) => listener());
  const ensureLoaded = () => {
    if (loaded) return;
    loaded = true;
    try { state = parseProgress(storage?.getItem(PROGRESS_KEY) ?? null) ?? initialProgress; } catch { state = initialProgress; }
  };
  return {
    getSnapshot(): ProgressState { ensureLoaded(); return state; },
    getServerSnapshot(): ProgressState { return initialProgress; },
    subscribe(listener: () => void): () => void {
      listeners.add(listener);
      return () => { listeners.delete(listener); };
    },
    dispatch(action: ProgressAction): void {
      ensureLoaded();
      const next = progressReducer(state, action);
      if (next === state) return;
      state = next;
      try { storage?.setItem(PROGRESS_KEY, JSON.stringify(next)); } catch { /* storage full or blocked: keep progress in memory */ }
      emit();
    },
    syncFromStorage(raw: string | null): void {
      loaded = true;
      state = parseProgress(raw) ?? initialProgress;
      emit();
    },
  };
}

export type ProgressStore = ReturnType<typeof createProgressStore>;
```
- [ ] **Step 9:** Implement `use-progress.ts`:
```ts
"use client";
import { useSyncExternalStore } from "react";
import { createProgressStore, PROGRESS_KEY, type StorageLike } from "./store";
import type { ProgressAction, ProgressState } from "./types";

function browserStorage(): StorageLike | null {
  if (typeof window === "undefined") return null;
  try { return window.localStorage; } catch { return null; }
}

export const progressStore = createProgressStore(browserStorage());

if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === PROGRESS_KEY) progressStore.syncFromStorage(event.newValue);
  });
}

export function useProgress(): [ProgressState, (action: ProgressAction) => void] {
  const state = useSyncExternalStore(progressStore.subscribe, progressStore.getSnapshot, progressStore.getServerSnapshot);
  return [state, progressStore.dispatch];
}
```
- [ ] **Step 10:** Run `npm --prefix $P run test`, `npm --prefix $P run lint` and `npm --prefix $P run typecheck`. Expected: all PASS and clean.
- [ ] **Step 11:** Commit: `feat: progress reducer and storage-safe external store`.

### Task 5: Content — types, trap catalog, 5 decoder questions, 4 twin sets, anchors, selectors (TDD)
**Files:**
- Create: `src/content/{types.ts,traps.ts,decoder.tsx,twins.tsx,anchors.ts,content.test.tsx}`
- Create: `src/lib/progress/{selectors.ts,selectors.test.ts}`
- Delete: `src/lib/smoke.test.tsx`

**Interfaces — Consumes:** `eq`, `Frac`, `Sqrt`, `System` (Task 2); `ChoiceLetter`, `Triple`, `ProgressState` (Task 4).
**Interfaces — Produces:** `DECODER_QUESTIONS`, `TWIN_SETS`, `ANCHORS`, `TRAPS`, `TOPIC_LABEL`, and the content types below; `decoderStats`, `trapJournal`, `twinStats`, `anchorStats`, `overallProgress`.

- [ ] **Step 1:** Write `src/content/types.ts`:
```ts
import type { ReactNode } from "react";
import type { ChoiceLetter, Triple } from "@/lib/progress/types";

export type Topic = "linear" | "systems" | "data" | "geometry";
export const TOPIC_LABEL: Record<Topic, string> = {
  linear: "Linear Equations", systems: "Systems of Equations", data: "Data Analysis", geometry: "Geometry",
};

export type TrapId =
  | "negative-distribution" | "multiply-before-subtract" | "sign-flip" | "wrong-target" | "partial-division"
  | "subtract-negative" | "stopped-early" | "raw-change" | "wrong-base" | "ratio-not-change"
  | "added-legs" | "forgot-root" | "wrong-side";
export interface Trap { id: TrapId; name: string; habit: string }

export interface WorkLine { math: string; label?: string; slip?: true; note?: string } // math goes through eq()
export interface SocraticStep { ask: string; move: ReactNode; result: ReactNode }

export interface DecoderChoice {
  letter: ChoiceLetter;
  label: ReactNode;
  value: number | null; // numeric value, re-derived in tests; null = "There is no solution."
  correct?: true;
  trap?: { id: TrapId; headline: ReactNode; work: WorkLine[]; fix: ReactNode };
}

export interface LineSpec { m: number; b: number; label: string }
export interface BalanceState { left: string; right: string; op?: string }
export type VisualSpec =
  | { kind: "distribution"; factor: string; terms: [string, string]; products: [string, string] }
  | { kind: "target"; chain: [string, string, string, string] }
  | { kind: "lines"; x: [number, number]; y: [number, number]; lines: [LineSpec, LineSpec]; point: [number, number] }
  | { kind: "fraction-bar"; parts: number; partValue: number; prefix: string; highlight: number; extra?: number; caption: string }
  | { kind: "right-triangle"; a: number; b: number }
  | { kind: "circle"; diameter: number }
  | { kind: "balance"; states: [BalanceState, BalanceState, BalanceState, BalanceState] };

export interface DecoderQuestion {
  id: string;
  topic: Topic;
  lesson: string;
  prompt: ReactNode;
  choices: [DecoderChoice, DecoderChoice, DecoderChoice, DecoderChoice];
  walkthrough: Triple<SocraticStep>;
  visual: VisualSpec;
}

export interface TwinOption { value: number; label?: ReactNode }
export interface TwinMistake { value: number; why: ReactNode }
export interface GuidedStep {
  ask: string;
  context: ReactNode;                     // the previous line, shown above the step
  line: (blank: ReactNode) => ReactNode;  // the step's line with exactly one blank
  answer: number;
  options: Triple<TwinOption>;            // ascending; includes the answer
  mistakes: TwinMistake[];                // one per wrong option, at minimum
  nudge: ReactNode;
}
export interface TwinSet {
  id: string;
  topic: Topic;
  title: string;
  pattern: Triple<string>;
  sample: { prompt: ReactNode; steps: Triple<SocraticStep>; answer: ReactNode; visual: VisualSpec };
  twin: { prompt: ReactNode; steps: Triple<GuidedStep>; check: ReactNode; visual: VisualSpec };
}

export type AnchorId = "slope" | "vertex" | "quadratic" | "pythagorean";
export interface AnchorMeta { id: AnchorId; name: string; formula: string; useFor: string }
```
- [ ] **Step 2:** Write the content files:
  - **`traps.ts`:** `export const TRAPS: Record<TrapId, Trap>`, transcribed exactly from the A3 catalog table.
  - **`decoder.tsx`:** `export const DECODER_QUESTIONS: DecoderQuestion[]`, transcribing D1–D5 from A3 exactly, in order D1→D5.
    - Math strings go through `eq()`.
    - Choice labels: `<Frac n="4" d="5" />` for D1-A and `<>2<Sqrt>7</Sqrt></>` for D5-A.
    - The D3 prompt uses `<System lines={["2x + 3y = 12", "2x − y = 4"]} />`.
    - Work lines are `{ math, label?, slip?, note? }`; "Answer:" goes in `label`.
    - Choice values: D1 `[0.8, 4, 20, null]`, D2 `[3, 5, 7, 11]`, D3 `[2, 3, 4, 8]`, D4 `[10, 20, 25, 125]`, D5 `[Math.sqrt(28), 10, 14, 100]`.
  - **`twins.tsx`:** `export const TWIN_SETS: TwinSet[]`, transcribing T1–T4 from A4.
    - Each `line` is a render function. For example, T1-G1 is `(b) => <Expr>{b}<V>x</V> − 4 = 11</Expr>`, and T3-G1 is `(b) => <Expr>20% = <Frac n="1" d={b} /></Expr>`.
    - The T2-G2 option 23/3 is `{ value: 23 / 3, label: <Frac n="23" d="3" /> }`.
  - **`anchors.ts`:**
```ts
import type { AnchorMeta } from "./types";
export const ANCHORS: AnchorMeta[] = [
  { id: "slope", name: "Slope & Lines", formula: "y = mx + b", useFor: "Lines, rates and graphs: the most common SAT topic." },
  { id: "vertex", name: "Vertex Form", formula: "y = a(x − h)² + k", useFor: "Find a parabola’s turning point at a glance." },
  { id: "quadratic", name: "Quadratic Formula", formula: "x = (−b ± √(b² − 4ac)) / 2a", useFor: "Solve any quadratic and count its solutions." },
  { id: "pythagorean", name: "Pythagorean Theorem", formula: "a² + b² = c²", useFor: "Find a missing side of a right triangle." },
];
```

- [ ] **Step 3: Write the content integrity tests.** They check structure, and re-derive every key and every trap value independently.
```tsx
// src/content/content.test.tsx
import { describe, expect, it } from "vitest";
import { ANCHORS } from "./anchors";
import { DECODER_QUESTIONS as QS } from "./decoder";
import { TRAPS } from "./traps";
import { TWIN_SETS as SETS } from "./twins";

const q = (id: string) => { const found = QS.find((x) => x.id === id); if (!found) throw new Error(id); return found; };
const val = (id: string, letter: string) => q(id).choices.find((c) => c.letter === letter)!.value;
const keyed = (id: string) => q(id).choices.find((c) => c.correct)!.value;

describe("decoder structure", () => {
  it("has 5 unique questions covering all four topics", () => {
    expect(QS).toHaveLength(5);
    expect(new Set(QS.map((x) => x.id)).size).toBe(5);
    expect(new Set(QS.map((x) => x.topic))).toEqual(new Set(["linear", "systems", "data", "geometry"]));
  });
  it("gives each question A–D, one correct choice, and ascending numeric values", () => {
    for (const x of QS) {
      expect(x.choices.map((c) => c.letter)).toEqual(["A", "B", "C", "D"]);
      expect(x.choices.filter((c) => c.correct)).toHaveLength(1);
      const nums = x.choices.map((c) => c.value).filter((v): v is number => v !== null);
      expect([...nums].sort((a, b) => a - b)).toEqual(nums);
      expect(new Set(nums).size).toBe(nums.length);
      const nullIndex = x.choices.findIndex((c) => c.value === null);
      expect(nullIndex === -1 || nullIndex === 3).toBe(true);
    }
  });
  it("gives every wrong choice a catalogued trap, 2–3 work lines and exactly one slip", () => {
    for (const x of QS) for (const c of x.choices.filter((c) => !c.correct)) {
      expect(c.trap && TRAPS[c.trap.id]).toBeTruthy();
      expect(c.trap!.work.length).toBeGreaterThanOrEqual(2);
      expect(c.trap!.work.length).toBeLessThanOrEqual(3);
      expect(c.trap!.work.filter((w) => w.slip)).toHaveLength(1);
    }
  });
});

describe("decoder math (re-derived)", () => {
  it("D1: 5 − 2(x − 4) = 3x − 7", () => {
    const lhs = (x: number) => 5 - 2 * (x - 4), rhs = (x: number) => 3 * x - 7;
    expect(keyed("distribute-negative")).toBe(4);
    expect(lhs(4)).toBe(rhs(4));
    expect(val("distribute-negative", "A")).toBeCloseTo((5 - 8 + 7) / 5); // −2 applied to x only
    expect(val("distribute-negative", "C")).toBe(13 + 7);                 // −2x moved without a sign flip
    expect(val("distribute-negative", "D")).toBeNull();                   // (5 − 2)(x − 4): 3x − 12 = 3x − 7
  });
  it("D2: 3x + 6 = 21 → x + 2", () => {
    const x = (21 - 6) / 3;
    expect(keyed("answer-the-question")).toBe(x + 2);
    expect(val("answer-the-question", "A")).toBe(21 / 3 - 6 + 2); // 6 not divided
    expect(val("answer-the-question", "B")).toBe(x);              // answered x
    expect(val("answer-the-question", "D")).toBe((21 + 6) / 3 + 2); // added 6
  });
  it("D3: 2x + 3y = 12, 2x − y = 4 → y", () => {
    const det = 2 * -1 - 3 * 2;
    const x = (12 * -1 - 3 * 4) / det, y = (2 * 4 - 12 * 2) / det;
    expect([x, y]).toEqual([3, 2]);
    expect(keyed("eliminate-carefully")).toBe(y);
    expect(val("eliminate-carefully", "B")).toBe(x);                  // answered x
    expect(val("eliminate-carefully", "C")).toBe((12 - 4) / (3 - 1)); // 3y − (−y) taken as 2y
    expect(val("eliminate-carefully", "D")).toBe(12 - 4);             // stopped at 4y
  });
  it("D4: $40 → $50", () => {
    expect(keyed("percent-change")).toBe(((50 - 40) / 40) * 100);
    expect(val("percent-change", "A")).toBe(50 - 40);
    expect(val("percent-change", "B")).toBeCloseTo(((50 - 40) / 50) * 100); // 0.2 × 100 is not exact in floating point
    expect(val("percent-change", "D")).toBe((50 / 40) * 100);
  });
  it("D5: legs 6 and 8", () => {
    expect(keyed("hypotenuse")).toBe(Math.hypot(6, 8));
    expect(val("hypotenuse", "A")).toBeCloseTo(Math.sqrt(64 - 36));
    expect(val("hypotenuse", "C")).toBe(6 + 8);
    expect(val("hypotenuse", "D")).toBe(36 + 64);
  });
  it("puts every lines-visual point on both of its lines", () => {
    const specs = [...QS.map((x) => x.visual), ...SETS.flatMap((s) => [s.sample.visual, s.twin.visual])];
    for (const v of specs) if (v.kind === "lines") for (const l of v.lines) expect(l.m * v.point[0] + l.b).toBeCloseTo(v.point[1]);
  });
});

describe("twin sets", () => {
  const answers = (id: string) => SETS.find((s) => s.id === id)!.twin.steps.map((s) => s.answer);
  it("has 4 unique sets covering all four topics", () => {
    expect(SETS.map((s) => s.id)).toEqual(["both-sides", "substitution", "percent-off", "circle-area"]);
    expect(new Set(SETS.map((s) => s.topic)).size).toBe(4);
  });
  it("re-derives every guided answer", () => {
    expect(answers("both-sides")).toEqual([5 - 2, 11 + 4, (11 + 4) / (5 - 2)]);
    const x = (19 - 4) / 3;
    expect(answers("substitution")).toEqual([2 + 1, x, x + 4]);
    expect(2 * x + (x + 4)).toBe(19);
    expect(answers("percent-off")).toEqual([100 / 20, 80 / 5, 80 - 80 / 5]);
    expect(answers("circle-area")).toEqual([14 / 2, 7 * 7, 7 * 7]);
  });
  it("gives each step 3 distinct ascending options, including the answer, with a message per wrong option", () => {
    for (const s of SETS) for (const step of s.twin.steps) {
      const values = step.options.map((o) => o.value);
      expect([...values].sort((a, b) => a - b)).toEqual(values);
      expect(new Set(values).size).toBe(3);
      expect(values).toContain(step.answer);
      for (const v of values.filter((v) => v !== step.answer)) expect(step.mistakes.some((m) => m.value === v)).toBe(true);
      expect(step.mistakes.every((m) => m.value !== step.answer)).toBe(true);
    }
  });
});

it("has the 4 anchors in order", () => {
  expect(ANCHORS.map((a) => a.id)).toEqual(["slope", "vertex", "quadratic", "pythagorean"]);
});
```
- [ ] **Step 4: Write the failing selector tests** (`src/lib/progress/selectors.test.ts`):
```ts
import { describe, expect, it } from "vitest";
import { ANCHORS } from "@/content/anchors";
import { DECODER_QUESTIONS as QS } from "@/content/decoder";
import { TWIN_SETS as SETS } from "@/content/twins";
import { initialProgress, progressReducer } from "./reducer";
import { anchorStats, decoderStats, overallProgress, trapJournal, twinStats } from "./selectors";
import type { ProgressAction } from "./types";

const run = (...a: ProgressAction[]) => a.reduce(progressReducer, initialProgress);
const pick = (questionId: string, choice: "A" | "B" | "C" | "D", correct = false): ProgressAction =>
  ({ type: "decoder/pick", questionId, choice, correct });
const content = { questions: QS, sets: SETS, anchors: ANCHORS };

describe("selectors", () => {
  it("counts decoded and first-try questions", () => {
    const s = run(pick("distribute-negative", "A"), pick("distribute-negative", "B", true), pick("hypotenuse", "B", true));
    expect(decoderStats(s, QS)).toEqual({ solved: 2, firstTry: 1, total: 5 });
  });
  it("groups the trap journal by trap, in content order", () => {
    const s = run(pick("eliminate-carefully", "B"), pick("answer-the-question", "B"), pick("distribute-negative", "A"));
    expect(trapJournal(s, QS)).toEqual([
      { trapId: "negative-distribution", count: 1, questionIndexes: [0] },
      { trapId: "wrong-target", count: 2, questionIndexes: [1, 2] },
    ]);
  });
  it("counts completed twins and explored anchors", () => {
    const id = SETS[0].id;
    const steps = [0, 1, 2].map((step): ProgressAction => ({ type: "twin/answer", twinId: id, step: step as 0 | 1 | 2, correct: true }));
    const s = run(...steps, { type: "anchor/explore", anchorId: "slope" });
    expect(twinStats(s, SETS)).toEqual({ completed: 1, total: 4 });
    expect(anchorStats(s, ANCHORS)).toEqual({ explored: 1, total: 4 });
  });
  it("computes overall progress from 0 to 1", () => {
    expect(overallProgress(initialProgress, content)).toBe(0);
    const all: ProgressAction[] = [
      ...QS.map((x) => pick(x.id, x.choices.find((c) => c.correct)!.letter, true)),
      ...SETS.flatMap((set) => [0, 1, 2].map((step) => ({ type: "twin/answer", twinId: set.id, step: step as 0 | 1 | 2, correct: true }) as ProgressAction)),
      ...ANCHORS.map((a) => ({ type: "anchor/explore", anchorId: a.id }) as ProgressAction),
    ];
    expect(overallProgress(run(...all), content)).toBe(1);
  });
});
```
- [ ] **Step 5:** Run the tests. Expected: FAIL (`./selectors` missing; content files fail until transcription is complete).
- [ ] **Step 6:** Implement `selectors.ts`:
```ts
import type { AnchorMeta, DecoderQuestion, TrapId, TwinSet } from "@/content/types";
import type { ProgressState } from "./types";

export function decoderStats(state: ProgressState, questions: readonly DecoderQuestion[]) {
  let solved = 0;
  let firstTry = 0;
  for (const q of questions) {
    const p = state.decoder[q.id];
    if (p?.solved) { solved++; if (p.picks.length === 1) firstTry++; }
  }
  return { solved, firstTry, total: questions.length };
}

export interface JournalEntry { trapId: TrapId; count: number; questionIndexes: number[] }

export function trapJournal(state: ProgressState, questions: readonly DecoderQuestion[]): JournalEntry[] {
  const entries = new Map<TrapId, JournalEntry>();
  questions.forEach((q, index) => {
    for (const letter of state.decoder[q.id]?.picks ?? []) {
      const trap = q.choices.find((c) => c.letter === letter)?.trap;
      if (!trap) continue;
      const entry = entries.get(trap.id) ?? { trapId: trap.id, count: 0, questionIndexes: [] };
      entry.count += 1;
      if (!entry.questionIndexes.includes(index)) entry.questionIndexes.push(index);
      entries.set(trap.id, entry);
    }
  });
  return [...entries.values()];
}

export const twinStats = (state: ProgressState, sets: readonly TwinSet[]) =>
  ({ completed: sets.filter((s) => (state.twins[s.id]?.stepsDone ?? 0) >= 3).length, total: sets.length });

export const anchorStats = (state: ProgressState, anchors: readonly AnchorMeta[]) =>
  ({ explored: anchors.filter((a) => state.anchorsExplored.includes(a.id)).length, total: anchors.length });

export function overallProgress(
  state: ProgressState,
  content: { questions: readonly DecoderQuestion[]; sets: readonly TwinSet[]; anchors: readonly AnchorMeta[] },
): number {
  const d = decoderStats(state, content.questions);
  const t = twinStats(state, content.sets);
  const a = anchorStats(state, content.anchors);
  return (d.solved / d.total + t.completed / t.total + a.explored / a.total) / 3;
}
```
- [ ] **Step 7:** Delete `src/lib/smoke.test.tsx`. `content.test.tsx` now exercises TSX. Run `npm --prefix $P run verify`. Expected: all green. If a math check fails, fix the content to match A3/A4 — never the test.
- [ ] **Step 8:** Commit: `feat: trap decoder, twin drill and anchor content with integrity tests`.

### Task 6: Visual anchors library (SVG/CSS)
**Files:**
- Create: `src/components/visuals/{CoordinatePlane,LinesGraph,FractionBar,RightTriangleSquares,CircleDiagram,BalanceSteps,DistributionArrows,TargetChain,VisualAnchor}.tsx`
- Modify: `src/app/page.tsx`, which becomes a temporary gallery.

**Interfaces — Consumes:** `Viewport`, `functionPath`, `linePath`, `lineSegment`, `ticks`, `toSvgX`, `toSvgY` (Task 3); `hypotenuse`, `simplifySqrt`, `formatNumber` (Task 3); `eq` (Task 2); `VisualSpec` (Task 5).
**Interfaces — Produces:**
```ts
type Level = 0 | 1 | 2 | 3;
CoordinatePlane(props: {
  x: [number, number]; y: [number, number]; title: string; tickStep?: number; // tickStep default: 1 if span ≤ 12, else 2
  children: (plot: { vp: Viewport; sx: (x: number) => number; sy: (y: number) => number; clip: string }) => ReactNode;
})                                       // width 320, height = 320 × ySpan/xSpan; children wrap curves in <g clipPath={clip}>
LinesGraph(props: { spec: Extract<VisualSpec, { kind: "lines" }>; level: Level })
FractionBar(props: Omit<Extract<VisualSpec, { kind: "fraction-bar" }>, "kind"> & { level: Level })
RightTriangleSquares(props: { a: number; b: number; level: Level })   // the Pythagorean anchor passes level 3
CircleDiagram(props: { diameter: number; level: Level })
BalanceSteps(props: { states: Extract<VisualSpec, { kind: "balance" }>["states"]; level: Level })
DistributionArrows(props: Omit<Extract<VisualSpec, { kind: "distribution" }>, "kind"> & { level: Level })
TargetChain(props: { chain: [string, string, string, string]; level: Level })
VisualAnchor(props: { spec: VisualSpec; level: number })  // clamps level to 0–3 and switches on spec.kind
```

- [ ] **Step 1: `CoordinatePlane`.**
  - Draw a minor grid every 1 unit (`stroke-grid`) and the axes (`stroke-axis`).
  - Label ticks every `tickStep` with 9-unit `fill-muted` text, skipping 0 on the y-axis.
  - Draw the `clipPath` rect over the plot area. Build its id as `"clip-" + useId().replace(/[^a-zA-Z0-9_-]/g, "")`.
  - Render `<svg viewBox role="img" aria-label={title} className="mx-auto h-auto w-full max-w-sm">`.
- [ ] **Step 2: `LinesGraph`** follows the A6 table.
  - Each line is a `linePath` in `stroke-v1` / `stroke-v2`, with `stroke-width` 2.5; at level 0 it gets opacity 0.35.
  - Place each label at the right-most visible end from `lineSegment`, nudged inward so it stays inside the view.
  - Level ≥ 2: a dashed vertical guide at x = px. Level 3: a dot plus "(px, py)".
  - `title`: "Graph of {label 1} and {label 2}, crossing at (px, py)."
- [ ] **Step 3: `FractionBar`** is an HTML flex row, so it is responsive.
  - Level 0: one bar labeled `prefix + parts·partValue`.
  - Level ≥ 1: split it into `parts` equal segments, each labeled `prefix + partValue`.
  - Level ≥ 2: shade the first `highlight` segments `bg-trap-soft border-trap-line`. Then append `extra` amber segments outside the original bar's right border, separated by a "+" gap.
  - Level 3: show `caption`.
  - Also render a visually hidden sentence describing the bar.
- [ ] **Step 4: `RightTriangleSquares`.**
  - Geometry, in world units: right angle at (0,0), leg b along +x, leg a along +y.
  - Squares: on b, the square (0,0)(b,0)(b,−b)(0,−b). On a, the square (0,0)(0,a)(−a,a)(−a,0). On the hypotenuse, P1=(b,0), P2=(0,a), P2+(a,b), P1+(a,b).
  - Bounding box: x from −a to b+a, y from −b to a+b. Scale it to fit the viewBox, with y flipped.
  - Reveal by level per A6. Label areas "a² = 36" (`fill-v1`), "b² = 64" (`fill-v2`), "c² = 100" (`fill-v3`).
  - For c, use `hypotenuse()`: exact shows "c = 10"; otherwise "c = √{n}", simplified with `simplifySqrt` when `outside > 1`.
- [ ] **Step 5: `CircleDiagram`.**
  - Draw a circle with a horizontal diameter labeled `d = {diameter}`.
  - Level ≥ 1: the radius in `stroke-v1`, labeled `r = {d/2}`.
  - Level ≥ 2: a dashed r × r square on the radius, labeled `r² = {r²}`.
  - Level 3: a fill-v1 / 15 % area plus `A = {r²}π ≈ {formatNumber(πr², 1)}`.
- [ ] **Step 6: `BalanceSteps`.**
  - A beam row with two pans: `eq(states[level].left)` = `eq(states[level].right)`.
  - When `level > 0`, show an op badge: `"{op} on both sides"`.
  - Below, show the history of the earlier states, struck through lightly.
- [ ] **Step 7: `DistributionArrows`.**
  - SVG text `factor(terms[0] terms[1])`.
  - Level ≥ 1: two curved arrows from the factor to each term (quadratic Bézier paths, `stroke-v1`). Show the products under each term in `fill-v1`.
- [ ] **Step 8: `TargetChain`.**
  - Chips joined by `ArrowRight` icons. Chip 0 carries a `Target` icon and the label "Asked for", and always shows.
  - Show `level + 1` chips. The last chip uses the ok tone when `level === 3`.
- [ ] **Step 9:** Temporary gallery in `page.tsx`: for every `visual` in `DECODER_QUESTIONS` and in `TWIN_SETS` (sample and twin), render `VisualAnchor` at levels 0–3 side by side.
- [ ] **Step 10: Verify.**
  - Run `npm --prefix $P run verify`; it must be green.
  - Browser checks:
    - Both themes: colors come from tokens and contrast holds.
    - At 375 px wide (`resize_window` mobile) the SVGs scale with no horizontal scroll.
    - The `lines` labels sit inside the plot.
    - The D3 point (3, 2), T2 point (3, 7) and T2 twin point (5, 9) sit exactly on the crossings.
    - The console is clean.
- [ ] **Step 11:** Commit: `feat: SVG/CSS visual anchors with step-by-step reveal levels`.

### Task 7: App shell, hash navigation, Home
**Files:**
- Create: `src/lib/{tabs.ts,tabs.test.ts,use-active-tab.ts}`
- Create: `src/components/shell/{MathLabApp,TopBar,BottomNav,ViewHeader,SiteFooter}.tsx`
- Create: `src/components/home/{HomeOverview,ModuleCard,TrapJournal,ResetProgress}.tsx`
- Modify: `src/app/page.tsx`

**Interfaces — Consumes:** `useProgress` (Task 4); selectors and content (Task 5); UI primitives and ThemeToggle (Task 2).
**Interfaces — Produces:**
```ts
// tabs.ts
export const TABS: readonly ["home", "decoder", "twins", "anchors"];
export type Tab = (typeof TABS)[number];
export function parseTab(hash: string): Tab;
// use-active-tab.ts ("use client")
export function useActiveTab(): [Tab, (tab: Tab) => void];
// components
MathLabApp()                                                       // "use client"; the whole single page
ViewHeader(props: { title: string; intro: ReactNode; headingRef: Ref<HTMLHeadingElement> })
HomeOverview(props: { onNavigate: (tab: Tab) => void })
// Each module view receives its props from MathLabApp and exposes its own h1 through ViewHeader.
```

- [ ] **Step 1: Write the failing test** (`tabs.test.ts`):
```ts
import { expect, it } from "vitest";
import { parseTab } from "./tabs";
it("parses known hashes and falls back to home", () => {
  expect(parseTab("#decoder")).toBe("decoder");
  expect(parseTab("twins")).toBe("twins");
  expect(parseTab("")).toBe("home");
  expect(parseTab("#nope")).toBe("home");
  expect(parseTab("#ANCHORS")).toBe("home");
});
```
- [ ] **Step 2:** Run it. Expected: FAIL.
- [ ] **Step 3:** Implement `tabs.ts` and `use-active-tab.ts`:
```ts
// tabs.ts
export const TABS = ["home", "decoder", "twins", "anchors"] as const;
export type Tab = (typeof TABS)[number];
export function parseTab(hash: string): Tab {
  const id = hash.replace(/^#/, "");
  return (TABS as readonly string[]).includes(id) ? (id as Tab) : "home";
}
```
```ts
// use-active-tab.ts
"use client";
import { useSyncExternalStore } from "react";
import { parseTab, type Tab } from "./tabs";

function subscribe(listener: () => void) {
  window.addEventListener("hashchange", listener);
  return () => window.removeEventListener("hashchange", listener);
}

export function useActiveTab(): [Tab, (tab: Tab) => void] {
  const tab = useSyncExternalStore(subscribe, () => parseTab(window.location.hash), () => "home" as const);
  return [tab, (next) => { if (next !== tab) window.location.hash = next; }]; // a new history entry, so Back works
}
```
- [ ] **Step 4: `MathLabApp`.**
  - Calls `useActiveTab()` and renders `TopBar` (md+), `<main id="main" className="mx-auto w-full max-w-5xl px-4 pb-28 pt-6 sm:px-6 md:pb-12">`, the active view (`HomeOverview | TrapDecoder | TwinDrill | FormulaAnchors`), `SiteFooter`, and `BottomNav` (< md).
  - Holds `headingRef = useRef<HTMLHeadingElement>(null)` and passes it to the active view's `ViewHeader`.
  - Focus effect — on a tab change, but not on first mount (track that with an `isFirst` ref read inside the effect):
```tsx
useEffect(() => {
  if (isFirst.current) { isFirst.current = false; return; }
  window.scrollTo({ top: 0 });
  headingRef.current?.focus();
}, [tab]);
```
  - Until Tasks 8–10 land, the three module views are `ViewHeader`-only components. Later tasks replace them.
- [ ] **Step 5: Navigation components.**
  - **TopBar:** sticky `top-0 z-40`, `bg-bg/85 backdrop-blur`, `border-b border-line`.
    - Brand: a ◆ in an indigo rounded square, "Math Lab", and a small "OCT1.2" pill.
    - Nav buttons (icon + label) with `aria-current={active ? "page" : undefined}`; the active one gets `bg-accent-soft text-accent`.
    - `ThemeToggle` on the right.
  - **BottomNav:** `fixed inset-x-0 bottom-0 md:hidden`, 4 equal buttons (icon over label, `min-h-14`), `pb-[env(safe-area-inset-bottom)]`. On mobile, the ThemeToggle sits in a slim TopBar that has the brand only.
  - **ViewHeader:** `<h1 ref tabIndex={-1} className="text-3xl font-semibold tracking-tight outline-none sm:text-4xl">` followed by the intro paragraph in `text-muted`.
  - **SiteFooter:** the A2 footer text, small and muted.
- [ ] **Step 6: Home, per A2.**
  - **HomeOverview:** the hero and an `overallProgress` bar (`role="progressbar"` with `aria-valuenow` 0–100). Below it, the "Your path" grid of 3 `ModuleCard`s, then `TrapJournal`, then `ResetProgress`.
  - **ModuleCard:** shows the step number, icon, title, a one-line description, the progress text, a thin progress bar, and a button.
    - Button label: "Start" when the module is at 0, "Review" when complete, "Continue" otherwise.
    - The button calls `onNavigate(tab)`.
  - **TrapJournal:** uses `trapJournal(state, DECODER_QUESTIONS)`. Each entry shows `TRAPS[id].name` with a `TriangleAlert` icon, the habit, and a "Caught you ×{count}" pill. For each `questionIndexes` item, a "Q{i+1} · {TOPIC_LABEL}" button dispatches `{ type: "cursor/set", cursor: { decoder: i } }`, then calls `onNavigate("decoder")`. Empty state copy is in A2.
  - **ResetProgress:** `const [confirming, setConfirming] = useState(false)`.
    - The first click sets it to true. A second click dispatches `progress/reset` and resets `confirming`.
    - Revert after 4 s: `useEffect(() => { if (!confirming) return; const t = setTimeout(() => setConfirming(false), 4000); return () => clearTimeout(t); }, [confirming])`. The setState happens inside the timer callback, which the lint rules allow.
- [ ] **Step 7:** Make `page.tsx` render `<MathLabApp />` only. This removes the gallery.
- [ ] **Step 8: Verify.**
  - Run `verify`; it must be green. Then check in the browser:
    - Nav buttons change the hash and the view; **Back** returns to the previous view.
    - Focus lands on the new `h1` after a nav click, but not on first load.
    - Loading `#nope` shows Home.
    - The bottom nav appears at 375 px; the top nav at ≥ 768 px.
    - The console has no hydration warnings.
- [ ] **Step 9:** Commit: `feat: single-page shell with hash navigation, Home, trap journal and reset`.

### Task 8: Module 1 — The Trap Decoder
**Files:**
- Create: `src/components/decoder/{TrapDecoder,DecoderQuestionCard,ChoiceButton,TrapReveal,SocraticSteps,DodgedTraps}.tsx`
- Modify: `MathLabApp.tsx` (swap in `TrapDecoder`)

**Interfaces — Consumes:** `useProgress`; `DECODER_QUESTIONS`, `TRAPS`, `TOPIC_LABEL`; `VisualAnchor`; `ProgressDots`, `Callout`, `Button`, `Pill`; `eq`.
**Interfaces — Produces:**
```ts
TrapDecoder(props: { headingRef: Ref<HTMLHeadingElement> })
DecoderQuestionCard(props: { question: DecoderQuestion; index: number; progress: DecoderProgress | undefined;
  onPick: (choice: DecoderChoice) => void; onReveal: () => void; onRetry: () => void; onNext?: () => void })
ChoiceButton(props: { choice: DecoderChoice; state: "open" | "eliminated" | "correct" | "locked"; onPick: () => void;
  buttonRef?: Ref<HTMLButtonElement> })
TrapReveal(props: { choice: DecoderChoice; onTryAgain: () => void; onWalkthrough: () => void })
SocraticSteps(props: { steps: Triple<SocraticStep>; revealed: number; onRevealNext: () => void })
DodgedTraps(props: { choices: DecoderChoice[] })
```

- [ ] **Step 1: `TrapDecoder` (the view).**
  - Read `[state, dispatch] = useProgress()`. Compute `index = Math.min(state.cursor.decoder, 4)`.
  - Render `ViewHeader` with the A3 intro copy.
  - Render `ProgressDots`: `done = questions.map(q => state.decoder[q.id]?.solved ?? false)`, `label = i => \`Question ${i + 1}${done[i] ? ", decoded" : ""}\``, and `onSelect = i => dispatch({ type: "cursor/set", cursor: { decoder: i } })`.
  - Prev/Next buttons are disabled at the ends.
  - Render `DecoderQuestionCard` with `key={question.id}`.
  - Wire the actions:
    - `onPick` → `dispatch({ type: "decoder/pick", questionId, choice: c.letter, correct: c.correct === true })`
    - `onReveal` → `decoder/revealStep`
    - `onRetry` → `decoder/retry`
    - `onNext` → `cursor/set` with index + 1 (omitted on the last question)
  - Live region: a `<p role="status" className="sr-only">` derived from state. If the last pick was a trap: "Trap spotted: {name}". If solved: "Decoded!". Otherwise empty.
- [ ] **Step 2: `DecoderQuestionCard` and `ChoiceButton`** follow the A3 behavior.
  - Header: `Pill` "Question {n} · {TOPIC_LABEL}". After solving, also show a `Pill tone="ok"` with "Lesson: {lesson}".
  - Prompt in `text-lg`.
  - Choices in a `grid gap-2` with letter circles. Compute each choice's state:
    - `correct`: solved and this is the correct letter.
    - `eliminated`: this letter is in `picks` and is not correct.
    - `locked`: solved and this is not the correct letter.
    - `open`: anything else.
  - Styling:
    - eliminated: line-through, `TriangleAlert`, `text-muted`, `disabled`, sr-only "trap".
    - correct: `bg-ok-soft text-ok`, `CircleCheck`, sr-only "correct".
  - The card keeps a `firstOpenRef` on the first open choice so Try again can focus it. The focus happens inside the click handler.
- [ ] **Step 3: `TrapReveal`** — show it when the last pick is a trap and the question isn't solved.
  - Wrapper: an amber `Callout` with `motion-safe:animate-fade-up`. Title: "Trap spotted: {TRAPS[id].name}".
  - Headline paragraph.
  - "How this answer happens:" as an ordered list of work lines. Render each as `label` + `eq(math)`.
  - The slip line gets `underline decoration-trap-line decoration-2 underline-offset-4`, a small "the slip" pill, and its `note` in `text-sm`.
  - "The fix:" paragraph, then "Habit:" with a `Lightbulb` icon.
  - Buttons: Try again (secondary) and Walk me through it (primary).
  - Above the card, list earlier traps on this question as small chips: "{letter}: {trap name}".
- [ ] **Step 4: Solved state.**
  - Show an ok `Callout`: "Decoded!" plus "First try!" when `picks.length === 1`.
  - Then `DodgedTraps`, a `<details>` with the summary "Traps you dodged ({n})". It lists the trap name and headline of each wrong choice the student never picked.
  - Then the "Walk through it" button (when `stepsRevealed === 0`) and "Next question →" (primary).
- [ ] **Step 5: Walkthrough.** Render it when `stepsRevealed > 0`. Use a `lg:grid-cols-[1fr_minmax(0,22rem)]` layout with `SocraticSteps` on the left and `VisualAnchor spec={question.visual} level={stepsRevealed}` on the right; stack them on mobile.
  - `SocraticSteps` shows `steps.slice(0, revealed)` as numbered cards: the ask in bold, then the move, then the result as a block `Expr`.
  - While `revealed < 3`, show a button "Show step {revealed + 1}". At 3, show "Pattern locked in." with `CircleCheck`.
  - A ghost "Start this one over" button (`RotateCcw`) sits at the bottom of the card.
- [ ] **Step 6: Verify** — run `verify` green, then check in the browser:
  - **D1:**
    - Pick A. The trap card shows "The Negative-Distribution Trap". The underlined slip line is `5 − 2x − 8 = 3x − 7`. A is struck through and disabled.
    - Pick C. Now two chips are listed.
    - Pick B. You see "Decoded!" (not "First try!"). Dodged traps lists D.
    - Reveal steps 1–3. The visual adds arrows at level 1.
    - Reload. Everything persists.
  - **Home:** the Trap Journal lists Negative-Distribution and Sign-Flip. A "Q1" button jumps to question 1.
  - **D5:** pick B first. You see "First try!".
  - **Keyboard only:** Tab reaches the choices and Enter picks one; Try again moves focus to the first open choice.
  - Repeat on mobile at 375 px. The console is clean.
- [ ] **Step 7:** Commit: `feat: Trap Decoder with trap reveals, Socratic walkthroughs and visuals`.

### Task 9: Module 2 — The Twin Question Drill
**Files:**
- Create: `src/components/twins/{TwinDrill,SampleAccordion,TwinPanel,GuidedStep,AnswerModeToggle}.tsx`
- Modify: `MathLabApp.tsx` — swap in `TwinDrill`.

**Interfaces — Consumes:** `useProgress`; `TWIN_SETS`; `parseNumericAnswer`, `answersMatch`, `formatNumber`; `VisualAnchor`; `MISSES_BEFORE_SHOW_ME`; UI primitives.

**Interfaces — Produces:**
```ts
TwinDrill(props: { headingRef: Ref<HTMLHeadingElement> })
SampleAccordion(props: { set: TwinSet; expanded: Triple<boolean>; mirrorStep: number | null;
  onToggle: (step: StepIndex) => void })
TwinPanel(props: { set: TwinSet; progress: TwinProgress; mode: AnswerMode; onPeek: (step: StepIndex) => void })
GuidedStep(props: { setId: string; index: StepIndex; step: GuidedStepContent; status: "done" | "active" | "locked";
  assisted: boolean; misses: number; mode: AnswerMode; onPeek: () => void })
AnswerModeToggle(props: { mode: AnswerMode; onChange: (mode: AnswerMode) => void })
```
(`GuidedStepContent` is the `GuidedStep` type from `content/types.ts`, imported under that alias to avoid a name clash.)

- [ ] **Step 1: `TwinDrill` (the view).**
  - Index: `index = Math.min(state.cursor.twin, 3)`.
  - Render `ViewHeader` with the A4 intro.
  - Set chips: 4 buttons with `aria-current` and a `CircleCheck` when `stepsDone === 3`. Clicking one dispatches `cursor/set { twin: i }`.
  - Pattern strip: the 3 `pattern` names joined by `ArrowRight`. Highlight the name at index `stepsDone` while it is below 3.
  - Grid: `lg:grid-cols-2 gap-4`, `SampleAccordion` on the left and `TwinPanel` on the right. Key both by `set.id`.
  - Accordion state: TwinDrill keeps UI-only `const [expandedBySet, setExpandedBySet] = useState<Record<string, Triple<boolean>>>({})`. Each set reads `expandedBySet[set.id] ?? [false, false, false]`. `onToggle(i)` flips that entry; when it opens, it also dispatches `twin/openSample`.
  - `onPeek(i)` sets `expanded[i] = true`, dispatches `twin/openSample`, then calls `document.getElementById(\`sample-${set.id}-${i}\`)?.scrollIntoView({ block: "center" })` in the handler.
  - `mirrorStep` is `stepsDone < 3 ? stepsDone : null`.
- [ ] **Step 2: `SampleAccordion`.**
  - Card "Sample (solved)" with the prompt and `VisualAnchor` at `level = highestOpenedIndex + 1`, where `highestOpenedIndex` comes from the stored `sampleOpened`.
  - 3 items. Each header is a `<button aria-expanded aria-controls id=…>` that shows the "Step n" pill, the ask, and a `ChevronDown` that rotates when open.
  - The body shows the move and the result (block `Expr`).
  - Viewed steps get a small `Eye` "viewed" mark.
  - The mirror item gets `ring-2 ring-accent` and a "Mirror step" pill.
- [ ] **Step 3: `TwinPanel`.**
  - Card "Your twin" with the prompt and `VisualAnchor` at `level = stepsDone`.
  - `AnswerModeToggle`: two buttons with `aria-pressed`, labeled "Type it" (`Keyboard`) and "Choose" (`ListChecks`). It dispatches `settings/answerMode`.
  - 3 `GuidedStep`s, each with `key={\`${set.id}-${i}-${progress.stepsDone > i ? "done" : "live"}\`}`.
  - When `stepsDone === 3`, show the completion `Callout` from A4.
    - Show the check line.
    - Show the "Try Practice again…" hint if any step is `assisted`.
    - Buttons: Practice again (`twin/restart`) and "Next twin →", which sets `cursor.twin` to index + 1 (hide it on the last set).
- [ ] **Step 4: `GuidedStep`.** It renders `step.context` (muted, `eq` style) above `step.line(blank)`.
  - **done:** `blank` = the answer, rendered with `formatNumber` (or its option `label`) in `font-semibold text-ok`, plus `CircleCheck`. If assisted, add a "shown" pill.
  - **locked:** dim the step (`opacity-50`) and show "Unlocks after step {index}".
  - **active, type mode:**
    - `blank` = `<input id aria-label={step.ask} inputMode="decimal" autoComplete="off" className="w-[5ch] … text-center font-math">`. It's a controlled `useState` field.
    - A "Check" button sits next to it. Enter submits through a `<form onSubmit>`.
  - **active, choose mode:**
    - `blank` = a dashed `inline-block w-[4ch]` slot.
    - 3 option buttons below, each labeled with `label ?? formatNumber(value)`.
  - **Submit logic.** It lives in the event handler only; local state is `lastValue: number | null` and `formatHint: boolean`.
```ts
function submit(value: number | null) {
  if (value === null) { setFormatHint(true); return; }        // garbage: hint only, nothing dispatched
  setFormatHint(false);
  setLastValue(value);
  dispatch({ type: "twin/answer", twinId: setId, step: index, correct: answersMatch(value, step.answer) });
}
// type mode:   submit(parseNumericAnswer(text))
// choose mode: submit(option.value)
```
  - **Feedback** is derived; there's no extra state.
    - If `formatHint`: show "Type a number, like 7, −3, or 4/5."
    - Else if `lastValue !== null`: if `mistakes.find(m => answersMatch(m.value, lastValue))` matches, show an amber `Callout` with `why`; otherwise show an info `Callout` with `nudge`.
    - When `misses >= MISSES_BEFORE_SHOW_ME`: show **Show me** (dispatches `twin/showMe`). In type mode, also show "Pick from 3 choices", which dispatches `settings/answerMode: "choose"`.
  - Small links under the line:
    - "Show 3 choices" / "Type it instead" — toggles `answerMode`.
    - "Peek at the sample" → `onPeek()`.
- [ ] **Step 5: Verify.** Run `verify` until green, then check in the browser:
  - **T1, Type mode:**
    - Type `7`. Expect "You added 2x instead of subtracting it…" and misses = 1.
    - Type `abc`. Expect the format hint and misses still 1 (check the Show me button is absent and localStorage is unchanged).
    - Type `−3` with a real minus. Expect the "Subtract 2x from 5x…" message; misses = 2; **Show me** appears.
    - Type `3`. Expect step 1 done; the balance visual moves to level 1; step 2 active.
  - Switch to **Choose**. Expect 3 options for step 2. Pick 11 and get its message, then pick 15.
  - Reload. Mode, progress, and set position all persist.
  - Finish with Show me on step 3 after 2 misses. Expect the "shown" pill and the Practice-again hint.
  - **Practice again** resets the guided steps but keeps sample "viewed" marks.
  - "Peek at the sample" expands and scrolls to the mirror item.
  - **T3 G1:** the blank sits inside the fraction denominator.
  - **T2 G2:** the 23/3 option renders as a stacked fraction.
  - At 375 px the panes stack, with no horizontal scroll.
  - The console is clean.
- [ ] **Step 6:** Commit: `feat: Twin Drill with sample accordion and type-or-choose guided steps`.

### Task 10: Module 3 — Interactive Formula Anchors
**Files:**
- Create: `src/components/anchors/{FormulaAnchors,LabeledSlider,FormulaTokens,SlopeAnchor,VertexAnchor,QuadraticAnchor,PythagoreanAnchor}.tsx`
- Modify: `MathLabApp.tsx` (swap in `FormulaAnchors`)

**Interfaces — Consumes:** `useProgress`, `ANCHORS`, `CoordinatePlane`, `RightTriangleSquares`, `linePath`, `functionPath`, `linearTokens`, `vertexTokens`, `standardQuadraticTokens`, `tokensToText`, `solveQuadratic`, `discriminant`, `slopeRiseRun`, `hypotenuse`, `simplifySqrt`, `isPerfectSquare`, `formatNumber`, `range`, `Callout`.
**Interfaces — Produces:**
```ts
FormulaAnchors(props: { headingRef: Ref<HTMLHeadingElement> })
LabeledSlider(props: { id: string; symbol: string; name: string; colorClass: string; values: readonly number[];
  value: number; onChange: (v: number) => void })      // the range input moves over indexes, so value lists can skip 0
FormulaTokens(props: { tokens: Token[]; size?: "lg" | "md" })
// Each anchor: (props: { onExplore: () => void }). Slider values live in local useState.
SlopeAnchor · VertexAnchor · QuadraticAnchor · PythagoreanAnchor
export const ROLE_COLOR: Record<VarRole, string>;     // m,a → "text-v1"; b,k → "text-v2"; h,c → "text-v3"
```

- [ ] **Step 1: `LabeledSlider`.**
  - Render a `<label htmlFor={id}>` holding the colored symbol chip and the name, plus a value readout (`formatNumber`).
  - Add a − and a + stepper (`aria-label="Decrease {symbol}"` / `"Increase {symbol}"`, 44 px each).
  - The range input is `<input type="range" id min={0} max={values.length - 1} step={1} value={index} className="accent-accent w-full">` with `aria-valuetext={\`${symbol} = ${formatNumber(value)}\`}`. `onChange` maps the index back to `values[index]`.
- [ ] **Step 2: `FormulaTokens`.**
  - Render each token as a span in `font-math`.
  - Italic tokens get `italic`; tokens with a role get `ROLE_COLOR[role] font-semibold`.
  - Size `lg` = `text-3xl sm:text-4xl`.
  - Include `aria-label={tokensToText(tokens)}` on the wrapper. The child spans are `aria-hidden`.
- [ ] **Step 3: `FormulaAnchors` (the view).**
  - Show the `ViewHeader` with the A5 intro.
  - On lg, use a `grid-cols-[15rem_1fr]` layout:
    - The left nav lists `ANCHORS` as buttons: name, the mini formula in `font-math`, and a `CircleCheck` when explored. Use `aria-current` for the selected one.
    - On mobile the nav becomes a horizontal `overflow-x-auto` chip row.
  - Choosing an anchor dispatches `cursor/set { anchor: id }`.
  - The selected id is `state.cursor.anchor`, falling back to `"slope"` when unknown.
  - Render the matching anchor with `key={id}` and `onExplore={() => dispatch({ type: "anchor/explore", anchorId: id })}`.
- [ ] **Step 4: The four anchors.** Follow the A5 table exactly, using workspace order: formula → substituted line → SVG → sliders → "What changed" (`aria-live="polite"`) → trap `Callout`. Each slider's `onChange` sets its local value and then calls `onExplore()`.
  - **Slope:**
    - Slider values: `values = range(-4, 4, 0.5)` and `range(-6, 6, 1)`.
    - Plane: [−8, 8]².
    - Line: `linePath(m, b)` with `stroke-v1`.
    - Points: an intercept dot at (0, b) in `fill-v2`.
    - Staircase: draw it from `slopeRiseRun(m)` as dashed legs. Label them "run {run}" and "rise {rise}".
    - Slope panel: `m = (y₂ − y₁)/(x₂ − x₁) = ({b+rise} − {b})/({run} − 0) = {m}`.
  - **Vertex:**
    - Slider values: `range(-3, 3, 0.5)`, `range(-5, 5, 1)` ×2.
    - Curve: if `a === 0`, draw the horizontal `linePath(0, k)`. Otherwise draw `functionPath(x => a*(x-h)**2 + k)` inside the clip.
    - Vertex dot labeled "(h, k)". Dashed axis at x = h when a ≠ 0.
    - Sign-flip callout logic is in A5.
  - **Quadratic:**
    - Slider values: a ∈ `[-3, -2, -1, 1, 2, 3]`; b and c ∈ `range(-6, 6, 1)`. Plane: x [−8, 8], y [−10, 10].
    - Parabola: `functionPath`. Root dots come from `solveQuadratic`.
    - Discriminant meter: a pill with the D value, plus a three-state sentence from A5.
    - Roots:
      - When `isPerfectSquare(D)`, show `x = ({−b} ± {√D}) / {2a}` → "x = r1 or x = r2" (`formatNumber`).
      - When D > 0 but not a perfect square, show `x = ({−b} ± {o}√{i}) / {2a} ≈ r1, r2`, using `simplifySqrt(D)` and printing `o` only when it is greater than 1.
      - When D < 0, show "No real solutions".
    - Display rule: show −b with its sign resolved. For b = −2, the substituted line reads `−(−2) = 2`.
  - **Pythagorean:**
    - Slider values: `range(1, 12, 1)` ×2.
    - Visual: `RightTriangleSquares a b level={3}`. Text lines per A5; show the triple badge when `hypotenuse().exact`.
- [ ] **Step 5: Verify.** Run `verify` (must be green), then check in the browser:
  - **Slope:**
    - m = −1, b = 1 shows `y = −x + 1`. Its sentence: "Negative slope: the line falls as you move right."
    - m = 0 shows `y = 1` and the flat-line sentence.
    - m = 4, b = 6: the line is clipped inside the grid.
  - **Vertex:**
    - h = −3 shows `(x + 3)²` and the sign-flip callout.
    - a = 0 shows `y = k` and the not-a-parabola sentence.
    - Vertex at (5, 5): the dot stays visible and the path has no NaN (inspect the `d` attribute).
  - **Quadratic:**
    - The default shows D = 16, roots −1 and 3, with two dots.
    - b = 2, c = 1 shows D = 0 and "just touches".
    - c = 6 shows D < 0 and "no real solutions" with no root dots.
    - a = 1, b = 2, c = −1 shows D = 8 = (2√2)² → `x = (−2 ± 2√2)/2 ≈ −2.41, 0.41`.
  - **Pythagorean:**
    - 6, 8 → c = 10 with the triple badge.
    - 2, 3 → c = √13 ≈ 3.61.
    - 6, 6 → `c = √72 = 6√2 ≈ 8.49`.
  - **Keyboard:** arrow keys move the sliders; the steppers work.
  - **Home:** shows "N of 4 explored".
  - **Layout:** 375 px has no horizontal scroll.
  - The console is clean.
- [ ] **Step 6:** Commit with message `feat: Formula Anchors with live slope, vertex, quadratic and Pythagorean visuals`.

### Task 11: README, full verification, final review
**Files:** Create `README.md`. Modify any file the review flags.

- [ ] **Step 1: Write `README.md`.** It should be short and cover, in order:
  - what the app is: three modules for students with math anxiety
  - how to run it:
```bash
npm install
```
```bash
npm run dev
```
    then open `http://localhost:4182`
  - `npm run verify`
  - the project structure, as the File structure tree above
  - how to edit content: the files in `src/content/`, where `content.test.tsx` re-checks every answer
  - persistence: browser-local, and the reset button
  - fonts: next/font downloads them at build time, so the first build needs internet
  - provenance: original SAT-style items, not from College Board, with the trademark line
- [ ] **Step 2:** Run `npm --prefix $P run verify` fresh.
  - Expected: ESLint finishes with 0 problems, tsc reports 0 errors, all Vitest suites pass, and `next build` succeeds with `/` prerendered as static.
  - Copy the real summary lines into the final report. Don't paraphrase them.
- [ ] **Step 3:** Run the browser checks in **Final verification** below. Fix anything that fails, and re-run `verify` after every fix.
- [ ] **Step 4: Final review.**
  - Dispatch one fresh reviewer subagent (`agent-protocols:code-reviewer`, model opus) over `Oct1.2/`, pointing it at this plan's spec and Global Constraints.
  - Fix every Critical or Important finding, then re-run `verify`.
  - List any finding that was skipped, with the reason, in the report.
- [ ] **Step 5:** Commit with message `docs: README; chore: final verification fixes`.
  - Report to the user: the run command, the URL, the verify output, a summary of the browser checks, the commit list (`git -C $P log --oneline`), and anything left unverified.

---

## Final verification (end-to-end, run in Task 11)
1. **Static checks:** `npm --prefix $P run verify` is green, with 0 ESLint warnings.
2. **Fresh load:** clear site data, then load `http://localhost:4182`.
   - No console errors or warnings (`read_console_messages`). No hydration warnings.
   - Home shows 0% progress and the empty Trap Journal message.
3. **Decoder flow:** as in Task 8 Step 6. Then on Home, the Trap Journal shows those traps, and the "Q" buttons jump to the right question.
4. **Twin flow:** as in Task 9 Step 5. This includes Review Focus #3: garbage input dispatches nothing.
5. **Anchors flow:** as in Task 10 Step 5. This covers Review Focus #4.
6. **Persistence:**
   - Reload: progress, cursor position, answer mode, and theme all persist.
   - With two tabs open, a change in one tab appears in the other.
7. **Corrupt storage** (Review Focus #1):
   - In devtools: `localStorage.setItem("oct1.2-math-lab/progress", "{bad")`, then reload. The app loads fresh, with no crash.
   - Repeat with `{"version":1,"decoder":{"x":{"picks":"A"}}}`. It loads, and the bad entry is ignored.
8. **Theme:**
   - Set dark, reload: no light flash.
   - Clear the theme key and emulate OS dark: the page is dark on first paint.
   - Toggle back to light, reload: it stays light.
9. **Widths:**
   - At 320, 375, 768 and 1280 px, `document.documentElement.scrollWidth <= window.innerWidth`.
   - The bottom nav appears below 768 px and the top nav from 768 px up.
   - The twin panes stack on narrow screens.
10. **Keyboard only:**
    - Tab through nav, choices, the accordion (Enter/Space), twin inputs (Enter submits), mode toggles, sliders (arrow keys) and steppers.
    - The focus ring is visible everywhere.
    - On each view change, focus lands on the `h1`.
11. **Reduced motion:** with `prefers-reduced-motion: reduce` emulated, no fade animations run.

## Plan self-review (done while writing)
- **Spec coverage:**
  - A2 → Task 7. A3 → Tasks 5 and 8. A4 → Tasks 5 and 9. A5 → Task 10. A6 → Task 6. A7 → Task 4. A8 → Task 2. A9 → Tasks 2 and 7–10, plus Final verification.
  - The user's technical requirements map to: Next.js, React, Tailwind and Lucide (Task 1); TypeScript and lint-clean code (`verify` in every task); no LaTeX (Task 2 `MathText`); dark mode (Task 2); state flows (Task 4).
- **Type consistency:**
  - `Triple`, `StepIndex`, `ChoiceLetter`, `AnswerMode` and `ProgressAction` names match across Tasks 4, 5 and 7–10.
  - `GuidedStep` exists as both a content type and a component. Task 9 imports the type under the alias `GuidedStepContent`.
  - `VisualAnchor` takes `level: number` and clamps it to 0–3.
- **Placeholders:** none. Content is fully specified in A3/A4. Component tasks give exact props, states, copy and checks; logic tasks include full code.
- **Review Focus:** each of the 5 items has its test in the owning task (#1 and #2 → Task 4 store tests; #3 → Task 3 parse tests plus the Task 9 check; #4 → Task 3; #5 → Task 4 reducer tests).

