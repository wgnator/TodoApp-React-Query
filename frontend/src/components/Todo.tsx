import TodoInputForm from "./TodoInputForm";
import { FiTrash2 } from "react-icons/fi";
import { BiPencil } from "react-icons/bi";
import { ImCheckmark2, ImCheckmark } from "react-icons/im";
import { FcCheckmark } from "react-icons/fc";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { useTodoContext } from "../contexts/TodoContext";
import { ACTIONS, TodoDispatch } from "../hooks/useTodoDisplayStateReducer";
import { ReceivedTodoData } from "../types/types";
import React, { useState } from "react";
import AlertDialog from "./AlertDialog";
import { useViewModeContext, ViewModeOptions, VIEW_MODE } from "../contexts/ViewModeContext";
import { DateTypes, sortOptionsDictionary } from "../hooks/useSortTodo";
import { MOBILE_WIDTH } from "../consts/consts";
import { IconType } from "react-icons";

type TodoProps = {
  todo: ReceivedTodoData;
  dateType: DateTypes;
  isComposing: boolean;
  isShowingContent: boolean;
  dispatch: TodoDispatch;
};

export default function Todo({
  todo,
  dateType,
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
  const handleOnClickCheck = (event: React.MouseEvent) => {
    event.stopPropagation();
    updateTodoMutation.mutate({ ...todo, checked: !todo.checked });
  };
  const handleOnClickEdit = (event: React.MouseEvent) => {
    event.stopPropagation();
    dispatch({ type: ACTIONS.SET_COMPOSING_TODO_ID, todoIDPayload: todo.id });
  };
  const handleOnClickDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsShowingAlert(true);
  };

  const EditIcon = () => <BiPencil onClick={handleOnClickEdit} />;
  const CheckIcon = ({ Wrapper }: { Wrapper: IconType }) => (
    <Wrapper onClick={handleOnClickCheck} />
  );
  const DeleteIcon = () => <FiTrash2 onClick={handleOnClickDelete} />;
  const DateInfo = ({ viewMode }: { viewMode?: ViewModeOptions }) => (
    <DateInfoWrapper viewMode={viewMode}>
      {`${sortOptionsDictionary[dateType]}: ${new Date(todo[dateType]).toLocaleString("ko-KR")}`}
    </DateInfoWrapper>
  );
  return (
    <Container
      onClick={(event) => {
        event.stopPropagation();
        toggleShowContent();
      }}
      layout={viewMode}
    >
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
              <CheckIcon Wrapper={ImCheckmark2} />
              <EditIcon />
              <FiTrash2 onClick={() => setIsShowingAlert(true)} />
            </Icons>
          </UpperRow>
          <Content>{todo.content}</Content>
          <DateInfo />
          {todo.checked && <Checkmark />}
        </>
      ) : (
        <>
          <UpperRow>
            <Checkbox onClick={handleOnClickCheck}>{todo.checked && <CheckmarkMini />}</Checkbox>
            <Title>{todo.title}</Title>
            {!isShowingContent && <DateInfo viewMode={viewMode} />}
            <Icons>
              <EditIcon />
              <DeleteIcon />
            </Icons>
          </UpperRow>
          <LowerRow>
            {isShowingContent && (
              <>
                <Content>{todo.content}</Content>
                <DateInfo />
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
  cursor: pointer;
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
const DateInfoWrapper = styled.div<{ viewMode?: ViewModeOptions }>`
  flex-shrink: 0;
  text-align: right;
  @media (max-width: ${MOBILE_WIDTH}px) {
    ${(props) => props.viewMode === VIEW_MODE.MINI && "display: none;"}
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
