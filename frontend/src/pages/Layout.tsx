import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import { TodoContextProvider } from "../contexts/TodoContext";
import { ViewModeContextProvider } from "../contexts/ViewModeContext";

export default function Layout() {
  return (
    <>
      <ViewModeContextProvider>
        <NavBar />
        <TodoContextProvider>
          <Outlet />
        </TodoContextProvider>
      </ViewModeContextProvider>
    </>
  );
}
