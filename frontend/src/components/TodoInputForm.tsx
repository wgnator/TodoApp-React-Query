import React, { useContext, useState } from "react";
import styled from "styled-components";
import { useTodoContext } from "../contexts/TodoContext";
import { SentTodoData } from "../types/types";

type TodoInputFormPropsType = {
  prevData: SentTodoData | null;
  closeForm: () => void;
};

export default function TodoInputForm({ prevData, closeForm }: TodoInputFormPropsType) {
  const [inputValues, setInputValues] = useState<SentTodoData>(
    prevData ? prevData : { title: "", content: "" }
  );
  const { createTodoMutation } = useTodoContext();
  const handleInputValues = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInputValues({ ...inputValues, [event.target.name]: event.target.value });
  };
  return (
    <Form
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <Input
        name="title"
        value={inputValues.title}
        type="text"
        placeholder="제목 입력"
        onChange={handleInputValues}
      />
      <TextArea
        name="content"
        value={inputValues.content}
        placeholder="내용 입력"
        onChange={handleInputValues}
      />
      <SubmitButton
        onClick={() => {
          createTodoMutation.mutate(inputValues);
          closeForm();
        }}
      >
        저장
      </SubmitButton>
      <CancelButton onClick={() => closeForm()}>취소</CancelButton>
    </Form>
  );
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  padding: 0.5rem 1rem;
  gap: 0.5rem;
`;

const Input = styled.input`
  height: 2rem;
  border-radius: 8px;
  padding: 0.5rem;
`;

const TextArea = styled.textarea`
  height: 5rem;
  border-radius: 8px;
  resize: none;
  padding: 0.5rem;
`;

const SubmitButton = styled.button`
  padding: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CancelButton = styled.button`
  padding: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;
