import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usersDataService } from "../services/usersDBService";

export default function useLogin() {
  const [userTokenState, setUserTokenState] = useState(localStorage.getItem("userToken"));
  const [userName, setUserName] = useState(localStorage.getItem("userName"));

  const login = (id: string, pw: string) => {
    if (!id || !pw) return;
    usersDataService
      .post("login", { email: id, password: pw })
      .then((response) => {
        localStorage.setItem("userToken", response.data.token);
        localStorage.setItem("userName", id.split("@")[0]);
        setUserTokenState(localStorage.getItem("userToken"));
        setUserName(localStorage.getItem("userName"));
      })
      .catch((error) => window.alert(error.response.data.details));
  };

  const logout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userName");
    setUserTokenState(localStorage.getItem("userToken"));
    setUserName(localStorage.getItem("userName"));
  };

  const signUp = async (id: string, pw: string) => {
    if (!id || !pw) return false;
    const confirmingPassword = window.prompt("비밀번호를 한번 더 입력해주세요.");
    if (pw !== confirmingPassword) {
      window.alert("다시 입력하신 비밀번호가 맞지 않습니다.");
      return false;
    }
    let isSignUpSuccessful: boolean = false;
    await usersDataService
      .post("create", { email: id, password: pw })
      .then((response) => {
        console.log(response);
        window.alert(response.data.message);
        isSignUpSuccessful = true;
      })
      .catch((error) => {
        window.alert(error.response.data.details);
        isSignUpSuccessful = false;
      });
    return isSignUpSuccessful;
  };

  return { userTokenState, userName, login, logout, signUp };
}
