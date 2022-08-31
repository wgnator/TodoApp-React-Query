import { AxiosResponse } from "axios";
import { useState } from "react";
import { usersDataService } from "../services/usersDBService";

export default function useLogin() {
  const [userTokenState, setUserTokenState] = useState(localStorage.getItem("userToken"));
  const [userName, setUserName] = useState(localStorage.getItem("userName"));

  const login = (id: string, pw: string): Promise<void | AxiosResponse | Error> => {
    if (!id || !pw)
      return new Promise(() => new Error("일치하는 아이디 또는 비밀번호가 없습니다."));
    else
      return usersDataService.post("login", { email: id, password: pw }).then((response) => {
        localStorage.setItem("userToken", response.data.token);
        localStorage.setItem("userName", id.split("@")[0]);
        setUserTokenState(localStorage.getItem("userToken"));
        setUserName(localStorage.getItem("userName"));
      });
  };

  const logout = (): void => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userName");
    setUserTokenState(localStorage.getItem("userToken"));
    setUserName(localStorage.getItem("userName"));
  };

  const signUp = function* (
    args: { id: string; pw: string } | string
  ): Generator<boolean | undefined | Promise<void>> {
    const id = (typeof args === "object" && args?.id) || null;
    const pw = (typeof args === "object" && args?.pw) || null;

    yield id && pw ? true : false;
    const confirmingPassword = yield;

    if (pw !== confirmingPassword) {
      return new Promise(() => {
        throw new Error("다시 입력하신 비밀번호가 맞지 않습니다.");
      });
    }

    return usersDataService.post("create", { email: id, password: pw });
  };

  return { userTokenState, userName, login, logout, signUp };
}
