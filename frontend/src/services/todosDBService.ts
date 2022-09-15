import axios from "axios";
import { useEffect } from "react";
import { TODOS_DB_API_BASE_URL } from "../consts/api";
import { useAuthContext } from "../contexts/AuthContext";
import useRefreshToken from "../hooks/useRefreshToken";

export const todosDBService = axios.create({
  baseURL: TODOS_DB_API_BASE_URL,
  headers: {
    "Content-type": "application/json",
  },
  withCredentials: true,
});

export const useTodosDBWithCredentials = () => {
  const refresh = useRefreshToken();
  const { userToken, setUserToken } = useAuthContext();

  useEffect(() => {
    // todosDBService.interceptors.request.use(
    //   (config) => {
    //     if (config.headers) config.headers.Authorization = userToken;
    //     return config;
    //   },
    //   (error) => Promise.reject(error)
    // );
    todosDBService.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers.Authorization = newAccessToken;
          setUserToken(newAccessToken);

          return todosDBService(prevRequest).catch((error) => console.log("retry error", error));
        }
        const errorMessage =
          error.response?.status >= 400
            ? `${error.response.status} error :${error.response?.data?.details}`
            : error.message;
        throw new Error(errorMessage);
      }
    );
  }, []);

  return todosDBService;
};
