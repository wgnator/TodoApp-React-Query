import axios from "axios";
import HttpRequest from "../http/httpRequest";
import { TODOS_DB_API_BASE_URL } from "../consts/api_consts";

export const todosDBService = axios.create({
  baseURL: TODOS_DB_API_BASE_URL,
  headers: {
    "Content-type": "application/json",
  },
});

todosDBService.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export const todosDataService = new HttpRequest(todosDBService);
