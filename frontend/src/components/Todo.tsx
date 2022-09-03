import TodoInputForm from "./TodoInputForm";
import { FiTrash2 } from "react-icons/fi";
import { BiPencil } from "react-icons/bi";
import { ImCheckmark2, ImCheckmark } from "react-icons/im";
import { FcCheckmark } from "react-icons/fc";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { useTodoContext } from "../contexts/TodoContext";
import { ACTIONS, TodoDispatch } from "../hooks/useTodoPageStateReducer";
import { ReceivedTodoData } from "../types/types";
import { useState } from "react";
import AlertDialog from "./AlertDialog";
import { useViewModeContext, ViewModeOptions, VIEW_MODE } from "../contexts/ViewModeContext";
import { OrderByType, sortOptionsDictionary } from "../hooks/useSortTodo";

type TodoProps = {
  todo: ReceivedTodoData;
  showingDateType: OrderByType;
  isComposing: boolean;
  isShowingContent: boolean;
  dispatch: TodoDispatch;
};

export default function Todo({
  todo,
  showingDateType,
  isComposing,
  isShowingContent,
  dispatch,
}: TodoProps) {
  const navigate = useNavigate();
  const { showingTodoIDParam } = useParams();
  const { updateTodoMutation, deleteTodoMutation } = useTodoContext();
  const { viewMode } = useViewModeContext();
  const [isShowingAlert, setIsShowingAlert] = useState(false);
  const toggleShowContent = () => {
    if (showingTodoIDParam === todo.id) navigate("/");
    else navigate("/" + todo.id);
  };

  return (
    <Container onClick={() => toggleShowContent()} layout={viewMode}>
      {isComposing ? (
        <TodoInputForm
          prevData={todo}
          isNew={false}
          closeForm={() => dispatch({ type: ACTIONS.SET_COMPOSING_TODO_ID, todoIDPayload: null })}
        />
      ) : viewMode === VIEW_MODE.LARGE ? (
        <>
          <UpperRow>
            <Title>{todo.title}</Title>
            <Icons>
              <ImCheckmark2
                onClick={(event) => {
                  event.stopPropagation();
                  updateTodoMutation.mutate({ ...todo, checked: !todo.checked });
                }}
              />
              <BiPencil
                onClick={() =>
                  dispatch({ type: ACTIONS.SET_COMPOSING_TODO_ID, todoIDPayload: todo.id })
                }
              />
              <FiTrash2 onClick={() => setIsShowingAlert(true)} />
            </Icons>
          </UpperRow>

          {isShowingContent && <Content>{todo.content}</Content>}
          <DateInfo>
            {`${sortOptionsDictionary[showingDateType.criterion]}: ${new Date(
              todo[showingDateType.criterion]
            ).toLocaleString()}`}
          </DateInfo>
          {todo.checked && <Checkmark />}
        </>
      ) : (
        <>
          <UpperRow>
            <Checkbox
              onClick={(event) => {
                event.stopPropagation();
                updateTodoMutation.mutate({ ...todo, checked: !todo.checked });
              }}
            >
              {todo.checked && <CheckmarkMini />}
            </Checkbox>
            <Title>{todo.title}</Title>
            <DateInfo viewMode={viewMode}>
              {`${sortOptionsDictionary[showingDateType.criterion]}: ${new Date(
                todo[showingDateType.criterion]
              ).toLocaleDateString()}`}
            </DateInfo>
            <Icons>
              <BiPencil
                onClick={() =>
                  dispatch({ type: ACTIONS.SET_COMPOSING_TODO_ID, todoIDPayload: todo.id })
                }
              />
              <FiTrash2 onClick={() => setIsShowingAlert(true)} />
            </Icons>
          </UpperRow>
          <LowerRow>
            {isShowingContent && (
              <>
                <Content>{todo.content}</Content>
              </>
            )}
          </LowerRow>
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
export const Container = styled.div<{ layout?: ViewModeOptions }>`
  position: relative;
  width: 100%;
  min-height: 5rem;
  padding: 0.5rem 0.5rem;
  border: 2px white solid;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  gap: 0.3rem;
  transition: height 1s;
  ${(props) => props.layout === VIEW_MODE.MINI && `min-height: 0; gap:0;`}
`;
const Icons = styled.div`
  top: 0.5rem;
  right: 0.5rem;
  height: 1rem;
  flex-shrink: 0;
  > * {
    margin-left: 0.5rem;
  }
`;
const Title = styled.h2`
  align-self: flex-start;
  width: 100%;
  height: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
const DateInfo = styled.div<{ viewMode?: ViewModeOptions }>`
  flex-shrink: 0;
  text-align: right;
  @media (max-width: 620px) {
    display: ${(props) => props.viewMode === VIEW_MODE.MINI && " none"};
  }
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

const UpperRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;
const LowerRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;
const Checkbox = styled.div`
  position: relative;
  width: 1rem;
  height: 1rem;
  background-color: white;
  margin-right: 1rem;
  flex-shrink: 0;
`;
const CheckmarkMini = styled(ImCheckmark)`
  color: green;
  position: absolute;
  width: 170%;
  height: 170%;
  left: -35%;
  bottom: -10%;
`;
