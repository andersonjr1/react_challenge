import React, { useState } from "react";
import { Link, useNavigate } from "react-router"; // Corrected import for react-router-dom v6+
import InputField from "../components/InputField"; // Adjust path if necessary
import styles from "./RegistrationPage.module.css"; // Import CSS Module

const RegistrationPage: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleRegistrationSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/register", {
        // Assuming this is your registration endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Falha ao tentar registrar.");
      }

      // On successful registration, you might want to inform the user
      // and redirect them to the login page.
      // alert("Cadastro realizado com sucesso! Faça o login para continuar."); // Optional: alert user
      navigate("/login");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocorreu um erro desconhecido. Tente novamente.");
      }
      console.error("Registration error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.registrationContainer}>
      <h2 className={styles.title}>Criar Conta</h2>
      <form
        onSubmit={handleRegistrationSubmit}
        className={styles.registrationForm}
      >
        <InputField
          label="Nome Completo"
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Seu nome completo"
          required
          autoComplete="name"
        />
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
          placeholder="Crie uma senha forte"
          required
          autoComplete="new-password"
        />
        {error && <p className={styles.errorMessage}>{error}</p>}
        <button
          type="submit"
          className={styles.registerButton}
          disabled={isLoading}
        >
          {isLoading ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>
      <div className={styles.loginLink}>
        <p>
          Já tem uma conta? <Link to="/login">Faça login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegistrationPage;
