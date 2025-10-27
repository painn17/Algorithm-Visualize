import { useState } from "react";
import CustomButton from "./Button";
import { useAlgorithm } from "../alg";

function AlgorithmBlock({ children, algorithm }) {
  const [arr, setArr] = useState([]);
  const [input, setInput] = useState(0);
  const [target, setTarget] = useState(0);
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
    <div className="flex flex-col items-center p-6 bg-amber-300 rounded-xl shadow-lg w-full max-w-xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-4">{children}</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="number"
          value={input}
          onChange={(e) => setInput(Number(e.target.value))}
          className="w-32 px-2 py-1 rounded-xl text-center text-gray-700 bg-white border focus:outline-none focus:ring-2"
          placeholder={algorithm === "factorialHash" ? "Enter n" : "Enter number"}
        />

        {algorithm !== "factorialHash" && (
          <CustomButton color="bg-green-400" callback={handleAdd}>
            Add
          </CustomButton>
        )}
        <CustomButton
          callback={() => {
            handleRun();
          }}
          color={"bg-blue-500"}
        >
          Run
        </CustomButton>
      </div>

      {algorithm === "binarySearch" && (
        <div className="flex gap-2 mb-4">
          <input
            type="number"
            value={target}
            onChange={(e) => setTarget(Number(e.target.value))}
            placeholder="Target"
            className="w-32 px-2 py-1 rounded-xl text-center text-gray-700 bg-white border focus:outline-none focus:ring-2"
          />
        </div>
      )}

      {algorithm !== "factorialHash" && (
        <div className="w-full bg-white rounded-xl p-4 mb-4 shadow-inner flex flex-col gap-2">
          <p className="text-lg font-semibold mb-2">Array:</p>
          <div className="flex flex-wrap gap-2">
            {arr.length === 0 ? (
              <div className="text-gray-400">No elements added</div>
            ) : (
              arr.map((num, index) => (
                <span key={index} className="bg-blue-200 px-3 py-1 rounded-full font-medium">
                  {num}
                </span>
              ))
            )}
          </div>
          <CustomButton color="bg-red-400" callback={() => setArr([])}>
            Clear
          </CustomButton>
        </div>
      )}

      <div className="w-full bg-white rounded-xl p-4 mb-4 shadow-inner">
        <p className="text-lg font-semibold mb-2">Algorithm Steps ({algorithm}):</p>
        <div className="flex flex-col gap-2">
          {steps.length === 0 && <span className="text-gray-400">No steps yet</span>}
          {steps.map((step) => (
            <div key={step.stepId} style={{ marginLeft: step.depth * 20 }}>
              <strong>Step {step.stepId}</strong> | {step.algorithm} | depth: {step.depth} <br />
              <pre>{JSON.stringify(step.data, null, 2)}</pre>
            </div>
          ))}
        </div>
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
