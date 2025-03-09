import { z } from 'zod';

export const LoginFormSchema = z.object({
  username: z.string().min(1, { message: 'Username is required' }).trim(),
  password: z.string().min(1, { message: 'Password is required' }).trim(),
});

export const AddMovieFormSchema = z.object({
  title: z.string().min(1, { message: 'Movie title is required' }).trim(),
  pub_date: z
    .preprocess((value) => (value === '' ? undefined : value), z.undefined())
    .or(
      z.coerce
        .number()
        .int()
        .min(new Date().getFullYear() - 100, {
          message: 'Publication year should be in the last 100 years',
        })
        .max(new Date().getFullYear(), {
          message: 'Publication year cannot be in the future',
        }),
    ),
  duration: z
    .preprocess((value) => (value === '' ? undefined : value), z.undefined())
    .or(
      z.coerce
        .number()
        .int()
        .min(1, { message: 'Duration cannot be negative' })
        .max(300, { message: 'Duration cannot exceed 300 minutes' }),
    ),
  rating: z
    .preprocess((value) => (value === '' ? undefined : value), z.undefined())
    .or(
      z.coerce
        .number()
        .min(1, { message: 'Minimum rating is 1' })
        .max(10, { message: 'Maximum rating is 10' }),
    ),
  description: z.coerce
    .string()
    .max(1000, {
      message: 'Description cannot exceed 1000 characters',
    })
    .trim()
    .optional(),
  categories: z
    .array(z.string())
    .min(1, { message: 'At least one category is required' }),
});

export interface AuthContextType {
  access: string | null;
  setAccess: (token: string | null) => void;
  isAdmin: boolean;
  setIsAdmin: (admin: boolean) => void;
}

export type LoginFormState =
  | {
      errors?: {
        username?: string[];
        password?: string[];
      };
      message?: string;
      access?: string;
    }
  | undefined;

export type AddMovieFormState =
  | {
      errors?: {
        title?: string[];
        pub_date?: string[];
        duration?: string[];
        rating?: string[];
        description?: string[];
        categories?: string[];
      };
      message?: string;
      access?: string;
    }
  | undefined;

export type Movie = {
  uuid: string;
  title: string;
  pub_date?: number;
  duration?: number;
  rating?: number;
  description?: string;
  poster_url?: string;
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
  rental_date: string;
  return_date: string | null;
  is_paid: boolean;
  user: string;
};

export type User = {
  access: string;
  is_admin: boolean;
};

export type Sort = 'TITLE' | 'RENTAL_DATE' | 'STATUS' | 'USER';
export type Order = 'ASC' | 'DESC';

export type RentalResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Rental[];
};

export type MovieResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Movie[];
};
