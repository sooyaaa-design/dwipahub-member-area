"use client";

import { useState, type FormEvent } from "react";
import { DUMMY_AI_RESULTS } from "@/lib/dummy-data";
import { ImagePlaceholder } from "../image-placeholder";

const fieldClass =
  "rounded-lg border border-[#D8DAE0] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#1DB5D8] disabled:bg-[#F7F7F8] disabled:text-[#9AA0AC]";

export function AiToolsPanel({ unlocked }: { unlocked: boolean }) {
  const [notice, setNotice] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // TODO: ganti dengan panggilan API generate gambar yang asli
    setNotice("Generate belum aktif (masih data dummy). Contoh hasil ada di bawah.");
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="relative rounded-[14px] border border-[#E4E6EB] bg-white p-6">
        {!unlocked && (
          <span className="absolute right-4 top-4 rounded-full bg-[#ECEDF0] px-2.5 py-0.5 text-[11px] font-bold text-[#6E7280]">
            🔒 Khusus Tier Lanjutan
          </span>
        )}
        <h2 className="mb-4 text-base font-extrabold">Generate Image AI</h2>

        <form onSubmit={handleSubmit}>
          <fieldset disabled={!unlocked} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="prompt" className="text-sm font-medium">
                Deskripsi gambar
              </label>
              <textarea
                id="prompt"
                name="prompt"
                rows={3}
                required
                placeholder="Contoh: Poster promo umroh Ramadhan dengan nuansa hijau dan emas"
                className={fieldClass}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="format" className="text-sm font-medium">
                  Format
                </label>
                <select id="format" name="format" className={fieldClass} defaultValue="feed">
                  <option value="feed">Instagram Feed (1:1)</option>
                  <option value="story">Story (9:16)</option>
                  <option value="banner">Banner (16:9)</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="gaya" className="text-sm font-medium">
                  Gaya visual
                </label>
                <select id="gaya" name="gaya" className={fieldClass} defaultValue="elegan">
                  <option value="elegan">Elegan</option>
                  <option value="modern">Modern</option>
                  <option value="islami">Ornamen Islami</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="self-start rounded-lg bg-[#1DB5D8] px-4 py-2.5 text-sm font-semibold text-white disabled:bg-[#C9CCD3]"
            >
              Generate
            </button>
          </fieldset>
        </form>

        {notice && (
          <p role="status" className="mt-3 text-sm text-[#6E7280]">
            {notice}
          </p>
        )}

        {!unlocked && (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-[#F4F5F7] px-4 py-3">
            <p className="text-sm text-[#4B4F58]">
              Fitur ini terbuka untuk member Tier Lanjutan.
            </p>
            <a
              href="/dashboard/profil"
              className="rounded-lg border border-[#D8DAE0] bg-white px-4 py-2 text-sm font-semibold text-[#14171F] hover:bg-[#F4F5F7]"
            >
              Lihat Opsi Upgrade
            </a>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-base font-extrabold">
          {unlocked ? "Hasil Terakhir" : "Contoh Hasil"}
        </h2>
        {/* TODO: ganti dengan data asli — riwayat hasil generate masih dummy */}
        <div className={`grid grid-cols-2 gap-4 lg:grid-cols-4 ${unlocked ? "" : "opacity-60"}`}>
          {DUMMY_AI_RESULTS.map((result) => (
            <figure
              key={result.id}
              className="flex flex-col overflow-hidden rounded-[14px] border border-[#E4E6EB] bg-white"
            >
              <ImagePlaceholder label="Preview hasil AI" className="aspect-square" />
              <figcaption className="p-3 text-xs text-[#4B4F58]">{result.prompt}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}
