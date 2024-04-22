import { selectBrushSize, selectDrawColor } from "@/redux/gameSlice";
import { useMemo } from "react";
import { useSelector } from "react-redux";

export const useCanvasCursor = () => {
  const brushSize = useSelector(selectBrushSize);
  const drawColor = useSelector(selectDrawColor);

  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="${drawColor}" /></svg>`;

  const cursorUrl = useMemo(() => {
    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    return URL.createObjectURL(blob);
  }, [svgContent]);

  return { cursorUrl, hotspotRadius: 50 };
};
