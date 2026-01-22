import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initPerformanceMonitoring, reportBundleSize } from "./lib/performanceMonitor";

if (import.meta.env.DEV) {
  initPerformanceMonitoring();
  reportBundleSize();
}

createRoot(document.getElementById("root")!).render(<App />);
