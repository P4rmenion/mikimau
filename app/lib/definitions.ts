import { z } from 'zod';

export const LoginFormSchema = z.object({
  username: z.string().min(1, { message: 'Username is required' }).trim(),
  password: z.string().min(1, { message: 'Password is required' }).trim(),
});

export type FormState =
  | {
      errors?: {
        username?: string[];
        password?: string[];
      };
      message?: string;
      access?: string;
    }
  | undefined;

export type Movie = {
  uuid: string;
  title: string;
  pub_date: number;
  duration: number;
  rating: number;
  description: string;
  poster_url: string;
};

export type Category = {
  name: string;
};

export type MovieFilters = {
  categories: string[];
  fromRating: number | null;
  toRating: number | null;
  fromYear: number | null;
  toYear: number | null;
};

export type Profile = {
  first_name: string;
  last_name: string;
  email: string;
  wallet: number;
};

export type Rental = {
  uuid: string;
  movie: string;
  rental_date: number;
  return_date: number;
  is_paid: boolean;
  user: number;
};
