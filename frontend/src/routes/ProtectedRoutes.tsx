import { useContext } from "react";
import { AuthState } from "../contexts/AuthContext";
import Layout from "../pages/Layout";
import LoginPage from "../pages/LoginPage";

export default function ProtectedRoutes() {
  const { userTokenState } = useContext(AuthState);
  return userTokenState ? <Layout /> : <LoginPage />;
}
