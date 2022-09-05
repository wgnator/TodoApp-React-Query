import styled from "styled-components";
import { theme } from "../styles/theme";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import { ReactNode, useState } from "react";
import { TermDictionary } from "../hooks/useSortTodo";

export default function TermSection({
  children,
  termText,
}: {
  children: ReactNode | ReactNode[];
  termText: typeof TermDictionary[keyof typeof TermDictionary]["korean"];
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <TermSectionContainer
      onClick={(event) => {
        event.stopPropagation();
        setIsExpanded(!isExpanded);
      }}
    >
      <TermText>{termText}</TermText>
      {isExpanded && children}
      <ExpandIcon>{isExpanded ? <MdExpandLess /> : <MdExpandMore />}</ExpandIcon>
    </TermSectionContainer>
  );
}

const TermSectionContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
`;
const ExpandIcon = styled.div`
  position: absolute;
  right: 0;
`;
const TermText = styled.div`
  border-bottom: 1px ${theme.primaryColor} solid;
`;
