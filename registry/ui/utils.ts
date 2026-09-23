import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...values: ClassValue[]) { return twMerge(clsx(values)); }

// Separate feedback, travel and disclosure: a large surface should not use a
// button's press spring. beUI reference paths are in THIRD_PARTY_NOTICES.md.
export const pressSpring = { type: 'spring', stiffness: 460, damping: 32, mass: 0.6 } as const;
export const layoutSpring = { type: 'spring', stiffness: 360, damping: 34, mass: 0.6 } as const;
export const easeOut = [0.16, 1, 0.3, 1] as const;
export const fadeTransition = { duration: 0.14, ease: easeOut } as const;
export const disclosureTransition = { duration: 0.24, ease: easeOut } as const;
export const focusRing = 'outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';

// Reused by native inputs; consumers retain their own shadcn theme tokens.
export const fieldControl = 'min-w-0 w-full rounded-[10px] border border-border bg-background px-3 text-foreground shadow-xs placeholder:text-muted-foreground/70 enabled:read-write:hover:border-foreground/25 read-only:bg-muted/25 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/15 focus-visible:ring-offset-0 aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive/15 motion-safe:transition-[color,background-color,border-color,box-shadow] motion-safe:duration-150';
