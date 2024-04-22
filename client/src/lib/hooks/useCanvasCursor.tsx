import { selectBrushSize, selectDrawColor, selectIsErasing } from "@/redux/gameSlice";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import type { BrushSize } from "../config";
import { getCanvasCursorRadius } from "../utils/canvas-utils";

export const useCanvasCursor = () => {
  const brushSize = useSelector(selectBrushSize);
  const radius = getCanvasCursorRadius(brushSize);
  const drawColor = useSelector(selectDrawColor);
  const borderWidth = 3; // Define the border width, you can adjust it
  const isErasing = useSelector(selectIsErasing);
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${radius * 2 + borderWidth * 2}" height="${
    radius * 2 + borderWidth * 2
  }"><circle cx="${radius + borderWidth}" cy="${radius + borderWidth}" r="${radius}" fill="${
    isErasing ? "white" : drawColor
  }" stroke="black" stroke-width="${borderWidth}" /></svg>`;

  const cursorUrl = useMemo(() => {
    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    return URL.createObjectURL(blob);
  }, [svgContent]);

  return { cursorUrl, hotspotRadius: radius };
};
