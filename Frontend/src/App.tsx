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

import { UserContext } from "./contexts/UserContext";
import type { UserData, UserContextType } from "./contexts/UserContext";
import { useState, useEffect } from "react";

function App() {
  const [user, setUser] = useState<UserData & { isLoggedIn: boolean }>({
    id: null,
    name: "",
    email: "",
    isLoggedIn: false,
  });

  const login = (userData: UserData) => {
    setUser({ ...userData, isLoggedIn: true });
  };

  const logout = () => {
    setUser({ id: null, name: "", email: "", isLoggedIn: false });
  };

  const fetchUser = async () => {
    const response = await fetch("http://localhost:3000/api/check-auth", {
      credentials: "include",
    });
    if (!response.ok) {
      return;
    }
    const data = await response.json();
    login({ id: data.data.id, name: data.data.name, email: data.data.email });
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ ...user, login, logout } as UserContextType}>
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
    </UserContext.Provider>
  );
}

export default App;
