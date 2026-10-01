import type { Trap, TrapId } from "./types";

export const TRAPS: Record<TrapId, Trap> = {
  "negative-distribution": {
    id: "negative-distribution",
    name: "The Negative-Distribution Trap",
    habit: "Draw an arrow from the outside number to every term inside, then multiply each one, signs included.",
  },
  "multiply-before-subtract": {
    id: "multiply-before-subtract",
    name: "The Order-of-Operations Trap",
    habit: "Multiply into the parentheses first and subtract after. Treat 2(x − 4) as one chunk.",
  },
  "sign-flip": {
    id: "sign-flip",
    name: "The Sign-Flip Trap",
    habit: "Don’t “move” terms. Write the same operation on both sides: −6 on the left, −6 on the right.",
  },
  "wrong-target": {
    id: "wrong-target",
    name: "The Wrong-Target Trap",
    habit: "Circle what the question asks for before you start, and check it again before you answer.",
  },
  "partial-division": {
    id: "partial-division",
    name: "The Partial-Division Trap",
    habit: "When you divide, divide every term on both sides.",
  },
  "subtract-negative": {
    id: "subtract-negative",
    name: "The Double-Negative Trap",
    habit: "Rewrite “minus a negative” as “plus” before combining: 3y − (−y) = 3y + y.",
  },
  "stopped-early": {
    id: "stopped-early",
    name: "The Stopped-Early Trap",
    habit: "You’re done only when the variable stands alone: 4y = 8 still needs ÷ 4.",
  },
  "raw-change": {
    id: "raw-change",
    name: "The Dollars-Aren’t-Percents Trap",
    habit: "A percent compares two numbers: change ÷ original × 100.",
  },
  "wrong-base": {
    id: "wrong-base",
    name: "The Wrong-Base Trap",
    habit: "Percent change always divides by the original amount. Say “out of the original.”",
  },
  "ratio-not-change": {
    id: "ratio-not-change",
    name: "The Whole-Ratio Trap",
    habit: "New ÷ old gives “percent of.” Subtract 100% to get the percent change.",
  },
  "added-legs": {
    id: "added-legs",
    name: "The Add-the-Sides Trap",
    habit: "Square first, add second, square-root last: a² + b² = c².",
  },
  "forgot-root": {
    id: "forgot-root",
    name: "The Forgotten-Square-Root Trap",
    habit: "After adding the squares, ask: “Did I find c, or c²?”",
  },
  "wrong-side": {
    id: "wrong-side",
    name: "The Wrong-Side Trap",
    habit: "The hypotenuse is the longest side, so its square is the sum of the other two.",
  },
};
