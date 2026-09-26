"use client";

import { useState } from "react";

// TODO: ganti dengan aksi asli — tombol ini hanya memberi tahu bahwa
// fiturnya belum aktif.
export function DummyActionButton({
  label,
  className,
  message = "Fitur ini belum aktif (masih data dummy).",
}: {
  label: string;
  className: string;
  message?: string;
}) {
  const [shown, setShown] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <button type="button" onClick={() => setShown(true)} className={className}>
        {label}
      </button>
      {shown && (
        <p role="status" className="text-xs text-[#6E7280]">
          {message}
        </p>
      )}
    </div>
  );
}
