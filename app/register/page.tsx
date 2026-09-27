import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { RegisterForm } from "./register-form";

export default async function RegisterPage(props: PageProps<"/register">) {
  const { module: moduleId, trial } = await props.searchParams;
  const moduleIdParam = typeof moduleId === "string" ? moduleId : undefined;
  const isTrial = trial === "true";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  let subtitle = "Buat akun member area";
  if (moduleIdParam) {
    const { data: moduleRow } = await supabase
      .from("modules")
      .select("nama, trial_days")
      .eq("id", moduleIdParam)
      .maybeSingle();

    if (moduleRow) {
      subtitle = isTrial
        ? `Daftar untuk mulai trial ${moduleRow.trial_days} hari "${moduleRow.nama}"`
        : `Daftar untuk akses "${moduleRow.nama}"`;
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-[#F4F5F7] px-4 py-10">
      <div className="w-full max-w-sm rounded-2xl border border-[#E4E6EB] bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-col items-center gap-1 text-center">
          <div className="text-lg font-extrabold tracking-wide text-brand-navy">
            DWIPAHUB
          </div>
          <p className="text-sm text-[#6E7280]">{subtitle}</p>
        </div>
        <RegisterForm moduleId={moduleIdParam} trial={isTrial} />
      </div>
    </div>
  );
}
