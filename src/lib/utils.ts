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
  if (!name) return "";
  const assistant = dataSet?.find((data) => data?.name === name);
  return assistant?.level ?? "";
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

export function formatDateString(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    // timeZoneName: 'short',
  };

  const formattedDate = new Date(dateString).toLocaleString("en-US", options);
  return formattedDate;
}

export const assistantAlertText = [
  "Cooking up a response...",
  "Brewing up some knowledge...",
  "Baking your answer...",
  "Loading the wisdom..",
  "Whipping up a solution...",
  "Summoning the data spirits...",
  "Crafting your answer...",
];

export function getRandomStringFromArray(strings: string[]): string {
  const randomIndex = Math.floor(Math.random() * strings.length);
  return strings[randomIndex];
}
