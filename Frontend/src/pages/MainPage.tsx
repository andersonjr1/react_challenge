import React, { useEffect } from "react";
import AssetMaintenanceDashboard from "../components/AssetMaintenanceDashboard";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router"; // Corrected import and aliased Link
const MainPage: React.FC = () => {
  const userCtx = React.useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userCtx.isLoggedIn) {
      navigate("/login");
    }
  }, [userCtx.isLoggedIn, navigate]);

  return <AssetMaintenanceDashboard />;
};

export default MainPage;
