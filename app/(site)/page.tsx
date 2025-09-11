'use client';

import React, { useMemo, useState } from 'react';
import CalendlyModal from '@/components/CalendlyModal';
import BackgroundVideo from '@/components/BackgroundVideo';

/* ============================================================
   Types & constantes
============================================================ */
type SessionKey = 'newborn' | 'maternity' | 'kids' | 'family' | 'duo';
type DayKey = 'weekday' | 'weekend';
type PackKey = 'p10' | 'p20' | 'p35' | 'all';

type PrintPackKey = 'prints10_13x18' | 'prints20_13x18' | 'prints20_15x20' | 'fineA4_10' | 'fineA3_6';
type AlbumKey = 'album_30x20' | 'album_30x30' | 'album_40x30';
type AlbumAddonKey = 'duplicate_minis' | 'presentation_box';
type WallArtKey = 'canvas_40x60' | 'canvas_60x90';

type Choice = {
  session: SessionKey;
  day: DayKey;
  kidsCount: number;
  includeParents: boolean;
  twins: boolean;
  extraHour: number;
  pack: PackKey;

  // Confort & style
  makeup: boolean;
  dresses: boolean;

  // Accessoires / décors (gratuits)
  themes: string[];
  colors: string[];
  newbornProps: string[];
  maternityGowns: string[];

  // Incrémentaux GROSSESSE
  mat_bodyVoileCount: number;
  mat_robeCount: number;
  mat_tenuePersoCount: number;

  // Incrémentaux NOUVEAU-NÉ
  nb_tenueBebeCount: number;         // 70€ chacun
  nb_emmaillotementCount: number;    // 40€ chacun
  nb_familleCount: number;           // 50€ chacun
  nb_robeMamanCount: number;         // 70€ chacun

  // Produits imprimés (payants)
  printPack?: PrintPackKey | null;
  album?: AlbumKey | null;
  albumAddons: AlbumAddonKey[];
  wallArts: WallArtKey[];

  // Livraison
  rush: boolean;
};

const P = { rose:'#F7DDE1', roseDeep:'#F2B8C1', mint:'#CDEAD9', mintDeep:'#9FD8BE', gold:'#E9C46A' };

/* ===================== Tarifs ===================== */
const BASE_PRICES: Record<SessionKey, { label: string; base: number; duration: string; emoji: string }> = {
  newborn:   { label: 'Nouveau-né',       base: 0,   duration: '2–3h',   emoji: '👶' }, // plus de prix minimum
  maternity: { label: 'Grossesse',        base: 0,   duration: '1h',     emoji: '🤰' },
  kids:      { label: 'Bébé assis',       base: 80,  duration: '2 thèmes', emoji: '🧒' }, // tu peux ajuster
  family:    { label: 'Famille',          base: 70,  duration: '1h',     emoji: '👨‍👩‍👧' }, // “Séance famille avec accessoires”
  duo:       { label: 'Duo Grossesse + Nouveau-né', base: 0, duration: '2 séances', emoji: '🤰👶' },
};

const PACKS: Record<PackKey, { label: string; add: number; emoji: string }> = {
  p10:  { label: '10 photos (inclus)', add: 0,   emoji: '✨' },
  p20:  { label: '20 photos',          add: 120, emoji: '🌟' },
  p35:  { label: '35 photos',          add: 220, emoji: '💫' },
  all:  { label: 'Toutes les photos',  add: 360, emoji: '🚀' },
};

const DAY_FEES = { weekday: 0, weekend: 50 } as const;
const EXTRA_KID_FEE = 30;
const TWINS_FEE = 60;
const EXTRA_HOUR_FEE = 90;

// Confort & style
const MAKEUP_PRICE = 120;
const DRESSES_PRICE = 40;

// Livraison
const RUSH_PRICE = 50;

// Packs d’impressions
const PRINT_PACKS: Record<PrintPackKey, { label: string; price: number; note?: string }> = {
  prints10_13x18: { label: 'Pack 10 tirages 13×18', price: 60 },
  prints20_13x18: { label: 'Pack 20 tirages 13×18', price: 100 },
  prints20_15x20: { label: 'Pack 20 tirages 15×20', price: 120 },
  fineA4_10:      { label: 'Tirages Fine Art A4 ×10', price: 150, note: 'Papier coton mat' },
  fineA3_6:       { label: 'Tirages Fine Art A3 ×6',  price: 180, note: 'Papier coton mat' },
};

// Albums premium (impression argentique, garanti 100 ans, fabrication artisanale)
const ALBUMS: Record<AlbumKey, { label: string; price: number; note?: string }> = {
  album_30x20: { label: 'Album premium 30×20', price: 150, note: 'Argentique, 100 ans, fabrication artisanale' },
  album_30x30: { label: 'Album premium 30×30', price: 250, note: 'Argentique, 100 ans, fabrication artisanale' },
  album_40x30: { label: 'Album premium 40×30', price: 350, note: 'Argentique, 100 ans, fabrication artisanale' },
};

