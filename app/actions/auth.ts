'use server';

import { cookies } from 'next/headers';
import { LoginFormSchema, FormState } from '@lib/definitions';
import { redirect } from 'next/navigation';

/**
 * Validate form fields and login user.
 * @param state - Form state
 * @param formData - Form data
 * @returns Form state with errors or access token
 */
export async function login(state: FormState, formData: FormData) {
  // Validate form fields
  const validatedFields = LoginFormSchema.safeParse({
    username: formData.get('username'),
    password: formData.get('password'),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Request access token
  const credentials = JSON.stringify(validatedFields.data);

  const response = await fetch(
    `${process.env.HOST}${process.env.ENDPOINT_LOGIN}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: credentials,
    },
  );

  // Pass error message in case of failure
  if (!response.ok) {
    const message = await response.json();

    return {
      message: message.detail,
    };
  }

  const { access, refresh } = await response.json();

  // Store refresh token in an HTTP-only, Secure cookie
  const cookieStore = await cookies();
  cookieStore.set('refresh', refresh, {
    httpOnly: true,
    secure: true,
    path: '/',
  });

  return { access };
}

/**
 * Refreshes an access token using the refresh token stored in cookies.
 * @throws {Error} If no refresh token is found or the refresh token is invalid.
 * @returns A new access token.
 */
export async function refreshAccess() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refresh')?.value;

  if (!refreshToken) {
    throw new Error('No refresh token found');
  }

  const response = await fetch(
    `${process.env.HOST}${process.env.ENDPOINT_REFRESH}`,
    {
      method: 'POST',
      body: JSON.stringify({ refresh: refreshToken }),
      headers: { 'Content-Type': 'application/json' },
    },
  );

  if (!response.ok) {
    throw new Error('Failed to refresh token');
  }

  const { access } = await response.json();

  return access;
}

/**
 * Logs out the user by deleting the refresh token cookie.
 */
export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('refresh');
  redirect('/login');
}