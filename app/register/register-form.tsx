"use client";

import { useActionState } from "react";
import { register, type RegisterState } from "./actions";

const initialState: RegisterState = null;

export function RegisterForm({
  moduleId,
  trial,
}: {
  moduleId?: string;
  trial?: boolean;
}) {
  const [state, formAction, pending] = useActionState(register, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {moduleId && <input type="hidden" name="moduleId" value={moduleId} />}
      {trial && <input type="hidden" name="trial" value="true" />}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="nama" className="text-sm font-medium text-[#14171F]">
          Nama
        </label>
        <input
          id="nama"
          name="nama"
          type="text"
          required
          autoComplete="name"
          className="rounded-lg border border-[#D8DAE0] px-3 py-2.5 text-sm outline-none focus:border-[#1DB5D8]"
        />
      </div>

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
          minLength={6}
          autoComplete="new-password"
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
        {pending ? "Mendaftar..." : "Daftar"}
      </button>
    </form>
  );
}
