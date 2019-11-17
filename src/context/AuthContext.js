import { createContext } from "react";

const AuthContext = createContext({ email: "", password: "" });

export default AuthContext;
