import { QueryClient, QueryClientProvider } from "react-query";
import { AuthContextProvider } from "./contexts/AuthContext";
import MainRouter from "./routes/MainRouter";
import { GlobalStyle } from "./styles/GlobalStyle";

const queryClient = new QueryClient();

function App() {
  return (
    <AuthContextProvider>
      <QueryClientProvider client={queryClient}>
        <GlobalStyle />
        <MainRouter />
      </QueryClientProvider>
    </AuthContextProvider>
  );
}

export default App;
