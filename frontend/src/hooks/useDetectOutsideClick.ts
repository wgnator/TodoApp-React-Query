import React, { useEffect, useRef } from "react";

export default function useDetectOutsideClick(
  targetElements: React.RefObject<HTMLElement>[],
  callback: () => void
) {
  const listener = useRef((event: MouseEvent) => {});

  useEffect(() => {
    const hasClickedOutsideElement = (event: MouseEvent, targetElement: HTMLElement | null) => {
      return !!(targetElement && !targetElement.contains(<Node>event?.target));
    };
    listener.current = (event: MouseEvent) => {
      const hasClickedOutsideAllElements = targetElements.every((ref) =>
        hasClickedOutsideElement(event, ref.current)
      );
      if (hasClickedOutsideAllElements) {
        console.log('has clicked outside:', targetElements)
        callback();
      }
    };
    window.addEventListener("click", listener.current, true);
    return () => {
      window.removeEventListener("click", listener.current, true);
    };
  }, []);
}
