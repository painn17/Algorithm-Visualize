import { useState } from "react";
import CustomButton from "./components/Button";
import AlgorithmBlock from "./components/AlgorithmBlock";
function App() {
  const [algorithm, setAlgorithm] = useState("quickSort");
  return (
    <>
      <main className="min-h-screen min-w-screen bg-background  mx-auto">
        <header className=" mx-auto flex flex-row justify-around p-2 mb-4 gap-3 bg-header rounded-xl container">
          <CustomButton
            color={`${algorithm === "quickSort" ? "bg-secondary" : "bg-accent"}`}
            textSize="text-lg"
            callback={() => setAlgorithm("quickSort")}
          >
            Quick Sort
          </CustomButton>
          <CustomButton
            color={`${algorithm === "binarySearch" ? "bg-secondary" : "bg-accent"}`}
            textSize="text-lg"
            callback={() => setAlgorithm("binarySearch")}
          >
            Binary Search
          </CustomButton>
          <CustomButton
            color={`${algorithm === "factorialHash" ? "bg-secondary" : "bg-accent"}`}
            textSize="text-lg"
            callback={() => setAlgorithm("factorialHash")}
          >
            Factorial Hash
          </CustomButton>
          <CustomButton
            color={`${algorithm === "bubbleSort" ? "bg-secondary" : "bg-accent"}`}
            textSize="text-lg"
            callback={() => setAlgorithm("bubbleSort")}
          >
            Bubble Sort
          </CustomButton>
        </header>
        <div className="mx-auto">
          <AlgorithmBlock algorithm={algorithm}>{algorithm}</AlgorithmBlock>
        </div>
      </main>
    </>
  );
}

export default App;
