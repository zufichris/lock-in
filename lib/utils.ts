import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const SITE_URL = typeof window !== 'undefined' ? window.location.origin : "https://lock-in-pink.vercel.app/";