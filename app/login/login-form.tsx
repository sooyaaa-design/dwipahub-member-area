"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

const initialState: LoginState = null;

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-[#14171F]">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="rounded-lg border border-[#D8DAE0] px-3 py-2.5 text-sm outline-none focus:border-[#1DB5D8]"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-[#14171F]">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="rounded-lg border border-[#D8DAE0] px-3 py-2.5 text-sm outline-none focus:border-[#1DB5D8]"
        />
      </div>

      {state?.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-[#1DB5D8] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Masuk..." : "Masuk"}
      </button>
    </form>
  );
}
