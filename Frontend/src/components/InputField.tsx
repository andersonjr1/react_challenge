import React from "react";
import styles from "./InputField.module.css"; // We'll create this CSS module next

interface InputFieldProps {
  label: string;
  type: string;
  id: string;
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  id,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  autoComplete,
}) => {
  return (
    <div className={styles.formGroup}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        className={styles.input}
      />
    </div>
  );
};

export default InputField;
