import React, { useEffect } from "react";

export default function useDetectOutsideClick(
  targetElements: React.RefObject<HTMLElement>[],
  callback: () => void
) {
  useEffect(() => {
    const hasClickedOutsideElement = (event: MouseEvent, targetElement: HTMLElement | null) => {
      return !!(targetElement && !targetElement.contains(<Node>event?.target));
    };
    const clickedOutsideElementListener = (event: MouseEvent) => {
      const hasClickedOutsideAllElements = targetElements
        .map((ref) => hasClickedOutsideElement(event, ref.current))
        .includes(false)
        ? false
        : true;
      if (hasClickedOutsideAllElements) callback();
    };
    window.addEventListener("click", clickedOutsideElementListener);
    return () => {
      window.removeEventListener("click", clickedOutsideElementListener);
    };
  }, []);
}
