import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initErrorTracking } from "@/lib/error-reporting";

// Initialize global error tracking for production crash reporting
initErrorTracking();

createRoot(document.getElementById("root")!).render(<App />);
