'use client';

import { useActionState, useEffect, useState } from 'react';
import { login } from '@actions/auth';
import { redirect } from 'next/navigation';
import { useAuth } from '@context/AuthContext';
import { orbitron } from '@root';

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { setAccessToken } = useAuth();

  // Reset error message
  useEffect(() => {
    if (!state?.message) setError('');
    else setError(state.message);
  }, [state]);

  // Store access token in state (app context)
  useEffect(() => {
    if (state?.access) {
      setAccessToken(state.access);
      redirect('/store/movies');
    }
  }, [state, setAccessToken]);

  return (
    <div className="bg-secondary flex h-full flex-col items-center gap-10 p-4 pt-[5dvh] lg:justify-center lg:p-0">
      <h1 className="flex flex-col items-center gap-2 text-center text-2xl text-white">
        Welcome to
        <span className={`${orbitron.className} text-primary text-4xl`}>
          MIKIMAU
        </span>
      </h1>
      <form
        noValidate
        action={action}
        className="flex min-h-fit w-full flex-col items-center justify-center gap-6 rounded-lg bg-white px-4 py-10 text-black shadow-lg shadow-black lg:min-h-[60vh] lg:w-auto lg:max-w-[500px] lg:px-[60px] lg:py-[80px]"
      >
        <h2 className="border-secondary w-full border-b text-center text-lg font-semibold tracking-wider uppercase lg:w-auto lg:px-2 lg:text-2xl">
          Access your account
        </h2>
        <div className="flex w-full flex-col lg:max-w-[300px]">
          <label
            className="px-2 py-1 text-xs font-medium uppercase lg:text-sm"
            htmlFor="username"
          >
            User
          </label>
          <input
            className="rounded-sm border border-gray-400 p-2 text-xs lg:text-sm"
            id="username"
            name="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {state?.errors?.username && (
            <span className="px-2 pt-1 text-xs text-red-500">
              {state.errors.username[0]}
            </span>
          )}
        </div>

        <div className="flex w-full flex-col lg:mb-20 lg:max-w-[300px]">
          <label
            className="px-2 py-1 text-xs font-medium uppercase lg:text-sm"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="rounded-sm border border-gray-400 p-2 text-xs lg:text-sm"
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {state?.errors?.password && (
            <span className="px-2 pt-1 text-xs text-red-500">
              {state.errors.password}
            </span>
          )}
        </div>
        {error && (
          <div className="rounded-xl bg-red-400 px-4 py-4 text-center text-xs text-white outline-2 outline-offset-2 outline-red-500 lg:max-w-[300px] lg:text-sm">
            <span>{error}</span>
          </div>
        )}

        <button
          className="bg-primary mt-auto w-full rounded-md py-2 text-sm font-semibold tracking-wide text-white uppercase disabled:bg-slate-300 lg:max-w-[300px] lg:text-base"
          type="submit"
          disabled={pending}
        >
          sign in
        </button>
      </form>
    </div>
  );
}
