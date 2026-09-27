import type { ReactNode } from "react";

export function ModuleCard({
  title,
  description,
  footer,
  muted,
  badge,
}: {
  title: string;
  description: string;
  footer: ReactNode;
  muted?: boolean;
  badge?: string;
}) {
  return (
    <div
      className={`relative flex h-[190px] flex-col gap-3.5 rounded-[14px] border border-[#E4E6EB] p-[22px] ${
        muted ? "bg-[#F7F7F8]" : "bg-white"
      }`}
    >
      {badge && (
        <span className="absolute right-4 top-4 rounded-full bg-[#ECEDF0] px-2.5 py-0.5 text-[11px] font-bold text-[#6E7280]">
          {badge}
        </span>
      )}
      <div
        className={`h-10 w-10 rounded-[10px] ${muted ? "bg-[#E4E6EB]" : "bg-brand-teal/10"}`}
      />
      <div className="flex flex-grow flex-col gap-1">
        <div className={`text-[15px] font-bold ${muted ? "text-[#9AA0AC]" : ""}`}>
          {title}
        </div>
        <div className={`text-[13px] ${muted ? "text-[#9AA0AC]" : "text-[#6E7280]"}`}>
          {description}
        </div>
      </div>
      {footer}
    </div>
  );
}