const ALBUM_ADDONS: Record<AlbumAddonKey, { label: string; price: number; note?: string }> = {
  duplicate_minis:  { label: 'Dupli. mini-albums ×2', price: 90, note: 'Pour offrir' },
  presentation_box: { label: 'Boîte de présentation', price: 45 },
};

const WALL_ARTS: Record<WallArtKey, { label: string; price: number }> = {
  canvas_40x60: { label: 'Toile murale 40×60', price: 120 },
  canvas_60x90: { label: 'Toile murale 60×90', price: 190 },
};

const DEPOSIT_RATE = 0.3;

// Incrémentaux — prix unitaires
const MAT_BODY_VOILE = 60;
const MAT_ROBE = 80;
const MAT_TENUE_PERSO = 40;

const NB_TENUE_BEBE = 70;
const NB_EMMAILL = 40;
const NB_FAMILLE = 50;
const NB_ROBE_MAMAN = 70;

/* ============================================================
   Calendly (mapping + builder)
============================================================ */
const calBaseBySession: Record<SessionKey, string> = {
  newborn:   process.env.NEXT_PUBLIC_CALENDLY_NEWBORN   || '',
  maternity: process.env.NEXT_PUBLIC_CALENDLY_MATERNITY || '',
  kids:      process.env.NEXT_PUBLIC_CALENDLY_SITTER    || '',
  family:    process.env.NEXT_PUBLIC_CALENDLY_FAMILY    || '',
  duo:       process.env.NEXT_PUBLIC_CALENDLY_MATERNITY || '', // 1er RDV sur Grossesse
};

function buildCalendlyUrl({
  base,
  redirectAfter,
  theme = { primary: 'E9C46A', bg: 'FFFCFA', text: '1A1A1A' },
  prefill,
}: {
  base: string;
  redirectAfter: string;
  theme?: { primary: string; bg: string; text: string };
  prefill?: { name?: string; email?: string };
}) {
  const params = new URLSearchParams({
    hide_event_type_details: '1',
    hide_landing_page_details: '1',
    primary_color: theme.primary,
    background_color: theme.bg,
    text_color: theme.text,
    redirect_url: redirectAfter,
  });
  if (prefill?.name)  params.set('name', prefill.name);
  if (prefill?.email) params.set('email', prefill.email);
  return `${base}?${params.toString()}`;
}

