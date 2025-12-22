// WHAT: Import React library (needed for JSX)
// WHY: React provides the core functionality for React components
// HOW: Import statement brings in the React module
import React from "react";

// WHAT: Import ReactDOM for rendering React to browser DOM
// WHY: React (above) handles components; ReactDOM handles actual browser rendering
// HOW: react-dom/client is for React 18+ concurrent features
import ReactDOM from "react-dom/client";

// WHAT: Import our main App component
// WHY: This is the root component that contains our entire application
// HOW: Default import from App.tsx file
import App from "./App";
import './index.css';

// WHAT: Create React root and render the application
// WHY: This is the entry point that mounts React to the HTML page
// HOW: Finds <div id="root"> in index.html and renders React inside it

// STEP 1: Get the root DOM element
// EXPLANATION: document.getElementById("root") finds the HTML element with id="root"
// TYPESCRIPT: 'as HTMLElement' tells TypeScript this is definitely an HTML element
// HTML: In index.html, there's a <div id="root"></div> where React will inject content

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // WHAT: StrictMode is a development helper tool
  // WHY: Helps find potential problems by running extra checks and warnings
  // HOW: Wraps your app and activates additional checks (only in development, not production)
  // FEATURES: Detects unsafe lifecycles, warns about deprecated APIs, detects side effects
  <React.StrictMode>
    {/* WHAT: Render the main App component */}
    {/* WHY: App contains all our UI and functionality */}
    {/* HOW: React transforms this JSX into actual DOM elements */}
    <App />
  </React.StrictMode>
);
