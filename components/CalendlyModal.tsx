
'use client';
import React, { useEffect } from 'react';

export default function CalendlyModal({
  url,
  open,
  onClose,
}: {
  url: string;
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[999]">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-4 md:inset-10 bg-white rounded-2xl overflow-hidden shadow-2xl border border-black/10">
        <div className="flex items-center justify-between p-3 border-b border-black/10">
          <div className="text-sm font-medium">Réserver un créneau</div>
          <button onClick={onClose} className="px-2 py-1 rounded-lg hover:bg-black/5">Fermer ✕</button>
        </div>
        <iframe
          src={url}
          className="w-full h-[calc(100%-44px)]"
          style={{ border: '0' }}
          allow="camera; microphone; autoplay; encrypted-media"
        />
      </div>
    </div>
  );
}
