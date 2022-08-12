import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { todosDBService } from "../services/todosDBService";
import { ReceivedTodoData, SentTodoData } from "../types/types";

export default function useTodoDB() {
  const [todos, setTodos] = useState<ReceivedTodoData[] | []>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken") || "";

  useEffect(() => {
    if (!token) {
      window.alert("저장된 로그인 정보가 없습니다.");
      navigate("/");
    }
  }, [token]);

  const processModelWithUI = (callback: Promise<void>, reload: boolean) => {
    setIsLoading(true);
    callback
      .catch((error) => window.alert(error.message))
      .finally(() => {
        setIsLoading(false);
        if (reload) getTodos();
      });
  };

  const getTodos = () => {
    processModelWithUI(
      todosDBService.get("/", { headers: { Authorization: token } }).then((response) => setTodos(response.data.data)),
      false
    );
  };

  const getTodoById = (id: string) => {
    processModelWithUI(
      todosDBService.get(`/${id}`, { headers: { Authorization: token } }).then((response) => setTodos(response.data.data)),
      false
    );
  };
  const createTodo = (todo: SentTodoData) => {
    processModelWithUI(todosDBService.post("/", todo, { headers: { Authorization: token } }), true);
  };
  const updateTodo = (id: string, todo: SentTodoData) => {
    processModelWithUI(todosDBService.put(`/${id}`, todo, { headers: { Authorization: token } }), true);
  };
  const deleteTodo = (id: string) => {
    processModelWithUI(todosDBService.delete(`/${id}`, { headers: { Authorization: token } }), true);
  };
  return { todos, getTodos, getTodoById, createTodo, updateTodo, deleteTodo, isLoading };
}
