'use server';

import { cookies } from 'next/headers';
import { LoginFormSchema, LoginFormState } from '@lib/definitions';
import { jwtDecode } from 'jwt-decode';

/**
 * Validate form fields and login user.
 * @param state - Form state
 * @param formData - Form data
 * @returns Form state with errors or access token
 */
export async function login(state: LoginFormState, formData: FormData) {
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

  const response:
    | { access: string; refresh: string }
    | { error: string; status: number } = await safeFetch(
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
  if ('error' in response) {
    return {
      message: response.error,
    };
  }

  await setRefreshToken(response.refresh);
  await setAccessToken(response.access);

  return { access: response.access };
}

/**
 * Refreshes an access token using the refresh token stored in cookies.
 * @throws {Error} If no refresh token is found or the refresh token is invalid.
 * @returns A new access token.
 */
export async function refreshAccess() {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token found');

  try {
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
    await setAccessToken(access);

    return access;
  } catch (error) {
    throw error;
  }
}

/**
 * Logs out the user by deleting the refresh token cookie.
 */
export async function logout() {
  await removeRefreshToken();
  await removeAccessToken();
}

// REFRESH TOKEN UTILS
export async function setRefreshToken(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('refresh', token, {
    httpOnly: true,
    secure: false,
    path: '/',
  });
}

export async function getRefreshToken() {
  const cookieStore = await cookies();
  return cookieStore.get('refresh')?.value;
}

export async function removeRefreshToken() {
  const cookieStore = await cookies();
  cookieStore.delete('refresh');
}

// ACCESS TOKEN UTILS
export async function setAccessToken(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('access', token, {
    httpOnly: false, // Allow frontend to access it
    secure: false,
    path: '/',
  });
}

export async function getAccessToken() {
  const cookieStore = await cookies();
  return cookieStore.get('access')?.value;
}

export async function removeAccessToken() {
  const cookieStore = await cookies();
  cookieStore.delete('access');
}

// ADMIN STATUS
export async function getAdminStatus(access: string | null) {
  if (!access) return false;

  const { is_admin }: { is_admin: boolean } = jwtDecode(access);
  return is_admin;
}

// FETCH WITH ERROR HANDLING
export async function safeFetch(url: string, options: RequestInit = {}) {
  const baseUrl = process.env.DOMAIN;
  const absoluteURL = new URL(url, baseUrl);

  try {
    let response = await fetch(absoluteURL, {
      ...options,
      credentials: 'include', // Include cookies automatically
    });

    // Check if the token is expired
    if (response.status === 401) {
      console.warn('Access token expired. Attempting refresh...');

      try {
        const access = await refreshAccess().catch(() => {
          return { error: 'Unauthorized', status: 401 };
        });

        await setAccessToken(access);

        // Retry the request with the new access token
        response = await fetch(absoluteURL, {
          ...options,
          credentials: 'include',
          headers: {
            ...options.headers,
            Authorization: `Bearer ${access}`, // Add the new token
          },
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_) {
        console.error('Token refresh failed, forcing logout...');
        return { error: 'Unauthorized', status: 401 };
      }
    }

    // If the response is still not OK, throw an error
    if (!response.ok) {
      return {
        error: `Error ${response.status}: ${response.statusText}`,
        status: response.status,
      };
    }

    return response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    return { error: 'Network error', status: 500 };
  }
}
