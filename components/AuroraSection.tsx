// components/AuroraSection.tsx
'use client';
export default function AuroraSection() {
  return (
    <div aria-hidden className="absolute inset-0 -z-[1]">
      <div
        className="absolute -top-40 left-[-10%] w-[70vw] h-[70vw] rounded-full blur-3xl opacity-40"
        style={{background: 'radial-gradient(closest-side, var(--rose-200), transparent 65%)'}}
      />
      <div
        className="absolute -top-32 right-[-10%] w-[55vw] h-[55vw] rounded-full blur-3xl opacity-40"
        style={{background: 'radial-gradient(closest-side, var(--mint-200), transparent 65%)'}}
      />
      <div
        className="absolute top-[20%] left-[20%] w-[40vw] h-[40vw] rounded-full blur-3xl opacity-40"
        style={{background: 'radial-gradient(closest-side, var(--gold-200), transparent 60%)'}}
      />
    </div>
  );
}