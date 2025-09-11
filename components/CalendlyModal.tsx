'use client';

import React from 'react';

type Props = {
  url: string;               // URL complète Calendly avec tes query params
  open: boolean;
  onClose: () => void;
  title?: string;
};

export default function CalendlyModal({ url, open, onClose, title = 'Réserver un créneau' }: Props) {
  if (!open) return null;

  // Empêche le scroll du body quand le modal est ouvert
  React.useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* Container */}
      <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-6">
        <div className="relative w-full max-w-4xl h-[80vh] rounded-2xl overflow-hidden shadow-2xl border border-black/10 bg-white">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-black/10 bg-white/70 backdrop-blur">
            <h3 className="text-sm font-semibold">{title}</h3>
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-black/10 bg-white hover:bg-white/90"
              aria-label="Fermer"
            >
              ✕
            </button>
          </div>

          {/* Iframe Calendly */}
          <iframe
            title="Calendly"
            src={url}
            className="w-full h-[calc(80vh-52px)]"
            // Ces permissions évitent des blocages dans certains navigateurs
            allow="clipboard-write; geolocation *; microphone *; camera *; autoplay *; encrypted-media *;"
          />
        </div>
      </div>
    </div>
  );
}