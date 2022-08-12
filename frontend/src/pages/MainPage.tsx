import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import useTodoDB from "../models/useTodoDB";
import useSortedTodos from "../models/useSortedTodos";
import { BsPlusCircle } from "react-icons/bs";
import { FiTrash2 } from "react-icons/fi";
import { BiPencil } from "react-icons/bi";
import { ImCheckmark2 } from "react-icons/im";
import { FcCheckmark } from "react-icons/fc";
import TodoInputForm from "../components/TodoInputForm";
import { SentTodoData } from "../types/types";
import SortControllers from "../components/SortControllers";

export type ComposingStateType = { isComposing: boolean; itemID: string | null };

export default function MainPage() {
  const { todos, getTodos, createTodo, updateTodo, deleteTodo, isLoading } = useTodoDB();
  const { sortedTodos, orderTodosBy, filterTodosByChecked, filterTodosByString } = useSortedTodos(todos);
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
      <SortControllers controllers={{ orderTodosBy, filterTodosByChecked, filterTodosByString }} />
      <CreateItem isComposing={composingState.isComposing} onClick={() => !composingState.isComposing && setComposingState({ isComposing: true, itemID: null })}>
        {composingState.isComposing && !composingState.itemID ? <TodoInputForm prevData={null} callback={createTodoCallback} /> : <PlusCircle />}
      </CreateItem>
      {sortedTodos.map((item) => (
        <Item
          key={item.id}
          onClick={(event) => {
            event.stopPropagation();
            toggleShowContent(item.id);
          }}
        >
          {composingState.isComposing && composingState.itemID === item.id ? (
            <TodoInputForm prevData={item} callback={(updatedTodo) => updateTodoCallback(item.id, updatedTodo)} />
          ) : (
            <>
              <Icons>
                <ImCheckmark2
                  onClick={(event) => {
                    event.stopPropagation();
                    console.log(item);
                    updateTodo(item.id, { ...item, checked: !item.checked });
                  }}
                />
                <BiPencil onClick={() => setComposingState({ isComposing: true, itemID: item.id })} />
                <FiTrash2 onClick={() => window.confirm("정말로 삭제하시겠습니까?") && deleteTodo(item.id)} />
              </Icons>
              <Title>{item.title}</Title>
              {showingContentItemID === item.id && <Content>{item.content}</Content>}
              <DateInfo>최근 수정: {new Date(item.updatedAt).toLocaleString()}</DateInfo>
              {item.checked && <Checkmark />}
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
