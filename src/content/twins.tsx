import { eq, Expr, Frac, System, V } from "@/components/math/MathText";
import type { TwinSet } from "./types";

export const TWIN_SETS: TwinSet[] = [
  {
    id: "both-sides",
    topic: "linear",
    title: "Variables on both sides",
    pattern: ["Gather", "Isolate", "Divide"],
    sample: {
      prompt: <>Solve {eq("4x − 7 = 2x + 9")}.</>,
      steps: [
        {
          ask: "Where should the x-terms live?",
          move: "Gather them on one side: subtract 2x from both sides.",
          result: eq("2x − 7 = 9", true),
        },
        { ask: "What’s stuck to the x-term?", move: "Isolate it: add 7 to both sides.", result: eq("2x = 16", true) },
        { ask: "How do we get x alone?", move: "Divide both sides by 2.", result: eq("x = 8", true) },
      ],
      answer: eq("x = 8"),
      visual: {
        kind: "balance",
        states: [
          { left: "4x − 7", right: "2x + 9" },
          { left: "2x − 7", right: "9", op: "−2x" },
          { left: "2x", right: "16", op: "+7" },
          { left: "x", right: "8", op: "÷2" },
        ],
      },
    },
    twin: {
      prompt: <>Solve {eq("5x − 4 = 2x + 11")}.</>,
      steps: [
        {
          ask: "Gather: subtract 2x from both sides.",
          context: eq("5x − 4 = 2x + 11"),
          line: (blank) => (
            <Expr>
              {blank}
              <V>x</V> − 4 = 11
            </Expr>
          ),
          answer: 3,
          options: [{ value: -3 }, { value: 3 }, { value: 7 }],
          mistakes: [
            { value: 7, why: "You added 2x instead of subtracting it: 5x − 2x = 3x." },
            { value: -3, why: "Subtract 2x from 5x, not the other way: 5x − 2x = 3x." },
          ],
          nudge: "How many x’s are left when you take 2x away from 5x?",
        },
        {
          ask: "Isolate: add 4 to both sides.",
          context: eq("3x − 4 = 11"),
          line: (blank) => (
            <Expr>
              3<V>x</V> = {blank}
            </Expr>
          ),
          answer: 15,
          options: [{ value: 7 }, { value: 11 }, { value: 15 }],
          mistakes: [
            { value: 7, why: "You subtracted 4. To undo − 4, add 4: 11 + 4." },
            { value: 11, why: "Do it to both sides: the right side becomes 11 + 4." },
          ],
          nudge: "Undo the − 4 by adding 4 to both sides.",
        },
        {
          ask: "Divide: get x alone.",
          context: eq("3x = 15"),
          line: (blank) => (
            <Expr>
              <V>x</V> = {blank}
            </Expr>
          ),
          answer: 5,
          options: [{ value: 5 }, { value: 12 }, { value: 45 }],
          mistakes: [
            { value: 12, why: "3x means 3 times x, so divide: 15 ÷ 3." },
            { value: 45, why: "You multiplied. Undo multiplication with division: 15 ÷ 3." },
          ],
          nudge: "What number times 3 makes 15?",
        },
      ],
      check: (
        <>
          {eq("5(5) − 4 = 21")} and {eq("2(5) + 11 = 21")} ✓
        </>
      ),
      visual: {
        kind: "balance",
        states: [
          { left: "5x − 4", right: "2x + 11" },
          { left: "3x − 4", right: "11", op: "−2x" },
          { left: "3x", right: "15", op: "+4" },
          { left: "x", right: "5", op: "÷3" },
        ],
      },
    },
  },
  {
    id: "substitution",
    topic: "systems",
    title: "Substitution",
    pattern: ["Swap in", "Solve", "Back-substitute"],
    sample: {
      prompt: (
        <>
          Consider the system below.
          <System lines={["y = 2x + 1", "3x + y = 16"]} />
          What is the solution {eq("(x, y)")}?
        </>
      ),
      steps: [
        {
          ask: "One equation already says what y equals. Where can we use that?",
          move: "Swap 2x + 1 in for y in the other equation.",
          result: (
            <>
              {eq("3x + (2x + 1) = 16", true)}
              {eq("5x + 1 = 16", true)}
            </>
          ),
        },
        { ask: "Only x is left. Solve for it.", move: "Subtract 1, then divide by 5.", result: eq("x = 3", true) },
        {
          ask: "We have x. How do we find y?",
          move: "Put x = 3 back into y = 2x + 1.",
          result: (
            <>
              {eq("y = 7", true)}
              so the solution is {eq("(3, 7)")}
            </>
          ),
        },
      ],
      answer: eq("(3, 7)"),
      visual: {
        kind: "lines",
        x: [-2, 8],
        y: [-2, 12],
        lines: [
          { m: 2, b: 1, label: "y = 2x + 1" },
          { m: -3, b: 16, label: "3x + y = 16" },
        ],
        point: [3, 7],
      },
    },
    twin: {
      prompt: (
        <>
          Consider the system below.
          <System lines={["y = x + 4", "2x + y = 19"]} />
          What is the value of {eq("y")}?
        </>
      ),
      steps: [
        {
          ask: "Swap in: replace y with x + 4.",
          context: eq("2x + (x + 4) = 19"),
          line: (blank) => (
            <Expr>
              {blank}
              <V>x</V> + 4 = 19
            </Expr>
          ),
          answer: 3,
          options: [{ value: 1 }, { value: 2 }, { value: 3 }],
          mistakes: [
            { value: 2, why: "y is the whole expression x + 4, not just 4: 2x + x + 4 = 3x + 4." },
            { value: 1, why: "The parentheses don’t mean subtract: 2x + (x + 4) = 3x + 4." },
          ],
          nudge: "Count the x’s: 2x plus one more x.",
        },
        {
          ask: "Solve: get x alone.",
          context: eq("3x + 4 = 19"),
          line: (blank) => (
            <Expr>
              <V>x</V> = {blank}
            </Expr>
          ),
          answer: 5,
          options: [{ value: 5 }, { value: 23 / 3, label: <Frac n="23" d="3" /> }, { value: 15 }],
          mistakes: [
            { value: 15, why: "That’s 3x. Divide by 3 to get x." },
            { value: 23 / 3, why: "You added 4. Undo + 4 by subtracting: 19 − 4 = 15." },
          ],
          nudge: "Subtract 4 from both sides, then divide by 3.",
        },
        {
          ask: "Back-substitute: find y.",
          context: eq("y = x + 4"),
          line: (blank) => (
            <Expr>
              <V>y</V> = {blank}
            </Expr>
          ),
          answer: 9,
          options: [{ value: 1 }, { value: 5 }, { value: 9 }],
          mistakes: [
            { value: 5, why: "That’s x. The question asks for y = x + 4." },
            { value: 1, why: "y = x + 4 means add 4 to x: 5 + 4." },
          ],
          nudge: "Put x = 5 into y = x + 4.",
        },
      ],
      check: <>{eq("2(5) + 9 = 19")} ✓</>,
      visual: {
        kind: "lines",
        x: [-2, 10],
        y: [-2, 14],
        lines: [
          { m: 1, b: 4, label: "y = x + 4" },
          { m: -2, b: 19, label: "2x + y = 19" },
        ],
        point: [5, 9],
      },
    },
  },
  {
    id: "percent-off",
    topic: "data",
    title: "Percent off",
    pattern: ["Fraction", "Part", "Subtract"],
    sample: {
      prompt: "A $60 game is on sale for 25% off. What is the sale price?",
      steps: [
        {
          ask: "What fraction is 25%?",
          move: "25% = 25/100 = 1/4. Split the price into 4 equal parts.",
          result: eq("25% = 1/4", true),
        },
        { ask: "How big is the discount?", move: "One part out of 4: 60 ÷ 4.", result: <Expr block>Discount = $15</Expr> },
        {
          ask: "What do you actually pay?",
          move: "Take the discount away from the original price.",
          result: eq("$60 − $15 = $45", true),
        },
      ],
      answer: <Expr>$45</Expr>,
      visual: {
        kind: "fraction-bar",
        parts: 4,
        partValue: 15,
        prefix: "$",
        highlight: 1,
        caption: "Discount: 1 of 4 parts = $15. You pay the other 3: $45",
      },
    },
    twin: {
      prompt: "An $80 jacket is on sale for 20% off. What is the sale price?",
      steps: [
        {
          ask: "Turn the percent into a fraction.",
          context: eq("20% = 20/100"),
          line: (blank) => (
            <Expr>
              20% = <Frac n="1" d={blank} />
            </Expr>
          ),
          answer: 5,
          options: [{ value: 2 }, { value: 5 }, { value: 20 }],
          mistakes: [
            { value: 2, why: "1/2 is 50%. 20% = 20/100 = 1/5." },
            { value: 20, why: "1/20 would be 5%. 20% = 20/100 = 1/5." },
          ],
          nudge: "Simplify 20/100: divide the top and bottom by 20.",
        },
        {
          ask: "Find the discount: one part.",
          context: <Expr>1/5 of $80</Expr>,
          line: (blank) => <Expr>Discount = ${blank}</Expr>,
          answer: 16,
          options: [{ value: 4 }, { value: 16 }, { value: 20 }],
          mistakes: [
            { value: 4, why: "You divided 80 by 20. Use the fraction: 1/5 of 80 = 80 ÷ 5." },
            { value: 20, why: "That’s 1/4 of 80 (25% off). 20% is 1/5: 80 ÷ 5." },
          ],
          nudge: "Split $80 into 5 equal parts.",
        },
        {
          ask: "Subtract: what do you pay?",
          context: eq("$80 − $16"),
          line: (blank) => <Expr>Sale price = ${blank}</Expr>,
          answer: 64,
          options: [{ value: 16 }, { value: 64 }, { value: 96 }],
          mistakes: [
            { value: 16, why: "That’s the discount. The question asks what you pay: 80 − 16." },
            { value: 96, why: "“Off” means subtract: 80 − 16." },
          ],
          nudge: "Take the discount away from $80.",
        },
      ],
      check: <>$64 is 4 of the 5 parts: 4 × $16 = $64 ✓</>,
      visual: {
        kind: "fraction-bar",
        parts: 5,
        partValue: 16,
        prefix: "$",
        highlight: 1,
        caption: "Discount: 1 of 5 parts = $16. You pay the other 4: $64",
      },
    },
  },
  {
    id: "circle-area",
    topic: "geometry",
    title: "Area from a diameter",
    pattern: ["Halve", "Square", "Times π"],
    sample: {
      prompt: "A circle has a diameter of 10. What is its area?",
      steps: [
        {
          ask: "Area uses the radius. How do we get it from the diameter?",
          move: "The radius is half the diameter.",
          result: eq("r = 10 ÷ 2 = 5", true),
        },
        { ask: "A = πr². What comes next?", move: "Square the radius.", result: eq("r² = 5 × 5 = 25", true) },
        {
          ask: "Finish the formula.",
          move: "Multiply by π.",
          result: (
            <>
              {eq("A = 25π", true)}
              <span className="text-sm text-muted">(≈ 78.5)</span>
            </>
          ),
        },
      ],
      answer: eq("A = 25π"),
      visual: { kind: "circle", diameter: 10 },
    },
    twin: {
      prompt: "A circle has a diameter of 14. What is its area?",
      steps: [
        {
          ask: "Halve: find the radius.",
          context: eq("d = 14"),
          line: (blank) => (
            <Expr>
              <V>r</V> = {blank}
            </Expr>
          ),
          answer: 7,
          options: [{ value: 7 }, { value: 14 }, { value: 28 }],
          mistakes: [
            { value: 14, why: "That’s the diameter. The radius is half: 14 ÷ 2." },
            { value: 28, why: "You doubled it. The radius is half the diameter." },
          ],
          nudge: "The radius runs from the center to the edge: half the diameter.",
        },
        {
          ask: "Square the radius.",
          context: eq("r = 7"),
          line: (blank) => (
            <Expr>
              <V>r</V>² = {blank}
            </Expr>
          ),
          answer: 49,
          options: [{ value: 14 }, { value: 49 }, { value: 196 }],
          mistakes: [
            { value: 14, why: "r² means 7 × 7, not 7 × 2." },
            { value: 196, why: "That’s the diameter squared (14²). Square the radius: 7²." },
          ],
          nudge: "r² = r × r.",
        },
        {
          ask: "Multiply by π.",
          context: eq("A = πr²"),
          line: (blank) => (
            <Expr>
              A = {blank}π
            </Expr>
          ),
          answer: 49,
          options: [{ value: 14 }, { value: 49 }, { value: 196 }],
          mistakes: [
            { value: 14, why: "14π is the circumference (π × diameter). Area uses r²." },
            { value: 196, why: "196π uses the diameter in place of the radius, the classic SAT circle trap." },
          ],
          nudge: "A = π × r², and you just found r².",
        },
      ],
      check: <>{eq("A = 49π ≈ 153.9")}</>,
      visual: { kind: "circle", diameter: 14 },
    },
  },
];