/* ============================================================
   Page
============================================================ */
export default function Page() {
  const [choice, setChoice] = useState<Choice>({
    session: 'newborn',
    day: 'weekday',
    kidsCount: 1,
    includeParents: true,
    twins: false,
    extraHour: 0,
    pack: 'p10',

    makeup: false,
    dresses: false,

    themes: [],
    colors: [],
    newbornProps: [],
    maternityGowns: [],

    mat_bodyVoileCount: 0,
    mat_robeCount: 0,
    mat_tenuePersoCount: 0,

    nb_tenueBebeCount: 0,
    nb_emmaillotementCount: 0,
    nb_familleCount: 0,
    nb_robeMamanCount: 0,

    printPack: null,
    album: null,
    albumAddons: [],
    wallArts: [],

    rush: false,
  });

  /* ====== Totaux ====== */
  const total = useMemo(() => {
    const base = BASE_PRICES[choice.session].base;
    const dayFee = DAY_FEES[choice.day];

    const extraKids =
      (choice.session === 'kids' || choice.session === 'family')
        ? Math.max(0, (choice.kidsCount || 1) - 1) * EXTRA_KID_FEE
        : 0;

    const twinsFee = choice.session === 'newborn' && choice.twins ? TWINS_FEE : 0;

    const packAdd = PACKS[choice.pack].add;
    const extraHours = (choice.extraHour || 0) * EXTRA_HOUR_FEE;

    // Confort
    const makeup = choice.makeup ? MAKEUP_PRICE : 0;
    const dresses = (choice.session === 'maternity' && choice.dresses) ? DRESSES_PRICE : 0;

    // Incrémentaux — Grossesse
    const mat =
      choice.mat_bodyVoileCount * MAT_BODY_VOILE +
      choice.mat_robeCount * MAT_ROBE +
      choice.mat_tenuePersoCount * MAT_TENUE_PERSO;

    // Incrémentaux — Nouveau-né
    const nb =
      choice.nb_tenueBebeCount * NB_TENUE_BEBE +
      choice.nb_emmaillotementCount * NB_EMMAILL +
      choice.nb_familleCount * NB_FAMILLE +
      choice.nb_robeMamanCount * NB_ROBE_MAMAN;

    // Produits imprimés
    const prints = choice.printPack ? PRINT_PACKS[choice.printPack].price : 0;
    const album = choice.album ? ALBUMS[choice.album].price : 0;
    const albumAddons = choice.albumAddons.reduce((sum, k) => sum + ALBUM_ADDONS[k].price, 0);
    const walls = choice.wallArts.reduce((sum, k) => sum + WALL_ARTS[k].price, 0);

    const rush = choice.rush ? RUSH_PRICE : 0;

    return base + dayFee + extraKids + twinsFee + packAdd + extraHours + makeup + dresses + mat + nb + prints + album + albumAddons + walls + rush;
  }, [choice]);

  // Acompte 30% arrondi à la dizaine supérieure
  const deposit = useMemo(() => {
    const raw = total * DEPOSIT_RATE;
    return Math.ceil(raw / 10) * 10;
  }, [total]);

  /* ====== Calendly & Stripe ====== */
  const [calendlyOpen, setCalendlyOpen] = useState(false);

  // Redirection Stripe après réservation Calendly
  const stripeParams = new URLSearchParams({
    ref: 'photobyguzi',
    session: choice.session,
    total: String(total),
    deposit: String(deposit),
  });

  // Si tu as une route /api/checkout-proxy qui crée la session Stripe puis redirige :
  const stripeUrl = typeof window === 'undefined'
    ? 'https://photobyguzi.com'
    : new URL(`/api/checkout-proxy?${stripeParams.toString()}`, window.location.origin).toString();

  const calBase = calBaseBySession[choice.session];
  const calendlyUrl = buildCalendlyUrl({
    base: calBase,
    redirectAfter: stripeUrl,
    theme: { primary: 'E9C46A', bg: 'FFFCFA', text: '1A1A1A' },
  });

  // Paiement Stripe (création session côté serveur, cf. /api/checkout donné précédemment)
  const onCheckout = async () => {
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: deposit,
          description: `Acompte séance (${choice.session}) — PhotobyGuzi`,
          metadata: {
            session: choice.session,
            day: choice.day,
            total: String(total),
            deposit: String(deposit),
            // Incrémentaux (exemples)
            mat_bodyVoileCount: String(choice.mat_bodyVoileCount),
            mat_robeCount: String(choice.mat_robeCount),
            mat_tenuePersoCount: String(choice.mat_tenuePersoCount),
            nb_tenueBebeCount: String(choice.nb_tenueBebeCount),
            nb_emmaillotementCount: String(choice.nb_emmaillotementCount),
            nb_familleCount: String(choice.nb_familleCount),
            nb_robeMamanCount: String(choice.nb_robeMamanCount),
          },
        }),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.error || 'Erreur de création de session Stripe');
      }
      const data = await res.json();
      if (data?.url) window.location.href = data.url;
      else throw new Error('URL Stripe manquante');
    } catch (err: any) {
      alert(err?.message || 'Impossible de rediriger vers le paiement');
    }
  };

  const current = BASE_PRICES[choice.session];

  /* ============================================================
     Rendu
  ============================================================ */
  return (
    <main className="relative min-h-screen">
      {/* Vidéo plein écran globale */}
      <BackgroundVideo
        mp4Src="/videos/hero.mp4"
        poster="/images/hero-poster.jpg"
        className="fixed -inset-px object-cover z-0 pointer-events-none"
      />
      {/* Voile de lisibilité */}
      <div className="fixed -inset-px bg-white/65 backdrop-blur-sm z-0" />

      {/* HERO */}
      <section className="relative z-10 overflow-hidden pt-12 sm:pt-16">
        <Aurora />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 text-center">
          <h1 className="text-[clamp(30px,5.5vw,56px)] font-extrabold tracking-tight">
            Photographe Nouveau-né & Grossesse — Studio à Montreuil
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-base sm:text-lg opacity-80">
            Des images douces, poétiques et intemporelles. Configurez votre séance, réservez votre créneau et choisissez vos produits imprimés.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <StatPill icon="🍼" accent="from-[#F7DDE1] to-[#F2B8C1]" label={`${current.label}`} value={`${current.duration}`} />
            <StatPill icon="💶" accent="from-[#CDEAD9] to-[#9FD8BE]" label="Total" value={`${total.toFixed(0)} €`} />
            <StatPill icon="🔒" accent="from-[#E9C46A] to-[#F7DDE1]" label="Acompte" value={`${deposit.toFixed(0)} €`} />
            <StatPill icon="📍" accent="from-[#9FD8BE] to-[#E9C46A]" label="Studio" value="Montreuil" />
          </div>
        </div>
      </section>

      {/* ================= CONFIGURATEUR ================= */}
      <section id="config" className="relative -mt-6 sm:-mt-10 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          {/* Décor pastel animé */}
          <ConfigBackgroundBlobs />

          {/* Conteneur principal glass + bordure dégradée */}
          <div className="relative z-[1] pg-glow">
            <div className="inner p-5 sm:p-8">
              {/* Header étapes */}
              <div className="relative px-1 sm:px-2 pb-5 flex items-center justify-between">
                <div>
                  <div className="text-xs mb-2 opacity-70">Étapes</div>
                  <div className="flex items-center gap-1">
                    <Step done>1</Step><span className="text-xs opacity-60 mx-1">Type</span>
                    <Line/>
                    <Step done>2</Step><span className="text-xs opacity-60 mx-1">Confort</span>
                    <Line/>
                    <Step active>3</Step><span className="text-xs opacity-60 mx-1">Produits</span>
                    <Line/>
                    <Step>4</Step><span className="text-xs opacity-60 mx-1">Récap</span>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs" style={{background: `${P.rose}22`, border: '1px solid #0001'}}>Doux & pastel</span>
                  <span className="px-3 py-1 rounded-full text-xs" style={{background: `${P.mint}22`, border: '1px solid #0001'}}>Studio Montreuil</span>
                </div>
              </div>

              {/* Corps */}
              <div className="grid lg:grid-cols-7 gap-6">
                {/* Colonne 1 */}
                <div className="lg:col-span-3 space-y-6">
                  <GlowCard tone="rose" title={<SectionTitle emoji="🎀">Type de séance</SectionTitle>}>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {(['newborn','maternity','kids','family','duo'] as SessionKey[]).map((key)=>(
                        <SelectCard
                          key={key}
                          active={choice.session===key}
                          onClick={()=>setChoice({...choice, session:key})}
                          badge={`${BASE_PRICES[key].duration}${BASE_PRICES[key].base ? ` · ${BASE_PRICES[key].base}€` : ''}`}
                          emoji={BASE_PRICES[key].emoji}
                          label={BASE_PRICES[key].label}
                          color={key==='newborn'?P.rose:key==='maternity'?P.gold:key==='kids'?P.mint:P.roseDeep}
                        />
                      ))}
                    </div>
                  </GlowCard>

                  <GlowCard tone="mint" title={<SectionTitle emoji="👨‍👩‍👧">Participants & durée</SectionTitle>}>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="rounded-xl bg-white/70 border border-black/5 p-4 pg-pattern">
                        <div className="text-sm font-medium mb-2">Enfants photographiés</div>
                        <Stepper value={choice.kidsCount} min={1} max={6} onChange={(v)=>setChoice({...choice, kidsCount:v})}/>
                        <div className="text-xs opacity-70 mt-2">Pour enfant/famille, +{EXTRA_KID_FEE}€ dès le 2ᵉ.</div>
                      </div>
                      <div className="rounded-xl bg-white/70 border border-black/5 p-4 pg-pattern">
                        <div className="text-sm font-medium mb-2">Jour & durée</div>
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <PillButton active={choice.day==='weekday'} onClick={()=>setChoice({...choice, day:'weekday'})}>Semaine · +0€</PillButton>
                          <PillButton active={choice.day==='weekend'} onClick={()=>setChoice({...choice, day:'weekend'})}>Week-end · +{DAY_FEES.weekend}€</PillButton>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm opacity-80">Ajouter 1h</span>
                          <Stepper value={choice.extraHour} min={0} max={3} onChange={(v)=>setChoice({...choice, extraHour:v})}/>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid sm:grid-cols-2 gap-4">
                      <Toggle label="Inclure des portraits avec les parents" checked={choice.includeParents} onChange={(v)=>setChoice({...choice, includeParents:v})}/>
                      <Toggle label={`Jumeaux (nouveau-nés) · +${TWINS_FEE}€`} checked={choice.twins} onChange={(v)=>setChoice({...choice, twins:v})} disabled={choice.session!=='newborn'}/>
                    </div>
                  </GlowCard>

                  {/* Incrémentaux — Grossesse */}
                  <GlowCard tone="gold" title={<SectionTitle emoji="🤰">Grossesse — Tenues & styles</SectionTitle>}>
                    <IncRow label="Body ou voile" value={choice.mat_bodyVoileCount} onChange={(n)=>setChoice({...choice, mat_bodyVoileCount:n})} unitPrice={MAT_BODY_VOILE}/>
                    <IncRow label="Robe" value={choice.mat_robeCount} onChange={(n)=>setChoice({...choice, mat_robeCount:n})} unitPrice={MAT_ROBE}/>
                    <IncRow label="Tenue perso" value={choice.mat_tenuePersoCount} onChange={(n)=>setChoice({...choice, mat_tenuePersoCount:n})} unitPrice={MAT_TENUE_PERSO}/>
                    <div className="text-xs opacity-70 mt-2">Photos retouchées : 25€ l’une, 20€ dès 5, 15€ dès 10 — à sélectionner après la séance.</div>
                    <div className="text-xs opacity-70">Photos artistiques (jeux de lumière) : 90€ — option à voir en studio.</div>
                    <Toggle className="mt-2" label={`Photos en couple ou en famille · +40€`} checked={false} onChange={()=>{}} disabled />{/* indicatif */}
                  </GlowCard>
                </div>

                {/* Colonne 2 */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Incrémentaux — Nouveau-né */}
                  <GlowCard tone="rose" title={<SectionTitle emoji="👶">Nouveau-né — Options</SectionTitle>}>
                    <IncRow label="Tenue pour bébé" value={choice.nb_tenueBebeCount} onChange={(n)=>setChoice({...choice, nb_tenueBebeCount:n})} unitPrice={NB_TENUE_BEBE}/>
                    <IncRow label="Emmaillotement" value={choice.nb_emmaillotementCount} onChange={(n)=>setChoice({...choice, nb_emmaillotementCount:n})} unitPrice={NB_EMMAILL}/>
                    <IncRow label="Photos en famille" value={choice.nb_familleCount} onChange={(n)=>setChoice({...choice, nb_familleCount:n})} unitPrice={NB_FAMILLE}/>
                    <IncRow label="Robe pour maman" value={choice.nb_robeMamanCount} onChange={(n)=>setChoice({...choice, nb_robeMamanCount:n})} unitPrice={NB_ROBE_MAMAN}/>
                    <div className="text-xs opacity-70 mt-2">Photos retouchées : 30€ l’une, 20€ dès 5, 15€ dès 10 — à choisir après la séance.</div>
                    <div className="text-xs opacity-70">Photo(s) brute(s) : offertes dès 5 retouchées (sinon 50€).</div>
                  </GlowCard>

                  <GlowCard tone="mint" title={<SectionTitle emoji="🌈">Pack de photos digitales</SectionTitle>}>
                    <div className="grid grid-cols-1 gap-2">
                      {(Object.keys(PACKS) as PackKey[]).map((k)=>(
                        <RadioRow key={k} checked={choice.pack===k} onChange={()=>setChoice({...choice, pack:k})} label={`${PACKS[k].emoji} ${PACKS[k].label}`} price={PACKS[k].add}/>
                      ))}
                    </div>
                  </GlowCard>

                  <GlowCard tone="rose" title={<SectionTitle emoji="🌼">Confort & style</SectionTitle>}>
                    <div className="flex flex-col gap-2">
                      <Toggle label={`Maquillage / coiffure partenaire · +${MAKEUP_PRICE}€`} checked={choice.makeup} onChange={(v)=>setChoice({...choice, makeup:v})}/>
                      <Toggle label={`Location robes & drapés · +${DRESSES_PRICE}€`} checked={choice.dresses} onChange={(v)=>setChoice({...choice, dresses:v})} disabled={choice.session!=='maternity'}/>
                      <Toggle label={`Livraison express 48h · +${RUSH_PRICE}€`} checked={choice.rush} onChange={(v)=>setChoice({...choice, rush:v})}/>
                    </div>
                  </GlowCard>
                </div>

                {/* Colonne 3 */}
                <div className="lg:col-span-2 space-y-6">
                  <GlowCard tone="mint" title={<SectionTitle emoji="🖨️">Packs d’impressions</SectionTitle>}>
                    <div className="grid grid-cols-1 gap-2">
                      {(Object.keys(PRINT_PACKS) as PrintPackKey[]).map((k)=>(
                        <RadioRow key={k} checked={choice.printPack===k} onChange={()=>setChoice({...choice, printPack: choice.printPack===k?null:k})} label={PRINT_PACKS[k].label} price={PRINT_PACKS[k].price} note={PRINT_PACKS[k].note}/>
                      ))}
                      <button onClick={()=>setChoice({...choice, printPack:null})} className="text-sm underline opacity-80 hover:opacity-100 text-left">Aucun pack d’impressions</button>
                    </div>
                  </GlowCard>

                  <GlowCard tone="gold" title={<SectionTitle emoji="📖">Albums premium & options</SectionTitle>}>
                    <div className="grid grid-cols-1 gap-2 mb-4">
                      {(Object.keys(ALBUMS) as AlbumKey[]).map((k)=>(
                        <RadioRow key={k} checked={choice.album===k} onChange={()=>setChoice({...choice, album: choice.album===k?null:k})} label={ALBUMS[k].label} price={ALBUMS[k].price} note={ALBUMS[k].note}/>
                      ))}
                      <button onClick={()=>setChoice({...choice, album:null})} className="text-sm underline opacity-80 hover:opacity-100 text-left">Pas d’album</button>
                    </div>
                    <div className="flex flex-col gap-2">
                      {(Object.keys(ALBUM_ADDONS) as AlbumAddonKey[]).map((k)=>(
                        <Toggle key={k} label={`${ALBUM_ADDONS[k].label} · +${ALBUM_ADDONS[k].price}€`}
                                checked={choice.albumAddons.includes(k)}
                                onChange={()=>toggleInArray(choice.albumAddons,k,(next)=>setChoice({...choice, albumAddons:next}))}
                                disabled={!choice.album}/>
                      ))}
                    </div>
                  </GlowCard>

                  {/* Récap sticky */}
                  <div className="sticky top-6">
                    <div className="rounded-2xl bg-white/90 border border-black/5 shadow-[0_10px_35px_rgba(0,0,0,.12)] p-5">
                      <h3 className="text-lg font-semibold mb-3">🧾 Récapitulatif</h3>
                      <div className="space-y-1.5 mb-3 text-sm">
                        <LineItem label={`${BASE_PRICES[choice.session].emoji} ${BASE_PRICES[choice.session].label}`} value={BASE_PRICES[choice.session].base}/>
                        <LineItem label={`Jour : ${choice.day==='weekday'?'Semaine':'Week-end'}`} value={choice.day==='weekday'?0:DAY_FEES.weekend}/>
                        {(choice.session==='kids' || choice.session==='family') && choice.kidsCount>1 && (
                          <LineItem label={`Enfants supp. (${choice.kidsCount-1})`} value={(choice.kidsCount-1)*EXTRA_KID_FEE}/>
                        )}
                        {choice.session==='newborn' && choice.twins && <LineItem label="Jumeaux" value={TWINS_FEE}/>}
                        <LineItem label={`Pack digital : ${PACKS[choice.pack].label}`} value={PACKS[choice.pack].add}/>
                        {choice.extraHour>0 && <LineItem label={`Heures sup. (${choice.extraHour})`} value={choice.extraHour*EXTRA_HOUR_FEE}/>}

                        {/* Incrémentaux récap */}
                        {choice.mat_bodyVoileCount>0 && <LineItem label={`Grossesse — Body/Voile ×${choice.mat_bodyVoileCount}`} value={choice.mat_bodyVoileCount*MAT_BODY_VOILE}/>}
                        {choice.mat_robeCount>0 && <LineItem label={`Grossesse — Robe ×${choice.mat_robeCount}`} value={choice.mat_robeCount*MAT_ROBE}/>}
                        {choice.mat_tenuePersoCount>0 && <LineItem label={`Grossesse — Tenue perso ×${choice.mat_tenuePersoCount}`} value={choice.mat_tenuePersoCount*MAT_TENUE_PERSO}/>}

                        {choice.nb_tenueBebeCount>0 && <LineItem label={`Nouveau-né — Tenue bébé ×${choice.nb_tenueBebeCount}`} value={choice.nb_tenueBebeCount*NB_TENUE_BEBE}/>}
                        {choice.nb_emmaillotementCount>0 && <LineItem label={`Nouveau-né — Emmaillotement ×${choice.nb_emmaillotementCount}`} value={choice.nb_emmaillotementCount*NB_EMMAILL}/>}
                        {choice.nb_familleCount>0 && <LineItem label={`Nouveau-né — Photos famille ×${choice.nb_familleCount}`} value={choice.nb_familleCount*NB_FAMILLE}/>}
                        {choice.nb_robeMamanCount>0 && <LineItem label={`Nouveau-né — Robe maman ×${choice.nb_robeMamanCount}`} value={choice.nb_robeMamanCount*NB_ROBE_MAMAN}/>}

                        {/* Produits imprimés */}
                        {choice.printPack && <LineItem label={PRINT_PACKS[choice.printPack].label} value={PRINT_PACKS[choice.printPack].price}/>}
                        {choice.album && <LineItem label={ALBUMS[choice.album].label} value={ALBUMS[choice.album].price}/>}
                        {choice.albumAddons.map(k=>(
                          <LineItem key={k} label={`Option — ${ALBUM_ADDONS[k].label}`} value={ALBUM_ADDONS[k].price}/>
                        ))}
                        {choice.wallArts.map(k=>(
                          <LineItem key={k} label={WALL_ARTS[k].label} value={WALL_ARTS[k].price}/>
                        ))}

                        {choice.makeup && <LineItem label="Maquillage / coiffure" value={MAKEUP_PRICE}/>}
                        {(choice.session==='maternity' && choice.dresses) && <LineItem label="Location robes & drapés" value={DRESSES_PRICE}/>}
                        {choice.rush && <LineItem label="Livraison express 48h" value={RUSH_PRICE}/>}
                      </div>

                      <div className="py-3 border-t border-b border-black/10 my-3">
                        <div className="flex items-center justify-between">
                          <span>Total</span><span className="font-semibold">{total.toFixed(0)} €</span>
                        </div>
                        <div className="flex items-center justify-between text-sm opacity-80">
                          <span>Acompte (30%) arrondi</span><span className="font-medium">{deposit.toFixed(0)} €</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <button onClick={()=>setCalendlyOpen(true)} className="h-11 rounded-xl border border-black/10 bg-white hover:bg-white/90 transition shadow-sm text-black">📅 Choisir un créneau</button>
                        <button onClick={onCheckout} className="h-11 rounded-xl bg-black text-white hover:opacity-90 transition shadow-sm">💳 Régler l’acompte et réserver</button>
                      </div>
                      <p className="text-xs opacity-70 mt-3">Le solde sera réglé le jour de la séance. Un e-mail récapitulatif vous sera envoyé.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA flottant (mobile) */}
              <div className="lg:hidden fixed bottom-4 left-0 right-0 px-4 z-[60]">
                <div className="rounded-2xl bg-white/90 border border-black/10 shadow-xl p-3 flex items-center gap-3">
                  <div className="text-sm">
                    <div className="font-semibold">Total {total.toFixed(0)} €</div>
                    <div className="text-xs opacity-70">Acompte {deposit.toFixed(0)} €</div>
                  </div>
                  <button onClick={onCheckout} className="ml-auto h-10 px-4 rounded-xl bg-black text-white text-sm">Réserver</button>
                </div>
              </div>

              <CalendlyModal url={calendlyUrl} open={calendlyOpen} onClose={()=>setCalendlyOpen(false)} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ============================================================
   UI helpers & décor
