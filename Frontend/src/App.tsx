import "./App.css";
import { Routes, Route } from "react-router";
import LoginPage from "./pages/LoginPage"; // Assuming LoginPage.tsx is in src/pages/
import RegistrationPage from "./pages/RegistrationPage"; // Import the new page
import MainPage from "./pages/MainPage";
import EditarAtivoPage from "./pages/EditarAtivoPage";
import EditarManutencaoPage from "./pages/EditarManutencaoPage";
import HistoricoAtivoPage from "./pages/HistoricoAtivoPage"; // Import the new page
import ListaAtivosPage from "./pages/ListaAtivosPage";

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
          <Route
            path="/ativos/:ativoId/manutencoes/:manutencaoId/editar"
            element={<EditarManutencaoPage />}
          />
          <Route
            path="/ativos/:ativoId/historico"
            element={<HistoricoAtivoPage />}
          />
          <Route path="/ativos" element={<ListaAtivosPage />} />
          <Route path="/ativos/criar" element={<div />} />
          <Route path="/ativos/:ativoId/manutencoes/criar" element={<div />} />
        </Routes>
      </div>
    </UserProvider>
  );
}

export default App;
