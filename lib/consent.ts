"use client";

import { useSyncExternalStore } from "react";

// Çerez / yerel depolama tercihleri. Zorunlu kategori her zaman açıktır;
// harita (Google Maps) ve analitik yalnızca açık onayla etkinleşir.

export type CerezTercihleri = { harita: boolean; analitik: boolean; tarih: string };

const ANAHTAR = "cerez-tercihleri";
const DEGISIM_OLAYI = "cerez-tercihleri-degisti";
export const TERCIH_PANELI_OLAYI = "cerez-tercihleri-ac";

function oku(): CerezTercihleri | null {
  try {
    const ham = window.localStorage.getItem(ANAHTAR);
    return ham ? (JSON.parse(ham) as CerezTercihleri) : null;
  } catch {
    return null;
  }
}

let onbellek: { ham: string | null; deger: CerezTercihleri | null } = { ham: null, deger: null };

function anlikGoruntu(): CerezTercihleri | null {
  let ham: string | null = null;
  try {
    ham = window.localStorage.getItem(ANAHTAR);
  } catch {
    ham = null;
  }
  if (ham !== onbellek.ham) onbellek = { ham, deger: oku() };
  return onbellek.deger;
}

function abone(bildir: () => void) {
  window.addEventListener(DEGISIM_OLAYI, bildir);
  window.addEventListener("storage", bildir);
  return () => {
    window.removeEventListener(DEGISIM_OLAYI, bildir);
    window.removeEventListener("storage", bildir);
  };
}

export function tercihleriKaydet(tercih: Omit<CerezTercihleri, "tarih">) {
  try {
    window.localStorage.setItem(ANAHTAR, JSON.stringify({ ...tercih, tarih: new Date().toISOString() }));
  } catch {
    // Depolama kapalıysa tercih yalnızca bu oturumda geçerli olmaz; site yine çalışır.
  }
  window.dispatchEvent(new Event(DEGISIM_OLAYI));
}

export function tercihPaneliniAc() {
  window.dispatchEvent(new Event(TERCIH_PANELI_OLAYI));
}

/** Sunucuda ve ilk render'da `undefined` döner; tarayıcıda kayıtlı tercih ya da `null`. */
export function useCerezTercihleri(): CerezTercihleri | null | undefined {
  return useSyncExternalStore(abone, anlikGoruntu, () => undefined);
}
