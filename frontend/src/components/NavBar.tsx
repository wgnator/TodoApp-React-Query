import { useContext } from "react";
import styled from "styled-components";
import { MOBILE_WIDTH } from "../consts/consts";
import { AuthState } from "../contexts/AuthContext";
import { ViewModeContext } from "../contexts/ViewModeContext";

export default function NavBar() {
  const { userName, logout } = useContext(AuthState);
  const { viewMode, toggleViewMode } = useContext(ViewModeContext);
  return (
    <Container>
      <Title>ToDo App</Title>
      <ButtonsWrapper>
        <UserInfo>
          <span>{userName}</span>
          <span>님, 안녕하세요!</span>
        </UserInfo>
        <ViewMode onClick={() => toggleViewMode()}>{viewMode}</ViewMode>
        <LogoutButton onClick={() => logout()}>로그아웃</LogoutButton>
      </ButtonsWrapper>
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
  @media (max-width: ${MOBILE_WIDTH}px) {
    font-size: 2rem;
  }
`;
const ButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;
const UserInfo = styled.div`
  flex-shrink: 0;
  @media (max-width: ${MOBILE_WIDTH}px) {
    width: fit-content;

    > span {
      display: none;
    }
  }
`;

const LogoutButton = styled.button`
  height: 2.5rem;
  flex-shrink: 0;
`;

const ViewMode = styled.button`
  height: 2.5rem;
`;
