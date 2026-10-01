import { eq } from "@/components/math/MathText";
import type { ExamQuestion } from "./types";

// Module 2, easier branch: routed here from a Module 1 score below the threshold.
// Skews easy/medium, matching the real Digital SAT's lower-ceiling second module.
export const EXAM_MODULE_2_EASIER: ExamQuestion[] = [
  // --- Algebra (7) ---
  {
    id: "m2e-alg-1",
    domain: "algebra",
    difficulty: "easy",
    type: "mc",
    prompt: <>If {eq("5x − 3 = 12")}, what is the value of {eq("x")}?</>,
    choices: [
      { letter: "A", label: "2" },
      { letter: "B", label: "3" },
      { letter: "C", label: "9" },
      { letter: "D", label: "15" },
    ],
    correctLetter: "B",
    explanation: <>Add 3, then divide by 5: {eq("x = 15/5 = 3")}.</>,
  },
  {
    id: "m2e-alg-2",
    domain: "algebra",
    difficulty: "easy",
    type: "spr",
    prompt: <>If {eq("3(x + 2) = 21")}, what is the value of {eq("x")}?</>,
    correctValue: 5,
    explanation: <>Divide by 3: {eq("x + 2 = 7")}, so {eq("x = 5")}.</>,
  },
  {
    id: "m2e-alg-3",
    domain: "algebra",
    difficulty: "easy",
    type: "spr",
    prompt: <>What is the greatest integer value of {eq("x")} that satisfies {eq("2x + 1 < 11")}?</>,
    correctValue: 4,
    explanation: <>{eq("2x < 10")}, so {eq("x < 5")}. The greatest integer less than 5 is 4.</>,
  },
  {
    id: "m2e-alg-4",
    domain: "algebra",
    difficulty: "medium",
    type: "mc",
    prompt: (
      <>
        In the system below, what is the value of {eq("y − x")}?
        <br />
        {eq("y = 2x + 1", true)}
        {eq("x + y = 13", true)}
      </>
    ),
    choices: [
      { letter: "A", label: "1" },
      { letter: "B", label: "4" },
      { letter: "C", label: "5" },
      { letter: "D", label: "9" },
    ],
    correctLetter: "C",
    explanation: (
      <>
        Substitute: {eq("x + 2x + 1 = 13")}, so {eq("x = 4")} and {eq("y = 9")}. Then {eq("y − x = 5")}.
      </>
    ),
  },
  {
    id: "m2e-alg-5",
    domain: "algebra",
    difficulty: "easy",
    type: "spr",
    prompt: (
      <>
        In the system below, what is the value of {eq("x + y")}?
        <br />
        {eq("3x + y = 14", true)}
        {eq("x = 2", true)}
      </>
    ),
    correctValue: 10,
    explanation: <>Substitute {eq("x = 2")}: {eq("6 + y = 14")}, so {eq("y = 8")}. Then {eq("x + y = 10")}.</>,
  },
  {
    id: "m2e-alg-6",
    domain: "algebra",
    difficulty: "easy",
    type: "mc",
    prompt: <>Concert tickets cost $8 each, plus a one-time $3 service fee for the order. What is the total cost of 4 tickets?</>,
    choices: [
      { letter: "A", label: "$32" },
      { letter: "B", label: "$35" },
      { letter: "C", label: "$38" },
      { letter: "D", label: "$44" },
    ],
    correctLetter: "B",
    explanation: <>{eq("8 × 4 + 3 = 32 + 3 = 35")}.</>,
  },
  {
    id: "m2e-alg-7",
    domain: "algebra",
    difficulty: "easy",
    type: "mc",
    prompt: <>A line passes through the points {eq("(0, 2)")} and {eq("(3, 11)")}. What is the slope of the line?</>,
    choices: [
      { letter: "A", label: "2" },
      { letter: "B", label: "3" },
      { letter: "C", label: "9" },
      { letter: "D", label: "11" },
    ],
    correctLetter: "B",
    explanation: <>{eq("slope = (11 − 2) / (3 − 0) = 9/3 = 3")}.</>,
  },

  // --- Advanced Math (7) ---
  {
    id: "m2e-am-1",
    domain: "advanced-math",
    difficulty: "easy",
    type: "spr",
    prompt: <>What is the positive solution to {eq("x² − 9 = 0")}?</>,
    correctValue: 3,
    explanation: <>{eq("x² = 9")}, so {eq("x = 3")} or {eq("x = −3")}. The positive solution is 3.</>,
  },
  {
    id: "m2e-am-2",
    domain: "advanced-math",
    difficulty: "medium",
    type: "mc",
    prompt: <>If {eq("f(x) = (x − 2)² + 1")}, what is the value of {eq("f(4)")}?</>,
    choices: [
      { letter: "A", label: "3" },
      { letter: "B", label: "5" },
      { letter: "C", label: "9" },
      { letter: "D", label: "17" },
    ],
    correctLetter: "B",
    explanation: <>{eq("f(4) = (4 − 2)² + 1 = 4 + 1 = 5")}.</>,
  },
  {
    id: "m2e-am-3",
    domain: "advanced-math",
    difficulty: "easy",
    type: "spr",
    prompt: <>If {eq("2ˣ = 8")}, what is the value of {eq("x")}?</>,
    correctValue: 3,
    explanation: <>{eq("8 = 2³")}, so {eq("x = 3")}.</>,
  },
  {
    id: "m2e-am-4",
    domain: "advanced-math",
    difficulty: "easy",
    type: "mc",
    prompt: <>Which expression is equivalent to {eq("x⁵ / x²")}, for {eq("x ≠ 0")}?</>,
    choices: [
      { letter: "A", label: eq("x²") },
      { letter: "B", label: eq("x³") },
      { letter: "C", label: eq("x⁷") },
      { letter: "D", label: eq("x¹⁰") },
    ],
    correctLetter: "B",
    explanation: <>Subtract exponents: {eq("5 − 2 = 3")}, so the expression simplifies to {eq("x³")}.</>,
  },
  {
    id: "m2e-am-5",
    domain: "advanced-math",
    difficulty: "medium",
    type: "spr",
    prompt: <>What is the product of the solutions to {eq("x² − 7x + 10 = 0")}?</>,
    correctValue: 10,
    explanation: (
      <>
        Factor: {eq("(x − 2)(x − 5) = 0")}, so the solutions are 2 and 5, and their product is 10. (Equivalently, the product
        of the roots of {eq("ax² + bx + c = 0")} is {eq("c/a = 10")}.)
      </>
    ),
  },
  {
    id: "m2e-am-6",
    domain: "advanced-math",
    difficulty: "medium",
    type: "mc",
    prompt: <>If {eq("g(x) = x² + 2x")}, what is the value of {eq("g(3)")}?</>,
    choices: [
      { letter: "A", label: "5" },
      { letter: "B", label: "9" },
      { letter: "C", label: "15" },
      { letter: "D", label: "24" },
    ],
    correctLetter: "C",
    explanation: <>{eq("g(3) = 9 + 6 = 15")}.</>,
  },
  {
    id: "m2e-am-7",
    domain: "advanced-math",
    difficulty: "easy",
    type: "spr",
    prompt: <>A square has an area of 49 square inches. What is the length, in inches, of one side?</>,
    correctValue: 7,
    explanation: <>{eq("x² = 49")}, so {eq("x = 7")}.</>,
  },

  // --- Problem-Solving & Data Analysis (4) ---
  {
    id: "m2e-da-1",
    domain: "data-analysis",
    difficulty: "easy",
    type: "spr",
    prompt: <>What is 20% of 150?</>,
    correctValue: 30,
    explanation: <>{eq("0.20 × 150 = 30")}.</>,
  },
  {
    id: "m2e-da-2",
    domain: "data-analysis",
    difficulty: "easy",
    type: "mc",
    prompt: <>What is the ratio 12 to 18, written in simplest form?</>,
    choices: [
      { letter: "A", label: "1 : 2" },
      { letter: "B", label: "2 : 3" },
      { letter: "C", label: "3 : 4" },
      { letter: "D", label: "4 : 6" },
    ],
    correctLetter: "B",
    explanation: <>Divide both terms by 6: {eq("12/6 : 18/6 = 2 : 3")}.</>,
  },
  {
    id: "m2e-da-3",
    domain: "data-analysis",
    difficulty: "easy",
    type: "mc",
    prompt: <>What is the mean of the data set {eq("{10, 20, 30}")}?</>,
    choices: [
      { letter: "A", label: "15" },
      { letter: "B", label: "20" },
      { letter: "C", label: "25" },
      { letter: "D", label: "30" },
    ],
    correctLetter: "B",
    explanation: <>{eq("(10 + 20 + 30) / 3 = 60/3 = 20")}.</>,
  },
  {
    id: "m2e-da-4",
    domain: "data-analysis",
    difficulty: "easy",
    type: "spr",
    prompt: <>A fair six-sided die is rolled once. What is the probability that the result is an even number?</>,
    correctValue: 0.5,
    explanation: <>3 of the 6 faces (2, 4, 6) are even, so {eq("P(even) = 3/6 = 0.5")}.</>,
  },

  // --- Geometry & Trigonometry (4) ---
  {
    id: "m2e-geo-1",
    domain: "geometry-trig",
    difficulty: "easy",
    type: "mc",
    prompt: <>A rectangle has length 7 and width 4. What is its area?</>,
    choices: [
      { letter: "A", label: "11" },
      { letter: "B", label: "22" },
      { letter: "C", label: "28" },
      { letter: "D", label: "56" },
    ],
    correctLetter: "C",
    explanation: <>{eq("Area = 7 × 4 = 28")}.</>,
  },
  {
    id: "m2e-geo-2",
    domain: "geometry-trig",
    difficulty: "medium",
    type: "mc",
    prompt: <>A circle has a radius of 5. What is its circumference?</>,
    choices: [
      { letter: "A", label: eq("5π") },
      { letter: "B", label: eq("10π") },
      { letter: "C", label: eq("25π") },
      { letter: "D", label: eq("50π") },
    ],
    correctLetter: "B",
    explanation: <>{eq("Circumference = 2πr = 2π(5) = 10π")}.</>,
  },
  {
    id: "m2e-geo-3",
    domain: "geometry-trig",
    difficulty: "easy",
    type: "spr",
    prompt: <>A right triangle has legs of length 3 and 4. What is the length of its hypotenuse?</>,
    correctValue: 5,
    explanation: <>{eq("3² + 4² = 9 + 16 = 25 = 5²")}, so the hypotenuse is 5.</>,
  },
  {
    id: "m2e-geo-4",
    domain: "geometry-trig",
    difficulty: "easy",
    type: "mc",
    prompt: <>Two angles of a triangle measure 50° and 60°. What is the measure of the third angle?</>,
    choices: [
      { letter: "A", label: "60°" },
      { letter: "B", label: "70°" },
      { letter: "C", label: "80°" },
      { letter: "D", label: "110°" },
    ],
    correctLetter: "B",
    explanation: <>The angles of a triangle sum to 180°: {eq("180 − 50 − 60 = 70")}.</>,
  },
];
