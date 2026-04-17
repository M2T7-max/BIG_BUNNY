import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function getDifficultyColor(difficulty: string): string {
  switch (difficulty.toLowerCase()) {
    case "easy": return "text-green-400";
    case "medium": return "text-yellow-400";
    case "hard": return "text-orange-400";
    case "insane": return "text-red-400";
    case "expert": return "text-red-400";
    default: return "text-gray-400";
  }
}

export function getDifficultyBadge(difficulty: string): string {
  switch (difficulty.toLowerCase()) {
    case "easy": return "badge-easy";
    case "medium": return "badge-medium";
    case "hard": return "badge-hard";
    case "insane": return "badge-insane";
    case "expert": return "badge-insane";
    default: return "bg-gray-500/10 text-gray-400 border border-gray-500/20";
  }
}

export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    web: "🌐",
    network: "🔌",
    binary: "💾",
    crypto: "🔐",
    forensics: "🔍",
    recon: "🔭",
    exploitation: "💥",
    "post-exploitation": "🏴",
    osint: "👁️",
    wireless: "📡",
    password: "🔑",
    misc: "⚡",
  };
  return icons[category.toLowerCase()] || "📦";
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.substring(0, length) + "...";
}

export function getTimeAgo(date: string): string {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
}
