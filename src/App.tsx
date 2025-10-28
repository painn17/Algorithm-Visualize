import { useState } from "react";
import CustomButton from "./components/Button";
import AlgorithmBlock from "./components/AlgorithmBlock";
function App() {
  const [algorithm, setAlgorithm] = useState("quickSort");
  return (
    <>
      <main className="min-h-screen min-w-screen bg-rose-200 container ">
        <header className=" mx-auto flex flex-row justify-around p-2 gap-3">
          <CustomButton callback={() => setAlgorithm("quickSort")}>Quick Sort</CustomButton>
          <CustomButton callback={() => setAlgorithm("binarySearch")}>Binary Search</CustomButton>
          <CustomButton callback={() => setAlgorithm("factorialHash")}>Factorial Hash</CustomButton>
          <CustomButton callback={() => setAlgorithm("bubbleSort")}>Bubble Sort</CustomButton>
        </header>
        <div className="mx-auto">
          <AlgorithmBlock algorithm={algorithm}>{algorithm}</AlgorithmBlock>
        </div>
      </main>
    </>
  );
}

export default App;
