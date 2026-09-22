export function ModuleCard({
  title,
  description,
  cta,
  locked,
  lockedLabel,
}: {
  title: string;
  description: string;
  cta: string;
  locked?: boolean;
  lockedLabel?: string;
}) {
  return (
    <div
      className={`relative flex h-[190px] flex-col gap-3.5 rounded-[14px] border border-[#E4E6EB] p-[22px] ${
        locked ? "bg-[#F7F7F8]" : "bg-white"
      }`}
    >
      {locked && lockedLabel && (
        <span className="absolute right-4 top-4 rounded-full bg-[#ECEDF0] px-2.5 py-0.5 text-[11px] font-bold text-[#6E7280]">
          🔒 {lockedLabel}
        </span>
      )}
      <div
        className={`h-10 w-10 rounded-[10px] ${locked ? "bg-[#E4E6EB]" : "bg-[#EAF7FA]"}`}
      />
      <div className="flex flex-grow flex-col gap-1">
        <div className={`text-[15px] font-bold ${locked ? "text-[#9AA0AC]" : ""}`}>
          {title}
        </div>
        <div className={`text-[13px] ${locked ? "text-[#9AA0AC]" : "text-[#6E7280]"}`}>
          {description}
        </div>
      </div>
      <button
        type="button"
        disabled={locked}
        className={`w-full rounded-lg border px-4 py-2.5 text-sm font-semibold ${
          locked
            ? "cursor-not-allowed border-[#D8DAE0] text-[#9AA0AC]"
            : "border-[#D8DAE0] text-[#14171F] hover:bg-[#F4F5F7]"
        }`}
      >
        {cta}
      </button>
    </div>
  );
}
