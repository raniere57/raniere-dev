import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import LoginScreen from "./components/LoginScreen";
import DemoBackPill from "./components/DemoBackPill";

const AUTH_KEY = "sentinel-demo-auth";

function Root() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem(AUTH_KEY) === "1"
  );

  function handleAuthenticated() {
    sessionStorage.setItem(AUTH_KEY, "1");
    setIsAuthenticated(true);
  }

  if (!isAuthenticated) {
    return <LoginScreen onAuthenticated={handleAuthenticated} />;
  }

  return (
    <>
      <App />
      <DemoBackPill />
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
