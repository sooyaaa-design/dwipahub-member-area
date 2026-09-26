import { LockedMarketplaceCard } from "./locked-marketplace-card";
import type { MarketplaceState } from "./marketplace-state";
import { ModuleCard } from "./module-card";
import type { ModuleRow } from "./module-cta";

export function MarketplaceCard({
  moduleRow,
  state,
}: {
  moduleRow: ModuleRow;
  state: MarketplaceState;
}) {
  if (state.kind === "hidden") return null;

  if (state.kind === "locked") {
    return (
      <LockedMarketplaceCard
        title={moduleRow.nama}
        description={moduleRow.kategori}
        kelas={state.kelas}
      />
    );
  }

  return (
    <ModuleCard
      title={moduleRow.nama}
      description={moduleRow.kategori}
      footer={
        <a
          href={`/dashboard/marketplace/${moduleRow.id}`}
          className="w-full rounded-lg border border-[#D8DAE0] px-4 py-2.5 text-center text-sm font-semibold text-[#14171F] hover:bg-[#F4F5F7]"
        >
          Buka Marketplace
        </a>
      }
    />
  );
}