============================================================ */
function Step({ children, done=false, active=false }:{children:React.ReactNode; done?:boolean; active?:boolean}){
  const cls = done ? 'bg-emerald-500 text-white' : active ? 'bg-black text-white' : 'bg-white text-black';
  return <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full border border-black/10 text-xs ${cls}`}>{children}</span>;
}
function Line(){ return <span className="w-6 h-[2px] bg-black/10 rounded-full mx-1" />; }

function SelectCard({
  active,
  onClick,
  badge,
  emoji,
  label,
  color,
}: {
  active: boolean;
  onClick: () => void;
  badge: string;
  emoji: string;
  label: string;
  /** Couleur d’accent facultative pour le highlight actif */
  color?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative rounded-xl border px-3 py-3 text-left transition shadow-sm ${
        active ? 'bg-white border-black/10' : 'bg-white/60 hover:bg-white border-black/5'
      }`}
    >
      <div className="text-2xl">{emoji}</div>
      <div className="mt-1 font-medium">{label}</div>
      <div className="text-[11px] opacity-70">{badge}</div>

      {/* Liseré d’accent quand actif (sans utilitaires Tailwind spéciaux) */}
      {active && (
        <span
          className="pointer-events-none absolute inset-0 rounded-xl"
          style={{ boxShadow: `0 0 0 3px ${color ?? 'rgba(0,0,0,0.25)'}` }}
        />
      )}
    </button>
  );
}

