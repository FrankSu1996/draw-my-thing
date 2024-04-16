import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Line, Point } from "../../../../lib";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
