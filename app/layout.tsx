// app/layout.tsx
import './globals.css';

export const metadata = {
  title: 'Photo by Guzi — Studio Montreuil',
  description: 'Photographe nouveau-né & grossesse — Paris / Montreuil',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="min-h-screen bg-[--paper] text-[--ink] antialiased">
        {children}
      </body>
    </html>
  );
}