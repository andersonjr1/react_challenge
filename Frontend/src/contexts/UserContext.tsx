import { createContext } from "react";

import type { UserContextType } from "../types/types";

// Define the shape of the user data

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
