import { AxiosResponse } from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Location, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import AlertDialog from "../components/AlertDialog";
import { useAuthContext } from "../contexts/AuthContext";
import { checkIsValidFormatEmail, checkIsValidFormatPassword } from "../utils/loginUtils";

const INVALID_MESSAGE = {
  id: "유효하지 않은 형식입니다. (예: abc@abc.abc)",
  pw: "유효하지 않은 형식입니다. (8자 이상)",
};

const initialUserState = { id: "", pw: "", persistLogin: false };

function LoginPage() {
  const [user, setUser] = useState(initialUserState);
  const [isUserInputValid, setIsUserInputValid] = useState({
    id: false,
    pw: false,
  });
  const { login, signUp } = useAuthContext();
  const progressSignUp = useRef<ReturnType<typeof signUp>>();
  const [alertMessage, setAlertMessage] = useState("");
  const [pwConfirmationModalState, setPwConfirmationModalState] = useState({
    isShowing: false,
    password: "",
  });
  const navigate = useNavigate();
  const location: Location & { state: any } = useLocation();
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    setIsUserInputValid({
      id: checkIsValidFormatEmail(user.id),
      pw: checkIsValidFormatPassword(user.pw),
    });
  }, [user]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const handleOnChangeKeepMeLoggedIn = (event: React.ChangeEvent<HTMLInputElement>) =>
    setUser({ ...user, persistLogin: event.target.checked });

  const clearForm = () => setUser(initialUserState);

  const onClickSignUp = () => {
    progressSignUp.current = signUp({ id: user.id, pw: user.pw });
    if (!progressSignUp.current.next().value)
      setAlertMessage("아이디와 비밀번호를 양식에 맞게 입력해 주세요.");
    else setPwConfirmationModalState({ isShowing: true, password: "" });
  };

  const onClickLogin = () =>
    login(user)
      .then(() => navigate(from, { replace: true }))
      .catch((error: Error) => setAlertMessage(error.message));

  const onPasswordConfirm = (hasConfirmed: boolean) => {
    if (hasConfirmed) {
      progressSignUp?.current?.next();
      progressSignUp?.current
        ?.next(pwConfirmationModalState.password)
        .value.then((response: AxiosResponse) => {
          setAlertMessage(response.data.message);
        })
        .then(() => clearForm())
        .catch((error: Error) => {
          setAlertMessage(error.message);
        });
      setPwConfirmationModalState({ ...pwConfirmationModalState, isShowing: false });
    }
  };

  const handleOnChangePWConfirmationModal = (event: React.ChangeEvent<HTMLInputElement>) =>
    setPwConfirmationModalState({
      ...pwConfirmationModalState,
      password: event.target.value,
    });

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
            <Input
              type="text"
              name="id"
              isValid={isUserInputValid.id}
              value={user.id}
              placeholder="아이디"
              onChange={handleInputChange}
            />
            {user.id && !isUserInputValid.id && (
              <InvalidMessage>{INVALID_MESSAGE.id}</InvalidMessage>
            )}
          </InputContainer>
          <InputContainer>
            <Input
              type="password"
              name="pw"
              isValid={isUserInputValid.pw}
              value={user.pw}
              placeholder="비밀번호"
              onChange={handleInputChange}
            />
            {user.pw && !isUserInputValid.pw && (
              <InvalidMessage>{INVALID_MESSAGE.pw}</InvalidMessage>
            )}
          </InputContainer>
          <KeepMeLoggedIn>
            <label htmlFor="keep_me_logged_in">로그인 상태 유지</label>
            <input
              type="checkbox"
              id="keep_me_logged_in"
              checked={user.persistLogin}
              onChange={handleOnChangeKeepMeLoggedIn}
            />
          </KeepMeLoggedIn>
          <ButtonsContainer>
            <SignUpButton
              disabled={!isUserInputValid.id || !isUserInputValid.pw}
              onClick={onClickSignUp}
            >
              회원가입
            </SignUpButton>
            <LoginButton
              disabled={!isUserInputValid.id || !isUserInputValid.pw}
              onClick={onClickLogin}
            >
              로그인
            </LoginButton>
          </ButtonsContainer>
        </Form>
      </LoginBox>
      {alertMessage && (
        <AlertDialog onConfirm={(hasConfirmed) => hasConfirmed && setAlertMessage("")}>
          {alertMessage}
        </AlertDialog>
      )}
      {pwConfirmationModalState.isShowing && (
        <PasswordConfirmaiton onConfirm={onPasswordConfirm}>
          <div>비밀번호 재입력:</div>
          <input type="password" onChange={handleOnChangePWConfirmationModal} />
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
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const Form = styled.form`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  width: 100%;
`;
const Title = styled.h1``;
const InputContainer = styled.div`
  width: 100%;
  height: 3rem;
`;
const Input = styled.input<{ isValid: boolean }>`
  width: 100%;
  height: 60%;
  &:focus {
    border: ${(props) => !props.isValid && "red 1px solid"};
    outline: none;
  }
`;
const KeepMeLoggedIn = styled.div`
  margin-bottom: 1rem;
  align-self: flex-end;
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
  width: 47%;
  opacity: ${(props) => (props.disabled ? "0.5" : "1")};
`;

const SignUpButton = styled(Button)``;
const LoginButton = styled(Button)``;
const PasswordConfirmaiton = styled(AlertDialog)``;
