import { dataSet } from "@/modelDataset";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  } else {
    return text.substring(0, maxLength) + "...";
  }
}

export const getAssistantLevel = (name: string | undefined): string => {
  if (!name) return '';
  const assistant = dataSet?.find((data) => data?.name === name);
  return assistant?.level ?? '';
};

export function getLevelColor(level: string) {
  if (!level) return;
  if (level?.toLowerCase() === "rookie") {
    return "text-primary-black";
  } else if (level?.toLowerCase() === "whiz") {
    return "text-primary-red";
  } else if (level?.toLowerCase() === "maestro") {
    return "text-primary-blue";
  } else if (level?.toLowerCase() === "virtuoso") {
    return "text-primary-yellow";
  }
  return "text-primary-black";
}
