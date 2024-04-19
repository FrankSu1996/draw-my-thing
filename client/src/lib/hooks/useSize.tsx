import useResizeObserver from "@react-hook/resize-observer";
import { useLayoutEffect, useState } from "react";

export const useSize = (target) => {
  const [size, setSize] = useState<DOMRect | null>(null);

  useLayoutEffect(() => {
    setSize(target.current.getBoundingClientRect());
  }, [target]);

  // Where the magic happens
  useResizeObserver(target, (entry) => setSize(entry.contentRect));
  return size;
};
