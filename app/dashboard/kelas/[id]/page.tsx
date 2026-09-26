import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { startTrial } from "../../actions";

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
    .select("id, nama, kategori, min_tier, trial_days")
    .eq("id", id)
    .maybeSingle();

  if (!moduleRow) {
    notFound();
  }

  const { data: access } = await supabase
    .from("member_access")
    .select("status, trial_ends_at")
    .eq("member_id", user.id)
    .eq("module_id", id)
    .maybeSingle();

  const { data: classes } = await supabase
    .from("classes")
    .select("id, judul, urutan")
    .eq("module_id", id)
    .order("urutan");

  const classRows = classes ?? [];
  const canStartTrial = !access && moduleRow.trial_days > 0;

  return (
    <div className="flex flex-1 flex-col bg-[#F4F5F7] p-10 text-[#14171F]">
      <a href="/dashboard" className="mb-6 text-sm text-[#6E7280] hover:text-[#14171F]">
        &larr; Kembali ke Beranda
      </a>

      <div className="flex flex-col gap-6 rounded-[14px] border border-[#E4E6EB] bg-white p-8">
        <div className="flex flex-col gap-1">
          <div className="text-xl font-extrabold">{moduleRow.nama}</div>
          <div className="text-sm text-[#6E7280]">{moduleRow.kategori}</div>
        </div>

        {classRows.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {classRows.map((classRow) => (
              <li
                key={classRow.id}
                className="rounded-lg border border-[#E4E6EB] px-4 py-3 text-sm font-medium"
              >
                {classRow.urutan}. {classRow.judul}
              </li>
            ))}
          </ul>
        ) : canStartTrial ? (
          <div className="flex flex-col items-start gap-3">
            <p className="text-sm text-[#6E7280]">
              Kamu belum punya akses ke materi modul ini. Coba gratis{" "}
              {moduleRow.trial_days} hari untuk membuka semua materinya.
            </p>
            <form action={startTrial}>
              <input type="hidden" name="moduleId" value={moduleRow.id} />
              <button
                type="submit"
                className="rounded-lg bg-[#1DB5D8] px-4 py-2.5 text-sm font-semibold text-white"
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
    </div>
  );
}
