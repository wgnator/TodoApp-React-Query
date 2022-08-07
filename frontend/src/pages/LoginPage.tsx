import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { checkIsValidFormatEmail, checkIsValidFormatPassword } from "../utils/loginUtils";

function LoginPage() {
  const [user, setUser] = useState({ id: "", pw: "" });
  const [isUserInputValid, setIsUserInputValid] = useState({
    id: false,
    pw: false,
  });
  const navigate = useNavigate();
  const loginButton = useRef(null);

  useEffect(() => {
    setIsUserInputValid({ id: checkIsValidFormatEmail(user.id), pw: checkIsValidFormatPassword(user.pw) });
  }, [user]);

  function login() {
    if (!isUserInputValid.id || !isUserInputValid.pw) return;
    fetch("userDB/users.json")
      .then((res) => res.json())
      .then((data) =>
        data.forEach((e) => {
          if (e.id === user.id && e.pw === user.pw) {
            localStorage.setItem("loggedInUser", e.userName);
            navigate("/main");
          } else window.alert("로그인 실패: 입력하신 아이디가 존재하지 않거나, 올바른 패스워드가 아닙니다.");
        })
      );
  }

  function handleInputChange(event) {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  }

  return (
    <Container>
      <LoginBox>
        <Title>ToDos App</Title>
        <Input
          type="text"
          className="id"
          name="id"
          value={user.id}
          placeholder="아이디"
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") loginButton.current?.click();
          }}
        />

        <Input
          type="password"
          className="pw"
          name="pw"
          value={user.pw}
          placeholder="비밀번호"
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") loginButton.current?.click();
          }}
        />

        <button onClick={login} className={isUserInputValid.id && isUserInputValid.pw ? "validated" : null} ref={loginButton}>
          로그인
        </button>
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

const Title = styled.h1``;
const Input = styled.input`
  margin: 0.5rem;
`;
