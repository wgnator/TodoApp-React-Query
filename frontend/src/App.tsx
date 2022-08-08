import { AuthState } from "./contexts/authContext";
import useLogin from "./hooks/useLogin";
import MainRouter from "./routes/MainRouter";

function App() {
  const { userTokenState, login, logout, signUp } = useLogin();
  return (
    <AuthState.Provider value={{ userTokenState, login, logout, signUp }}>
      <MainRouter />;
    </AuthState.Provider>
  );
}

export default App;
