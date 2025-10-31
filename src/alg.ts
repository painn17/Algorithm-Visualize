import { useState } from "react";
import type { AlgorithmStep, StepEffect } from "./types/types";

export function useAlgorithm() {
  type AlgorithmStepWithParent = AlgorithmStep & { parentStepId: number | null };
  const [steps, setSteps] = useState<AlgorithmStepWithParent[]>([]);
  const [result, setResult] = useState<null | number | number[]>(null);
  const [factorialMemo, setFactorialMemo] = useState<Record<number, number>>({});
  let stepCounter = 0;

  const reset = (): void => {
    setSteps([]);
    setResult(null);
    stepCounter = 0;
  };

  const addStep = (step: Omit<AlgorithmStepWithParent, "stepId">): number => {
    const id = stepCounter++;
    setSteps((prev) => [...prev, { stepId: id, ...step }]);
    return id;
  };

  const algorithms = {
    quickSort: (
      arr: number[],
      depth = 0,
      path: number[] = [],
      parentStepId: number | null = null
    ): number[] => {
      if (arr.length <= 1) return arr;
      const pivotIndex = Math.floor(arr.length / 2);
      const pivot = arr[pivotIndex];
      const leftIndexes = arr.map((x, i) => (x < pivot ? i : -1)).filter((i) => i !== -1);
      const rightIndexes = arr.map((x, i) => (x > pivot ? i : -1)).filter((i) => i !== -1);
      const effects: StepEffect[] = [
        { type: "highlight", indices: [pivotIndex], label: "pivot" },
        { type: "partition", indices: leftIndexes, label: "partition" },
        { type: "partition", indices: rightIndexes, label: "partition" },
      ];
      const currentStepId = addStep({
        algorithm: "quickSort",
        depth,
        data: { array: arr.slice() },
        effects,
        path: path.slice(),
        parentStepId,
      });
      const leftArr = arr.filter((x) => x < pivot);
      const equalArr = arr.filter((x) => x === pivot);
      const rightArr = arr.filter((x) => x > pivot);
      return [
        ...algorithms.quickSort(leftArr, depth + 1, [...path, 0], currentStepId),
        ...equalArr,
        ...algorithms.quickSort(rightArr, depth + 1, [...path, 1], currentStepId),
      ];
    },
    bubbleSort: (arr: number[]): number[] => {
      const array = [...arr];
      let lastStepId: number | null = null;
      for (let i = 0; i < array.length - 1; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
          const effects: StepEffect[] = [{ type: "compare", indices: [j, j + 1] }];
          if (array[j] > array[j + 1]) [array[j], array[j + 1]] = [array[j + 1], array[j]];
          // Каждый следующий шаг — потомок предыдущего
          lastStepId = addStep({
            algorithm: "bubbleSort",
            depth: 0,
            data: { array: [...array] },
            effects,
            parentStepId: lastStepId,
            path: [],
          });
        }
      }
      return array;
    },
    binarySearch: (
      arr: number[],
      target: number,
      depth = 0,
      path: number[] = [],
      parentStepId: number | null = null
    ): number => {
      let left = 0;
      let right = arr.length - 1;
      const sorted = [...arr].sort((a, b) => a - b);
      let lastStepId: number | null = parentStepId;
      while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const effects: StepEffect[] = [
          { type: "highlight", indices: [mid], label: "mid" },
          { type: "highlight", indices: [left], label: "left", color: "bg-sky-300" },
          { type: "highlight", indices: [right], label: "right", color: "bg-emerald-300" },
        ];
        lastStepId = addStep({
          algorithm: "binarySearch",
          depth,
          data: { array: sorted.slice(left, right + 1), target },
          effects,
          path: path.slice(),
          parentStepId: lastStepId,
        });
        if (sorted[mid] === target) return arr.indexOf(sorted[mid]);
        if (sorted[mid] < target) left = mid + 1;
        else right = mid - 1;
      }
      return -1;
    },
    factorialHash: (
      n: number,
      memo: Record<number, number>,
      depth = 0,
      parentStepId: number | null = null
    ): number => {
      if (n <= 1) {
        const value = 1;
        const currentId = addStep({
          algorithm: "factorialHash",
          depth,
          data: { array: [n], n, value, memo: { ...memo } },
          effects: [{ type: "mark", indices: [0], label: "base", color: "bg-slate-300" }],
          parentStepId,
          path: [],
        });
        return value;
      }
      if (memo[n] !== undefined) {
        const value = memo[n];
        addStep({
          algorithm: "factorialHash",
          depth,
          data: { array: [n], n, value, memo: { ...memo }, usedMemo: true },
          effects: [{ type: "mark", indices: [0], label: "from memo", color: "bg-teal-400" }],
          parentStepId,
          path: [],
        });
        return value;
      }
      const childValue = algorithms.factorialHash(n - 1, memo, depth + 1, parentStepId);
      const value = n * childValue;
      memo[n] = value;
      addStep({
        algorithm: "factorialHash",
        depth,
        data: { array: [n], n, value, memo: { ...memo }, usedMemo: false },
        effects: [{ type: "mark", indices: [0], label: "computed", color: "bg-amber-300" }],
        parentStepId,
        path: [],
      });
      return value;
    },
  };

  type AlgorithmName = keyof typeof algorithms;

  const run = (algorithm: AlgorithmName, input: any): number | number[] | null => {
    reset();
    if (!algorithms[algorithm]) throw new Error(`Algorithm "${algorithm}" not found`);
    let res;
    switch (algorithm) {
      case "binarySearch":
        res = algorithms[algorithm](input.arr, input.target);
        break;
      case "quickSort":
      case "bubbleSort":
        res = algorithms[algorithm](input);
        break;
      case "factorialHash": {
        const workingMemo = { ...factorialMemo };
        res = algorithms[algorithm](input, workingMemo, 0, null);
        setFactorialMemo(workingMemo);
        break;
      }
      default:
        throw new Error("Unknown algorithm");
    }
    setResult(res);
    return res;
  };

  return { steps, result, run, reset };
}
