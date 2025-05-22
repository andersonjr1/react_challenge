import React, { useState } from "react";
import InputField from "../components/InputField"; // Adjust path if necessary
import styles from "./LoginPage.module.css"; // Import CSS Module
import { Link } from "react-router";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLoginSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: Implement actual login logic here
    console.log("Login attempt with:", { email, password });
    alert(`Tentativa de login com E-mail: ${email}`);
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
        <button type="submit" className={styles.loginButton}>
          Entrar
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
