import "./App.css";
import { Routes, Route } from "react-router";
import LoginPage from "./pages/LoginPage"; // Assuming LoginPage.tsx is in src/pages/
import RegistrationPage from "./pages/RegistrationPage"; // Import the new page
import MainPage from "./pages/MainPage";
import EditarAtivoPage from "./pages/EditarAtivoPage";
import EditarManutencaoPage from "./pages/EditarManutencaoPage";
import DetalhesAtivoPage from "./pages/DetalhesAtivoPage"; // Import the new page
import ListaAtivosPage from "./pages/ListaAtivosPage";
import CriarAtivoPage from "./pages/CriarAtivoPage";
import CriarManutencaoPage from "./pages/CriarManutencaoPage";
import MainAppBar from "./components/MainAppBar";

import { UserProvider } from "./contexts/UserContext";

function App() {
  return (
    <UserProvider>
      <MainAppBar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/" element={<MainPage />} />
        <Route path="/ativos/:ativoId/editar" element={<EditarAtivoPage />} />
        <Route
          path="/ativos/:ativoId/manutencoes/:manutencaoId/editar"
          element={<EditarManutencaoPage />}
        />
        <Route
          path="/ativos/:ativoId/detalhes"
          element={<DetalhesAtivoPage />}
        />
        <Route path="/ativos" element={<ListaAtivosPage />} />
        <Route path="/ativos/criar" element={<CriarAtivoPage />} />
        <Route
          path="/ativos/:ativoId/manutencoes/criar"
          element={<CriarManutencaoPage />}
        />
      </Routes>
    </UserProvider>
  );
}

export default App;