function PillButton({active, children, onClick}:{active:boolean; children:React.ReactNode; onClick:()=>void}){
  return (
    <button onClick={onClick}
      className={`px-3 py-2 rounded-xl border text-sm transition ${active?'bg-white border-black/10':'bg-white/60 hover:bg-white border-black/5'}`}>
      {children}
    </button>
  );
}

function Stepper({ value, onChange, min=0, max=10, step=1 }:{ value:number; onChange:(v:number)=>void; min?:number; max?:number; step?:number; }){
  return (
    <div className="flex items-center gap-2">
      <button className="w-9 h-9 rounded-lg border bg-white hover:bg-white/80" onClick={()=>onChange(Math.max(min, value-step))}>−</button>
      <div className="px-3 py-2 bg-white rounded-lg border text-sm min-w-[64px] text-center">{value}</div>
      <button className="w-9 h-9 rounded-lg border bg-white hover:bg-white/80" onClick={()=>onChange(Math.min(max, value+step))}>+</button>
    </div>
  );
}

function IncRow({ label, value, onChange, unitPrice }:{
  label:string; value:number; onChange:(n:number)=>void; unitPrice:number;
}){
  return (
    <div className="flex items-center justify-between rounded-xl bg-white/70 border border-black/5 p-3">
      <div className="text-sm">
        <div className="font-medium">{label}</div>
        <div className="text-xs opacity-70">+{unitPrice}€ / unité</div>
      </div>
      <Stepper value={value} min={0} max={10} step={1} onChange={onChange}/>
    </div>
  );
}

