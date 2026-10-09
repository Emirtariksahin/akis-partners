import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["motion"],
  // Keystatic GitHub modunda paneli 127.0.0.1 adresine yönlendirir; geliştirme sunucusu bu kökene izin vermeli.
  allowedDevOrigins: ["127.0.0.1"],
  async redirects() {
    return [
      // Site tek adreste yayınlanır: www ve Vercel'in varsayılan adresi ana alan adına yönlenir.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.akispartnershukuk.com" }],
        destination: "https://akispartnershukuk.com/:path*",
        permanent: true,
      },
      // Keystatic paneli ve API'si hariç: GitHub girişi bu adresin callback'ine de kayıtlı.
      {
        source: "/:path((?!keystatic|api/keystatic).*)",
        has: [{ type: "host", value: "akis-partners.vercel.app" }],
        destination: "https://akispartnershukuk.com/:path",
        permanent: true,
      },
      // Eski prototip adresi. TBB Reklam Yasağı Yönetmeliği uyarınca "uzmanlık" ifadesi kullanılmıyor.
      { source: "/uzmanlik-alanlari", destination: "/faaliyet-alanlari", permanent: true },
      { source: "/uzmanlik-alanlari/:slug", destination: "/faaliyet-alanlari/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
