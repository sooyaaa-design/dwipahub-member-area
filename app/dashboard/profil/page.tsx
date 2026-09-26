import Link from "next/link";
import { redirect } from "next/navigation";
import { DUMMY_PEMBAYARAN, formatRupiah, type Pembayaran } from "@/lib/dummy-data";
import { TIER_LABEL, TIER_ORDER } from "@/lib/labels";
import { createClient } from "@/lib/supabase/server";
import { DummyActionButton } from "../dummy-action-button";

const STATUS_CLASS: Record<Pembayaran["status"], string> = {
  Lunas: "bg-[#E7F6EC] text-[#1E7B3C]",
  Menunggu: "bg-[#FFF4E0] text-[#9A5B00]",
  Gagal: "bg-[#FDECEC] text-[#B42318]",
};

export default async function ProfilPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/dashboard/profil");
  }

  const { data: member } = await supabase
    .from("members")
    .select("nama, tier")
    .eq("id", user.id)
    .maybeSingle();

  const tier = member?.tier ?? "pengantar";
  const nextTier = TIER_ORDER[TIER_ORDER.indexOf(tier) + 1];

  return (
    <div className="flex flex-1 flex-col bg-[#F4F5F7] p-10 text-[#14171F]">
      <Link href="/dashboard" className="mb-6 text-sm text-[#6E7280] hover:text-[#14171F]">
        &larr; Kembali ke Beranda
      </Link>
      <h1 className="mb-6 text-xl font-extrabold">Profil & Billing</h1>

      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="flex flex-col gap-4 rounded-[14px] border border-[#E4E6EB] bg-white p-6">
            <h2 className="text-base font-extrabold">Profil</h2>
            <dl className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-[#6E7280]">Nama</dt>
                <dd className="text-right font-medium">{member?.nama ?? user.email}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#6E7280]">Email</dt>
                <dd className="break-all text-right font-medium">{user.email}</dd>
              </div>
            </dl>
          </section>

          <section className="flex flex-col gap-4 rounded-[14px] border border-[#E4E6EB] bg-white p-6">
            <h2 className="text-base font-extrabold">Status Tier</h2>
            <ol className="flex gap-2" aria-label="Tingkatan tier">
              {TIER_ORDER.map((t) => {
                const reached = TIER_ORDER.indexOf(t) <= TIER_ORDER.indexOf(tier);
                return (
                  <li
                    key={t}
                    aria-current={t === tier ? "step" : undefined}
                    className={`flex-1 rounded-lg px-3 py-2 text-center text-xs font-bold ${
                      t === tier
                        ? "bg-[#1DB5D8] text-white"
                        : reached
                          ? "bg-[#EAF7FA] text-[#0E7A94]"
                          : "bg-[#F4F5F7] text-[#9AA0AC]"
                    }`}
                  >
                    {TIER_LABEL[t]}
                  </li>
                );
              })}
            </ol>
            {nextTier ? (
              <div className="flex flex-col gap-3">
                <p className="text-sm text-[#4B4F58]">
                  Kamu di Tier {TIER_LABEL[tier] ?? tier}. Upgrade ke Tier{" "}
                  {TIER_LABEL[nextTier]} untuk membuka kelas dan fitur berikutnya.
                </p>
                <div className="self-start">
                  {/* TODO: ganti dengan checkout / payment gateway asli */}
                  <DummyActionButton
                    label={`Upgrade ke ${TIER_LABEL[nextTier]}`}
                    className="rounded-lg bg-[#1DB5D8] px-4 py-2.5 text-sm font-semibold text-white"
                    message="Pembayaran belum aktif (masih data dummy)."
                  />
                </div>
              </div>
            ) : (
              <p className="text-sm text-[#4B4F58]">
                Kamu sudah di tier tertinggi. Semua kelas dan fitur terbuka.
              </p>
            )}
          </section>
        </div>

        <section className="rounded-[14px] border border-[#E4E6EB] bg-white p-6">
          <h2 className="mb-4 text-base font-extrabold">Riwayat Pembayaran</h2>
          {/* TODO: ganti dengan data asli — riwayat transaksi masih dummy */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#E4E6EB] text-xs text-[#6E7280]">
                  <th scope="col" className="py-2.5 pr-4 font-medium">Tanggal</th>
                  <th scope="col" className="py-2.5 pr-4 font-medium">Invoice</th>
                  <th scope="col" className="py-2.5 pr-4 font-medium">Deskripsi</th>
                  <th scope="col" className="py-2.5 pr-4 text-right font-medium">Jumlah</th>
                  <th scope="col" className="py-2.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {DUMMY_PEMBAYARAN.map((p) => (
                  <tr key={p.id} className="border-b border-[#F0F1F3] last:border-0">
                    <td className="py-3 pr-4 whitespace-nowrap">{p.tanggal}</td>
                    <td className="py-3 pr-4 whitespace-nowrap text-[#6E7280]">{p.id}</td>
                    <td className="py-3 pr-4">{p.deskripsi}</td>
                    <td className="py-3 pr-4 text-right whitespace-nowrap font-medium">
                      {formatRupiah(p.jumlah)}
                    </td>
                    <td className="py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${STATUS_CLASS[p.status]}`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
