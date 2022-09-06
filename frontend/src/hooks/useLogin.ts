import { AxiosResponse } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usersDataService } from "../services/usersDBService";

export const getItemFromStorage = (key: string) =>
  localStorage.getItem(key) || sessionStorage.getItem(key);

const removeItemFromStorage = (key: string) => {
  localStorage.removeItem(key);
  sessionStorage.removeItem(key);
};

export default function useLogin() {
  const [userTokenState, setUserTokenState] = useState(getItemFromStorage("userToken"));
  const [userName, setUserName] = useState(getItemFromStorage("userName"));
  const login = ({
    id,
    pw,
    persistLogin,
  }: {
    id: string;
    pw: string;
    persistLogin: boolean;
  }): Promise<void | AxiosResponse | Error> => {
    const storage = persistLogin ? localStorage : sessionStorage;
    if (!id || !pw)
      return new Promise(() => new Error("아이디 또는 패스워드 입력이 잘못되었습니다."));
    else
      return usersDataService
        .post("login", { email: id, password: pw })
        .then((response) => {
          storage.setItem("userToken", response.data.token);
          storage.setItem("userName", id.split("@")[0]);
          setUserTokenState(storage.getItem("userToken"));
          setUserName(storage.getItem("userName"));
        })
        .catch((error) => {
          throw new Error(error?.response?.data?.details || error.message);
        });
  };

  const logout = (): void => {
    removeItemFromStorage("userToken");
    removeItemFromStorage("userName");
    setUserTokenState(getItemFromStorage("userToken"));
    setUserName(getItemFromStorage("userName"));
  };

  function* signUp(
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

    return usersDataService.post("create", { email: id, password: pw }).catch((error) => {
      console.log("error caught", error);
      throw new Error(error?.response?.data?.details || error.message);
    });
  }

  return { userTokenState, userName, login, logout, signUp };
}
