import { useState } from "react";

export function useAlgorithm() {
  const [steps, setSteps] = useState([]);
  const [result, setResult] = useState(null);

  let stepCounter = 0; // нумерация шагов

  const reset = () => {
    setSteps([]);
    setResult(null);
    stepCounter = 0;
  };

  const addStep = (step) => setSteps((prev) => [...prev, { stepId: stepCounter++, ...step }]);

  const algorithms = {
    quickSort: (arr, depth = 0) => {
      if (arr.length <= 1) return arr;

      const pivot = arr[Math.floor(arr.length / 2)];
      const left = arr.filter((x) => x < pivot);
      const equal = arr.filter((x) => x === pivot);
      const right = arr.filter((x) => x > pivot);

      addStep({
        algorithm: "quickSort",
        depth,
        data: { left, equal, right, pivot },
      });

      return [
        ...algorithms.quickSort(left, depth + 1),
        ...equal,
        ...algorithms.quickSort(right, depth + 1),
      ];
    },

    bubbleSort: (arr) => {
      const array = [...arr];
      for (let i = 0; i < array.length - 1; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
          if (array[j] > array[j + 1]) [array[j], array[j + 1]] = [array[j + 1], array[j]];

          addStep({
            algorithm: "bubbleSort",
            depth: 0,
            data: [...array],
          });
        }
      }
      return array;
    },

    binarySearch: (arr, target, depth = 0) => {
      let left = 0;
      let right = arr.length - 1;
      const sorted = [...arr].sort((a, b) => a - b);

      while (left <= right) {
        const mid = Math.floor((left + right) / 2);

        addStep({
          algorithm: "binarySearch",
          depth,
          data: { left, mid, right, current: sorted[mid], target },
        });

        if (sorted[mid] === target) return arr.indexOf(sorted[mid]);
        if (sorted[mid] < target) left = mid + 1;
        else right = mid - 1;
      }

      return -1;
    },

    factorialHash: (n, memo = {}, depth = 0) => {
      if (n <= 1) return 1;
      if (memo[n]) return memo[n];

      const res = n * algorithms.factorialHash(n - 1, memo, depth + 1);
      memo[n] = res;

      addStep({
        algorithm: "factorialHash",
        depth,
        data: { n, value: res, memo: { ...memo } },
      });

      return res;
    },
  };

  const run = (algorithm, input) => {
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
      case "factorialHash":
        res = algorithms[algorithm](input);
        break;
      default:
        throw new Error("Unknown algorithm");
    }

    setResult(res);
    return res;
  };

  return { steps, result, run, reset };
}
