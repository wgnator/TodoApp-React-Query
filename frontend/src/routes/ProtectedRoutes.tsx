import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import useRefreshToken from "../hooks/useRefreshToken";
import Layout from "../pages/Layout";
import LoginPage from "../pages/LoginPage";

export default function ProtectedRoutes() {
  const { userToken, setUserInfo } = useAuthContext();
  const refresh = useRefreshToken();

  useEffect(() => {
    if (!userToken) {
      const userInfo = localStorage.getItem("userInfo");
      if (userInfo) {
        const parsedUserInfo = JSON.parse(userInfo);
        console.log(parsedUserInfo);
        if (Object.keys(parsedUserInfo).every((e) => e === "userId" || e === "userName"))
          setUserInfo(parsedUserInfo);
        else return;
        console.log("refreshing at ProtectedRoutes");
        refresh();
      }
    }
  }, []);

  return !!userToken ? <Layout /> : <LoginPage />;
}
