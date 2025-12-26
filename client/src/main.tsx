import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Simple render without tRPC for static deployment
createRoot(document.getElementById("root")!).render(<App />);
