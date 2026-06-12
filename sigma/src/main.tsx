import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { LoginScreen } from "./components/LoginScreen";
import { DemoBackPill } from "./components/DemoBackPill";
import { installMockBackend } from "./lib/mockBackend";
import "./styles.css";

// Demo estático: sem backend. Todas as chamadas de API são mockadas.
installMockBackend();

const AUTH_KEY = "sigma-demo-auth";

function Root() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem(AUTH_KEY) === "1",
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

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename="/sigma">
      <Root />
    </BrowserRouter>
  </React.StrictMode>,
);
