import { useAuthContext } from "../contexts/AuthContext";
import { usersDBService } from "../services/usersDBService";

const useRefreshToken = () => {
  const { setUserToken } = useAuthContext();

  const refresh = async () => {
    try {
      const response = await usersDBService.get("/refresh", {
        withCredentials: true,
      });
      if (response.data) setUserToken(response.data.token);
      console.log("refreshing access token...");
      return response.data.token;
    } catch {
      setUserToken("");
      throw new Error("refresh access token failed");
    }
  };

  return refresh;
};

export default useRefreshToken;