function Toggle({ label, checked, onChange, disabled=false, className='' }:{
  label:string; checked:boolean; onChange:(v:boolean)=>void; disabled?:boolean; className?:string;
}){
  return (
    <label className={`flex items-center gap-3 text-sm ${disabled?'opacity-40 cursor-not-allowed':''} ${className}`}>
      <input type="checkbox" className="accent-black/80" checked={checked} onChange={(e)=>onChange(e.target.checked)} disabled={disabled}/>
      <span>{label}</span>
    </label>
  );
}

function RadioRow({ checked, onChange, label, price, note }:{
  checked:boolean; onChange:()=>void; label:string; price:number; note?:string;
}){
  return (
    <label className={`flex items-center justify-between rounded-xl border px-3 py-2 cursor-pointer ${checked?'bg-white border-black/10':'bg-white/60 hover:bg-white border-black/5'}`}>
      <div className="text-sm">
        <div className="font-medium">{label}</div>
        {note && <div className="text-xs opacity-70">{note}</div>}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">{price ? `+${price}€` : 'Inclus'}</span>
        <input type="radio" checked={checked} onChange={onChange}/>
      </div>
    </label>
  );
}

function LineItem({ label, value }:{ label:string; value:number }){
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="opacity-80">{label}</span>
      <span className="font-medium">{value.toFixed(0)} €</span>
    </div>
  );
}

