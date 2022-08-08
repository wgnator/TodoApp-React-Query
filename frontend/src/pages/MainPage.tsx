import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import useTodoDB from "../models/useTodoDB";
import { BsPlusCircle } from "react-icons/bs";
import { FiTrash2 } from "react-icons/fi";
import { BiPencil } from "react-icons/bi";
import TodoInputForm from "../components/TodoInputForm";
import { SentTodoData } from "../types/types";

export type ComposingStateType = { isComposing: boolean; itemID: string | null };

export default function MainPage() {
  const { data, getTodos, getTodoById, createTodo, updateTodo, deleteTodo } = useTodoDB();
  const { showItemID } = useParams();
  const navigate = useNavigate();

  const [showingContentItemID, setShowingContentItemID] = useState<string | null>(null);
  const [composingState, setComposingState] = useState<ComposingStateType>({ isComposing: false, itemID: null });

  const toggleShowContent = (id: string) => {
    if (!showItemID) navigate("/" + id);
    else navigate("/");
  };

  const createTodoCallback = (composedData?: SentTodoData) => {
    if (composedData) createTodo(composedData);
    setComposingState({ isComposing: false, itemID: null });
  };
  const updateTodoCallback = (id?: string, composedData?: SentTodoData) => {
    if (id && composedData) updateTodo(id, composedData);
    setComposingState({ isComposing: false, itemID: null });
  };

  useEffect(() => {
    getTodos();
  }, []);

  useEffect(() => {
    if (showItemID) setShowingContentItemID(showItemID);
    else setShowingContentItemID(null);
  }, [showItemID]);

  return (
    <Container>
      <CreateItem isComposing={composingState.isComposing} onClick={() => !composingState.isComposing && setComposingState({ isComposing: true, itemID: null })}>
        {composingState.isComposing && !composingState.itemID ? <TodoInputForm prevData={null} callback={createTodoCallback} /> : <BsPlusCircle />}
      </CreateItem>
      {data.map((item) => (
        <Item
          key={item.id}
          onClick={(event) => {
            event.stopPropagation();
            toggleShowContent(item.id);
          }}
        >
          {composingState.isComposing && composingState.itemID === item.id ? (
            <TodoInputForm prevData={item} callback={(data) => updateTodoCallback(item.id, data)} />
          ) : (
            <>
              <Icons>
                <BiPencil onClick={() => setComposingState({ isComposing: true, itemID: item.id })} />
                <FiTrash2 onClick={() => window.confirm("정말로 삭제하시겠습니까?") && deleteTodo(item.id)} />
              </Icons>
              <Title>{item.title}</Title>
              {showingContentItemID === item.id && <Content>{item.content}</Content>}
              <DateInfo>최근 수정: {new Date(item.updatedAt).toLocaleString()}</DateInfo>
            </>
          )}
        </Item>
      ))}
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

const Item = styled.div`
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
  > svg {
    align-self: center;
    width: 2rem;
    height: 2rem;
    margin: 1rem;
  }
`;

const CreateItem = styled(Item)<{ isComposing: boolean }>`
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

const Icons = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  height: 1rem;
  width: 2.5rem;
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
