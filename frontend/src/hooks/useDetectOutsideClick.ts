import React, { useEffect } from "react";

export default function useDetectOutsideClick(targetElements: React.MutableRefObject<HTMLElement | undefined>[], callback: () => void) {
  useEffect(() => {
    console.log(targetElements);
    const hasClickedOutsideElement = (event: MouseEvent, targetElement: HTMLElement | undefined) => {
      return !!(targetElement && !targetElement.contains(<Node>event?.target));
    };
    const clickedOutsideElementListener = (event: MouseEvent) => {
      const hasClickedOutsideAllElements = targetElements.map((ref) => hasClickedOutsideElement(event, ref.current)).includes(false) ? false : true;
      if (hasClickedOutsideAllElements) callback();
    };
    window.addEventListener("click", clickedOutsideElementListener);
    return () => window.removeEventListener("click", clickedOutsideElementListener);
  }, []);
}
