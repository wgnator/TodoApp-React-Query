import React from "react";
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
          <ConfirmButton
            onClick={(event: React.MouseEvent) => {
              event.stopPropagation();
              onConfirm(true);
            }}
          >
            확인
          </ConfirmButton>
          {isCancelable && (
            <ConfirmButton
              onClick={(event: React.MouseEvent) => {
                event.stopPropagation();
                onConfirm(false);
              }}
            >
              취소
            </ConfirmButton>
          )}
        </ButtonsWrapper>
      </Container>
    </Veil>
  );
}

const Veil = styled.div`
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 100;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.4);
`;
const Container = styled.div`
  max-width: 25rem;
  width: 80%;
  height: 10rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  background-color: ${theme.backgroundColor};
  border: 1px solid white;
  border-radius: 10px;
  margin: auto;
`;
const Message = styled.h4``;

const ButtonsWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
`;
const ConfirmButton = styled(Button)``;
