import { createContext } from "react";

type AuthStateType = {
  userTokenState: string | null;
  userName: string | null;
  login: (id: string, pw: string) => void;
  logout: () => void;
  signUp: (id: string, pw: string) => Promise<boolean>;
};
export const AuthState = createContext<AuthStateType>({} as AuthStateType);
