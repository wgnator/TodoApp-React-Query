import { useState } from "react";
import styled from "styled-components";
import { theme } from "../styles/theme";
import sortTodoFunctions from "../utils/sortTodoFunctions";
import { BsPlusCircle } from "react-icons/bs";
import TodoInputForm from "../components/TodoInputForm";
import { SelectedOptionsType } from "../types/types";
import SortControllerComponents from "../components/SortControllerComponents";
import LoadingSpinner from "../components/LoadingSpinner";
import { initialSelectedOptionsState } from "../consts/initialStates";
import Todo from "../components/Todo";
import { useTodoContext } from "../contexts/TodoContext";
import useTodoPageStateReducer, { ACTIONS } from "../hooks/useTodoPageStateReducer";
import { Container as TodoStyle } from "../components/Todo";

export default function MainPage() {
  const { todos } = useTodoContext();
  const { sortTodos } = sortTodoFunctions();
  const { pageState, dispatch } = useTodoPageStateReducer();
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptionsType>(
    initialSelectedOptionsState
  );

  const closeForm = () => dispatch({ type: ACTIONS.SET_COMPOSING_TODO_ID, payload: null });

  return (
    <Container>
      <SortControllerComponents
        selectedOptions={selectedOptions}
        setSelectedOptions={setSelectedOptions}
      />
      <CreateTodo
        isComposing={pageState.composingTodoID === "NEW"}
        onClick={() =>
          !pageState.composingTodoID &&
          dispatch({ type: ACTIONS.SET_COMPOSING_TODO_ID, payload: "NEW" })
        }
      >
        {pageState.composingTodoID === "NEW" ? (
          <TodoInputForm prevData={null} closeForm={closeForm} />
        ) : (
          <PlusCircle />
        )}
      </CreateTodo>
      {todos &&
        sortTodos(todos, selectedOptions).map((todo) => (
          <Todo
            key={todo.id}
            todo={todo}
            isComposing={pageState.composingTodoID === todo.id}
            isShowingContent={pageState.showingContentTodoID === todo.id}
            dispatch={dispatch}
          />
        ))}
      {/* {isLoading && (
        <Veil>
          <Circle />
        </Veil>
      )} */}
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
      border-color: #646cff;
      * {
        color: #646cff;
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

const Veil = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Circle = styled(LoadingSpinner).attrs((props) => ({
  color: theme.primaryColor,
  backgroundColor: theme.backgroundColor,
}))`
  background-color: transparent;
`;
