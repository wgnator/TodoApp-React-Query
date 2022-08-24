import { AxiosResponse } from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import AlertDialog from "../components/AlertDialog";
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
  const progressSignUp = useRef<ReturnType<typeof signUp>>();
  const [alertMessage, setAlertMessage] = useState("");
  const [pwConfirmationModalState, setPwConfirmationModalState] = useState({ isShowing: false, password: "" });

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
        <Title>ToDo App</Title>
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
              // disabled={!isUserInputValid.id || !isUserInputValid.pw}
              onClick={async () => {
                progressSignUp.current = signUp({ id: user.id, pw: user.pw });

                if (!progressSignUp.current.next().value) setAlertMessage("아이디와 비밀번호를 양식에 맞게 입력해 주세요.");
                else setPwConfirmationModalState({ isShowing: true, password: "" });
              }}
            >
              회원가입
            </Button>
            <Button
              // disabled={!isUserInputValid.id || !isUserInputValid.pw}
              onClick={() => login(user.id, user.pw).catch((error: Error & { response: { data: { details: string } } }) => setAlertMessage(error.response.data.details))}
            >
              로그인
            </Button>
          </ButtonsContainer>
        </Form>
      </LoginBox>
      {alertMessage && <AlertDialog onConfirm={(hasConfirmed) => hasConfirmed && setAlertMessage("")}>{alertMessage}</AlertDialog>}
      {pwConfirmationModalState.isShowing && (
        <PasswordConfirmaiton
          onConfirm={(hasConfirmed) => {
            if (hasConfirmed) {
              progressSignUp.current.next("hey");
              progressSignUp.current
                .next(pwConfirmationModalState.password)
                .value.then((response: AxiosResponse) => {
                  setAlertMessage(response.data.message);
                })
                .then(() => clearForm())
                .catch((error: Error & { response: { data: { details: string } } }) => {
                  setAlertMessage(error.message);
                });
              setPwConfirmationModalState({ ...pwConfirmationModalState, isShowing: false });
            }
          }}
        >
          <div>비밀번호 재입력:</div>
          <input onChange={(event) => setPwConfirmationModalState({ ...pwConfirmationModalState, password: event.target.value })} />
        </PasswordConfirmaiton>
      )}
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
  margin-top: 0.3rem;
  font-size: 0.7rem;
  text-align: end;
  color: #ff6262;
`;

const ButtonsContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
`;
const Button = styled.button`
  opacity: ${(props) => (props.disabled ? "0.5" : "1")};
`;
const PasswordConfirmaiton = styled(AlertDialog)``;
