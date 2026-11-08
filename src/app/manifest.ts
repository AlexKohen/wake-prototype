import type { MetadataRoute } from 'next';
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'WAKE — Твоя волна',
    short_name: 'WAKE',
    description: 'Катера и вейк-школы Москвы. Демо-бронирования.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f6f8fb',
    theme_color: '#ffffff',
    lang: 'ru',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
