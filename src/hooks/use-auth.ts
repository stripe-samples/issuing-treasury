import { useContext } from "react";

import { AuthContext } from "../contexts/auth-context";

export const useAuth = () => useContext(AuthContext);
