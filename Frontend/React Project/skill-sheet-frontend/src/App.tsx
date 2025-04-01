import { AuthProvider } from "./context/AuthContext";
import AppRouter from "./routes/router.tsx";

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
