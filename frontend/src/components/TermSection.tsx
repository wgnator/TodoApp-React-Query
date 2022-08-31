import styled from "styled-components";
import { theme } from "../styles/theme";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import { ReactNode, useState } from "react";
import { TermDictionary } from "../consts/consts";

export default function TermSection({
  children,
  termText,
}: {
  children: ReactNode | ReactNode[];
  termText: keyof typeof TermDictionary;
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <TermSectionContainer>
      <TermText>{termText}</TermText>
      {isExpanded && children}
      <ExpandIcon onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? <MdExpandLess /> : <MdExpandMore />}
      </ExpandIcon>
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
