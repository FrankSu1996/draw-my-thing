import type { Line, Point } from "../../../../lib";
import type { Color } from "../config";

const canvasOptions: CanvasRenderingContext2DSettings = {
  willReadFrequently: true,
};

export const getCanvasContext = (canvas: HTMLCanvasElement) => {
  return canvas.getContext("2d", canvasOptions);
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
        context.drawImage(image, 0, 0);
      };
    }
  }
  static changeColor(canvas: HTMLCanvasElement, color: Color) {
    const context = getCanvasContext(canvas);
    if (context) context.strokeStyle = color;
  }
  static changeDrawMode(canvas: HTMLCanvasElement, isErasing: boolean) {
    const context = getCanvasContext(canvas);
    if (context) context.globalCompositeOperation = isErasing ? "destination-out" : "source-over";
  }
}
