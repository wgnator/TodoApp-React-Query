import axios from "axios";
import HttpRequest from "../http/httpRequest";
import { USERS_DB_API_BASE_URL } from "../consts/api_consts";

const usersDBService = axios.create({
  baseURL: USERS_DB_API_BASE_URL,
  headers: {
    "Content-type": "application/json",
  },
});

usersDBService.interceptors.response.use(
  (response) => response,
  (error) => {
    throw new Error(error.response.data.details);
  }
);

export const usersDataService = new HttpRequest(usersDBService);
