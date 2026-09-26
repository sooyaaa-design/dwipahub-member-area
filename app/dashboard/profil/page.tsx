import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const TIER_LABEL: Record<string, string> = {
  pengantar: "Pengantar",
  sertifikasi: "Sertifikasi",
  lanjutan: "Lanjutan",
};

export default async function ProfilPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/dashboard/profil");
  }

  const { data: member } = await supabase
    .from("members")
    .select("nama, tier")
    .eq("id", user.id)
    .maybeSingle();

  const tier = member?.tier ?? "pengantar";

  return (
    <div className="flex flex-1 flex-col bg-[#F4F5F7] p-10 text-[#14171F]">
      <a href="/dashboard" className="mb-6 text-sm text-[#6E7280] hover:text-[#14171F]">
        &larr; Kembali ke Beranda
      </a>
      <div className="flex max-w-md flex-col gap-4 rounded-[14px] border border-[#E4E6EB] bg-white p-8">
        <div className="text-xl font-extrabold">{member?.nama ?? user.email}</div>
        <dl className="flex flex-col gap-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-[#6E7280]">Email</dt>
            <dd className="font-medium">{user.email}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-[#6E7280]">Tier</dt>
            <dd className="font-medium">{TIER_LABEL[tier] ?? tier}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
