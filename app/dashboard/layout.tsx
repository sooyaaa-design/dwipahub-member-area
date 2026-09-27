import Image from "next/image";
import Link from "next/link";
import { TIER_LABEL } from "@/lib/labels";
import logo from "@/public/logo-dwipahub.png";
import { logout } from "./actions";
import { getCurrentMember } from "./current-member";
import { DashboardNav } from "./dashboard-nav";
import { MobileAccountMenu, MobileNavMenu } from "./mobile-menus";
import { NotificationMenu } from "./notification-menu";

export default async function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  const { user, member } = await getCurrentMember();
  const tier = member?.tier ?? "pengantar";

  return (
    <div className="flex flex-1 flex-col bg-[#F4F5F7] text-[#14171F]">
      {/* relative: anchors the full-width mobile panels below the header.
          md+: never wraps — the right group is locked (shrink-0) and the nav
          absorbs any shortage by scrolling horizontally. */}
      <header className="relative flex min-h-16 flex-nowrap items-center justify-between gap-x-3 md:gap-x-6 border-b border-[#E4E6EB] bg-white px-4 py-3 md:min-h-[72px] md:px-6 lg:px-10">
        <div className="flex min-w-0 flex-1 items-center gap-x-6 lg:gap-x-11">
          <Link href="/dashboard" className="shrink-0">
            <Image
              src={logo}
              alt="DwipaHub"
              loading="eager"
              className="h-8 w-auto md:h-9"
            />
          </Link>
          <div className="hidden min-w-0 [scrollbar-width:thin] md:block md:overflow-x-auto">
            <DashboardNav />
          </div>
        </div>

        {/* Mobile (< md): hamburger nav + notifications + avatar account menu. */}
        <div className="flex shrink-0 items-center gap-1.5 md:hidden">
          <MobileNavMenu loggedIn={!!user} />
          {user && (
            <>
              <NotificationMenu />
              <MobileAccountMenu tierLabel={TIER_LABEL[tier] ?? tier} />
            </>
          )}
        </div>

        <div className="hidden shrink-0 flex-nowrap items-center gap-3.5 md:flex">
          {user ? (
            <>
              <span className="rounded-full bg-brand-teal/10 px-3 py-1 text-xs font-bold whitespace-nowrap text-brand-navy">
                TIER: {(TIER_LABEL[tier] ?? tier).toUpperCase()}
              </span>
              <NotificationMenu />
              <div className="h-[38px] w-[38px] shrink-0 rounded-full bg-[#D8DAE0]" />
              <form action={logout}>
                <button
                  type="submit"
                  className="rounded-lg border border-[#D8DAE0] px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-[#4B4F58] hover:bg-[#F4F5F7]"
                >
                  Keluar
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-semibold text-[#4B4F58] hover:text-[#14171F]"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-brand-navy px-4 py-2 text-sm font-semibold text-white hover:bg-brand-navy/90"
              >
                Daftar
              </Link>
            </>
          )}
        </div>
      </header>
      {children}
    </div>
  );
}
