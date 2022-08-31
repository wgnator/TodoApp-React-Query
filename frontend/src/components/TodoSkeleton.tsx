import styled from "styled-components";
import { Container as TodoStyle } from "../components/Todo";

export default function TodoSkeleton({ numOfItems }: { numOfItems: number }) {
  return (
    <>
      {new Array(numOfItems).fill(0).map((_, index) => (
        <Skeleton key={index}>
          <SkeletonTextTitle />
          <SkeletonTextInfo />
        </Skeleton>
      ))}
    </>
  );
}

const Skeleton = styled(TodoStyle)`
  height: 5rem;
  gap: 0.5rem;
`;

const SkeletonTextTitle = styled.div`
  width: 100%;
  height: 2.5rem;
  animation: skeleton-gradient 1s infinite;
`;
const SkeletonTextInfo = styled.div`
  width: 30%;
  height: 1rem;
  align-self: flex-end;
  animation: skeleton-gradient 1s infinite;
`;
