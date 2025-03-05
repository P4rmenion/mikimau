import { clsx, type ClassValue } from 'clsx';
import { jwtDecode } from 'jwt-decode';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isJWTExpired = (token: string) => {
  const decode: { exp: number } = jwtDecode(token);
  return decode.exp * 1000 < new Date().getTime();
};
