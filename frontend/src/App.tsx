import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { AuthContextProvider } from "./contexts/AuthContext";
import MainRouter from "./routes/MainRouter";
import { GlobalStyle } from "./styles/GlobalStyle";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        {/* <ReactQueryDevtools /> */}
        <GlobalStyle />
        <MainRouter />
      </AuthContextProvider>
    </QueryClientProvider>
  );
}

export default App;
