"use client";

import { useEffect, type RefObject } from "react";

// Closes an open menu on outside click or Escape (Escape returns focus to
// the trigger button).
export function useDismiss(
  open: boolean,
  setOpen: (open: boolean) => void,
  containerRef: RefObject<HTMLElement | null>,
  buttonRef: RefObject<HTMLButtonElement | null>,
) {
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, setOpen, containerRef, buttonRef]);
}
