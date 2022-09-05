import { todosDBService } from "../../services/todosDBService";
import { ReceivedTodoData, SentTodoData } from "../../types/types";

export default function useTodoRequests() {
  const token = localStorage.getItem("userToken") || "";
  if (!token) throw new Error("저장된 로그인 정보가 없습니다.");

  const getTodos = async (page: number) =>
    await todosDBService
      .get<{ data: { result: ReceivedTodoData[]; page: number } }>(`/?page=${page}`, {
        headers: { Authorization: token },
      })
      .then((response) => {
        return response.data.data;
      });

  const getTodosCount = async () =>
    await todosDBService
      .get("/?countOnly=true", { headers: { Authorization: token } })
      .then((response) => {
        console.log("data count:", response.data);
        return response.data.data;
      });
  // const getTodoById = async (id: string) => await todosDBService.get<ReceivedTodoData>(`/${id}`, { headers: { Authorization: token } });

  const createTodo = async (todo: SentTodoData) =>
    await todosDBService.post<SentTodoData>("/", todo, { headers: { Authorization: token } });

  const updateTodo = async (todo: SentTodoData) =>
    await todosDBService.put<SentTodoData>(`/${todo.id}`, todo, {
      headers: { Authorization: token },
    });

  const deleteTodo = async (todo: SentTodoData) =>
    await todosDBService.delete<SentTodoData>(`/${todo.id}`, { headers: { Authorization: token } });

  return { getTodos, getTodosCount, createTodo, updateTodo, deleteTodo };
}
