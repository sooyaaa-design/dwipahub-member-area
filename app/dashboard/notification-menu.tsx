"use client";

import { useId, useRef, useState } from "react";
import { DUMMY_NOTIFIKASI } from "@/lib/dummy-data";
import { useDismiss } from "./use-dismiss";

export function NotificationMenu() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  useDismiss(open, setOpen, containerRef, buttonRef);

  // TODO: ganti dengan data asli setelah payment webhook jalan
  const notifikasi = DUMMY_NOTIFIKASI;
  const unreadCount = notifikasi.filter((n) => n.belumDibaca).length;

  return (
    // Mobile: panel spans the header (like the hamburger panel) so it never
    // overflows the screen; md+: anchored under the bell.
    <div ref={containerRef} className="md:relative">
      <button
        ref={buttonRef}
        type="button"
        aria-label={
          unreadCount > 0 ? `Notifikasi, ${unreadCount} belum dibaca` : "Notifikasi"
        }
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className={`relative flex h-10 w-10 items-center justify-center rounded-lg text-brand-navy hover:bg-[#F4F5F7] ${
          open ? "bg-[#F4F5F7]" : ""
        }`}
      >
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
        {unreadCount > 0 && (
          <span
            aria-hidden="true"
            className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-[#E5484D] ring-2 ring-white"
          />
        )}
      </button>
      {open && (
        <div
          id={panelId}
          className="absolute inset-x-4 top-full z-20 mt-2 rounded-[14px] border border-[#E4E6EB] bg-white shadow-lg md:inset-x-auto md:right-0 md:w-80"
        >
          <div className="flex items-center justify-between border-b border-[#E4E6EB] px-4 py-3">
            <h2 className="text-sm font-extrabold text-brand-navy">Notifikasi</h2>
            {unreadCount > 0 && (
              <span className="rounded-full bg-brand-teal/10 px-2 py-0.5 text-[11px] font-bold text-brand-navy">
                {unreadCount} baru
              </span>
            )}
          </div>
          <ul className="max-h-80 overflow-y-auto p-2">
            {notifikasi.map((n) => (
              <li
                key={n.id}
                className={`flex gap-3 rounded-lg px-3 py-2.5 ${
                  n.belumDibaca ? "bg-brand-teal/5" : ""
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                    n.belumDibaca ? "bg-brand-teal" : "bg-transparent"
                  }`}
                />
                <div className="flex min-w-0 flex-col gap-0.5">
                  <p className={`text-sm ${n.belumDibaca ? "font-semibold text-[#14171F]" : "text-[#4B4F58]"}`}>
                    {n.judul}
                    {n.belumDibaca && <span className="sr-only"> (belum dibaca)</span>}
                  </p>
                  <p className="text-xs text-[#6E7280]">{n.waktu}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
