
'use client';
import React from 'react';

export default function BackgroundVideo({
  mp4Src,
  poster,
  className,
}: {
  mp4Src: string;
  poster?: string;
  className?: string;
}) {
  return (
    <video
      className={className}
      autoPlay
      muted
      loop
      playsInline
      poster={poster}
    >
      <source src={mp4Src} type="video/mp4" />
    </video>
  );
}
