import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import useRefreshToken from "../hooks/useRefreshToken";
import Layout from "../pages/Layout";
import LoginPage from "../pages/LoginPage";

export default function ProtectedRoutes() {
  const { userToken } = useAuthContext();
  const location = useLocation();
  const refresh = useRefreshToken();

  useEffect(() => {
    try {
      refresh();
      console.log("refreshing at ProtectedRoutes");
    } catch (error) {
      console.log("protected routes refresh error");
    }
  }, []);

  console.log("Protected Routes rerender");
  return !!userToken ? <Layout /> : <LoginPage />;
}
