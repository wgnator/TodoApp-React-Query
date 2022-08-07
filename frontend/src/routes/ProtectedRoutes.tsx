import LoginPage from "../pages/LoginPage";
import MainPage from "../pages/MainPage";

export default function ProtectedRoutes() {
  const userToken = localStorage.getItem("userToken");
  return userToken ? <MainPage /> : <LoginPage />;
}
