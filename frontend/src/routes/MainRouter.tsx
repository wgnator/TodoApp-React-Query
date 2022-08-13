import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "../pages/MainPage";
import ProtectedRoutes from "./ProtectedRoutes";

export default function MainRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProtectedRoutes />}>
          <Route path="" element={<MainPage />} />
          <Route path=":showItemID" element={<MainPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
