import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import useRefreshToken from "../hooks/useRefreshToken";
import Layout from "../pages/Layout";
import LoginPage from "../pages/LoginPage";

export default function ProtectedRoutes() {
  const { userToken } = useAuthContext();
  const refresh = useRefreshToken();

  useEffect(() => {
    if (localStorage.getItem("userID")) {
      console.log("refreshing at ProtectedRoutes");
      refresh();
    }
  }, []);

  return !!userToken ? <Layout /> : <LoginPage />;
}
