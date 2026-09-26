import type { createClient } from "@/lib/supabase/server";
import type { AccessRow, ModuleRow } from "./module-cta";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

export const MODULE_COLUMNS =
  "id, nama, kategori, min_tier, trial_days, vertical, skill_area, module_type";

export type MarketplaceState =
  | { kind: "hidden" }
  | { kind: "locked"; kelas: { id: string; nama: string } }
  | { kind: "unlocked" };

export async function loadAccessByModuleId(
  supabase: SupabaseServerClient,
  memberId: string,
) {
  const { data } = await supabase
    .from("member_access")
    .select("module_id, status, trial_ends_at")
    .eq("member_id", memberId);

  return new Map<string, AccessRow>(
    (data ?? []).map((row) => [
      row.module_id as string,
      { status: row.status, trial_ends_at: row.trial_ends_at } as AccessRow,
    ]),
  );
}

// A marketplace is only relevant to members who own (trial or purchase) a
// kelas in the same vertical; only a full purchase unlocks it.
export function getMarketplaceState(
  marketplace: ModuleRow,
  modules: ModuleRow[],
  accessByModuleId: Map<string, AccessRow>,
): MarketplaceState {
  const ownedKelas = modules.filter(
    (m) =>
      m.module_type === "kelas" &&
      m.vertical === marketplace.vertical &&
      accessByModuleId.has(m.id),
  );

  const unlocked =
    accessByModuleId.get(marketplace.id)?.status === "active" ||
    ownedKelas.some((m) => accessByModuleId.get(m.id)?.status === "active");
  if (unlocked) return { kind: "unlocked" };

  if (ownedKelas.length === 0) return { kind: "hidden" };

  return {
    kind: "locked",
    kelas: { id: ownedKelas[0].id, nama: ownedKelas[0].nama },
  };
}
