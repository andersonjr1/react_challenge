import React, { useState } from "react";
import { Link, useNavigate } from "react-router"; // useNavigate for potential redirection
import InputField from "../components/InputField"; // Adjust path if necessary
import styles from "./RegistrationPage.module.css"; // Import CSS Module

const RegistrationPage: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  // const navigate = useNavigate(); // For redirecting after registration

  const handleRegistrationSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    // TODO: Implement actual registration logic here
    console.log("Registration attempt with:", { name, email, password });
    alert(`Tentativa de cadastro com Nome: ${name}, E-mail: ${email}`);
    // Example: navigate('/login'); // Redirect to login after successful registration
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
        <button type="submit" className={styles.registerButton}>
          Cadastrar
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
