import { eq, Frac, Sqrt, System } from "@/components/math/MathText";
import type { DecoderQuestion } from "./types";

const note = (text: string) => <span className="text-sm text-muted">{text}</span>;

export const DECODER_QUESTIONS: DecoderQuestion[] = [
  {
    id: "distribute-negative",
    topic: "linear",
    lesson: "Distribute the negative",
    prompt: (
      <>
        If {eq("5 − 2(x − 4) = 3x − 7")}, what is the value of {eq("x")}?
      </>
    ),
    choices: [
      {
        letter: "A",
        label: <Frac n="4" d="5" />,
        value: 0.8,
        trap: {
          id: "negative-distribution",
          headline: "You distributed −2 to the x but not to the −4.",
          work: [
            { math: "5 − 2x − 8 = 3x − 7", slip: true, note: "−2 · (−4) is +8, not −8" },
            { math: "−3 − 2x = 3x − 7" },
            { math: "4 = 5x → x = 4/5" },
          ],
          fix: <>−2 · (−4) = +8, so the left side is {eq("13 − 2x")}.</>,
        },
      },
      { letter: "B", label: "4", value: 4, correct: true },
      {
        letter: "C",
        label: "20",
        value: 20,
        trap: {
          id: "sign-flip",
          headline: "You moved −2x to the right side without flipping its sign.",
          work: [
            { math: "13 − 2x = 3x − 7" },
            { math: "13 + 7 = 3x − 2x", slip: true, note: "−2x changed sides but kept its sign" },
            { math: "x = 20" },
          ],
          fix: <>Add 2x to both sides: {eq("13 = 5x − 7")}, so {eq("20 = 5x")}.</>,
        },
      },
      {
        letter: "D",
        label: "There is no solution.",
        value: null,
        trap: {
          id: "multiply-before-subtract",
          headline: "You subtracted 5 − 2 before multiplying.",
          work: [
            { math: "3(x − 4) = 3x − 7", slip: true, note: "5 − 2(…) is not (5 − 2)(…)" },
            { math: "3x − 12 = 3x − 7" },
            { math: "−12 = −7", note: "a false statement, so it looked like no solution" },
          ],
          fix: <>Multiply first: {eq("−2(x − 4) = −2x + 8")}.</>,
        },
      },
    ],
    walkthrough: [
      {
        ask: "What does the −2 multiply?",
        move: "Every term inside: −2 · x = −2x and −2 · (−4) = +8.",
        result: (
          <>
            {eq("5 − 2x + 8 = 3x − 7", true)}
            {eq("13 − 2x = 3x − 7", true)}
          </>
        ),
      },
      {
        ask: "How do we get the x-terms together?",
        move: "Add 2x to both sides, then add 7 to both sides.",
        result: eq("20 = 5x", true),
      },
      {
        ask: "What’s left to undo?",
        move: "Divide by 5, then check by substituting.",
        result: (
          <>
            {eq("x = 4", true)}
            {note("Check: 5 − 2(0) = 5 and 3(4) − 7 = 5 ✓")}
          </>
        ),
      },
    ],
    visual: { kind: "distribution", factor: "−2", terms: ["x", "−4"], products: ["−2x", "+8"] },
  },
  {
    id: "answer-the-question",
    topic: "linear",
    lesson: "Hit the real target",
    prompt: (
      <>
        If {eq("3x + 6 = 21")}, what is the value of {eq("x + 2")}?
      </>
    ),
    choices: [
      {
        letter: "A",
        label: "3",
        value: 3,
        trap: {
          id: "partial-division",
          headline: "You divided the 21 by 3 but not the 6.",
          work: [
            { math: "x + 6 = 7", slip: true, note: "the 6 wasn’t divided by 3" },
            { math: "x = 1" },
            { math: "x + 2 = 3" },
          ],
          fix: <>Divide every term by 3: {eq("x + 2 = 7")}. That’s already the answer!</>,
        },
      },
      {
        letter: "B",
        label: "5",
        value: 5,
        trap: {
          id: "wrong-target",
          headline: "You found x, but the question asks for x + 2.",
          work: [
            { math: "3x = 15" },
            { math: "x = 5" },
            { label: "Answer:", math: "5", slip: true, note: "that’s x, not x + 2" },
          ],
          fix: <>{eq("x = 5")}, so {eq("x + 2 = 7")}.</>,
        },
      },
      { letter: "C", label: "7", value: 7, correct: true },
      {
        letter: "D",
        label: "11",
        value: 11,
        trap: {
          id: "sign-flip",
          headline: "You added 6 to the right side instead of subtracting it.",
          work: [
            { math: "3x = 21 + 6", slip: true, note: "subtract 6 from both sides" },
            { math: "3x = 27 → x = 9" },
            { math: "x + 2 = 11" },
          ],
          fix: <>Subtract 6 from both sides: {eq("3x = 15")}.</>,
        },
      },
    ],
    walkthrough: [
      {
        ask: "What exactly does the question ask for?",
        move: "Circle it: the value of x + 2, not x.",
        result: <>Target: {eq("x + 2")}</>,
      },
      { ask: "How do we undo the + 6?", move: "Subtract 6 from both sides.", result: eq("3x = 15", true) },
      {
        ask: "Finish the job, and hit the target.",
        move: "Divide by 3 to get x = 5. Then add 2.",
        result: eq("x + 2 = 7", true),
      },
    ],
    visual: { kind: "target", chain: ["x + 2", "3x = 15", "x = 5", "x + 2 = 7"] },
  },
  {
    id: "eliminate-carefully",
    topic: "systems",
    lesson: "Subtracting a negative",
    prompt: (
      <>
        Consider the system below.
        <System lines={["2x + 3y = 12", "2x − y = 4"]} />
        If {eq("(x, y)")} is the solution to the system, what is the value of {eq("y")}?
      </>
    ),
    choices: [
      { letter: "A", label: "2", value: 2, correct: true },
      {
        letter: "B",
        label: "3",
        value: 3,
        trap: {
          id: "wrong-target",
          headline: "You found x = 3, but the question asks for y.",
          work: [
            { math: "y = 2x − 4" },
            { math: "2x + 3(2x − 4) = 12 → x = 3" },
            { label: "Answer:", math: "3", slip: true, note: "that’s x, not y" },
          ],
          fix: <>Put x = 3 back in: {eq("2(3) − y = 4")}, so {eq("y = 2")}.</>,
        },
      },
      {
        letter: "C",
        label: "4",
        value: 4,
        trap: {
          id: "subtract-negative",
          headline: "You treated 3y − (−y) as 2y.",
          work: [
            { math: "(2x + 3y) − (2x − y) = 12 − 4" },
            { math: "2y = 8", slip: true, note: "3y − (−y) is 4y, not 2y" },
            { math: "y = 4" },
          ],
          fix: <>{eq("3y − (−y) = 3y + y = 4y")}, so {eq("4y = 8")}.</>,
        },
      },
      {
        letter: "D",
        label: "8",
        value: 8,
        trap: {
          id: "stopped-early",
          headline: "You found 4y = 8 and stopped.",
          work: [
            { math: "(2x + 3y) − (2x − y) = 12 − 4" },
            { math: "4y = 8" },
            { label: "Answer:", math: "8", slip: true, note: "that’s 4y, not y" },
          ],
          fix: <>Divide by 4: {eq("y = 2")}.</>,
        },
      },
    ],
    walkthrough: [
      {
        ask: "Which variable can we knock out in one move?",
        move: "Both equations start with 2x. Subtract the second equation from the first.",
        result: eq("(2x + 3y) − (2x − y) = 12 − 4", true),
      },
      {
        ask: "What is 3y − (−y)?",
        move: "Subtracting a negative means adding: 3y + y = 4y.",
        result: eq("4y = 8", true),
      },
      {
        ask: "Is 4y the answer?",
        move: "Not yet: divide by 4. Check that x = 3, y = 2 works in both equations.",
        result: eq("y = 2", true),
      },
    ],
    visual: {
      kind: "lines",
      x: [-2, 8],
      y: [-4, 6],
      lines: [
        { m: -2 / 3, b: 4, label: "2x + 3y = 12" },
        { m: 2, b: -4, label: "2x − y = 4" },
      ],
      point: [3, 2],
    },
  },
  {
    id: "percent-change",
    topic: "data",
    lesson: "Percent of what?",
    prompt: "The price of a jacket increased from $40 to $50. By what percent did the price increase?",
    choices: [
      {
        letter: "A",
        label: "10%",
        value: 10,
        trap: {
          id: "raw-change",
          headline: "You used the $10 increase as if it were 10%.",
          work: [
            { math: "50 − 40 = 10" },
            { label: "Answer:", math: "10%", slip: true, note: "$10 is dollars, not a percent" },
          ],
          fix: <>Compare the change to the original: {eq("10 ÷ 40 = 0.25 = 25%")}.</>,
        },
      },
      {
        letter: "B",
        label: "20%",
        value: 20,
        trap: {
          id: "wrong-base",
          headline: "You divided by the new price ($50) instead of the original ($40).",
          work: [
            { math: "50 − 40 = 10" },
            { math: "10 ÷ 50 = 0.20 = 20%", slip: true, note: "divide by the original, $40" },
          ],
          fix: <>{eq("10 ÷ 40 = 0.25 = 25%")}.</>,
        },
      },
      { letter: "C", label: "25%", value: 25, correct: true },
      {
        letter: "D",
        label: "125%",
        value: 125,
        trap: {
          id: "ratio-not-change",
          headline: "You found the new price as a percent of the old price, not the increase.",
          work: [
            { math: "50 ÷ 40 = 1.25" },
            { math: "1.25 = 125%", slip: true, note: "that’s new ÷ old" },
          ],
          fix: <>{eq("125% − 100% = 25%")}.</>,
        },
      },
    ],
    walkthrough: [
      { ask: "How much did the price change?", move: "New minus original.", result: eq("50 − 40 = 10", true) },
      {
        ask: "Compared to what?",
        move: "Percent change always compares to the original amount, $40.",
        result: eq("10/40 = 1/4", true),
      },
      {
        ask: "How do we turn 1/4 into a percent?",
        move: "Multiply by 100%.",
        result: eq("1/4 × 100% = 25%", true),
      },
    ],
    visual: {
      kind: "fraction-bar",
      parts: 4,
      partValue: 10,
      prefix: "$",
      highlight: 0,
      extra: 1,
      caption: "The $10 increase is 1 of the original 4 parts: 1/4 = 25%",
    },
  },
  {
    id: "hypotenuse",
    topic: "geometry",
    lesson: "Square, add, root",
    prompt: "A right triangle has legs of length 6 and 8. What is the length of the hypotenuse?",
    choices: [
      {
        letter: "A",
        label: (
          <>
            2<Sqrt>7</Sqrt>
          </>
        ),
        value: Math.sqrt(28),
        trap: {
          id: "wrong-side",
          headline: "You subtracted the squares. That finds a missing leg, not the hypotenuse.",
          work: [
            { math: "8² − 6² = 64 − 36 = 28", slip: true, note: "the hypotenuse adds the squares" },
            { math: "c = √28 = 2√7" },
          ],
          fix: (
            <>
              {eq("c² = 6² + 8²")}. (2√7 ≈ 5.3 is shorter than 8, but the hypotenuse is the longest side.)
            </>
          ),
        },
      },
      { letter: "B", label: "10", value: 10, correct: true },
      {
        letter: "C",
        label: "14",
        value: 14,
        trap: {
          id: "added-legs",
          headline: "You added the legs: 6 + 8. The theorem adds their squares.",
          work: [
            { math: "c = 6 + 8", slip: true, note: "add the squares, not the sides" },
            { math: "c = 14" },
          ],
          fix: <>{eq("6² + 8² = 36 + 64 = 100")}, so {eq("c = 10")}.</>,
        },
      },
      {
        letter: "D",
        label: "100",
        value: 100,
        trap: {
          id: "forgot-root",
          headline: "You found c² = 100 and stopped.",
          work: [
            { math: "c² = 36 + 64" },
            { math: "c² = 100" },
            { label: "Answer:", math: "100", slip: true, note: "that’s c², not c" },
          ],
          fix: <>Take the square root: {eq("c = √100 = 10")}.</>,
        },
      },
    ],
    walkthrough: [
      {
        ask: "Which side is the hypotenuse?",
        move: "The side across from the right angle. It’s always the longest.",
        result: <>Legs 6 and 8, hypotenuse {eq("c")}</>,
      },
      {
        ask: "What does the theorem say?",
        move: "Leg² + leg² = hypotenuse².",
        result: (
          <>
            {eq("6² + 8² = c²", true)}
            {eq("36 + 64 = 100", true)}
          </>
        ),
      },
      { ask: "We have c². How do we get c?", move: "Take the square root.", result: eq("c = √100 = 10", true) },
    ],
    visual: { kind: "right-triangle", a: 6, b: 8 },
  },
];
