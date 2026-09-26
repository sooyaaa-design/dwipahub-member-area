import { startTrial } from "./actions";

export type ModuleRow = {
  id: string;
  nama: string;
  kategori: string;
  min_tier: string;
  trial_days: number;
  vertical: string;
  skill_area: string;
  module_type: "kelas" | "marketplace" | "tool" | "app";
};

export type AccessStatus = "pending" | "active" | "expired" | "revoked" | "trial";

export type AccessRow = {
  status: AccessStatus;
  trial_ends_at: string | null;
} | null;

type Cta =
  | { kind: "link"; label: string; href: string }
  | { kind: "start-trial"; label: string }
  | { kind: "disabled"; label: string };

export function getModuleCta(
  moduleRow: ModuleRow,
  access: AccessRow,
  loggedIn: boolean,
): Cta {
  if (!loggedIn) {
    if (moduleRow.module_type === "marketplace") {
      return { kind: "link", label: "Daftar untuk Akses", href: "/register" };
    }
    return moduleRow.trial_days > 0
      ? {
          kind: "link",
          label: `Coba Gratis ${moduleRow.trial_days} Hari`,
          href: `/register?module=${moduleRow.id}&trial=true`,
        }
      : {
          kind: "link",
          label: "Daftar untuk Akses",
          href: `/register?module=${moduleRow.id}`,
        };
  }

  if (!access) {
    return moduleRow.trial_days > 0
      ? { kind: "start-trial", label: "Mulai Trial" }
      : { kind: "disabled", label: "Hubungi Admin untuk Akses" };
  }

  switch (access.status) {
    case "active":
      return {
        kind: "link",
        label: "Buka",
        href: `/dashboard/kelas/${moduleRow.id}`,
      };
    case "trial": {
      const endsAt = access.trial_ends_at
        ? new Date(access.trial_ends_at).getTime()
        : 0;
      if (endsAt > Date.now()) {
        const daysLeft = Math.max(1, Math.ceil((endsAt - Date.now()) / 86_400_000));
        return {
          kind: "link",
          label: `Lanjutkan (sisa ${daysLeft} hari)`,
          href: `/dashboard/kelas/${moduleRow.id}`,
        };
      }
      return { kind: "disabled", label: "Trial Berakhir - Upgrade" };
    }
    case "expired":
      return { kind: "disabled", label: "Akses Berakhir - Upgrade" };
    case "pending":
      return { kind: "disabled", label: "Menunggu Persetujuan" };
    case "revoked":
      return { kind: "disabled", label: "Akses Dicabut" };
  }
}

const buttonClass =
  "w-full rounded-lg border px-4 py-2.5 text-center text-sm font-semibold";
const activeButtonClass = `${buttonClass} border-[#D8DAE0] text-[#14171F] hover:bg-[#F4F5F7]`;
const disabledButtonClass = `${buttonClass} cursor-not-allowed border-[#D8DAE0] text-[#9AA0AC]`;

export function ModuleCtaButton({
  cta,
  moduleId,
}: {
  cta: Cta;
  moduleId: string;
}) {
  if (cta.kind === "link") {
    return (
      <a href={cta.href} className={activeButtonClass}>
        {cta.label}
      </a>
    );
  }

  if (cta.kind === "start-trial") {
    return (
      <form action={startTrial}>
        <input type="hidden" name="moduleId" value={moduleId} />
        <button type="submit" className={activeButtonClass}>
          {cta.label}
        </button>
      </form>
    );
  }

  return (
    <button type="button" disabled className={disabledButtonClass}>
      {cta.label}
    </button>
  );
}
