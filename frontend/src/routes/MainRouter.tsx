import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import MainPage from "../pages/MainPage";
import { PageNotFound } from "../pages/PageNotFound";
import ProtectedRoutes from "./ProtectedRoutes";

export default function MainRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedRoutes />}>
          <Route path="" element={<MainPage />} />
          <Route path=":showingTodoIDParam" element={<MainPage />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
