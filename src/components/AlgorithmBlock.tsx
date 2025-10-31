import { useState } from "react";
import CustomButton from "./Button";
import { useAlgorithm } from "../alg";
import type { AlgorithmStep } from "../types/types";
import ArrayVisualizer from "./visualizers/ArrayVisualizer";
import StepTree, { buildStepsTree } from "./steps/StepTree";
import StepList from "./steps/StepList";
import Legend from "../components/Legend";
import Input from "./Input";

function AlgorithmBlock({ children, algorithm }: { children: React.ReactNode; algorithm: string }) {
  const [arr, setArr] = useState<number[]>([]);
  const [input, setInput] = useState<number>(0);
  const [target, setTarget] = useState<number>(0);
  const { steps, result, run } = useAlgorithm();

  const handleRun = () => {
    switch (algorithm) {
      case "binarySearch":
        run(algorithm, { arr, target });
        break;
      case "factorialHash":
        run(algorithm, input);
        break;
      default:
        run(algorithm, arr);
        break;
    }
  };

  const handleAdd = () => {
    setArr([...arr, input]);
    setInput(0);
  };

  return (
    <div className="flex flex-col items-center p-6 bg-card rounded-xl shadow-lg w-full max-w-xl mx-auto">
      {/* <h2 className="text-2xl font-bold text-primary mb-4 capitalize">{children}</h2> */}

      <div className="flex gap-2 mb-4">
        <Input
          type="number"
          value={input}
          onChange={(e) => setInput(Number(e.target.value))}
          placeholder={algorithm === "factorialHash" ? "Enter n" : "Enter number"}
        />

        {algorithm !== "factorialHash" && (
          <CustomButton color="bg-accent" callback={handleAdd}>
            Add
          </CustomButton>
        )}
        <CustomButton
          callback={() => {
            handleRun();
          }}
          color={"bg-danger"}
        >
          Run
        </CustomButton>
      </div>

      {algorithm === "binarySearch" && (
        <div className="flex gap-2 mb-4">
          <label className="text-primary text-lg font-bold">Target:</label>
          <Input
            type="number"
            value={target}
            onChange={(e) => setTarget(Number(e.target.value))}
            placeholder="Target"
          />
        </div>
      )}

      {algorithm !== "factorialHash" && (
        <div className="w-full bg-white rounded-xl p-4 mb-4 shadow-inner flex flex-col gap-2">
          <p className="text-lg font-semibold mb-2">Array:</p>
          <div className="flex flex-wrap gap-2">
            {arr.length === 0 ? (
              <div className="text-secondary">No elements added</div>
            ) : (
              arr.map((num, index) => (
                <span key={index} className="bg-blue-200 px-3 py-1 rounded-full font-medium">
                  {num}
                </span>
              ))
            )}
          </div>
          <CustomButton
            callback={() => {
              setArr([]);
              const quantity = Math.random() * 15 + 2;
              for (let i = 0; i < quantity; i++) {
                setArr((prev) => [...prev, Math.floor(Math.random() * 100 - 10)]);
              }
            }}
          >
            Set random array
          </CustomButton>
          <CustomButton color="bg-danger" callback={() => setArr([])}>
            Clear
          </CustomButton>
        </div>
      )}

      <div className="w-full bg-white rounded-xl p-4 mb-4 shadow-inner">
        <p className="text-lg font-semibold mb-2">Algorithm Steps ({algorithm}):</p>
        {algorithm === "quickSort" ? (
          <div className="max-h-[400px] overflow-auto">
            {buildStepsTree(steps as any).map((tree: any) => (
              <StepTree node={tree} key={tree.step.stepId} />
            ))}
          </div>
        ) : (
          <StepList steps={steps as AlgorithmStep[]} algorithm={algorithm} />
        )}
        <Legend steps={steps as AlgorithmStep[]} algorithm={algorithm} />
      </div>
      {result !== null && (
        <div className="w-full bg-white rounded-xl p-4 mb-4 shadow-inner text-center">
          <p className="text-lg font-semibold mb-2">Result:</p>
          <span className="text-green-600 font-medium">
            {Array.isArray(result) ? result.join(", ") : result}
          </span>
        </div>
      )}
    </div>
  );
}

export default AlgorithmBlock;
