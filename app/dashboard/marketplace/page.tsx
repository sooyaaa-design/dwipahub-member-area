import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function MarketplacePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/dashboard/marketplace");
  }

  return (
    <div className="flex flex-1 flex-col bg-[#F4F5F7] p-10 text-[#14171F]">
      <a href="/dashboard" className="mb-6 text-sm text-[#6E7280] hover:text-[#14171F]">
        &larr; Kembali ke Beranda
      </a>
      <div className="rounded-[14px] border border-[#E4E6EB] bg-white p-8">
        <p className="text-sm text-[#6E7280]">
          Daftar paket marketplace akan segera hadir di sini.
        </p>
      </div>
    </div>
  );
}
