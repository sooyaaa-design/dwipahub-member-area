import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "./login-form";

export default async function LoginPage(props: PageProps<"/login">) {
  const { next } = await props.searchParams;
  const nextPath =
    typeof next === "string" && next.startsWith("/") && !next.startsWith("//")
      ? next
      : undefined;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect(nextPath ?? "/dashboard");
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-[#F4F5F7] px-4">
      <div className="w-full max-w-sm rounded-2xl border border-[#E4E6EB] bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-col items-center gap-1 text-center">
          <div className="text-lg font-extrabold tracking-wide text-brand-navy">
            DWIPAHUB
          </div>
          <p className="text-sm text-[#6E7280]">Masuk ke member area kamu</p>
        </div>
        <LoginForm next={nextPath} />
      </div>
    </div>
  );
}
