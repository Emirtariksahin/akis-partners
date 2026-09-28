import type { Metadata } from "next";
import KeystaticApp from "./keystatic";

export const metadata: Metadata = {
  title: "İçerik Yönetimi | Akış Partners",
  robots: { index: false, follow: false },
};

export default function KeystaticLayout() {
  return (
    <html lang="tr">
      <body>
        <KeystaticApp />
      </body>
    </html>
  );
}
