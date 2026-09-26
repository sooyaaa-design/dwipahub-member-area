import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  MODULE_COLUMNS,
  getMarketplaceState,
  loadAccessByModuleId,
} from "../../marketplace-state";
import type { ModuleRow } from "../../module-cta";

export default async function MarketplaceDetailPage(
  props: PageProps<"/dashboard/marketplace/[id]">,
) {
  const { id } = await props.params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/dashboard/marketplace/${id}`);
  }

  const [{ data: modules }, accessByModuleId] = await Promise.all([
    supabase.from("modules").select(MODULE_COLUMNS),
    loadAccessByModuleId(supabase, user.id),
  ]);

  const moduleRows = (modules ?? []) as ModuleRow[];
  const marketplace = moduleRows.find(
    (m) => m.id === id && m.module_type === "marketplace",
  );

  if (
    !marketplace ||
    getMarketplaceState(marketplace, moduleRows, accessByModuleId).kind !== "unlocked"
  ) {
    redirect("/dashboard/marketplace");
  }

  return (
    <div className="flex flex-1 flex-col bg-[#F4F5F7] p-10 text-[#14171F]">
      <Link
        href="/dashboard/marketplace"
        className="mb-6 text-sm text-[#6E7280] hover:text-[#14171F]"
      >
        &larr; Kembali ke Marketplace
      </Link>
      <div className="flex flex-col gap-2 rounded-[14px] border border-[#E4E6EB] bg-white p-8">
        <div className="text-xl font-extrabold">{marketplace.nama}</div>
        <p className="text-sm text-[#6E7280]">
          Daftar paket di marketplace ini akan segera hadir.
        </p>
      </div>
    </div>
  );
}