function ChipGroup({ title, items, selected, onToggle }:{
  title:string; items:string[]; selected:string[]; onToggle:(v:string)=>void;
}){
  return (
    <div className="mb-3">
      <div className="text-xs font-medium mb-2 opacity-80">{title}</div>
      <div className="flex flex-wrap gap-2">
        {items.map((it)=>(
          <button key={it}
            onClick={()=>onToggle(it)}
            className={`px-3 py-1 rounded-full border text-xs ${selected.includes(it)?'bg-white border-black/10':'bg-white/60 hover:bg-white border-black/5'}`}>
            {it}
          </button>
        ))}
      </div>
    </div>
  );
}

function toggleInArray<T extends string>(arr: T[], val: T, cb:(next:T[])=>void) {
  const set = new Set(arr as T[]);
  set.has(val) ? set.delete(val) : set.add(val);
  cb(Array.from(set));
}

function StatPill({ icon, label, value, accent = 'from-[#F7DDE1] to-[#CDEAD9]' }:{
  icon: string; label: string; value: string; accent?: string;
}) {
  return (
    <div
      className="group inline-flex items-center gap-3 rounded-full border border-black/10 bg-white/70 backdrop-blur-md
                 shadow-[0_6px_20px_rgba(0,0,0,0.10)] px-4 py-2 transition
                 hover:bg-white hover:shadow-[0_10px_30px_rgba(0,0,0,0.12)]"
      aria-label={`${label}: ${value}`}
    >
      <span className={`relative grid place-items-center h-8 w-8 rounded-full bg-gradient-to-br ${accent} text-base shadow-sm`}>
        <span className="drop-shadow-sm">{icon}</span>
      </span>
      <div className="flex flex-col leading-tight text-left">
        <span className="text-[11px] uppercase tracking-wide opacity-70">{label}</span>
        <span className="text-sm font-semibold">{value}</span>
      </div>
    </div>
  );
}

