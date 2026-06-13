import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge Tailwind class names with conditional logic. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/** Format a number in French locale (narrow spaces as thousand separators). */
export function fmt(n: number): string {
  return n.toLocaleString('fr-FR')
}
