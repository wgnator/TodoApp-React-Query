import styled from "styled-components";
import { GoTriangleDown } from "react-icons/go";
import { ReactElement, RefObject, useRef, useState } from "react";
import { theme } from "../styles/theme";
import useDetectOutsideClick from "../hooks/useDetectOutsideClick";

export default function SelectBox({ children }: { children: ReactElement[] }) {
  const [isSelecting, setIsSelecting] = useState(false);
  const containerRef = useRef<HTMLDivElement>();

  useDetectOutsideClick([containerRef], () => setIsSelecting(false));

  return (
    <Container
      ref={containerRef as RefObject<HTMLDivElement>}
      onClick={(event) => {
        event.stopPropagation();
        setIsSelecting(!isSelecting);
      }}
    >
      {isSelecting ? (
        <OptionsWrapper>{children}</OptionsWrapper>
      ) : (
        <SelectedOption>
          {children.find((child) => child.props.selected)?.props.children}
        </SelectedOption>
      )}

      <TriangleDown />
    </Container>
  );
}

export const Container = styled.div`
  border: 3px white solid;
  height: 3rem;
  border-radius: 8px;
  width: 10rem;
  padding: 0.3rem 0.3rem;
  display: flex;
  align-items: center;
  cursor: pointer;
`;
const SelectedOption = styled.div`
  width: calc(100% - 1.3rem);
  display: flex;
  justify-content: center;
  align-items: center;
`;
const OptionsWrapper = styled.div`
  z-index: 1;
  position: absolute;
  top: -3px;
  left: -3px;
  padding: 0.5rem 0;
  border: 3px white solid;
  border-radius: 8px;
  width: 100%;
  box-sizing: content-box;
  background-color: ${theme.backgroundColor};
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  outline: none;

  * {
    height: 2rem;
    width: 100%;
    background-color: ${theme.backgroundColor};
    z-index: 5;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
      color: ${theme.primaryColor};
    }
  }
`;
const TriangleDown = styled(GoTriangleDown)`
  position: absolute;
  right: 0.3rem;
  width: 1rem;
  height: 1rem;
  font-size: 0.6rem;
  * {
    color: white;
  }
`;
