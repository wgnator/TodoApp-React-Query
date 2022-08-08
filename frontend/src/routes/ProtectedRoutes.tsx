import { useContext, useEffect, useState } from "react";
import { AuthState } from "../contexts/authContext";
import LoginPage from "../pages/LoginPage";
import MainPage from "../pages/MainPage";

export default function ProtectedRoutes() {
  const { userTokenState } = useContext(AuthState);
  console.log(userTokenState);
  return userTokenState ? <MainPage /> : <LoginPage />;
}
