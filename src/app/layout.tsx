import type { Metadata, Viewport } from 'next';
import './globals.css';
import 'leaflet/dist/leaflet.css';
export const metadata: Metadata = {
  title: 'WAKE — Твоя волна. В любое время.',
  description: 'Найди катер в Москве и забронируй катание за минуту. Интерактивная демонстрация.',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'WAKE' },
  manifest: '/manifest.webmanifest',
  icons: { icon: '/icon.svg', apple: '/apple-touch-icon.png' },
};
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#ffffff',
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
