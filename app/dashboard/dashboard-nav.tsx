"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Beranda" },
  { href: "/dashboard/kelas", label: "Kelas" },
  { href: "/dashboard/marketplace", label: "Marketplace" },
  { href: "/dashboard/ai-tools", label: "AI Tools" },
  { href: "/dashboard/profil", label: "Profil" },
];

// Beranda only matches exactly; other items stay active on their subpages.
export function isNavActive(pathname: string, href: string) {
  return href === "/dashboard"
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);
}

// Client component because layouts don't re-render on navigation, so the
// active item has to come from usePathname.
export function DashboardNav() {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);

  // On medium screens the nav's wrapper scrolls horizontally; keep the active
  // item in view. Adjusts scrollLeft directly so the page never scrolls.
  useEffect(() => {
    const scroller = navRef.current?.parentElement;
    const active = navRef.current?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!scroller || !active || scroller.scrollWidth <= scroller.clientWidth) return;
    const left = active.offsetLeft - scroller.offsetLeft;
    const right = left + active.offsetWidth;
    if (left < scroller.scrollLeft) {
      scroller.scrollLeft = left;
    } else if (right > scroller.scrollLeft + scroller.clientWidth) {
      scroller.scrollLeft = right - scroller.clientWidth;
    }
  }, [pathname]);

  return (
    <nav ref={navRef} className="flex gap-7 text-sm font-medium text-[#4B4F58]">
      {NAV_ITEMS.map(({ href, label }) => {
        const active = isNavActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`border-b-2 pb-1.5 whitespace-nowrap ${
              active
                ? "border-brand-teal font-bold text-[#14171F]"
                : "border-transparent hover:text-[#14171F]"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
