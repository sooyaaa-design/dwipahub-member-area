import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { DUMMY_LESSONS, type Lesson } from "@/lib/dummy-data";
import { TIER_LABEL, TIER_ORDER, formatSlug } from "@/lib/labels";
import { createClient } from "@/lib/supabase/server";
import { startTrial } from "../../actions";
import { isTrialActive, type AccessRow } from "../../module-cta";
import { KelasPlayer } from "./kelas-player";

export default async function KelasDetailPage(
  props: PageProps<"/dashboard/kelas/[id]">,
) {
  const { id } = await props.params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/dashboard/kelas/${id}`);
  }

  const { data: moduleRow } = await supabase
    .from("modules")
    .select("id, nama, skill_area, min_tier, trial_days")
    .eq("id", id)
    .maybeSingle();

  if (!moduleRow) {
    notFound();
  }

  const [{ data: access }, { data: member }, { data: classes }] = await Promise.all([
    supabase
      .from("member_access")
      .select("status, trial_ends_at")
      .eq("member_id", user.id)
      .eq("module_id", id)
      .maybeSingle(),
    supabase.from("members").select("tier").eq("id", user.id).maybeSingle(),
    supabase
      .from("classes")
      .select("id, judul, urutan")
      .eq("module_id", id)
      .order("urutan"),
  ]);

  const classRows = classes ?? [];

  // Mirrors the classes_select_if_unlocked RLS policy. An empty classes
  // result is ambiguous under RLS (no lessons yet vs. no access), so this
  // decides whether to show content at all.
  const hasAccess =
    classRows.length > 0 ||
    (member != null &&
      TIER_ORDER.indexOf(member.tier) >= TIER_ORDER.indexOf(moduleRow.min_tier)) ||
    access?.status === "active" ||
    isTrialActive(access as AccessRow);

  const canStartTrial = !access && moduleRow.trial_days > 0;

  // TODO: ganti dengan data asli — progress (selesai) dan durasi belum ada di
  // skema; kalau classes masih kosong, seluruh daftar pelajaran memakai dummy.
  const lessons: Lesson[] =
    classRows.length > 0
      ? classRows.map((c) => ({ id: c.id, judul: c.judul, durasi: null, selesai: false }))
      : DUMMY_LESSONS;

  return (
    <div className="flex flex-1 flex-col bg-[#F4F5F7] p-10 text-[#14171F]">
      <Link href="/dashboard/kelas" className="mb-6 text-sm text-[#6E7280] hover:text-[#14171F]">
        &larr; Kembali ke Kelas
      </Link>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-extrabold text-brand-navy">{moduleRow.nama}</h1>
        <span className="rounded-full bg-brand-teal/10 px-2.5 py-0.5 text-[11px] font-bold text-brand-navy">
          {formatSlug(moduleRow.skill_area)}
        </span>
        <span className="rounded-full bg-[#ECEDF0] px-2.5 py-0.5 text-[11px] font-bold text-[#6E7280]">
          TIER {(TIER_LABEL[moduleRow.min_tier] ?? moduleRow.min_tier).toUpperCase()}
        </span>
      </div>

      {hasAccess ? (
        <KelasPlayer lessons={lessons} />
      ) : (
        <div className="rounded-[14px] border border-[#E4E6EB] bg-white p-8">
          {canStartTrial ? (
            <div className="flex flex-col items-start gap-3">
              <p className="text-sm text-[#6E7280]">
                Kamu belum punya akses ke materi modul ini. Coba gratis{" "}
                {moduleRow.trial_days} hari untuk membuka semua materinya.
              </p>
              <form action={startTrial}>
                <input type="hidden" name="moduleId" value={moduleRow.id} />
                <button
                  type="submit"
                  className="rounded-lg bg-brand-gradient px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90"
                >
                  Mulai Trial {moduleRow.trial_days} Hari
                </button>
              </form>
            </div>
          ) : (
            <p className="text-sm text-[#6E7280]">
              Kamu belum punya akses ke materi modul ini. Hubungi admin untuk
              upgrade akses.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
