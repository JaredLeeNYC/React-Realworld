import { createContext } from "react";

const AuthContext = createContext({ email: "", password: "", username: "" });

export default AuthContext;
