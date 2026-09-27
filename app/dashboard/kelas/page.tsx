import Link from "next/link";
import { redirect } from "next/navigation";
import { TIER_LABEL, formatSlug } from "@/lib/labels";
import { createClient } from "@/lib/supabase/server";
import { MODULE_COLUMNS, loadAccessByModuleId } from "../marketplace-state";
import { ModuleCard } from "../module-card";
import { ModuleCtaButton, getModuleCta, type ModuleRow } from "../module-cta";

function kelasHref(vertical: string, skill?: string) {
  const params = new URLSearchParams({ vertical });
  if (skill) params.set("skill", skill);
  return `/dashboard/kelas?${params}`;
}

export default async function KelasPage(props: PageProps<"/dashboard/kelas">) {
  const { vertical: verticalParam, skill: skillParam } = await props.searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/dashboard/kelas");
  }

  const [{ data: modules }, accessByModuleId] = await Promise.all([
    supabase
      .from("modules")
      .select(MODULE_COLUMNS)
      .eq("module_type", "kelas")
      .order("min_tier")
      .order("created_at"),
    loadAccessByModuleId(supabase, user.id),
  ]);

  const kelasRows = (modules ?? []) as ModuleRow[];
  const verticals = [...new Set(kelasRows.map((m) => m.vertical))].sort();

  const activeVertical = verticals.includes(verticalParam as string)
    ? (verticalParam as string)
    : verticals[0];

  const inVertical = kelasRows.filter((m) => m.vertical === activeVertical);
  const skills = [...new Set(inVertical.map((m) => m.skill_area))].sort();

  const activeSkill = skills.includes(skillParam as string)
    ? (skillParam as string)
    : undefined;

  const visible = activeSkill
    ? inVertical.filter((m) => m.skill_area === activeSkill)
    : inVertical;

  const chipClass = (active: boolean) =>
    `rounded-full border px-3.5 py-1.5 text-xs font-semibold ${
      active
        ? "border-brand-teal bg-brand-teal/10 text-brand-navy"
        : "border-[#D8DAE0] bg-white text-[#4B4F58] hover:bg-[#F4F5F7]"
    }`;

  return (
    <div className="flex flex-1 flex-col bg-[#F4F5F7] p-10 text-[#14171F]">
      <Link href="/dashboard" className="mb-6 text-sm text-[#6E7280] hover:text-[#14171F]">
        &larr; Kembali ke Beranda
      </Link>
      <div className="mb-5 text-xl font-extrabold">Kelas</div>

      {verticals.length === 0 ? (
        <div className="rounded-[14px] border border-[#E4E6EB] bg-white p-8 text-sm text-[#6E7280]">
          Belum ada kelas yang tersedia.
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <nav
            aria-label="Vertikal"
            className="flex gap-7 border-b border-[#E4E6EB] text-sm font-medium"
          >
            {verticals.map((vertical) => (
              <Link
                key={vertical}
                href={kelasHref(vertical)}
                aria-current={vertical === activeVertical ? "page" : undefined}
                className={`-mb-px border-b-2 pb-2.5 ${
                  vertical === activeVertical
                    ? "border-brand-teal font-bold text-[#14171F]"
                    : "border-transparent text-[#4B4F58] hover:text-[#14171F]"
                }`}
              >
                {formatSlug(vertical)}
              </Link>
            ))}
          </nav>

          <div aria-label="Skill area" className="flex flex-wrap gap-2">
            <Link
              href={kelasHref(activeVertical)}
              aria-current={activeSkill ? undefined : "true"}
              className={chipClass(!activeSkill)}
            >
              Semua
            </Link>
            {skills.map((skill) => (
              <Link
                key={skill}
                href={kelasHref(activeVertical, skill)}
                aria-current={skill === activeSkill ? "true" : undefined}
                className={chipClass(skill === activeSkill)}
              >
                {formatSlug(skill)}
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {visible.map((moduleRow) => (
              <ModuleCard
                key={moduleRow.id}
                title={moduleRow.nama}
                description={formatSlug(moduleRow.skill_area)}
                badge={`TIER ${(TIER_LABEL[moduleRow.min_tier] ?? moduleRow.min_tier).toUpperCase()}`}
                footer={
                  <ModuleCtaButton
                    cta={getModuleCta(
                      moduleRow,
                      accessByModuleId.get(moduleRow.id) ?? null,
                      true,
                    )}
                    moduleId={moduleRow.id}
                  />
                }
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
