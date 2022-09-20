import { createContext, ReactNode, useContext } from "react";
import useLogin from "../hooks/useLogin";

export const AuthContext = createContext({} as ReturnType<typeof useLogin>);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const { userToken, setUserToken, userInfo, setUserInfo, login, logout, signUp } = useLogin();
  return (
    <AuthContext.Provider
      value={{ userToken, setUserToken, userInfo, setUserInfo, login, logout, signUp }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