/* —— décor : blobs pastel derrière la carte principale —— */
function ConfigBackgroundBlobs(){
  return (
    <div aria-hidden className="pg-blobs">
      <div className="pg-blob pg-blob--rose a" />
      <div className="pg-blob pg-blob--mint b" />
      <div className="pg-blob pg-blob--gold c" />
      <style jsx>{`
        .pg-blobs { position:absolute; inset:-40px -10px 0 -10px; z-index:0; pointer-events:none; }
        .pg-blob {
          position:absolute; filter: blur(40px); opacity: .35;
          width: 380px; height: 380px; border-radius: 9999px;
        }
        .pg-blob--rose { background: ${P.rose}; }
        .pg-blob--mint { background: ${P.mint}; }
        .pg-blob--gold { background: ${P.gold}; }
        .a { top:-20px; left:-20px; }
        .b { top:-30px; right:10%; }
        .c { bottom:-20px; left:20%; }
        @media (min-width: 1024px) {
          .pg-blob { width: 520px; height: 520px; }
          .a { top:-60px; left:-40px; }
          .b { top:-80px; right:8%; }
          .c { bottom:-40px; left:22%; }
        }
      `}</style>
    </div>
  );
}

/* —— carte “glass + gradient border” —— */
function GlowCard({ tone='rose', title, children }:{
  tone?: 'rose'|'mint'|'gold'; title: React.ReactNode; children: React.ReactNode;
}){
  const t = tone==='rose' ? P.rose : tone==='mint' ? P.mint : P.gold;
  return (
    <div className="relative rounded-[24px] overflow-hidden">
      <div className="absolute inset-0 rounded-[24px]" style={{
        background: `linear-gradient(135deg, ${t}55, rgba(255,255,255,.7))`,
      }}/>
      <div className="relative border border-black/10 rounded-[24px] bg-white/70 backdrop-blur-md shadow-[0_10px_35px_rgba(0,0,0,.08)]">
        <div className="p-5 sm:p-6">
          {typeof title === 'string' ? <h3 className="pg-section-title text-[15px] mb-3">{title}</h3> : title}
          {children}
        </div>
      </div>
    </div>
  );
}

/* —— titre de section —— */
function SectionTitle({emoji, children}:{emoji:string; children:React.ReactNode}){
  return (
    <div className="mb-3">
      <div className="pg-section-title text-[15px] flex items-center gap-2">
        <span className="text-lg">{emoji}</span>
        <span>{children}</span>
      </div>
      <div className="pg-underline mt-2" />
      <style jsx>{`
        .pg-section-title { font-weight:600; }
        .pg-underline { height:4px; width:80px; border-radius:9999px; background: linear-gradient(90deg, ${P.rose}, ${P.mint}, ${P.gold}); }
      `}</style>
    </div>
  );
}

/* —— Aurora background for HERO —— */
function Aurora() {
  return (
    <div aria-hidden className="absolute inset-0 -z-10">
      <div className="absolute inset-0" style={{ background:
        `radial-gradient(1000px 600px at 10% -10%, ${P.rose} 0%, transparent 60%),
         radial-gradient(900px 500px at 90% -20%, ${P.mint} 0%, transparent 60%),
         radial-gradient(1200px 700px at 50% -30%, ${P.gold} 0%, transparent 60%)` }} />
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '3px 3px' }} />
    </div>
  );
}