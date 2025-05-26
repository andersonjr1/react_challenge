import "./App.css";
import { Routes, Route } from "react-router";
import LoginPage from "./pages/LoginPage"; // Assuming LoginPage.tsx is in src/pages/
import RegistrationPage from "./pages/RegistrationPage"; // Import the new page
import MainPage from "./pages/MainPage";
import EditarAtivoPage from "./pages/EditarAtivoPage";
import { UserProvider } from "./contexts/UserContext";

function App() {
  return (
    <UserProvider>
      <div>
        {/* You can add a common navigation bar here if needed */}

        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/ativos/:ativoId/editar" element={<EditarAtivoPage />} />
          {/* <Route
            path="/ativos/:ativoId/manutencoes/:manutencaoId/editar"
            element={<EditarManutencaoPage />}
          />
          <Route
            path="/ativos/:ativoId/historico"
            element={<HistoricoAtivoPage />}
          /> */}
        </Routes>
      </div>
    </UserProvider>
  );
}

export default App;
