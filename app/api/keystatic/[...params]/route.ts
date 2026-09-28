import { makeRouteHandler } from "@keystatic/next/route-handler";
import config from "../../../../keystatic.config";

// GitHub modunda Keystatic, GitHub App anahtarları olmadan derlemeyi durdurur. Anahtarlar Vercel'e
// eklenene kadar site yayına alınabilsin diye panel API'si bu durumda 503 döndürür.
const githubAyarlariEksik =
  config.storage.kind === "github" &&
  (!process.env.KEYSTATIC_GITHUB_CLIENT_ID || !process.env.KEYSTATIC_GITHUB_CLIENT_SECRET || !process.env.KEYSTATIC_SECRET);

const handler = githubAyarlariEksik ? null : makeRouteHandler({ config });

function yapilandirilmadi() {
  return new Response("İçerik yönetim paneli henüz yapılandırılmadı (Keystatic GitHub App anahtarları eksik).", {
    status: 503,
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}

export async function GET(request: Request) {
  return handler ? handler.GET(request) : yapilandirilmadi();
}

export async function POST(request: Request) {
  return handler ? handler.POST(request) : yapilandirilmadi();
}
