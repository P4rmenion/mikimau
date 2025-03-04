import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isJWTExpired = (token: string) => {
  const decode = JSON.parse(atob(token.split('.')[1]));
  return decode.exp * 1000 < new Date().getTime();
};
