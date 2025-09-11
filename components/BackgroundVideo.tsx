'use client';
import React from 'react';

export default function BackgroundVideo({
  mp4Src,
  webmSrc,
  poster,
  className,
}: {
  mp4Src: string;
  webmSrc?: string;
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
      preload="auto"
      poster={poster}
    >
      <source src={mp4Src} type="video/mp4" />
      {webmSrc && <source src={webmSrc} type="video/webm" />}
    </video>
  );
}