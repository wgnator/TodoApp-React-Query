import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { theme } from "../styles/theme";
import useSortTodo, { TermDictionary } from "../hooks/useSortTodo";
import useIntersectionObserver from "../hooks/useIntersectionObserver";
import { BsPlusCircle } from "react-icons/bs";
import TodoInputForm from "../components/TodoInputForm";
import SortOptionComponents from "../components/SortOptionComponents";
import LoadingSpinner from "../components/LoadingSpinner";
import Todo from "../components/Todo";
import { useTodoContext } from "../contexts/TodoContext";
import useTodoDisplayStateReducer, { ACTIONS } from "../hooks/useTodoDisplayStateReducer";
import { Container as TodoStyle } from "../components/Todo";
import AlertDialog from "../components/AlertDialog";
import TodoSkeleton from "../components/TodoSkeleton";
import TermSection from "../components/TermSection";
import { ResponsiveRenderer } from "../components/ResponsiveRender";

export default function MainPage() {
  const { todos, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage, isError, error } =
    useTodoContext();
  const { sortTodos, reduceTodos, selectedOptions, setSelectedOptions } = useSortTodo();
  const { todoDisplayStates, dispatch } = useTodoDisplayStateReducer();
  const [isShowingAlert, setIsShowingAlert] = useState(false);
  const observerDivRef = useRef(null);
  const closeForm = () => dispatch({ type: ACTIONS.SET_COMPOSING_TODO_ID, todoIDPayload: null });

  useIntersectionObserver(
    observerDivRef,
    () => {
      console.log("observer intersecting");
      fetchNextPage();
    },
    [todos]
  );

  useEffect(() => {
    if (isError) setIsShowingAlert(true);
  }, [isError]);

  return (
    <Container>
      <ResponsiveRenderer title="정렬/검색옵션">
        <SortOptionComponents
          selectedOptions={selectedOptions}
          setSelectedOptions={(selectedOptions) => setSelectedOptions(selectedOptions)}
        />
      </ResponsiveRenderer>
      <CreateTodo
        isComposing={todoDisplayStates.composingTodoID === "NEW"}
        onClick={() =>
          !todoDisplayStates.composingTodoID &&
          dispatch({ type: ACTIONS.SET_COMPOSING_TODO_ID, todoIDPayload: "NEW" })
        }
      >
        {todoDisplayStates.composingTodoID === "NEW" ? (
          <TodoInputForm prevData={null} isNew={true} closeForm={closeForm} />
        ) : (
          <PlusCircle />
        )}
      </CreateTodo>
      {todos &&
        reduceTodos(sortTodos(todos)).map(
          (entry, index) =>
            entry[1].length > 0 && (
              <TermSection key={index} termText={TermDictionary[entry[0]].korean}>
                {entry[1].map((todo) => (
                  <Todo
                    key={todo.id}
                    todo={todo}
                    dateType={selectedOptions.dateType}
                    isComposing={todoDisplayStates.composingTodoID === todo.id}
                    isShowingContent={todoDisplayStates.showingContentTodoID === todo.id}
                    dispatch={dispatch}
                  />
                ))}
              </TermSection>
            )
        )}
      {isLoading && <TodoSkeleton numOfItems={5} />}
      {hasNextPage && (
        <Observer ref={observerDivRef}>
          <Circle />
        </Observer>
      )}

      {isShowingAlert && (
        <AlertDialog isCancelable={false} onConfirm={() => setIsShowingAlert(false)}>
          데이터를 불러오는데 실패하였습니다: {error?.message}
        </AlertDialog>
      )}
    </Container>
  );
}

const Container = styled.div`
  width: 80%;
  margin: 1rem auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CreateTodo = styled(TodoStyle)<{ isComposing: boolean }>`
  ${(props) =>
    !props.isComposing &&
    `    
    transition: border-color 0.25s;
    &:hover {
      border-color: ${theme.primaryColor};
      * {
        color: ${theme.primaryColor};
        transition: color 0.25s;
      }
    }
  `}
`;

const PlusCircle = styled(BsPlusCircle)`
  align-self: center;
  width: 2rem;
  height: 2rem;
  margin: 1rem;
`;

const Circle = styled(LoadingSpinner).attrs((props) => ({
  color: theme.primaryColor,
  backgroundColor: theme.backgroundColor,
}))``;

const Observer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;
