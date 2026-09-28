"use client";

import { tercihPaneliniAc } from "@/lib/consent";

export function CookiePreferencesButton({ className }: { className?: string }) {
  return (
    <button type="button" onClick={tercihPaneliniAc} className={className}>
      Çerez Tercihleri
    </button>
  );
}
