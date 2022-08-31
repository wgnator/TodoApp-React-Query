import { createContext } from "react";
import useLogin from "../hooks/useLogin";

export const AuthState = createContext({} as ReturnType<typeof useLogin>);
