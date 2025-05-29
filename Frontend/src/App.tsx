import "./App.css";
import { Routes, Route } from "react-router";
import LoginPage from "./pages/LoginPage"; // Assuming LoginPage.tsx is in src/pages/
import RegistrationPage from "./pages/RegistrationPage"; // Import the new page
import MainPage from "./pages/MainPage";
import EditAssetPage from "./pages/EditAssetPage";
import EditMaintenancePage from "./pages/EditMaintenancePage";
import AssetDetailsPage from "./pages/AssetDetailsPage"; // Import the new page
import AssetListPage from "./pages/AssetListPage";
import CreateAssetPage from "./pages/CreateAssetPage";
import CreateMaintenancePage from "./pages/CreateMaintenancePage";
import MainAppBar from "./components/MainAppBar";

import { UserContext } from "./contexts/UserContext";
import type { UserData, UserContextType } from "./types/types";
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
        <Route path="/registro" element={<RegistrationPage />} />
        <Route path="/" element={<MainPage />} />
        <Route path="/ativos/:ativoId/editar" element={<EditAssetPage />} />
        <Route
          path="/ativos/:ativoId/manutencoes/:manutencaoId/editar"
          element={<EditMaintenancePage />}
        />
        <Route
          path="/ativos/:ativoId/detalhes"
          element={<AssetDetailsPage />}
        />
        <Route path="/ativos" element={<AssetListPage />} />
        <Route path="/ativos/criar" element={<CreateAssetPage />} />
        <Route
          path="/ativos/:ativoId/manutencoes/criar"
          element={<CreateMaintenancePage />}
        />
      </Routes>
    </UserContext.Provider>
  );
}

export default App;
