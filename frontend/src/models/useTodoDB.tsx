import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { todosDBService } from "../services/todosDBService";
import { ReceivedTodoData, SentTodoData } from "../types/types";

export default function useTodoDB() {
  const [data, setData] = useState([] as ReceivedTodoData[]);
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken") || "";

  useEffect(() => {
    if (!token) {
      window.alert("저장된 로그인 정보가 없습니다.");
      navigate("/");
    }
  }, [token]);

  const getTodos = () => {
    todosDBService
      .get("/", { headers: { Authorization: token } })
      .then((response) => setData(response.data.data))
      .catch((error) => console.log(error));
  };

  const getTodoById = (id: string) => {
    todosDBService
      .get(`/${id}`, { headers: { Authorization: token } })
      .then((response) => setData(response.data.data))
      .catch((error) => console.log(error));
  };
  const createTodo = (data: SentTodoData) => {
    todosDBService
      .post("/", data, { headers: { Authorization: token } })
      .then((response) => getTodos())
      .catch((error) => console.log(error));
  };
  const updateTodo = (id: string, data: SentTodoData) => {
    todosDBService
      .put(`/${id}`, data, { headers: { Authorization: token } })
      .then((response) => getTodos())
      .catch((error) => console.log(error));
  };
  const deleteTodo = (id: string) => {
    todosDBService
      .delete(`/${id}`, { headers: { Authorization: token } })
      .then((response) => getTodos())
      .catch((error) => console.log(error));
  };
  return { data, getTodos, getTodoById, createTodo, updateTodo, deleteTodo };
}
