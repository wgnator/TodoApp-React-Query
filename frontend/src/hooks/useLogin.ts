import { AxiosResponse } from "axios";
import { useState } from "react";
import { useQueryClient } from "react-query";
import { usersDBService } from "../services/usersDBService";

const initialUserInfo = { userName: "", userId: "" };

export default function useLogin() {
  const [userToken, setUserToken] = useState("");
  const [userInfo, setUserInfo] = useState(initialUserInfo);
  const queryClient = useQueryClient();
  const login = ({
    id,
    pw,
    persistLogin,
  }: {
    id: string;
    pw: string;
    persistLogin: boolean;
  }): Promise<void | AxiosResponse | Error> => {
    if (!id || !pw) return Promise.reject(new Error("아이디 또는 패스워드 입력이 잘못되었습니다."));
    else
      return usersDBService
        .post("login", { email: id, password: pw, persistLogin })
        .then((response) => {
          if (persistLogin) localStorage.setItem("userID", id);
          setUserInfo({ userName: response.data.userName, userId: response.data.userId });
          setUserToken(response.data.token);
        });
  };

  const logout = (): void => {
    setUserToken("");
    setUserInfo(initialUserInfo);
    localStorage.removeItem("userID");
    queryClient.removeQueries("todos");
    usersDBService.get("/logout");
  };

  function* signUp(
    args: { id: string; pw: string } | string
  ): Generator<boolean | undefined | Promise<void>> {
    const id = (typeof args === "object" && args?.id) || null;
    const pw = (typeof args === "object" && args?.pw) || null;

    yield id && pw ? true : false;
    const confirmingPassword = yield;

    if (pw !== confirmingPassword) {
      return Promise.reject(new Error("다시 입력하신 비밀번호가 맞지 않습니다."));
    }

    return usersDBService.post("create", { email: id, password: pw }).catch((error) => {
      throw new Error(error.message);
    });
  }

  return { userToken, setUserToken, userInfo, login, logout, signUp };
}
