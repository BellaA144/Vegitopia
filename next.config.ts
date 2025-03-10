import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  basePath: process.env.BASEPATH,
  images: {
    domains: ['images.unsplash.com', 'png.pngtree.com'], // ✅ Tambahkan domain ini agar Next.js bisa memuat gambar
  },
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/home',
        permanent: true,
        locale: false,
      },
    ];
  },
};

export default nextConfig;
