import { ComponentProps } from "react";
import styled from "styled-components";

export default function Button(props: ComponentProps<any>) {
  return <Container {...props} />;
}

const Container = styled.button`
  color: white;
  width: 10rem;
  height: 2rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
  }
`;
