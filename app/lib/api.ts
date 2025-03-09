import { getAccessToken, safeFetch } from '@actions/auth';
import {
  AddMovieFormSchema,
  AddMovieFormState,
  Category,
  Movie,
  MovieResponse,
  Profile,
  RentalResponse,
} from '@lib/definitions';

export const fetchMovies = async (
  access: string | null,
  queryParams: URLSearchParams,
) => {
  const response: MovieResponse | { error: string; status: number } =
    await safeFetch(`/api/movies?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access}`,
      },
    });

  return response;
};

export const fetchMovieDetails = async (
  access: string | null,
  uuid: string,
) => {
  const response: Movie | { error: string; status: number } = await safeFetch(
    `/api/movies/${uuid}`,
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${access}` },
    },
  );

  return response;
};

export const fetchCategories = async (access: string | null) => {
  const response: Category[] | { error: string; status: number } =
    await safeFetch(`/api/categories`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${access}` },
    });

  return response;
};

export const fetchProfile = async (access: string | null) => {
  const response: Profile | { error: string; status: number } = await safeFetch(
    `/api/profile/`,
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${access}` },
    },
  );

  return response;
};

export const fetchRentals = async (
  access: string | null,
  queryParams: URLSearchParams,
) => {
  const response: RentalResponse | { error: string; status: number } =
    await safeFetch(`/api/rentals?${queryParams}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${access}` },
    });

  return response;
};

export const depositFunds = async (access: string | null, deposit: number) => {
  const response: { deposit: number } | { error: string; status: number } =
    await safeFetch(`/api/profile/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access}`,
      },
      body: JSON.stringify({ deposit: Number(deposit) }),
    });

  return response;
};

export async function rentMovie(access: string | null, uuid: string) {
  const response: RentalResponse | { error: string; status: number } =
    await safeFetch(`/api/rentals/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access}`,
      },
      body: JSON.stringify({ movie: uuid }),
    });

  return response;
}

export async function returnMovie(access: string | null, rental_uuid: string) {
  const response: string | { error: string; status: number } = await safeFetch(
    `/api/rentals/${rental_uuid}`,
    {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${access}` },
    },
  );

  return response;
}

export async function addMovie(state: AddMovieFormState, formData: FormData) {
  // Validate form fields
  const validatedFields = AddMovieFormSchema.safeParse({
    title: formData.get('title'),
    pub_date: formData.get('pub_date'),
    duration: formData.get('duration'),
    rating: formData.get('rating'),
    description: formData.get('description'),
    categories: formData.getAll('category'),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Post movie
  const movieInformation = Object.fromEntries(
    Object.entries(validatedFields.data).filter(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ([_, value]) => value !== '' && value !== null && value !== undefined,
    ),
  );

  const access = await getAccessToken();
  const response: Movie | { error: string; status: number } = await safeFetch(
    `${process.env.HOST}${process.env.ENDPOINT_MOVIES}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access}`,
      },
      body: JSON.stringify(movieInformation),
    },
  );

  return {
    message:
      'error' in response
        ? `Something went wrong! ${response.error}`
        : `Movie "${response.title}" successfully updated!`,
  };
}
