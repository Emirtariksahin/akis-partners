"use client";

import { useEffect } from "react";

// Siteden en az ASGARI_UZUNLUK karakterlik metin kopyalandığında sonuna sayfa adresini kaynak olarak ekler.
// Form alanları ve `data-no-attribution` ile işaretlenmiş bölümler (telefon, e-posta vb.) etkilenmez.
const ASGARI_UZUNLUK = 40;
const HARIC = 'input, textarea, select, [contenteditable="true"], [data-no-attribution]';

function htmlKacis(metin: string) {
  return metin.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function CopyAttribution() {
  useEffect(() => {
    const kopyala = (e: ClipboardEvent) => {
      const secim = window.getSelection();
      if (!secim || secim.isCollapsed || !e.clipboardData) return;

      const metin = secim.toString();
      if (metin.trim().length < ASGARI_UZUNLUK) return;

      const aktif = document.activeElement;
      if (aktif instanceof HTMLInputElement || aktif instanceof HTMLTextAreaElement) return;
      const dugum = secim.anchorNode;
      const eleman = dugum instanceof Element ? dugum : dugum?.parentElement;
      if (eleman?.closest(HARIC)) return;

      const adres = window.location.origin + window.location.pathname;
      const kapsayici = document.createElement("div");
      for (let i = 0; i < secim.rangeCount; i++) kapsayici.appendChild(secim.getRangeAt(i).cloneContents());

      e.clipboardData.setData("text/plain", `${metin}\n\nKaynak: ${adres}`);
      e.clipboardData.setData(
        "text/html",
        `${kapsayici.innerHTML}<br><br>Kaynak: <a href="${htmlKacis(adres)}">${htmlKacis(adres)}</a>`,
      );
      e.preventDefault();
    };

    document.addEventListener("copy", kopyala);
    return () => document.removeEventListener("copy", kopyala);
  }, []);

  return null;
}
