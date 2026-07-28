import { BrowserRouter } from "react-router";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import { AppRoutes } from "./Routes";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
