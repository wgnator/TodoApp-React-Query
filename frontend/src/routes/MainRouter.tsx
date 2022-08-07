import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoutes from "./ProtectedRoutes";

export default function MainRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProtectedRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}
