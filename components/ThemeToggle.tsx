'use client';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('pgz-theme');
    const isDark = saved ? saved === 'dark' : false;
    setDark(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('pgz-theme', next ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggle}
      className="fixed z-[210] top-4 right-4 h-10 px-3 rounded-xl bg-white/80 backdrop-blur border border-black/10 shadow hover:bg-white/90 transition text-sm flex items-center gap-2"
      aria-label="Basculer le thème"
    >
      {dark ? '🌙 Sombre' : '☀️ Clair'}
    </button>
  );
}