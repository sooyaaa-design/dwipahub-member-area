"use client";

import { useState } from "react";
import {
  DUMMY_DISKUSI,
  DUMMY_MATERI,
  DUMMY_UNDUHAN,
  type Lesson,
} from "@/lib/dummy-data";
import { DummyActionButton } from "../../dummy-action-button";

const TABS = [
  { id: "materi", label: "Materi" },
  { id: "diskusi", label: "Diskusi" },
  { id: "unduhan", label: "Unduhan" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const secondaryButton =
  "rounded-lg border border-[#D8DAE0] px-3 py-1.5 text-xs font-semibold text-[#14171F] hover:bg-[#F4F5F7]";

export function KelasPlayer({ lessons }: { lessons: Lesson[] }) {
  const [activeLessonId, setActiveLessonId] = useState(
    (lessons.find((l) => !l.selesai) ?? lessons[0]).id,
  );
  const [activeTab, setActiveTab] = useState<TabId>("materi");

  const activeIndex = lessons.findIndex((l) => l.id === activeLessonId);
  const activeLesson = lessons[activeIndex];
  const doneCount = lessons.filter((l) => l.selesai).length;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="flex flex-col gap-5">
        {/* TODO: ganti dengan video player asli dari classes.video_url */}
        <div className="flex aspect-video flex-col items-center justify-center gap-3 rounded-[14px] bg-[#14171F] text-white">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <div className="px-6 text-center">
            <div className="text-sm font-semibold">
              Pelajaran {activeIndex + 1}: {activeLesson.judul}
            </div>
            <div className="text-xs text-white/60">Video placeholder</div>
          </div>
        </div>

        <div className="rounded-[14px] border border-[#E4E6EB] bg-white">
          <div role="tablist" aria-label="Konten kelas" className="flex gap-6 border-b border-[#E4E6EB] px-6">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={activeTab === tab.id}
                aria-controls={`panel-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`-mb-px border-b-2 py-3.5 text-sm ${
                  activeTab === tab.id
                    ? "border-[#1DB5D8] font-bold text-[#14171F]"
                    : "border-transparent font-medium text-[#4B4F58] hover:text-[#14171F]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div
            role="tabpanel"
            id={`panel-${activeTab}`}
            aria-labelledby={`tab-${activeTab}`}
            className="p-6 text-sm"
          >
            {/* TODO: ganti dengan data asli — isi ketiga tab masih dummy */}
            {activeTab === "materi" && (
              <div className="flex flex-col gap-3">
                <p className="text-[#4B4F58]">{DUMMY_MATERI.ringkasan}</p>
                <ul className="list-disc space-y-1.5 pl-5 text-[#14171F]">
                  {DUMMY_MATERI.poin.map((poin) => (
                    <li key={poin}>{poin}</li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === "diskusi" && (
              <div className="flex flex-col gap-4">
                {DUMMY_DISKUSI.map((d) => (
                  <div key={d.id} className="flex flex-col gap-1 border-b border-[#F0F1F3] pb-4 last:border-0">
                    <div className="flex items-baseline gap-2">
                      <span className="font-semibold">{d.nama}</span>
                      <span className="text-xs text-[#6E7280]">{d.waktu}</span>
                    </div>
                    <p className="text-[#4B4F58]">{d.isi}</p>
                  </div>
                ))}
                <label htmlFor="diskusi-baru" className="sr-only">
                  Tulis pertanyaan
                </label>
                <textarea
                  id="diskusi-baru"
                  rows={3}
                  placeholder="Tulis pertanyaan untuk mentor..."
                  className="rounded-lg border border-[#D8DAE0] px-3 py-2.5 text-sm outline-none focus:border-[#1DB5D8]"
                />
                <div className="self-end">
                  <DummyActionButton label="Kirim" className={secondaryButton} />
                </div>
              </div>
            )}

            {activeTab === "unduhan" && (
              <ul className="flex flex-col gap-3">
                {DUMMY_UNDUHAN.map((file) => (
                  <li
                    key={file.id}
                    className="flex items-start justify-between gap-4 rounded-lg border border-[#E4E6EB] px-4 py-3"
                  >
                    <div>
                      <div className="font-medium">{file.nama}</div>
                      <div className="text-xs text-[#6E7280]">{file.ukuran}</div>
                    </div>
                    <DummyActionButton label="Unduh" className={secondaryButton} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <aside className="flex flex-col gap-4 self-start rounded-[14px] border border-[#E4E6EB] bg-white p-5">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-sm">
            <span className="font-bold">Daftar Pelajaran</span>
            <span className="text-[#6E7280]">
              {doneCount}/{lessons.length} selesai
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[#ECEDF0]">
            <div
              className="h-full bg-[#1DB5D8]"
              style={{ width: `${(doneCount / lessons.length) * 100}%` }}
            />
          </div>
        </div>

        <ol className="flex flex-col gap-1.5">
          {lessons.map((lesson, index) => {
            const active = lesson.id === activeLessonId;
            return (
              <li key={lesson.id}>
                <button
                  type="button"
                  onClick={() => setActiveLessonId(lesson.id)}
                  aria-current={active ? "true" : undefined}
                  className={`flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left text-sm ${
                    active ? "bg-[#EAF7FA]" : "hover:bg-[#F4F5F7]"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                      lesson.selesai
                        ? "bg-[#1DB5D8] text-white"
                        : "border border-[#C9CCD3] text-[#6E7280]"
                    }`}
                  >
                    {lesson.selesai ? (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-label="Selesai">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </span>
                  <span className="flex flex-col">
                    <span className={active ? "font-semibold" : ""}>{lesson.judul}</span>
                    {lesson.durasi && (
                      <span className="text-xs text-[#6E7280]">{lesson.durasi}</span>
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </aside>
    </div>
  );
}
