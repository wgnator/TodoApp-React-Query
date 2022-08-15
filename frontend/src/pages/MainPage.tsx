import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import sortTodoFunctions from "../utils/sortTodoFunctions";
import { BsPlusCircle } from "react-icons/bs";
import { FiTrash2 } from "react-icons/fi";
import { BiPencil } from "react-icons/bi";
import { ImCheckmark2 } from "react-icons/im";
import { FcCheckmark } from "react-icons/fc";
import TodoInputForm from "../components/TodoInputForm";
import { SelectedOptionsType, SentTodoData } from "../types/types";
import SortControllerComponents from "../components/SortControllerComponents";
import LoadingSpinner from "../components/LoadingSpinner";
import { theme } from "../styles/theme";
import useTodoQuery from "../models/useTodoQuery";
import { initialSelectedOptionsState } from "../consts/initialStates";

export type ComposingStateType = { isComposing: boolean; todoID: string | null };

export default function MainPage() {
  const { todos, createTodoMutation, updateTodoMutation, deleteTodoMutation } = useTodoQuery();
  const { sortTodos } = sortTodoFunctions();
  const { showingTodoIDParam } = useParams();
  const navigate = useNavigate();
  const [showingContentTodoID, setShowingContentTodoID] = useState<string | null>(null);
  const [composingState, setComposingState] = useState<ComposingStateType>({ isComposing: false, todoID: null });
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptionsType>(initialSelectedOptionsState);

  const toggleShowContent = (id: string) => {
    if (showingTodoIDParam === showingContentTodoID) navigate("/");
    else navigate("/" + id);
  };

  const createTodoCallback = (composedData?: SentTodoData) => {
    if (composedData) createTodoMutation.mutate(composedData);
    setComposingState({ isComposing: false, todoID: null });
  };
  const updateTodoCallback = (id?: string, composedData?: SentTodoData) => {
    if (id && composedData) updateTodoMutation.mutate(composedData);
    setComposingState({ isComposing: false, todoID: null });
  };

  useEffect(() => {
    if (showingTodoIDParam) setShowingContentTodoID(showingTodoIDParam);
    else setShowingContentTodoID(null);
    console.log(showingContentTodoID, showingTodoIDParam);
  }, [showingTodoIDParam]);

  return (
    <Container>
      <SortControllerComponents selectedOptions={selectedOptions} setSelectedOptions={setSelectedOptions} />
      <CreateTodo isComposing={composingState.isComposing} onClick={() => !composingState.isComposing && setComposingState({ isComposing: true, todoID: null })}>
        {composingState.isComposing && !composingState.todoID ? <TodoInputForm prevData={null} callback={createTodoCallback} /> : <PlusCircle />}
      </CreateTodo>
      {todos &&
        sortTodos(todos, selectedOptions).map((todo) => (
          <Todo
            key={todo.id}
            onClick={(event) => {
              event.stopPropagation();
              toggleShowContent(todo.id);
            }}
          >
            {composingState.isComposing && composingState.todoID === todo.id ? (
              <TodoInputForm prevData={todo} callback={(updatedTodo) => updateTodoCallback(todo.id, updatedTodo)} />
            ) : (
              <>
                <Icons>
                  <ImCheckmark2
                    onClick={(event) => {
                      event.stopPropagation();
                      updateTodoMutation.mutate({ ...todo, checked: !todo.checked });
                    }}
                  />
                  <BiPencil onClick={() => setComposingState({ isComposing: true, todoID: todo.id })} />
                  <FiTrash2 onClick={() => window.confirm("정말로 삭제하시겠습니까?") && deleteTodoMutation.mutate(todo)} />
                </Icons>
                <Title>{todo.title}</Title>
                {showingContentTodoID === todo.id && <Content>{todo.content}</Content>}
                <DateInfo>최근 수정: {new Date(todo.updatedAt).toLocaleString()}</DateInfo>
                {todo.checked && <Checkmark />}
              </>
            )}
          </Todo>
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

const Todo = styled.div`
  position: relative;
  width: 100%;
  min-height: 5rem;
  padding: 0.5rem 0.5rem;
  border: 2px white solid;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: height 1s;
`;

const CreateTodo = styled(Todo)<{ isComposing: boolean }>`
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
const Icons = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  height: 1rem;
  width: 4rem;
  display: flex;
  justify-content: space-between;
`;
const Title = styled.h2`
  align-self: flex-start;
`;
const DateInfo = styled.div`
  align-self: flex-end;
`;
const Content = styled.div`
  margin: 1rem 0;
`;

const Checkmark = styled(FcCheckmark)`
  position: absolute;
  width: 3rem;
  height: 3rem;
  left: calc((100% - 3rem) / 2);
  top: calc((100% - 3rem) / 2 - 5px);
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
const Circle = styled(LoadingSpinner).attrs((props) => ({ color: theme.primaryColor, backgroundColor: theme.backgroundColor }))`
  background-color: transparent;
`;
