import { createClient } from "@/lib/supabase/server";
import { logout } from "./actions";
import { MarketplaceCard } from "./marketplace-card";
import {
  MODULE_COLUMNS,
  getMarketplaceState,
  loadAccessByModuleId,
} from "./marketplace-state";
import { ModuleCard } from "./module-card";
import { ModuleCtaButton, getModuleCta, type AccessRow, type ModuleRow } from "./module-cta";

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

  const { data: modules } = await supabase
    .from("modules")
    .select(MODULE_COLUMNS)
    .order("created_at");

  const moduleRows = (modules ?? []) as ModuleRow[];

  let member: { nama: string; tier: string } | null = null;
  let accessByModuleId = new Map<string, AccessRow>();

  if (user) {
    const { data: memberRow } = await supabase
      .from("members")
      .select("nama, tier")
      .eq("id", user.id)
      .maybeSingle();
    member = memberRow;
    accessByModuleId = await loadAccessByModuleId(supabase, user.id);
  }

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
          {user ? (
            <>
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
            </>
          ) : (
            <>
              <a
                href="/login"
                className="text-sm font-semibold text-[#4B4F58] hover:text-[#14171F]"
              >
                Masuk
              </a>
              <a
                href="/register"
                className="rounded-lg bg-[#1DB5D8] px-4 py-2 text-sm font-semibold text-white"
              >
                Daftar
              </a>
            </>
          )}
        </div>
      </header>

      <main className="flex flex-col gap-9 p-10">
        {user && (
          <div className="flex items-center justify-between rounded-[14px] border border-[#E4E6EB] bg-white p-7">
            <div className="flex flex-col gap-1.5">
              <div className="text-[22px] font-extrabold">
                Halo, {member?.nama ?? user.email}
              </div>
              <div className="text-sm text-[#6E7280]">{user.email}</div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div className="text-base font-extrabold">Modul & Akses Kamu</div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {moduleRows.map((moduleRow) => {
              // Anonymous visitors get the full showroom; members only see
              // marketplaces relevant to a kelas they own.
              if (user && moduleRow.module_type === "marketplace") {
                return (
                  <MarketplaceCard
                    key={moduleRow.id}
                    moduleRow={moduleRow}
                    state={getMarketplaceState(moduleRow, moduleRows, accessByModuleId)}
                  />
                );
              }

              const access = accessByModuleId.get(moduleRow.id) ?? null;
              const cta = getModuleCta(moduleRow, access, !!user);
              return (
                <ModuleCard
                  key={moduleRow.id}
                  title={moduleRow.nama}
                  description={moduleRow.kategori}
                  footer={<ModuleCtaButton cta={cta} moduleId={moduleRow.id} />}
                />
              );
            })}
          </div>
        </div>

        {user && (
          <div className="flex flex-col gap-4">
            <div className="text-base font-extrabold">Lainnya</div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <ModuleCard
                title="Admin Dashboard (App)"
                description="Kelola jamaah & keuangan bisnismu"
                footer={
                  <a
                    href="/dashboard/admin"
                    className="w-full rounded-lg border border-[#D8DAE0] px-4 py-2.5 text-center text-sm font-semibold text-[#14171F] hover:bg-[#F4F5F7]"
                  >
                    Buka Dashboard ↗
                  </a>
                }
              />
              <ModuleCard
                title="Generate Image AI"
                description="Fase 2 - buat visual promosi otomatis"
                muted={!aiToolsUnlocked}
                badge={aiToolsUnlocked ? undefined : "🔒 LANJUTAN"}
                footer={
                  aiToolsUnlocked ? (
                    <button
                      type="button"
                      className="w-full rounded-lg border border-[#D8DAE0] px-4 py-2.5 text-sm font-semibold text-[#14171F] hover:bg-[#F4F5F7]"
                    >
                      Buka AI Tools
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="w-full cursor-not-allowed rounded-lg border border-[#D8DAE0] px-4 py-2.5 text-sm font-semibold text-[#9AA0AC]"
                    >
                      Upgrade untuk Akses
                    </button>
                  )
                }
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
