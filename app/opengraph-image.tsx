import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Sosyal medya / mesajlaşma paylaşımlarında görünen varsayılan görsel (tüm site sayfaları).
// Logo unvanı zaten içerdiği için ayrıca Türkçe karakterli metin (ve font) gerekmez.

export const alt = "Akış Partners Hukuk & Danışmanlık";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logo = await readFile(join(process.cwd(), "public/akislogo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#FFFFFF",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={520} height={520} alt="" />
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: -30 }}>
          <div style={{ width: 120, height: 1, background: "#C9A55C" }} />
          <div style={{ fontSize: 24, letterSpacing: 4, color: "#0B1B33" }}>akispartnershukuk.com</div>
          <div style={{ width: 120, height: 1, background: "#C9A55C" }} />
        </div>
      </div>
    ),
    size,
  );
}
