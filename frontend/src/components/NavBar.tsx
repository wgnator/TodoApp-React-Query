import { useContext } from "react";
import styled from "styled-components";
import { AuthState } from "../contexts/AuthContext";
import { ViewModeContext, VIEW_MODE } from "../contexts/ViewModeContext";

export default function NavBar() {
  const { userName, logout } = useContext(AuthState);
  const { viewMode, toggleViewMode } = useContext(ViewModeContext);
  return (
    <Container>
      <Title>ToDo App</Title>
      <ViewMode onClick={() => toggleViewMode()}>{viewMode}</ViewMode>
      <UserInfo>
        <span>{userName}</span>
        <span>님, 안녕하세요!</span>
        <LogoutButton onClick={() => logout()}>로그아웃</LogoutButton>
      </UserInfo>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 4rem;
  padding: 0 0.5rem;
  background-color: #4633aa;
  display: flex;
  justify-content: space-between;
  align-items: center;
  > * {
    margin: 0 0.5rem;
  }
`;

const Title = styled.h1`
  flex-shrink: 0;
  @media (max-width: 620px) {
    font-size: 2rem;
  }
`;

const UserInfo = styled.div`
  flex-shrink: 0;
  @media (max-width: 620px) {
    width: fit-content;

    > span {
      display: none;
    }
  }
`;

const LogoutButton = styled.button`
  height: 2.5rem;
  flex-shrink: 0;
  margin-left: 1rem;
`;

const ViewMode = styled.button`
  height: 2.5rem;
`;
