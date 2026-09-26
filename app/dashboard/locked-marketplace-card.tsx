"use client";

import { useRef } from "react";
import { ModuleCard } from "./module-card";

export function LockedMarketplaceCard({
  title,
  description,
  kelas,
}: {
  title: string;
  description: string;
  kelas: { id: string; nama: string };
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <ModuleCard
        title={title}
        description={description}
        muted
        badge="🔒 Perlu Kelas Full"
        footer={
          <button
            type="button"
            onClick={() => dialogRef.current?.showModal()}
            className="w-full rounded-lg border border-[#D8DAE0] px-4 py-2.5 text-sm font-semibold text-[#9AA0AC] after:absolute after:inset-0 after:rounded-[14px]"
          >
            Terkunci
          </button>
        }
      />
      <dialog
        ref={dialogRef}
        className="m-auto w-full max-w-sm rounded-2xl border border-[#E4E6EB] bg-white p-6 text-[#14171F] backdrop:bg-black/40"
      >
        <div className="flex flex-col gap-5">
          <div className="text-base font-extrabold">{title}</div>
          <p className="text-sm text-[#4B4F58]">
            Marketplace ini khusus untuk member yang sudah menyelesaikan
            pembelian penuh kelas {kelas.nama}. Upgrade sekarang untuk membuka
            akses.
          </p>
          <div className="flex justify-end gap-3">
            <form method="dialog">
              <button
                type="submit"
                className="rounded-lg border border-[#D8DAE0] px-4 py-2 text-sm font-semibold text-[#4B4F58] hover:bg-[#F4F5F7]"
              >
                Tutup
              </button>
            </form>
            <a
              href={`/dashboard/kelas/${kelas.id}`}
              className="rounded-lg bg-[#1DB5D8] px-4 py-2 text-sm font-semibold text-white"
            >
              Lihat Kelas {kelas.nama}
            </a>
          </div>
        </div>
      </dialog>
    </>
  );
}
