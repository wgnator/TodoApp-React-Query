import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { AuthState } from "../contexts/AuthContext";
import { checkIsValidFormatEmail, checkIsValidFormatPassword } from "../utils/loginUtils";

const INVALID_MESSAGE = {
  id: "유효하지 않은 형식입니다. (예: abc@abc.abc)",
  pw: "유효하지 않은 형식입니다. (8자 이상)",
};

function LoginPage() {
  const [user, setUser] = useState({ id: "", pw: "" });
  const [isUserInputValid, setIsUserInputValid] = useState({
    id: false,
    pw: false,
  });
  const { login, signUp } = useContext(AuthState);

  useEffect(() => {
    setIsUserInputValid({ id: checkIsValidFormatEmail(user.id), pw: checkIsValidFormatPassword(user.pw) });
  }, [user]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const clearForm = () => {
    setUser({ id: "", pw: "" });
  };
  return (
    <Container>
      <LoginBox>
        <Title>ToDos App</Title>
        <Form
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <InputContainer>
            <Input type="text" name="id" isValid={isUserInputValid.id} value={user.id} placeholder="아이디" onChange={handleInputChange} />
            {user.id && !isUserInputValid.id && <InvalidMessage>{INVALID_MESSAGE.id}</InvalidMessage>}
          </InputContainer>
          <InputContainer>
            <Input type="password" name="pw" isValid={isUserInputValid.pw} value={user.pw} placeholder="비밀번호" onChange={handleInputChange} />
            {user.pw && !isUserInputValid.pw && <InvalidMessage>{INVALID_MESSAGE.pw}</InvalidMessage>}
          </InputContainer>

          <ButtonsContainer>
            <Button
              isActive={isUserInputValid.id && isUserInputValid.pw}
              onClick={() => {
                signUp(user.id, user.pw).then((response: boolean) => response && clearForm());
              }}
            >
              회원가입
            </Button>
            <Button isActive={isUserInputValid.id && isUserInputValid.pw} onClick={() => login(user.id, user.pw)}>
              로그인
            </Button>
          </ButtonsContainer>
        </Form>
      </LoginBox>
    </Container>
  );
}

export default LoginPage;

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoginBox = styled.div`
  width: 300px;
  border: white 1px solid;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  > * {
    margin: 1rem;
  }
`;
const Form = styled.form`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  > * {
    margin: 1rem;
  }
`;
const Title = styled.h1``;
const InputContainer = styled.div`
  margin: 0.5rem 0;
  width: 80%;
  height: 2rem;
`;
const Input = styled.input<{ isValid: boolean }>`
  width: 100%;
  height: 70%;
  &:focus {
    border: ${(props) => !props.isValid && "red 1px solid"};
    outline: none;
  }
`;
const InvalidMessage = styled.div`
  height: 30%;
  font-size: 0.7rem;
  text-align: end;
  color: #ff6262;
`;

const ButtonsContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
`;
const Button = styled.button<{ isActive: boolean }>`
  pointer-events: ${(props) => (props.isActive ? "all" : "none")};
  opacity: ${(props) => (props.isActive ? "1" : "0.5")};
`;
