import React, { RefObject } from "react";

const options = {
  root: null,
  rootMargin: "0px",
  threshold: 0,
};

export default function useIntersectionObserver(
  ref: RefObject<HTMLElement>,
  callback: () => void,
  dependencies: any[] = []
) {
  const onIntersection = (
    entries: IntersectionObserverEntry[],
    _observer: IntersectionObserver
  ) => {
    if (entries[0].isIntersecting) {
      callback();
    }
  };

  React.useEffect(() => {
    const observer = new IntersectionObserver(onIntersection, options);
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, dependencies);
}
