import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import { TodoContextProvider } from "../contexts/TodoContext";

export default function Layout() {
  return (
    <>
      <NavBar />
      <TodoContextProvider>
        <Outlet />
      </TodoContextProvider>
    </>
  );
}
