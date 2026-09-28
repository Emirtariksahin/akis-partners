import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["motion"],
  async redirects() {
    return [
      // Eski prototip adresi. TBB Reklam Yasağı Yönetmeliği uyarınca "uzmanlık" ifadesi kullanılmıyor.
      { source: "/uzmanlik-alanlari", destination: "/faaliyet-alanlari", permanent: true },
      { source: "/uzmanlik-alanlari/:slug", destination: "/faaliyet-alanlari/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
