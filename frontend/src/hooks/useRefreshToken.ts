import { useAuthContext } from "../contexts/AuthContext";
import { usersDBService } from "../services/usersDBService";

const useRefreshToken = () => {
  const { setUserToken } = useAuthContext();

  const refresh = async () => {
    try {
      const response = await usersDBService.get("/refresh", {
        withCredentials: true,
      });
      if (response.data)
        setUserToken((prev) => {
          console.log(JSON.stringify(prev));
          console.log(response.data.token);
          return response.data.token;
        });
      console.log("refreshing access token... result:", response);
      return response.data.token;
    } catch {
      console.log("refresh access token failed");
      setUserToken("");
      throw new Error("refresh access token failed");
    }
  };

  return refresh;
};

export default useRefreshToken;
