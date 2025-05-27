
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Only run this code in the browser, not during SSR
if (typeof document !== 'undefined') {
  const rootElement = document.getElementById("root");
  if (rootElement) {
    createRoot(rootElement).render(<App />);
  }
}

// Export a render function for SSR
export function render() {
  return "";
}
