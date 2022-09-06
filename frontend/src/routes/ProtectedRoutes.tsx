import { Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import Layout from "../pages/Layout";

export default function ProtectedRoutes() {
  const { userTokenState } = useAuthContext();
  const location = useLocation();
  return userTokenState ? <Layout /> : <Navigate to="/login" state={{ from: location }} replace />;
}
