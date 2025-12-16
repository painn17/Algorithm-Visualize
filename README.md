# Algorithm Visualizer

A React-based web application that visualizes common algorithms with step-by-step execution details. This interactive tool helps users understand how different algorithms work by showing their internal state at each step.

## Features

### Supported Algorithms (more will be added)

- **Quick Sort**: Visualizes the divide-and-conquer sorting algorithm with pivot selection
- **Bubble Sort**: Demonstrates the comparison-based sorting with step-by-step swaps
- **Binary Search**: Shows the search process in sorted arrays with left/right pointer movement
- **Factorial Hash**: Illustrates recursive factorial calculation with memoization

### Interactive Controls

- **Dynamic Array Management**: Add numbers manually or generate random arrays
- **Real-time Visualization**: Watch algorithm execution step by step
- **Detailed Step Information**: See algorithm state, depth, and variables at each step
- **Clear Results**: Reset arrays and visualization with one click

## Technology Stack

- **Frontend**: React with Hooks (useState)
- **Styling**: Tailwind CSS
- **Algorithms**: Custom implementations with step tracking

## Installation

1. Clone the repository:

```bash
git clone [<repository-url>](https://github.com/painn17/Algorithm-Visualize)
cd algorithm-visualizer
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

## Usage

1. **Select Algorithm**: Choose from Quick Sort, Bubble Sort, Binary Search, or Factorial Hash using the header buttons

2. **Input Data**:

   - For sorting/searching: Add numbers manually or generate random arrays
   - For binary search: Specify target value
   - For factorial: Enter a single number

3. **Run Algorithm**: Click "Run" to execute and visualize the algorithm

4. **Analyze Steps**:
   - View detailed step information in the visualization panel
   - See algorithm state, variables, and recursion depth
   - Watch the final result display

## UI Components

- **CustomButton**: Reusable button component with color customization
- **AlgorithmBlock**: Main visualization container with algorithm-specific inputs
- **useAlgorithm Hook**: Centralized algorithm management and step tracking

## Responsive Design

- Mobile-friendly interface using Tailwind CSS
- Flexible layout that adapts to different screen sizes
- Scrollable step visualization for large datasets

## State Management

- React hooks for local state management
- Centralized algorithm runner with reset functionality
- Real-time updates for steps and results

Perfect for educational purposes, algorithm analysis, and understanding computational thinking through visualization.
