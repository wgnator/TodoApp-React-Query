import axios from "axios";
import { USERS_DB_API_BASE_URL } from "../consts/api_consts";

export const usersDBService = axios.create({
  baseURL: USERS_DB_API_BASE_URL,
  headers: {
    "Content-type": "application/json",
  },
  withCredentials: true,
});

usersDBService.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(error.response?.status >= 400 && error);
    const errorMessage =
      error.response?.status >= 400
        ? `${error.response.status} error :${error.response.data.details}`
        : "네트워크 에러";
    throw new Error(errorMessage);
  }
);
