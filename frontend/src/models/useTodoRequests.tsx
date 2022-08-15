import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { todosDBService } from "../services/todosDBService";
import { ReceivedTodoData, SentTodoData } from "../types/types";

export default function useTodoRequests() {
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken") || "";

  useEffect(() => {
    if (!token) {
      window.alert("저장된 로그인 정보가 없습니다.");
      navigate("/");
    }
  }, [token]);

  const getTodos = async () =>
    await todosDBService.get<{ data: ReceivedTodoData[] }>("/", { headers: { Authorization: token } }).then((response) => {
      console.log(response, response.data, response.data.data);
      return response.data.data;
    });

  // const getTodoById = async (id: string) => await todosDBService.get<ReceivedTodoData>(`/${id}`, { headers: { Authorization: token } });

  const createTodo = async (todo: SentTodoData) => await todosDBService.post<SentTodoData>("/", todo, { headers: { Authorization: token } });

  const updateTodo = async (todo: SentTodoData) => await todosDBService.put<SentTodoData>(`/${todo.id}`, todo, { headers: { Authorization: token } });

  const deleteTodo = async (todo: SentTodoData) => await todosDBService.delete<SentTodoData>(`/${todo.id}`, { headers: { Authorization: token } });

  return { getTodos, createTodo, updateTodo, deleteTodo };
}
