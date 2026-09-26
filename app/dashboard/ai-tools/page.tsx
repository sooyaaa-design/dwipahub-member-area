import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AiToolsPanel } from "./ai-tools-panel";

export default async function AiToolsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/dashboard/ai-tools");
  }

  const { data: member } = await supabase
    .from("members")
    .select("tier")
    .eq("id", user.id)
    .maybeSingle();

  const unlocked = (member?.tier ?? "pengantar") === "lanjutan";

  return (
    <div className="flex flex-1 flex-col bg-[#F4F5F7] p-10 text-[#14171F]">
      <Link href="/dashboard" className="mb-6 text-sm text-[#6E7280] hover:text-[#14171F]">
        &larr; Kembali ke Beranda
      </Link>
      <h1 className="mb-1 text-xl font-extrabold">AI Tools</h1>
      <p className="mb-6 text-sm text-[#6E7280]">
        Buat visual promosi travel umroh secara otomatis.
      </p>
      <AiToolsPanel unlocked={unlocked} />
    </div>
  );
}
