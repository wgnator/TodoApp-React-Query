import styled from "styled-components";

export default function LoadingSpinner({
  color,
  backgroundColor,
}: {
  color: string;
  backgroundColor: string;
}) {
  return (
    <Container backgroundColor={backgroundColor}>
      <MainCircle color={color}>
        <Triangle backgroundColor={backgroundColor} />
      </MainCircle>
    </Container>
  );
}

const Container = styled.div<{ backgroundColor: string }>`
  width: 6rem;
  height: 6rem;
  transform: scale(0.5);
  transform-origin: top;
  background-color: ${(props) => props.backgroundColor};
  display: flex;
  justify-content: center;
  align-items: center;
`;
const MainCircle = styled.div<{ color: string }>`
  width: 4rem;
  height: 4rem;
  position: relative;
  border: 10px solid ${(props) => props.color};
  box-sizing: border-box;
  border-radius: 50%;
  animation: 0.8s infinite linear rotate;

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const Triangle = styled.div<{ backgroundColor: string }>`
  width: 0;
  height: 0;
  left: -10px;
  top: -10px;
  border-top: 2rem solid ${(props) => props.backgroundColor};
  border-left: 2rem solid transparent;
  border-right: 2rem solid transparent;
  position: absolute;

  /* transform: rotate(45deg) skew(0deg, 349deg); */
`;
