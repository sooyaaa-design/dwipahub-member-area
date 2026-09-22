import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "./actions";
import { ModuleCard } from "./module-card";

const TIER_LABEL: Record<string, string> = {
  pengantar: "Pengantar",
  sertifikasi: "Sertifikasi",
  lanjutan: "Lanjutan",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: member } = await supabase
    .from("members")
    .select("nama, tier")
    .eq("id", user.id)
    .maybeSingle();

  const tier = member?.tier ?? "pengantar";
  const aiToolsUnlocked = tier === "lanjutan";

  return (
    <div className="flex flex-1 flex-col bg-[#F4F5F7] text-[#14171F]">
      <header className="flex h-[72px] items-center justify-between border-b border-[#E4E6EB] bg-white px-10">
        <div className="flex items-center gap-11">
          <div className="text-xl font-extrabold tracking-wide text-[#1B3A6B]">
            DWIPAHUB
          </div>
          <nav className="flex gap-7 text-sm font-medium text-[#4B4F58]">
            <span className="border-b-2 border-[#1DB5D8] pb-1.5 font-bold text-[#14171F]">
              Beranda
            </span>
            <span>Kelas</span>
            <span>Marketplace</span>
            <span>AI Tools</span>
            <span>Profil</span>
          </nav>
        </div>
        <div className="flex items-center gap-3.5">
          <span className="rounded-full bg-[#EAF7FA] px-3 py-1 text-xs font-bold text-[#0E7A94]">
            TIER: {(TIER_LABEL[tier] ?? tier).toUpperCase()}
          </span>
          <div className="h-[38px] w-[38px] rounded-full bg-[#D8DAE0]" />
          <form action={logout}>
            <button
              type="submit"
              className="rounded-lg border border-[#D8DAE0] px-3 py-1.5 text-xs font-semibold text-[#4B4F58] hover:bg-[#F4F5F7]"
            >
              Keluar
            </button>
          </form>
        </div>
      </header>

      <main className="flex flex-col gap-9 p-10">
        <div className="flex items-center justify-between rounded-[14px] border border-[#E4E6EB] bg-white p-7">
          <div className="flex flex-col gap-1.5">
            <div className="text-[22px] font-extrabold">
              Halo, {member?.nama ?? user.email}
            </div>
            <div className="text-sm text-[#6E7280]">{user.email}</div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="text-base font-extrabold">Modul & Akses Kamu</div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <ModuleCard
              title="Kelas & Materi"
              description="Lanjutkan materi sesuai tier kamu"
              cta="Lanjutkan Belajar"
            />
            <ModuleCard
              title="Paket Umroh Siap Jual"
              description="Marketplace paket dari provider mitra"
              cta="Lihat Marketplace"
            />
            <ModuleCard
              title="Admin Dashboard (App)"
              description="Kelola jamaah & keuangan bisnismu"
              cta="Buka Dashboard ↗"
            />
            <ModuleCard
              title="Generate Image AI"
              description="Fase 2 - buat visual promosi otomatis"
              cta={aiToolsUnlocked ? "Buka AI Tools" : "Upgrade untuk Akses"}
              locked={!aiToolsUnlocked}
              lockedLabel="LANJUTAN"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
