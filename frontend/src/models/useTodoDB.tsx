import { AxiosInstance, AxiosResponse } from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { todosDBService } from "../services/todosDBService";
import { ReceivedTodoData, SentTodoData } from "../types/types";
import { filterTodosDataByChecked, filterTodosDataByString, sortTodos } from "../utils/sortFunctions";

export type reorderTodosByType = (criterion: "updatedAt" | "createdAt", order: "newestFirst" | "oldestFirst") => void;
export type filterTodosByCheckedType = (isValue: boolean) => void;
export type filterTodosByType = (criterion: "title" | "content", searchString: string) => void;

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

  const reorderTodosBy: reorderTodosByType = (criterion, order) => setTodos(sortTodos(todos).by(criterion, order));

  const filterTodosByChecked: filterTodosByCheckedType = (isValue) => setTodos(filterTodosDataByChecked(todos).is(isValue));

  const filterTodosBy: filterTodosByType = (criterion, searchString) => setTodos(filterTodosDataByString(todos).by(criterion).contains(searchString));

  const processModelWithInfoForUser = (callback: Promise<void>, reload: boolean) => {
    setIsLoading(true);
    callback
      .catch((error) => window.alert(error.message))
      .finally(() => {
        setIsLoading(false);
        if (reload) getTodos();
      });
  };

  const getTodos = () => {
    processModelWithInfoForUser(
      todosDBService.get("/", { headers: { Authorization: token } }).then((response) => setTodos(sortTodos(response.data.data).by("updatedAt", "newestFirst"))),
      false
    );
  };

  const getTodoById = (id: string) => {
    processModelWithInfoForUser(
      todosDBService.get(`/${id}`, { headers: { Authorization: token } }).then((response) => setTodos(response.data.data)),
      false
    );
  };
  const createTodo = (todo: SentTodoData) => {
    processModelWithInfoForUser(todosDBService.post("/", todo, { headers: { Authorization: token } }), true);
  };
  const updateTodo = (id: string, todo: SentTodoData) => {
    processModelWithInfoForUser(todosDBService.put(`/${id}`, todo, { headers: { Authorization: token } }), true);
  };
  const deleteTodo = (id: string) => {
    processModelWithInfoForUser(todosDBService.delete(`/${id}`, { headers: { Authorization: token } }), true);
  };
  return { todos, getTodos, getTodoById, createTodo, updateTodo, deleteTodo, isLoading, reorderTodosBy, filterTodosByChecked, filterTodosBy };
}
