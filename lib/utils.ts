import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Safely converts a rating value to a number
 * Handles string, null, undefined, and NaN cases
 * @param rating - The rating value to convert
 * @returns A valid number between 0 and 5, or 0 if invalid
 */
export function safeRating(rating: any): number {
  const num = typeof rating === 'string' ? parseFloat(rating) : rating;
  if (isNaN(num) || num === null || num === undefined) {
    return 0;
  }
  // Clamp between 0 and 5
  return Math.max(0, Math.min(5, num));
}

/**
 * Formats a rating for display
 * @param rating - The rating value
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted rating string or "Baru" if rating is 0
 */
export function formatRating(rating: any, decimals: number = 1): string {
  const safeNum = safeRating(rating);
  return safeNum > 0 ? safeNum.toFixed(decimals) : "Baru";
}
