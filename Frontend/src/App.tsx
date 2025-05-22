import "./App.css";
import { Routes, Route, Link } from "react-router";
import LoginPage from "./pages/LoginPage"; // Assuming LoginPage.tsx is in src/pages/

function App() {
  return (
    <div>
      {/* You can add a common navigation bar here if needed */}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <div style={{ textAlign: "center", marginTop: "50px" }}>
              <h1>Página Inicial</h1>
              <p>
                Bem-vindo! Navegue para{" "}
                <Link to="/login">a página de login</Link>.
              </p>
            </div>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
