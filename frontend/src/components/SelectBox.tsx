import styled from "styled-components";
import { GoTriangleDown } from "react-icons/go";
import { ReactElement, RefObject, useRef, useState } from "react";
import { theme } from "../styles/theme";
import useDetectOutsideClick from "../hooks/useDetectOutsideClick";
import { MOBILE_WIDTH } from "../consts/consts";

export default function SelectBox({
  children,
  icon,
}: {
  children: ReactElement[];
  icon?: ReactElement;
}) {
  const [isSelecting, setIsSelecting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useDetectOutsideClick([containerRef], () => setIsSelecting(false));

  return (
    <Container
      ref={containerRef as RefObject<HTMLDivElement>}
      onClick={(event) => {
        event.stopPropagation();
        setIsSelecting(!isSelecting);
      }}
    >
      {icon && <Icon>{icon}</Icon>}
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
  position: relative;
  border: 2px white solid;
  height: 3rem;
  border-radius: 8px;
  width: 10rem;
  padding: 0.3rem 0.3rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;

  * {
    word-break: keep-all;
  }
`;
const SelectedOption = styled.div`
  width: calc(100% - 1.3rem);
  display: flex;
  justify-content: center;
  align-items: center;
  @media (max-width: ${MOBILE_WIDTH}px) {
    width: 100%;
  }
`;
const OptionsWrapper = styled.div`
  z-index: 1;
  position: absolute;
  top: -3px;
  left: -3px;
  padding: 0.5rem 0;
  border: 2px white solid;
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
export const TriangleDown = styled(GoTriangleDown)`
  right: 0.3rem;
  width: 1rem;
  height: 1rem;
  font-size: 0.6rem;
  * {
    color: white;
  }
  /* @media (max-width: ${MOBILE_WIDTH}px) {
    display: none;
  } */
`;

const Icon = styled.div`
  width: 10%;
`;
