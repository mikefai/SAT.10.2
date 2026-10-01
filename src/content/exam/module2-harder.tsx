import { eq, Frac } from "@/components/math/MathText";
import type { ExamQuestion } from "./types";

// Module 2, harder branch: routed here from a Module 1 score at or above the
// threshold. Skews medium/hard and is the only branch that can reach the full
// 800 ceiling, matching the real Digital SAT's higher-ceiling second module.
export const EXAM_MODULE_2_HARDER: ExamQuestion[] = [
  // --- Algebra (7) ---
  {
    id: "m2h-alg-1",
    domain: "algebra",
    difficulty: "medium",
    type: "spr",
    prompt: <>If {eq("(2/3)x − 4 = 6")}, what is the value of {eq("x")}?</>,
    correctValue: 15,
    explanation: <>Add 4: {eq("(2/3)x = 10")}. Multiply by {eq("3/2")}: {eq("x = 15")}.</>,
  },
  {
    id: "m2h-alg-2",
    domain: "algebra",
    difficulty: "hard",
    type: "spr",
    prompt: <>What is the least integer value of {eq("x")} that satisfies {eq("3(2x − 1) ≥ 4x + 9")}?</>,
    correctValue: 6,
    explanation: (
      <>
        Distribute: {eq("6x − 3 ≥ 4x + 9")}. Subtract {eq("4x")} and add 3: {eq("2x ≥ 12")}, so {eq("x ≥ 6")}. The least
        integer satisfying this is 6.
      </>
    ),
  },
  {
    id: "m2h-alg-3",
    domain: "algebra",
    difficulty: "hard",
    type: "spr",
    prompt: (
      <>
        In the system below, what is the value of {eq("xy")}?
        <br />
        {eq("4x + 3y = 25", true)}
        {eq("2x − 3y = −1", true)}
      </>
    ),
    correctValue: 12,
    explanation: (
      <>
        Add the equations: {eq("6x = 24")}, so {eq("x = 4")}. Then {eq("3y = 25 − 16 = 9")}, so {eq("y = 3")}, and{" "}
        {eq("xy = 12")}.
      </>
    ),
  },
  {
    id: "m2h-alg-4",
    domain: "algebra",
    difficulty: "hard",
    type: "mc",
    prompt: (
      <>
        A theater sells adult tickets for $3 and child tickets for $2. One showing sold 31 tickets for a total of $78. If{" "}
        {eq("a")} is the number of adult tickets sold and {eq("c")} is the number of child tickets sold, what is the value
        of {eq("a − c")}?
      </>
    ),
    choices: [
      { letter: "A", label: "−1" },
      { letter: "B", label: "1" },
      { letter: "C", label: "15" },
      { letter: "D", label: "16" },
    ],
    correctLetter: "B",
    explanation: (
      <>
        {eq("a + c = 31")} and {eq("3a + 2c = 78")}. Substituting {eq("a = 31 − c")}: {eq("3(31 − c) + 2c = 78")}, so{" "}
        {eq("93 − c = 78")}, giving {eq("c = 15")} and {eq("a = 16")}. Then {eq("a − c = 1")}.
      </>
    ),
  },
  {
    id: "m2h-alg-5",
    domain: "algebra",
    difficulty: "hard",
    type: "spr",
    prompt: (
      <>
        A water tank starts with 5 gallons and drains at a constant rate of 0.5 gallons per minute, modeled by{" "}
        {eq("V(t) = 5 − 0.5t")}. At what value of {eq("t")}, in minutes, is the tank empty?
      </>
    ),
    correctValue: 10,
    explanation: <>Set {eq("V(t) = 0")}: {eq("5 − 0.5t = 0")}, so {eq("t = 10")}.</>,
  },
  {
    id: "m2h-alg-6",
    domain: "algebra",
    difficulty: "hard",
    type: "spr",
    prompt: <>What is the sum of the solutions to {eq("|2x − 5| = 9")}?</>,
    correctValue: 5,
    explanation: (
      <>
        Either {eq("2x − 5 = 9")}, giving {eq("x = 7")}, or {eq("2x − 5 = −9")}, giving {eq("x = −2")}. These sum to 5.
      </>
    ),
  },
  {
    id: "m2h-alg-7",
    domain: "algebra",
    difficulty: "hard",
    type: "spr",
    prompt: (
      <>
        For what positive value of {eq("k")} does the system below have infinitely many solutions?
        <br />
        {eq("3x + ky = 6", true)}
        {eq("6x + 4y = 12", true)}
      </>
    ),
    correctValue: 2,
    explanation: (
      <>
        The second equation is the first scaled by a constant: {eq("6/3 = 2")} and {eq("12/6 = 2")}, so {eq("k")} must also
        scale by 2: {eq("4/k = 2")}, giving {eq("k = 2")}.
      </>
    ),
  },

  // --- Advanced Math (7) ---
  {
    id: "m2h-am-1",
    domain: "advanced-math",
    difficulty: "medium",
    type: "spr",
    prompt: <>What is the positive solution to {eq("x² + 4x − 21 = 0")}?</>,
    correctValue: 3,
    explanation: <>Factor: {eq("(x + 7)(x − 3) = 0")}, so {eq("x = −7")} or {eq("x = 3")}. The positive solution is 3.</>,
  },
  {
    id: "m2h-am-2",
    domain: "advanced-math",
    difficulty: "hard",
    type: "spr",
    prompt: <>What is the {eq("x")}-coordinate of the vertex of {eq("y = x² − 6x + 5")}?</>,
    correctValue: 3,
    explanation: <>{eq("x = −b/2a = 6/2 = 3")}.</>,
  },
  {
    id: "m2h-am-3",
    domain: "advanced-math",
    difficulty: "hard",
    type: "spr",
    prompt: <>For what positive value of {eq("k")} does {eq("x² + kx + 9 = 0")} have exactly one real solution?</>,
    correctValue: 6,
    explanation: (
      <>
        Exactly one real solution means the discriminant is 0: {eq("k² − 4(1)(9) = 0")}, so {eq("k² = 36")} and{" "}
        {eq("k = 6")} (taking the positive value).
      </>
    ),
  },
  {
    id: "m2h-am-4",
    domain: "advanced-math",
    difficulty: "hard",
    type: "spr",
    prompt: (
      <>
        A sample of a substance decays according to {eq("A(t) = 800(0.5)^(t/3)")}, where {eq("t")} is measured in days.
        What is {eq("A(t)")} when {eq("t = 9")}?
      </>
    ),
    correctValue: 100,
    explanation: <>{eq("A(9) = 800(0.5)³ = 800(1/8) = 100")}.</>,
  },
  {
    id: "m2h-am-5",
    domain: "advanced-math",
    difficulty: "medium",
    type: "spr",
    prompt: <>If {eq("f(x) = x + 3")} and {eq("g(x) = x²")}, what is the value of {eq("g(f(2))")}?</>,
    correctValue: 25,
    explanation: <>{eq("f(2) = 5")}, so {eq("g(f(2)) = g(5) = 25")}.</>,
  },
  {
    id: "m2h-am-6",
    domain: "advanced-math",
    difficulty: "hard",
    type: "spr",
    prompt: <>What is the solution to {eq("(x + 2) / (x − 1) = 3")}?</>,
    correctValue: 2.5,
    explanation: <>Multiply both sides by {eq("(x − 1)")}: {eq("x + 2 = 3x − 3")}, so {eq("5 = 2x")}, giving {eq("x = 2.5")}.</>,
  },
  {
    id: "m2h-am-7",
    domain: "advanced-math",
    difficulty: "hard",
    type: "spr",
    prompt: (
      <>
        A company’s daily profit, in hundreds of dollars, from selling {eq("x")} hundred units is modeled by{" "}
        {eq("P(x) = −2x² + 40x − 150")}. What is the maximum daily profit, in hundreds of dollars?
      </>
    ),
    correctValue: 50,
    explanation: (
      <>
        The maximum occurs at {eq("x = −b/2a = 40/4 = 10")}. Then {eq("P(10) = −200 + 400 − 150 = 50")}.
      </>
    ),
  },

  // --- Problem-Solving & Data Analysis (4) ---
  {
    id: "m2h-da-1",
    domain: "data-analysis",
    difficulty: "hard",
    type: "spr",
    prompt: <>Class A has 20 students with a mean score of 80. Class B has 30 students with a mean score of 90. What is the combined mean score of all 50 students?</>,
    correctValue: 86,
    explanation: <>{eq("(20 × 80 + 30 × 90) / 50 = (1600 + 2700) / 50 = 4300/50 = 86")}.</>,
  },
  {
    id: "m2h-da-2",
    domain: "data-analysis",
    difficulty: "hard",
    type: "spr",
    prompt: <>A price is increased by 20% and then the new price is decreased by 10%. What is the overall percent change from the original price?</>,
    correctValue: 8,
    explanation: <>{eq("1.20 × 0.90 = 1.08")}, an overall increase of 8%.</>,
  },
  {
    id: "m2h-da-3",
    domain: "data-analysis",
    difficulty: "hard",
    type: "spr",
    prompt: (
      <>
        A bag contains 4 red and 6 blue marbles. Two marbles are drawn at random, one after the other, without replacement.
        What is the probability that both marbles are red?
      </>
    ),
    correctValue: 2 / 15,
    explanation: (
      <>
        {eq("P(first red) = 4/10")}. Given the first is red, {eq("P(second red) = 3/9")}. {eq("(4/10)(3/9) = 12/90 = 2/15")}.
      </>
    ),
  },
  {
    id: "m2h-da-4",
    domain: "data-analysis",
    difficulty: "medium",
    type: "mc",
    prompt: <>A scatterplot shows that as {eq("x")} increases, {eq("y")} tends to increase as well, with points clustered closely around a line sloping upward. Which best describes the correlation?</>,
    choices: [
      { letter: "A", label: "Strong positive correlation" },
      { letter: "B", label: "Strong negative correlation" },
      { letter: "C", label: "No correlation" },
      { letter: "D", label: "Weak negative correlation" },
    ],
    correctLetter: "A",
    explanation: "Both variables increase together, and the points cluster tightly around an upward-sloping line — a strong positive correlation.",
  },

  // --- Geometry & Trigonometry (4) ---
  {
    id: "m2h-geo-1",
    domain: "geometry-trig",
    difficulty: "hard",
    type: "spr",
    prompt: <>Two triangles are similar, with a side ratio of 2 : 5. The area of the smaller triangle is 8. What is the area of the larger triangle?</>,
    correctValue: 50,
    explanation: <>Areas scale by the square of the side ratio: {eq("8 × (5/2)² = 8 × 25/4 = 50")}.</>,
  },
  {
    id: "m2h-geo-2",
    domain: "geometry-trig",
    difficulty: "medium",
    type: "mc",
    prompt: <>A circle has radius 6. What is the area of a sector with a central angle of 60°?</>,
    choices: [
      { letter: "A", label: eq("π") },
      { letter: "B", label: eq("6π") },
      { letter: "C", label: eq("12π") },
      { letter: "D", label: eq("36π") },
    ],
    correctLetter: "B",
    explanation: <>{eq("(60/360) × π × 6² = (1/6) × 36π = 6π")}.</>,
  },
  {
    id: "m2h-geo-3",
    domain: "geometry-trig",
    difficulty: "medium",
    type: "mc",
    prompt: <>A cylinder has radius 3 and height 10. What is its volume?</>,
    choices: [
      { letter: "A", label: eq("30π") },
      { letter: "B", label: eq("60π") },
      { letter: "C", label: eq("90π") },
      { letter: "D", label: eq("100π") },
    ],
    correctLetter: "C",
    explanation: <>{eq("Volume = πr²h = π(9)(10) = 90π")}.</>,
  },
  {
    id: "m2h-geo-4",
    domain: "geometry-trig",
    difficulty: "hard",
    type: "spr",
    prompt: (
      <>
        A right triangle has legs of length 5 and 12, and a hypotenuse of length 13. What is the cosine of the angle
        opposite the leg of length 5?
      </>
    ),
    correctValue: 12 / 13,
    explanation: (
      <>
        The side adjacent to that angle is the leg of length 12: <Frac n="12" d="13" /> {eq("= cos(θ)")}.
      </>
    ),
  },
];
