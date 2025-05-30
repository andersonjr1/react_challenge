import { createContext } from "react";

import type { UserContextType } from "../types/types";

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
