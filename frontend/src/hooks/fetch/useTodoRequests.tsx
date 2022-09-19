import { useAuthContext } from "../../contexts/AuthContext";
import { useTodosDBWithCredentials } from "../../services/todosDBService";
import { ReceivedTodoData, SentTodoData } from "../../types/types";

export default function useTodoRequests() {
  const {
    logout,
    userToken,
    userInfo: { userId },
  } = useAuthContext();
  if (!userToken || !userId) {
    console.error("저장된 로그인 정보가 없습니다.");
    logout();
  }

  const todosDBService = useTodosDBWithCredentials();

  const getTodos = async (page: number) =>
    await todosDBService
      .get<{ data: { result: ReceivedTodoData[]; page: number } }>(
        `/?userId=${userId}&page=${page}`,
        {
          headers: { Authorization: userToken },
        }
      )
      .then((response) => {
        return response.data.data;
      });

  const getTodosCount = async () =>
    await todosDBService.get(`/?userId=${userId}&countOnly=true`).then((response) => {
      return response.data.data;
    });
  // const getTodoById = async (id: string) => await todosDBService.get<ReceivedTodoData>(`/${id}`);

  const createTodo = async (todo: SentTodoData) =>
    await todosDBService.post<SentTodoData>(`/?userId=${userId}`, todo);

  const updateTodo = async (todo: SentTodoData) =>
    await todosDBService.put<SentTodoData>(`/${todo.id}?userId=${userId}`, todo, {
      headers: { Authorization: userToken },
    });

  const deleteTodo = async (todo: SentTodoData) =>
    await todosDBService.delete<SentTodoData>(`/${todo.id}?userId=${userId}`, {
      headers: { Authorization: userToken },
    });

  return { getTodos, getTodosCount, createTodo, updateTodo, deleteTodo };
}
