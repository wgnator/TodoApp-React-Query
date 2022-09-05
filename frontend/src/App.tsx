import { QueryClient, QueryClientProvider } from "react-query";
import { AuthState } from "./contexts/AuthContext";
import useLogin from "./hooks/useLogin";
import MainRouter from "./routes/MainRouter";
import { GlobalStyle } from "./styles/GlobalStyle";

const queryClient = new QueryClient();

function App() {
  const { userTokenState, userName, login, logout, signUp } = useLogin();
  return (
    <AuthState.Provider value={{ userTokenState, userName, login, logout, signUp }}>
      <QueryClientProvider client={queryClient}>
        <GlobalStyle />
        <MainRouter />
      </QueryClientProvider>
    </AuthState.Provider>
  );
}

export default App;
