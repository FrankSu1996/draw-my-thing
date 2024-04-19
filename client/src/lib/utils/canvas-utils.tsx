import type { Line, Point } from "../../../../lib";

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

  static getImageData(canvas: HTMLCanvasElement): ImageData | undefined {
    const context = getCanvasContext(canvas);
    if (context) return context.getImageData(0, 0, context.canvas.width, context.canvas.height);
  }

  static putImageData(canvas: HTMLCanvasElement, imageData: ImageData) {
    const context = getCanvasContext(canvas);
    if (context) context.putImageData(imageData, 0, 0);
  }
}