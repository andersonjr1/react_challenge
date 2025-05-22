import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router"; // Corrected Link import
import InputField from "../components/InputField"; // Adjust path if necessary
import styles from "./LoginPage.module.css"; // Import CSS Module
import { UserContext } from "../contexts/UserContext"; // Import UserContext

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const userCtx = useContext(UserContext);
  const navigate = useNavigate();

  const handleLoginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Falha ao tentar login.");
      }

      // Assuming API returns id, name, email
      userCtx.login({ id: data.id, name: data.name, email: data.email });
      navigate("/dashboard"); // Or any other page after successful login
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocorreu um erro. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h2 className={styles.title}>Login</h2>
      <form onSubmit={handleLoginSubmit} className={styles.loginForm}>
        <InputField
          label="E-mail"
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seuemail@exemplo.com"
          required
          autoComplete="email"
        />
        <InputField
          label="Senha"
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Sua senha"
          required
          autoComplete="current-password"
        />
        {error && <p className={styles.errorMessage}>{error}</p>}
        <button
          type="submit"
          className={styles.loginButton}
          disabled={isLoading}
        >
          {isLoading ? "Entrando..." : "Entrar"}
        </button>
      </form>
      <div className={styles.createAccountLink}>
        <p>
          Não tem uma conta? <Link to="/register">Criar Conta</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
