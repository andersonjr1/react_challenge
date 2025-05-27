import { createContext } from "react";

// Define the shape of the user data
export interface UserData {
  id: string | null; // Assuming ID can be a string or null when not logged in
  name: string;
  email: string;
}

// Define the shape of the context value
export interface UserContextType extends UserData {
  isLoggedIn: boolean;
  login: (userData: UserData) => void;
  logout: () => void;
}

// 1. Create the Context
// We can provide a default value, which is useful for testing or when a
// component tries to consume the context without a Provider higher up in the tree.
const defaultUserState: UserContextType = {
  id: null,
  name: "",
  email: "",
  isLoggedIn: false,
  login: () => {
    /* default empty function */
  },
  logout: () => {
    /* default empty function */
  },
};

export const UserContext = createContext<UserContextType>(defaultUserState);
