import { MODULE_MINUTES, MODULE_SIZE } from "@/content/exam/types";
import { routeModule2 } from "@/lib/exam/routing";
import { scaleScore } from "@/lib/exam/scoring";
import type { ExamAction, ExamState } from "./types";

export function initialExamState(): ExamState {
  const now = Date.now();
  return {
    phase: "module1",
    cursor: 0,
    startedAt: now,
    deadline: now + MODULE_MINUTES * 60_000,
    module1Responses: {},
    module1Flags: [],
    module1Result: null,
    module2Branch: null,
    module2Responses: {},
    module2Flags: [],
    result: null,
  };
}

const inRange = (i: number) => Number.isInteger(i) && i >= 0 && i < MODULE_SIZE;

function assertNever(action: never): never {
  throw new Error(`Unknown exam action: ${JSON.stringify(action)}`);
}

export function examReducer(exam: ExamState | null, action: ExamAction): ExamState | null {
  switch (action.type) {
    case "exam/start":
      // An attempt already in progress is never silently discarded; only a fresh
      // start (no exam) or starting over from a finished report replaces it.
      return exam !== null && exam.phase !== "report" ? exam : initialExamState();
    case "exam/exit":
      return exam === null ? exam : null;
    case "exam/answerMc": {
      if (!exam || !inRange(action.index)) return exam;
      if (exam.phase === "module1") {
        if (exam.module1Responses[action.index]?.letter === action.letter) return exam;
        return { ...exam, module1Responses: { ...exam.module1Responses, [action.index]: { letter: action.letter } } };
      }
      if (exam.phase === "module2") {
        if (exam.module2Responses[action.index]?.letter === action.letter) return exam;
        return { ...exam, module2Responses: { ...exam.module2Responses, [action.index]: { letter: action.letter } } };
      }
      return exam;
    }
    case "exam/answerSpr": {
      if (!exam || !inRange(action.index)) return exam;
      if (exam.phase === "module1") {
        if (exam.module1Responses[action.index]?.text === action.text) return exam;
        return { ...exam, module1Responses: { ...exam.module1Responses, [action.index]: { text: action.text } } };
      }
      if (exam.phase === "module2") {
        if (exam.module2Responses[action.index]?.text === action.text) return exam;
        return { ...exam, module2Responses: { ...exam.module2Responses, [action.index]: { text: action.text } } };
      }
      return exam;
    }
    case "exam/clearAnswer": {
      if (!exam || !inRange(action.index)) return exam;
      if (exam.phase === "module1" && action.index in exam.module1Responses) {
        const next = { ...exam.module1Responses };
        delete next[action.index];
        return { ...exam, module1Responses: next };
      }
      if (exam.phase === "module2" && action.index in exam.module2Responses) {
        const next = { ...exam.module2Responses };
        delete next[action.index];
        return { ...exam, module2Responses: next };
      }
      return exam;
    }
    case "exam/toggleFlag": {
      if (!exam || !inRange(action.index)) return exam;
      if (exam.phase === "module1") {
        const has = exam.module1Flags.includes(action.index);
        return {
          ...exam,
          module1Flags: has ? exam.module1Flags.filter((i) => i !== action.index) : [...exam.module1Flags, action.index],
        };
      }
      if (exam.phase === "module2") {
        const has = exam.module2Flags.includes(action.index);
        return {
          ...exam,
          module2Flags: has ? exam.module2Flags.filter((i) => i !== action.index) : [...exam.module2Flags, action.index],
        };
      }
      return exam;
    }
    case "exam/goTo": {
      if (!exam || !inRange(action.index)) return exam;
      if (exam.phase !== "module1" && exam.phase !== "module2") return exam;
      return exam.cursor === action.index ? exam : { ...exam, cursor: action.index };
    }
    case "exam/submitModule1": {
      if (!exam || exam.phase !== "module1") return exam;
      const branch = routeModule2(action.correct, MODULE_SIZE);
      return {
        ...exam,
        phase: "between",
        module1Result: { correct: action.correct, total: MODULE_SIZE },
        module2Branch: branch,
        deadline: null,
      };
    }
    case "exam/startModule2": {
      if (!exam || exam.phase !== "between" || !exam.module2Branch) return exam;
      return { ...exam, phase: "module2", cursor: 0, deadline: Date.now() + MODULE_MINUTES * 60_000 };
    }
    case "exam/submitModule2": {
      if (!exam || exam.phase !== "module2" || !exam.module2Branch || !exam.module1Result) return exam;
      const rawCorrect = exam.module1Result.correct + action.correct;
      const rawTotal = MODULE_SIZE * 2;
      const scaledScore = scaleScore(rawCorrect, rawTotal, exam.module2Branch);
      return {
        ...exam,
        phase: "report",
        deadline: null,
        result: { rawCorrect, rawTotal, scaledScore, module2Branch: exam.module2Branch, byDomain: action.byDomain },
      };
    }
    default:
      return assertNever(action);
  }
}
