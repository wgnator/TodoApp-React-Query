import axios from "axios";
import HttpRequest from "../http/httpRequest";
import { USERS_DB_API_BASE_URL } from "../consts/api_consts";

export const usersDBService = axios.create({
  baseURL: USERS_DB_API_BASE_URL,
  headers: {
    "Content-type": "application/json",
  },
});

export const usersDataService = new HttpRequest(usersDBService);
