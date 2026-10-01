import { eq } from "@/components/math/MathText";
import type { ExamQuestion } from "./types";

// Module 1: a mixed-difficulty diagnostic module, matching the real Digital SAT's
// first Math module. Performance here routes to the easier or harder Module 2.
export const EXAM_MODULE_1: ExamQuestion[] = [
  // --- Algebra (7) ---
  {
    id: "m1-alg-1",
    domain: "algebra",
    difficulty: "easy",
    type: "mc",
    prompt: <>If {eq("3x + 5 = 20")}, what is the value of {eq("x")}?</>,
    choices: [
      { letter: "A", label: "3" },
      { letter: "B", label: "5" },
      { letter: "C", label: "15" },
      { letter: "D", label: "25" },
    ],
    correctLetter: "B",
    explanation: <>Subtract 5 from both sides: {eq("3x = 15")}. Divide by 3: {eq("x = 5")}.</>,
  },
  {
    id: "m1-alg-2",
    domain: "algebra",
    difficulty: "medium",
    type: "mc",
    prompt: <>If {eq("2(x − 3) = x + 4")}, what is the value of {eq("x")}?</>,
    choices: [
      { letter: "A", label: "−2" },
      { letter: "B", label: "2" },
      { letter: "C", label: "10" },
      { letter: "D", label: "14" },
    ],
    correctLetter: "C",
    explanation: <>Distribute: {eq("2x − 6 = x + 4")}. Subtract x and add 6 to both sides: {eq("x = 10")}.</>,
  },
  {
    id: "m1-alg-3",
    domain: "algebra",
    difficulty: "medium",
    type: "spr",
    prompt: <>What is the greatest integer value of {eq("x")} that satisfies {eq("4x − 7 ≤ 13")}?</>,
    correctValue: 5,
    explanation: <>Add 7, then divide by 4: {eq("x ≤ 5")}. The greatest integer satisfying this is 5.</>,
  },
  {
    id: "m1-alg-4",
    domain: "algebra",
    difficulty: "medium",
    type: "mc",
    prompt: (
      <>
        In the system below, what is the value of {eq("x + y")}?
        <br />
        {eq("y = 3x − 1", true)}
        {eq("2x + y = 9", true)}
      </>
    ),
    choices: [
      { letter: "A", label: "2" },
      { letter: "B", label: "5" },
      { letter: "C", label: "7" },
      { letter: "D", label: "9" },
    ],
    correctLetter: "C",
    explanation: (
      <>
        Substitute: {eq("2x + 3x − 1 = 9")}, so {eq("x = 2")} and {eq("y = 5")}. Then {eq("x + y = 7")}.
      </>
    ),
  },
  {
    id: "m1-alg-5",
    domain: "algebra",
    difficulty: "hard",
    type: "spr",
    prompt: (
      <>
        In the system below, what is the value of {eq("xy")}?
        <br />
        {eq("2x + y = 11", true)}
        {eq("x − y = 1", true)}
      </>
    ),
    correctValue: 12,
    explanation: (
      <>
        Add the equations: {eq("3x = 12")}, so {eq("x = 4")} and {eq("y = 3")}. Then {eq("xy = 12")}.
      </>
    ),
  },
  {
    id: "m1-alg-6",
    domain: "algebra",
    difficulty: "medium",
    type: "mc",
    prompt: (
      <>
        A car rental company charges a flat fee of $25 plus $0.20 per mile driven. Which equation gives the total cost {eq("c")},
        in dollars, of driving {eq("m")} miles?
      </>
    ),
    choices: [
      { letter: "A", label: eq("c = 0.20m") },
      { letter: "B", label: eq("c = 25m") },
      { letter: "C", label: eq("c = 25 + 0.20m") },
      { letter: "D", label: eq("c = 0.20 + 25m") },
    ],
    correctLetter: "C",
    explanation: "The flat fee ($25) is added once; the per-mile charge ($0.20) is multiplied by the number of miles.",
  },
  {
    id: "m1-alg-7",
    domain: "algebra",
    difficulty: "medium",
    type: "spr",
    prompt: <>A line passes through the points {eq("(2, 5)")} and {eq("(6, 13)")}. What is the slope of the line?</>,
    correctValue: 2,
    explanation: <>{eq("slope = (13 − 5) / (6 − 2) = 8/4 = 2")}.</>,
  },

  // --- Advanced Math (7) ---
  {
    id: "m1-am-1",
    domain: "advanced-math",
    difficulty: "medium",
    type: "spr",
    prompt: <>What is the greater solution to {eq("x² − 5x + 6 = 0")}?</>,
    correctValue: 3,
    explanation: <>Factor: {eq("(x − 2)(x − 3) = 0")}, so {eq("x = 2")} or {eq("x = 3")}. The greater solution is 3.</>,
  },
  {
    id: "m1-am-2",
    domain: "advanced-math",
    difficulty: "medium",
    type: "mc",
    prompt: (
      <>
        The height of a ball, in feet, {eq("t")} seconds after it is thrown is modeled by {eq("h(t) = −t² + 6t")}. What is the
        maximum height the ball reaches?
      </>
    ),
    choices: [
      { letter: "A", label: "3 feet" },
      { letter: "B", label: "6 feet" },
      { letter: "C", label: "9 feet" },
      { letter: "D", label: "12 feet" },
    ],
    correctLetter: "C",
    explanation: (
      <>
        The vertex occurs at {eq("t = −b/2a = 6/2 = 3")}. Then {eq("h(3) = −9 + 18 = 9")} feet.
      </>
    ),
  },
  {
    id: "m1-am-3",
    domain: "advanced-math",
    difficulty: "medium",
    type: "mc",
    prompt: (
      <>
        A population is modeled by {eq("P(t) = 500(1.04)ᵗ")}, where {eq("t")} is measured in years. What does this model
        indicate about the population?
      </>
    ),
    choices: [
      { letter: "A", label: "It starts at 500 and grows by 4% each year." },
      { letter: "B", label: "It starts at 500 and grows by 40% each year." },
      { letter: "C", label: "It starts at 104 and grows by 500% each year." },
      { letter: "D", label: "It starts at 500 and decreases by 4% each year." },
    ],
    correctLetter: "A",
    explanation: "The base 500 is the starting value; a growth factor of 1.04 means a 4% increase each year.",
  },
  {
    id: "m1-am-4",
    domain: "advanced-math",
    difficulty: "easy",
    type: "mc",
    prompt: <>Which expression is equivalent to {eq("(x^(2/3))³")}, for {eq("x > 0")}?</>,
    choices: [
      { letter: "A", label: eq("x") },
      { letter: "B", label: eq("x²") },
      { letter: "C", label: eq("x³")  },
      { letter: "D", label: eq("x⁶") },
    ],
    correctLetter: "B",
    explanation: <>Multiply exponents: {eq("(2/3) × 3 = 2")}, so the expression simplifies to {eq("x²")}.</>,
  },
  {
    id: "m1-am-5",
    domain: "advanced-math",
    difficulty: "hard",
    type: "spr",
    prompt: <>What is the sum of the solutions to {eq("x² − 2x − 15 = 0")}?</>,
    correctValue: 2,
    explanation: (
      <>
        Factor: {eq("(x − 5)(x + 3) = 0")}, so the solutions are 5 and −3, which sum to 2. (Equivalently, the sum of the
        roots of {eq("ax² + bx + c = 0")} is {eq("−b/a = 2")}.)
      </>
    ),
  },
  {
    id: "m1-am-6",
    domain: "advanced-math",
    difficulty: "medium",
    type: "mc",
    prompt: <>If {eq("f(x) = 2x² − 3")}, what is the value of {eq("f(−2)")}?</>,
    choices: [
      { letter: "A", label: "−11" },
      { letter: "B", label: "−5" },
      { letter: "C", label: "5" },
      { letter: "D", label: "11" },
    ],
    correctLetter: "C",
    explanation: <>{eq("f(−2) = 2(−2)² − 3 = 2(4) − 3 = 5")}.</>,
  },
  {
    id: "m1-am-7",
    domain: "advanced-math",
    difficulty: "hard",
    type: "spr",
    prompt: (
      <>
        What is the sum of the {eq("x")}-coordinates of the points where {eq("y = x²")} and {eq("y = 2x + 3")} intersect?
      </>
    ),
    correctValue: 2,
    explanation: (
      <>
        Set equal: {eq("x² = 2x + 3")}, so {eq("x² − 2x − 3 = 0")}, which factors as {eq("(x − 3)(x + 1) = 0")}. The
        {" "}
        {eq("x")}-coordinates are 3 and −1, which sum to 2.
      </>
    ),
  },

  // --- Problem-Solving & Data Analysis (4) ---
  {
    id: "m1-da-1",
    domain: "data-analysis",
    difficulty: "easy",
    type: "spr",
    prompt: <>The price of a jacket increased from $80 to $92. What was the percent increase?</>,
    correctValue: 15,
    explanation: <>{eq("(92 − 80) / 80 × 100% = 15%")}.</>,
  },
  {
    id: "m1-da-2",
    domain: "data-analysis",
    difficulty: "medium",
    type: "spr",
    prompt: <>A recipe uses 3 cups of flour to make 2 dozen cookies. At this rate, how many cups of flour are needed to make 5 dozen cookies?</>,
    correctValue: 7.5,
    explanation: <>{eq("3 cups / 2 dozen = x / 5 dozen")}, so {eq("x = 3 × 5 / 2 = 7.5")} cups.</>,
  },
  {
    id: "m1-da-3",
    domain: "data-analysis",
    difficulty: "medium",
    type: "mc",
    prompt: <>What is the mean of the data set {eq("{2, 4, 6, 8, 10}")}?</>,
    choices: [
      { letter: "A", label: "5" },
      { letter: "B", label: "6" },
      { letter: "C", label: "7" },
      { letter: "D", label: "8" },
    ],
    correctLetter: "B",
    explanation: <>{eq("(2 + 4 + 6 + 8 + 10) / 5 = 30 / 5 = 6")}.</>,
  },
  {
    id: "m1-da-4",
    domain: "data-analysis",
    difficulty: "medium",
    type: "spr",
    prompt: <>A bag contains 5 red, 3 blue, and 2 green marbles. If one marble is drawn at random, what is the probability that it is blue?</>,
    correctValue: 0.3,
    explanation: <>There are 10 marbles total and 3 are blue, so {eq("P(blue) = 3/10 = 0.3")}.</>,
  },

  // --- Geometry & Trigonometry (4) ---
  {
    id: "m1-geo-1",
    domain: "geometry-trig",
    difficulty: "easy",
    type: "mc",
    prompt: <>A triangle has a base of 10 and a height of 6. What is its area?</>,
    choices: [
      { letter: "A", label: "16" },
      { letter: "B", label: "30" },
      { letter: "C", label: "60" },
      { letter: "D", label: "120" },
    ],
    correctLetter: "B",
    explanation: <>{eq("Area = (1/2)(10)(6) = 30")}.</>,
  },
  {
    id: "m1-geo-2",
    domain: "geometry-trig",
    difficulty: "medium",
    type: "spr",
    prompt: <>A rectangular prism has length 4, width 3, and height 5. What is its volume?</>,
    correctValue: 60,
    explanation: <>{eq("Volume = 4 × 3 × 5 = 60")}.</>,
  },
  {
    id: "m1-geo-3",
    domain: "geometry-trig",
    difficulty: "medium",
    type: "mc",
    prompt: <>A right triangle has legs of length 9 and 12. What is the length of its hypotenuse?</>,
    choices: [
      { letter: "A", label: "15" },
      { letter: "B", label: "21" },
      { letter: "C", label: eq("√153") },
      { letter: "D", label: "144" },
    ],
    correctLetter: "A",
    explanation: <>{eq("9² + 12² = 81 + 144 = 225 = 15²")}, so the hypotenuse is 15.</>,
  },
  {
    id: "m1-geo-4",
    domain: "geometry-trig",
    difficulty: "medium",
    type: "spr",
    prompt: <>In a right triangle, the side opposite an angle has length 6 and the hypotenuse has length 10. What is the sine of that angle?</>,
    correctValue: 0.6,
    explanation: <>{eq("sin(θ) = opposite / hypotenuse = 6/10 = 0.6")}.</>,
  },
];
