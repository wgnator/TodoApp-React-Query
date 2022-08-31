import React, { Children, ReactElement } from "react";
import styled from "styled-components";
import { theme } from "../styles/theme";
import Button from "./Button";

type AlertDialogPropType = {
  isCancelable?: boolean;
  children: any;
  onConfirm: (hasConfirmed: boolean) => void;
};
export default function AlertDialog({ isCancelable, children, onConfirm }: AlertDialogPropType) {
  return (
    <Veil>
      <Container>
        <Message>{children}</Message>
        <ButtonsWrapper>
          <ConfirmButton onClick={() => onConfirm(true)}>확인</ConfirmButton>
          {isCancelable && <ConfirmButton onClick={() => onConfirm(false)}>취소</ConfirmButton>}
        </ButtonsWrapper>
      </Container>
    </Veil>
  );
}

const Veil = styled.div`
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 10;
  position: fixed;
  background-color: rgba(0, 0, 0, 0.4);
`;
const Container = styled.div`
  width: 25rem;
  height: 10rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  background-color: ${theme.backgroundColor};
  border: 1px solid white;
  border-radius: 10px;
  position: absolute;
  left: calc((100vw - 25rem) / 2);
  top: calc((100vh - 10rem) / 2);
`;
const Message = styled.h4``;

const ButtonsWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
`;
const ConfirmButton = styled(Button)``;
