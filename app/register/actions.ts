"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type RegisterState = { error: string } | null;

export async function register(
  _prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const email = formData.get("email");
  const password = formData.get("password");
  const nama = formData.get("nama");
  const moduleId = formData.get("moduleId");
  const trial = formData.get("trial") === "true";

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof nama !== "string" ||
    !email ||
    !password ||
    !nama
  ) {
    return { error: "Semua field wajib diisi." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return {
      error:
        error.code === "user_already_exists"
          ? "Email sudah terdaftar. Silakan masuk."
          : "Gagal mendaftar. Coba lagi.",
    };
  }

  const user = data.user;
  if (!user) {
    return { error: "Gagal mendaftar. Coba lagi." };
  }

  if (!data.session) {
    // Email confirmation is required before a session exists. Trial
    // provisioning needs auth.uid() for RLS, so it can't happen yet —
    // send them to confirm and log in manually.
    redirect("/login?confirm=1");
  }

  await supabase.from("members").insert({ id: user.id, email, nama });

  if (typeof moduleId === "string" && moduleId) {
    if (trial) {
      const { data: moduleRow } = await supabase
        .from("modules")
        .select("trial_days")
        .eq("id", moduleId)
        .maybeSingle();

      const trialDays = moduleRow?.trial_days ?? 0;

      if (trialDays > 0) {
        await supabase.from("member_access").insert({
          member_id: user.id,
          module_id: moduleId,
          status: "trial",
          trial_ends_at: new Date(
            Date.now() + trialDays * 24 * 60 * 60 * 1000,
          ).toISOString(),
        });
      }
    }

    redirect(`/dashboard/kelas/${moduleId}`);
  }

  redirect("/dashboard");
}
