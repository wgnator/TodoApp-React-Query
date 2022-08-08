import { AuthState } from "./contexts/AuthContext";
import useLogin from "./hooks/useLogin";
import MainRouter from "./routes/MainRouter";
import { GlobalStyle } from "./styles/GlobalStyle";

function App() {
  const { userTokenState, userName, login, logout, signUp } = useLogin();
  return (
    <AuthState.Provider value={{ userTokenState, userName, login, logout, signUp }}>
      <GlobalStyle />
      <MainRouter />
    </AuthState.Provider>
  );
}

export default App;
