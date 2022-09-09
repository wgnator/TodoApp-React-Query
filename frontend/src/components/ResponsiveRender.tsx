import { ReactNode, useEffect, useState } from "react";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import styled from "styled-components";
import { MOBILE_WIDTH } from "../consts/consts";
import { theme } from "../styles/theme";

const VIEWPORT_TYPE = {
  DESKTOP: "DESKTOP",
  MOBILE: "MOBILE",
};

export const ResponsiveRenderer = ({ children, title }: { children: ReactNode; title: string }) => {
  const detectViewportSize = () =>
    window.innerWidth <= MOBILE_WIDTH ? VIEWPORT_TYPE.MOBILE : VIEWPORT_TYPE.DESKTOP;
  const [viewportType, setViewportType] = useState(detectViewportSize());
  useEffect(() => {
    const onWindowResize = () => setViewportType(detectViewportSize);
    window.addEventListener("resize", onWindowResize);
    return () => window.removeEventListener("resize", onWindowResize);
  }, []);

  return (
    <>
      {viewportType === VIEWPORT_TYPE.MOBILE ? (
        <Minimizer title={title}>{children}</Minimizer>
      ) : (
        children
      )}
    </>
  );
};

export const Minimizer = ({ title, children }: { title: string; children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <MinimizerHeader onClick={() => setIsOpen(!isOpen)}>
        <div>{title}</div>
        {isOpen ? <MdExpandLess /> : <MdExpandMore />}
      </MinimizerHeader>
      {isOpen && children}
    </>
  );
};

const MinimizerHeader = styled.div`
  border-bottom: 1px solid ${theme.primaryColor};
  display: flex;
  justify-content: space-between;
`;
