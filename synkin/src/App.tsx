import { AppProvider, useApp } from "./state/AppContext";
import { LoginPage } from "./pages/Login";
import { AppShell } from "./components/layout/AppShell";

function Gate() {
  const { isAuthenticated } = useApp();
  if (!isAuthenticated) return <LoginPage />;
  return <AppShell />;
}

export default function App() {
  return (
    <AppProvider>
      <Gate />
    </AppProvider>
  );
}
