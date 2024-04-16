import type { Line, Point } from "../../../../lib";

export class CanvasUtils {
  static beginDrawLine(canvas: HTMLCanvasElement, startPoint: Point) {
    const context = canvas.getContext("2d");
    if (context) {
      context.beginPath();
      context.moveTo(startPoint.x, startPoint.y);
    }
  }
  static drawLine(canvas: HTMLCanvasElement, line: Line) {
    const context = canvas.getContext("2d");
    if (context) {
      for (const point of line) {
        context.lineTo(point.x, point.y);
        context.stroke();
      }
    }
  }
  static clear(canvas: HTMLCanvasElement) {
    const context = canvas.getContext("2d");
    if (context) context.clearRect(0, 0, canvas.width, canvas.height);
  }
}
