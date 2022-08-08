import { useContext } from "react";
import styled from "styled-components";
import { AuthState } from "../contexts/AuthContext";

export default function NavBar() {
  const { userName, logout } = useContext(AuthState);
  return (
    <Container>
      <Title>ToDo App</Title>
      <UserInfo>{userName} 님, 안녕하세요!</UserInfo>
      <LogoutButton onClick={() => logout()}>로그아웃</LogoutButton>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 4rem;
  padding: 0 0.5rem;
  background-color: #4633aa;
  display: flex;
  justify-content: space-around;
  align-items: center;
  > * {
    margin: 0 0.5rem;
  }
`;

const Title = styled.h1`
  width: 70%;
`;

const UserInfo = styled.div`
  flex-shrink: 0;
`;

const LogoutButton = styled.button`
  height: 2.5rem;
  flex-shrink: 0;
`;
