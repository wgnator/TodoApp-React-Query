import { createContext, ReactNode, useContext } from "react";
import useLogin from "../hooks/useLogin";

export const AuthContext = createContext({} as ReturnType<typeof useLogin>);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const { userTokenState, userName, login, logout, signUp } = useLogin();
  return (
    <AuthContext.Provider value={{ userTokenState, userName, login, logout, signUp }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
