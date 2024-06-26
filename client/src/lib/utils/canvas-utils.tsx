import type { Line, Point } from "../../../../lib";
import type { BrushSize, Color } from "../config";

export const getCanvasContext = (canvas: HTMLCanvasElement) => {
  const context = canvas.getContext("2d");
  return context;
};

export type CanvasConfig = {
  isErasing: boolean;
  drawColor: Color;
  lineWidth: number;
};

export class CanvasUtils {
  static beginDrawLine(canvas: HTMLCanvasElement, startPoint: Point) {
    const context = getCanvasContext(canvas);
    if (context) {
      context.beginPath();
      context.moveTo(startPoint.x, startPoint.y);
    }
  }
  static drawLine(canvas: HTMLCanvasElement, line: Line) {
    const context = getCanvasContext(canvas);
    if (context) {
      for (const point of line) {
        context.lineTo(point.x, point.y);
        context.stroke();
      }
    }
  }
  static clear(canvas: HTMLCanvasElement) {
    const context = getCanvasContext(canvas);
    if (context) context.clearRect(0, 0, canvas.width, canvas.height);
  }
  static getImageUrl(canvas: HTMLCanvasElement) {
    return canvas.toDataURL();
  }
  static drawFromImageUrl(canvas: HTMLCanvasElement, imageUrl: string) {
    const context = canvas.getContext("2d");
    if (context) {
      const image = new Image();
      image.src = imageUrl;
      image.onload = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
      };
    }
  }
  static changeColor(canvas: HTMLCanvasElement, color: Color) {
    const context = getCanvasContext(canvas);
    if (context) context.strokeStyle = color;
  }
  static changeDrawMode(canvas: HTMLCanvasElement, isErasing: boolean) {
    const context = getCanvasContext(canvas);
    if (context && isErasing) {
      context.strokeStyle = "rgba(241, 245, 249)";
    }
  }
  static changeBrushSize(canvas: HTMLCanvasElement, brushSize: BrushSize) {
    const context = getCanvasContext(canvas);
    if (context) {
      const radius = getCanvasLineWidth(brushSize);
      context.lineWidth = radius;
    }
  }

  static configureCanvas(canvas: HTMLCanvasElement, config: CanvasConfig) {
    const context = getCanvasContext(canvas);
    if (context) {
      const { drawColor, isErasing, lineWidth } = config;
      context.lineWidth = lineWidth;
      if (isErasing) {
        context.strokeStyle = "rgba(241, 245, 249)";
      } else context.strokeStyle = drawColor;
    }
  }
}

export const getCanvasCursorRadius = (brushSize: BrushSize) => {
  let radius = 0;
  switch (brushSize) {
    case "small": {
      radius = 2;
      break;
    }
    case "medium":
      radius = 4;
      break;
    case "large":
      radius = 8;
      break;
    case "x-large":
      radius = 14;
      break;
    default:
      break;
  }
  return radius;
};

export const getCanvasLineWidth = (brushSize: BrushSize) => {
  let radius = 0;
  switch (brushSize) {
    case "small": {
      radius = 2;
      break;
    }
    case "medium":
      radius = 5;
      break;
    case "large":
      radius = 12;
      break;
    case "x-large":
      radius = 18;
      break;
    default:
      break;
  }
  return radius;
};
