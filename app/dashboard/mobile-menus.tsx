"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId, useRef, useState } from "react";
import { logout } from "./actions";
import { NAV_ITEMS, isNavActive } from "./dashboard-nav";
import { useDismiss } from "./use-dismiss";

const panelClass =
  "absolute z-20 mt-2 rounded-[14px] border border-[#E4E6EB] bg-white p-2 shadow-lg";
const itemClass = "block rounded-lg px-3 py-2.5 text-sm font-medium";

export function MobileNavMenu({ loggedIn }: { loggedIn: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  useDismiss(open, setOpen, containerRef, buttonRef);

  return (
    // Not `relative`: the panel spans the full header width below it.
    <div ref={containerRef}>
      <button
        ref={buttonRef}
        type="button"
        aria-label={open ? "Tutup menu" : "Buka menu"}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className="flex h-10 w-10 items-center justify-center rounded-lg text-brand-navy hover:bg-[#F4F5F7]"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>
      {open && (
        <nav id={panelId} aria-label="Menu utama" className={`${panelClass} inset-x-4 top-full`}>
          {NAV_ITEMS.map(({ href, label }) => {
            const active = isNavActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={`${itemClass} border-l-[3px] ${
                  active
                    ? "border-brand-teal bg-brand-teal/10 font-bold text-brand-navy"
                    : "border-transparent text-[#4B4F58] hover:bg-[#F4F5F7]"
                }`}
              >
                {label}
              </Link>
            );
          })}
          {!loggedIn && (
            <div className="mt-2 flex gap-2 border-t border-[#E4E6EB] pt-3">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="flex-1 rounded-lg border border-[#D8DAE0] px-4 py-2.5 text-center text-sm font-semibold text-[#4B4F58]"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="flex-1 rounded-lg bg-brand-navy px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-brand-navy/90"
              >
                Daftar
              </Link>
            </div>
          )}
        </nav>
      )}
    </div>
  );
}

export function MobileAccountMenu({ tierLabel }: { tierLabel: string }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  useDismiss(open, setOpen, containerRef, buttonRef);

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-label="Menu akun"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className={`block h-[38px] w-[38px] rounded-full bg-[#D8DAE0] ${
          open ? "ring-2 ring-brand-teal ring-offset-2" : ""
        }`}
      />
      {open && (
        <div id={panelId} className={`${panelClass} right-0 top-full w-56`}>
          <div className="px-3 pt-2 pb-3">
            <span className="rounded-full bg-brand-teal/10 px-3 py-1 text-xs font-bold whitespace-nowrap text-brand-navy">
              Tier: {tierLabel}
            </span>
          </div>
          <div className="border-t border-[#E4E6EB] pt-2">
            <Link
              href="/dashboard/profil"
              onClick={() => setOpen(false)}
              className={`${itemClass} text-[#14171F] hover:bg-[#F4F5F7]`}
            >
              Profil
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className={`${itemClass} w-full text-left text-[#B42318] hover:bg-[#FDECEC]`}
              >
                Keluar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
