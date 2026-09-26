"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function startTrial(formData: FormData) {
  const moduleId = formData.get("moduleId");
  if (typeof moduleId !== "string" || !moduleId) {
    redirect("/dashboard");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/register?module=${moduleId}&trial=true`);
  }

  // Ensures a members row exists even for a session that never went through
  // /register (e.g. a user created directly in Supabase Auth), since
  // member_access.member_id has a foreign key to members(id).
  await supabase
    .from("members")
    .upsert(
      { id: user.id, email: user.email, nama: user.email ?? "Member" },
      { onConflict: "id", ignoreDuplicates: true },
    );

  const { data: existing } = await supabase
    .from("member_access")
    .select("id")
    .eq("member_id", user.id)
    .eq("module_id", moduleId)
    .maybeSingle();

  if (!existing) {
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
