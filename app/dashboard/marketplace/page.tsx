import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MarketplaceCard } from "../marketplace-card";
import {
  MODULE_COLUMNS,
  getMarketplaceState,
  loadAccessByModuleId,
} from "../marketplace-state";
import type { ModuleRow } from "../module-cta";

export default async function MarketplacePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/dashboard/marketplace");
  }

  const [{ data: modules }, accessByModuleId] = await Promise.all([
    supabase.from("modules").select(MODULE_COLUMNS).order("created_at"),
    loadAccessByModuleId(supabase, user.id),
  ]);

  const moduleRows = (modules ?? []) as ModuleRow[];
  const visible = moduleRows
    .filter((m) => m.module_type === "marketplace")
    .map((m) => ({
      moduleRow: m,
      state: getMarketplaceState(m, moduleRows, accessByModuleId),
    }))
    .filter(({ state }) => state.kind !== "hidden");

  return (
    <div className="flex flex-1 flex-col bg-[#F4F5F7] p-10 text-[#14171F]">
      <a href="/dashboard" className="mb-6 text-sm text-[#6E7280] hover:text-[#14171F]">
        &larr; Kembali ke Beranda
      </a>
      <div className="mb-4 text-base font-extrabold">Marketplace</div>
      {visible.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map(({ moduleRow, state }) => (
            <MarketplaceCard key={moduleRow.id} moduleRow={moduleRow} state={state} />
          ))}
        </div>
      ) : (
        <div className="rounded-[14px] border border-[#E4E6EB] bg-white p-8 text-sm text-[#6E7280]">
          Belum ada marketplace untuk kamu. Marketplace terbuka setelah kamu
          membeli penuh salah satu kelas di vertikal yang sama.
        </div>
      )}
    </div>
  );
}
