import TodoInputForm from "./TodoInputForm";
import { FiTrash2 } from "react-icons/fi";
import { BiPencil } from "react-icons/bi";
import { ImCheckmark2 } from "react-icons/im";
import { FcCheckmark } from "react-icons/fc";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useTodoContext } from "../contexts/TodoContext";
import { ACTIONS, TodoDispatch } from "../hooks/useTodoPageStateReducer";
import { ReceivedTodoData } from "../types/types";
import { useState } from "react";
import AlertDialog from "./AlertDialog";

type TodoProps = {
  todo: ReceivedTodoData;
  isComposing: boolean;
  isShowingContent: boolean;
  dispatch: TodoDispatch;
};

export default function Todo({ todo, isComposing, isShowingContent, dispatch }: TodoProps) {
  const navigate = useNavigate();
  const { updateTodoMutation, deleteTodoMutation } = useTodoContext();
  const [isShowingAlert, setIsShowingAlert] = useState(false);
  const showContent = () => {
    navigate("/" + todo.id);
  };

  return (
    <Container onClick={() => showContent()}>
      {isComposing ? (
        <TodoInputForm
          prevData={todo}
          closeForm={() => dispatch({ type: ACTIONS.SET_COMPOSING_TODO_ID, payload: null })}
        />
      ) : (
        <>
          <Icons>
            <ImCheckmark2
              onClick={(event) => {
                event.stopPropagation();
                updateTodoMutation.mutate({ ...todo, checked: !todo.checked });
              }}
            />
            <BiPencil
              onClick={() => dispatch({ type: ACTIONS.SET_COMPOSING_TODO_ID, payload: todo.id })}
            />
            <FiTrash2 onClick={() => setIsShowingAlert(true)} />
          </Icons>
          <Title>{todo.title}</Title>
          {isShowingContent && <Content>{todo.content}</Content>}
          <DateInfo>최근 수정: {new Date(todo.updatedAt).toLocaleString()}</DateInfo>
          {todo.checked && <Checkmark />}
        </>
      )}
      {isShowingAlert && (
        <AlertDialog
          isCancelable={true}
          onConfirm={(isConfirmed) => {
            isConfirmed && deleteTodoMutation.mutate(todo);
            setIsShowingAlert(false);
          }}
        >
          정말로 삭제하시겠습니까?
        </AlertDialog>
      )}
    </Container>
  );
}
export const Container = styled.div`
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
  width: 100%;
  word-wrap: break-word;
  line-height: 1.5rem;
`;

const Checkmark = styled(FcCheckmark)`
  position: absolute;
  width: 3rem;
  height: 3rem;
  left: calc((100% - 3rem) / 2);
  top: calc((100% - 3rem) / 2 - 5px);
`;
