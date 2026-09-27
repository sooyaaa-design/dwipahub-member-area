import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentMember } from "./current-member";
import { MarketplaceCard } from "./marketplace-card";
import {
  MODULE_COLUMNS,
  getMarketplaceState,
  loadAccessByModuleId,
} from "./marketplace-state";
import { ModuleCard } from "./module-card";
import { ModuleCtaButton, getModuleCta, type AccessRow, type ModuleRow } from "./module-cta";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { user, member } = await getCurrentMember();

  const { data: modules } = await supabase
    .from("modules")
    .select(MODULE_COLUMNS)
    .order("created_at");

  const moduleRows = (modules ?? []) as ModuleRow[];

  const accessByModuleId = user
    ? await loadAccessByModuleId(supabase, user.id)
    : new Map<string, AccessRow>();

  const tier = member?.tier ?? "pengantar";
  const aiToolsUnlocked = tier === "lanjutan";

  return (
    <main className="flex flex-1 flex-col gap-9 p-10">
      {user && (
        <div className="flex items-center justify-between rounded-[14px] bg-brand-gradient p-7 text-white">
          <div className="flex flex-col gap-1.5">
            <div className="text-[22px] font-extrabold">
              Halo, {member?.nama ?? user.email}
            </div>
            <div className="text-sm text-white/80">{user.email}</div>
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
                <Link
                  href="/dashboard/ai-tools"
                  className={`w-full rounded-lg border border-[#D8DAE0] px-4 py-2.5 text-center text-sm font-semibold hover:bg-[#F4F5F7] ${
                    aiToolsUnlocked ? "text-[#14171F]" : "text-[#9AA0AC]"
                  }`}
                >
                  {aiToolsUnlocked ? "Buka AI Tools" : "Upgrade untuk Akses"}
                </Link>
              }
            />
          </div>
        </div>
      )}
    </main>
  );
}
