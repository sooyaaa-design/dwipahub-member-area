export const TIER_ORDER = ["pengantar", "sertifikasi", "lanjutan"];

export const TIER_LABEL: Record<string, string> = {
  pengantar: "Pengantar",
  sertifikasi: "Sertifikasi",
  lanjutan: "Lanjutan",
};

export function formatSlug(slug: string) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
