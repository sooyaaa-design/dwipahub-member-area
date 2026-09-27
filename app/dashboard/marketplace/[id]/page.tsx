import Link from "next/link";
import { redirect } from "next/navigation";
import { DUMMY_PAKET, formatRupiah } from "@/lib/dummy-data";
import { createClient } from "@/lib/supabase/server";
import { DummyActionButton } from "../../dummy-action-button";
import { ImagePlaceholder } from "../../image-placeholder";
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
      <h1 className="mb-1 text-xl font-extrabold text-brand-navy">{marketplace.nama}</h1>
      <p className="mb-6 text-sm text-[#6E7280]">
        Paket umroh siap jual dari provider mitra. Pilih paket, lalu hubungi
        provider untuk kerja sama penjualan.
      </p>

      {/* TODO: ganti dengan data asli — daftar paket masih dummy */}
      <div className="flex flex-col gap-5">
        {DUMMY_PAKET.map((paket) => (
          <article
            key={paket.id}
            className="grid grid-cols-1 overflow-hidden rounded-[14px] border border-[#E4E6EB] bg-white md:grid-cols-[280px_minmax(0,1fr)]"
          >
            <ImagePlaceholder
              label={`Foto ${paket.nama}`}
              className="aspect-[4/3] md:aspect-auto md:min-h-full"
            />
            <div className="flex flex-col gap-4 p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-extrabold">{paket.nama}</h2>
                  <div className="text-sm text-[#6E7280]">oleh {paket.provider}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-extrabold text-brand-navy">
                    {formatRupiah(paket.harga)}
                  </div>
                  <div className="text-xs text-[#6E7280]">per jamaah</div>
                </div>
              </div>

              <p className="text-sm text-[#4B4F58]">{paket.deskripsi}</p>

              <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-xs text-[#6E7280]">Durasi</dt>
                  <dd className="font-medium">{paket.durasi}</dd>
                </div>
                <div>
                  <dt className="text-xs text-[#6E7280]">Keberangkatan</dt>
                  <dd className="font-medium">{paket.keberangkatan}</dd>
                </div>
              </dl>

              <details className="rounded-lg border border-[#E4E6EB] px-4 py-3 text-sm">
                <summary className="cursor-pointer font-semibold">Itinerary singkat</summary>
                <ol className="mt-3 flex flex-col gap-2">
                  {paket.itinerary.map((item) => (
                    <li key={item.hari} className="flex gap-3">
                      <span className="w-20 shrink-0 font-semibold text-brand-navy">{item.hari}</span>
                      <span className="text-[#4B4F58]">{item.kegiatan}</span>
                    </li>
                  ))}
                </ol>
              </details>

              <div className="self-start">
                <DummyActionButton
                  label={`Hubungi ${paket.provider}`}
                  className="rounded-lg bg-brand-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-navy/90"
                  message="Kontak provider belum aktif (masih data dummy)."
                />
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
