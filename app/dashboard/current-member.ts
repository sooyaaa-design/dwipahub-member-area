import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

// Shared by the dashboard layout and pages; cache() dedupes the auth call and
// members query within a single request.
export const getCurrentMember = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, member: null };
  }

  const { data: member } = await supabase
    .from("members")
    .select("nama, tier")
    .eq("id", user.id)
    .maybeSingle();

  return { user, member };
});
