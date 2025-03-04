import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  env: {
    SESSION_SECRET: 'OJzQ6do+TM6ipCUZan+REClpS/PaBe4cVvW/XSgjDv8=',
    HOST: 'http://3.235.214.44:8000',
    DOMAIN: 'http://localhost:3000',

    ENDPOINT_LOGIN: '/auth/login/',
    ENDPOINT_REFRESH: '/auth/refresh/',
    ENDPOINT_MOVIES: '/rent-store/movies/',
    ENDPOINT_CATEGORIES: '/rent-store/categories',
  },
  images: {
    remotePatterns: [
      { hostname: 'dnm.nflximg.net' },
      { hostname: 'images-na.ssl-images-amazon.com' },
      { hostname: 'm.media-amazon.com' },
    ],
  },
};

export default nextConfig;
