'use client';

import React, { useMemo, useState } from 'react';
import CalendlyModal from '../../components/CalendlyModal';
import BackgroundVideo from '../../components/BackgroundVideo';
import AuroraSection from '../../components/AuroraSection';

/* ============================================================
   Types & données
============================================================ */
type SessionKey = 'newborn' | 'maternity' | 'kids' | 'family' | 'duo';
type DayKey = 'weekday' | 'weekend';
type PackKey = 'p10' | 'p20' | 'p35' | 'all';
type PrintPackKey = 'prints10_13x18' | 'prints20_13x18' | 'prints20_15x20' | 'fineA4_10' | 'fineA3_6';
type AlbumKey = 'album20_basic' | 'album30_linen' | 'album30_leather';
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
  makeup: boolean;
  dresses: boolean;
  themes: string[];
  colors: string[];
  newbornProps: string[];
  maternityGowns: string[];
  printPack?: PrintPackKey | null;
  album?: AlbumKey | null;
  albumAddons: AlbumAddonKey[];
  wallArts: WallArtKey[];
  rush: boolean;
};

const STRIPE_PAYMENT_LINK =
  process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK || 'https://buy.stripe.com/test_abcdefghijk';

const BASE_PRICES: Record<SessionKey, { label: string; base: number; duration: string }> = {
  newborn:   { label: 'Nouveau-né',       base: 390, duration: '2-3h' },
  maternity: { label: 'Grossesse',        base: 320, duration: '1h' },
  kids:      { label: 'Enfant',           base: 250, duration: '45min' },
  family:    { label: 'Famille',          base: 380, duration: '1h30' },
  duo:       { label: 'Duo Grossesse + Nouveau-né', base: Math.round((320 + 390) * 0.9), duration: '2 séances' },
};

const PACKS: Record<PackKey, { label: string; add: number }> = {
  p10:  { label: '10 photos (inclus)', add: 0 },
  p20:  { label: '20 photos',          add: 120 },
  p35:  { label: '35 photos',          add: 220 },
  all:  { label: 'Toutes les photos',  add: 360 },
};

const DAY_FEES = { weekday: 0, weekend: 50 } as const;
const EXTRA_KID_FEE = 30;
const TWINS_FEE = 60;
const EXTRA_HOUR_FEE = 90;
const MAKEUP_PRICE = 120;
const DRESSES_PRICE = 40;
const RUSH_PRICE = 50;

const PRINT_PACKS: Record<PrintPackKey, { label: string; price: number; note?: string }> = {
  prints10_13x18: { label: 'Pack 10 tirages 13×18', price: 60 },
  prints20_13x18: { label: 'Pack 20 tirages 13×18', price: 100 },
  prints20_15x20: { label: 'Pack 20 tirages 15×20', price: 120 },
  fineA4_10:      { label: 'Tirages Fine Art A4 ×10', price: 150, note: 'Papier coton mat' },
  fineA3_6:       { label: 'Tirages Fine Art A3 ×6',  price: 180, note: 'Papier coton mat' },
};

const ALBUMS: Record<AlbumKey, { label: string; price: number; note?: string }> = {
  album20_basic:  { label: 'Album 20 pages — Classique', price: 190 },
  album30_linen:  { label: 'Album 30 pages — Lin artisanal', price: 240 },
  album30_leather:{ label: 'Album 30 pages — Simili cuir', price: 260 },
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
    printPack: null,
    album: null,
    albumAddons: [],
    wallArts: [],
    rush: false,
  });

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
    const makeup = choice.makeup ? MAKEUP_PRICE : 0;
    const dresses = (choice.session === 'maternity' && choice.dresses) ? DRESSES_PRICE : 0;
    const prints = choice.printPack ? PRINT_PACKS[choice.printPack].price : 0;
    const album = choice.album ? ALBUMS[choice.album].price : 0;
    const albumAddons = choice.albumAddons.reduce((sum, k) => sum + ALBUM_ADDONS[k].price, 0);
    const walls = choice.wallArts.reduce((sum, k) => sum + WALL_ARTS[k].price, 0);
    const rush = choice.rush ? RUSH_PRICE : 0;
    return base + dayFee + extraKids + twinsFee + packAdd + extraHours + makeup + dresses + prints + album + albumAddons + walls + rush;
  }, [choice]);

  const deposit = useMemo(() => Math.round(total * DEPOSIT_RATE), [total]);

  const [calendlyOpen, setCalendlyOpen] = useState(false);
  const calendlyBase = process.env.NEXT_PUBLIC_CALENDLY_URL || 'https://calendly.com/your-calendly/rdv';

  const stripeParams = new URLSearchParams({
    ref: 'photobyguzi',
    session: choice.session,
    day: choice.day,
    total: String(total),
    deposit: String(deposit),
    printPack: String(choice.printPack ?? ''),
    album: String(choice.album ?? ''),
    albumAddons: choice.albumAddons.join(','),
    wallArts: choice.wallArts.join(','),
  });
  const stripeUrl = `${STRIPE_PAYMENT_LINK}?${stripeParams.toString()}`;
  const calendlyUrl =
    `${calendlyBase}?hide_event_type_details=1&hide_landing_page_details=1` +
    `&primary_color=E9C46A&background_color=FFFCFA&text_color=1A1A1A` +
    `&redirect_url=${encodeURIComponent(stripeUrl)}`;

  const onCheckout = () => { window.location.href = stripeUrl; };

  const current = BASE_PRICES[choice.session];

  return (
    <div className="relative min-h-screen">
      {/* Vidéo plein écran : déborde d’1px pour éviter toute couture */}
      <BackgroundVideo
        mp4Src="/videos/hero.mp4"
        
        poster="/images/hero-poster.jpg"
        className="fixed -inset-px object-cover z-0 pointer-events-none"
      />
      {/* Voile de lisibilité au-dessus de la vidéo */}
      <div className="fixed -inset-px z-10 bg-white/40 backdrop-blur-sm pointer-events-none" />

      {/* Contenu */}
      <main className="relative z-20">
        {/* HERO */}
        <section className="relative overflow-hidden text-center py-14 sm:py-20">
          {/* Petite aurora top pour le hero */}
          <div aria-hidden className="absolute inset-0">
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(1000px 600px at 10% -10%, #F7DDE1 0%, transparent 60%), ' +
                  'radial-gradient(900px 500px at 90% -20%, #CDEAD9 0%, transparent 60%), ' +
                  'radial-gradient(1200px 700px at 50% -30%, #F3DFB0 0%, transparent 60%)',
              }}
            />
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '3px 3px' }}
            />
          </div>

          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
            <h1 className="text-[clamp(30px,5.5vw,56px)] font-extrabold tracking-tight">
              Photographe Nouveau-né & Grossesse — Portraits - LifeStyle - 
              Studio à Montreuil
            </h1>
            <p className="mt-4 max-w-3xl mx-auto text-base sm:text-lg opacity-80">
              Des images douces, poétiques et intemporelles. Configurez votre séance, réservez votre créneau et choisissez vos produits imprimés.
            </p>
          
            <div className="mt-5 flex flex-wrap justify-center gap-3 text-xs sm:text-sm opacity-90">
              <Badge>{current.label} — {current.duration}</Badge>
              <Badge>Total : {total.toFixed(0)} €</Badge>
              <Badge>Acompte : {deposit.toFixed(0)} €</Badge>
              <Badge>Studio Montreuil</Badge>
            </div>
          </div>
        </section>

        {/* CONFIGURATEUR ULTRA DESIGN */}
        <section id="config" className="relative max-w-6xl mx-auto px-4 sm:px-6 py-14">
          <div className="relative rounded-[28px] shadow-[0_8px_30px_rgba(0,0,0,.06)] overflow-hidden">
            <AuroraSection />

            {/* En-tête configurateur */}
            <div className="relative px-5 sm:px-8 py-6 sm:py-8 bg-white/60 backdrop-blur-md border-b border-black/10/5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Créez votre séance idéale</h2>
                  <p className="text-sm opacity-70">Choisissez le type de séance, les options de confort et vos produits imprimés. 🌸</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs bg-[#fff7f9] border border-black/5">Doux & pastel</span>
                  <span className="px-3 py-1 rounded-full text-xs bg-[#CDEAD9]/30 border border-black/5">Studio Montreuil</span>
                </div>
              </div>
            </div>

            {/* Grille principale */}
            <div className="relative grid lg:grid-cols-5 gap-0 bg-white/50 backdrop-blur-md">
              {/* Colonne gauche */}
              <div className="lg:col-span-3 p-5 sm:p-8">
                <div className="rounded-2xl bg-[rgba(255,255,255,.66)] p-5 sm:p-6 border border-black/5 shadow-[0_8px_30px_rgba(0,0,0,.06)]">
                  <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
                    <span>🎀 Type de séance</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-[#F7DDE1]/40 border border-black/5">bébé & famille</span>
                  </h3>

                  {/* Type de séance */}
                  <div className="mb-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        { value: 'newborn',   label: BASE_PRICES.newborn.label,   hint: `${BASE_PRICES.newborn.duration} · ${BASE_PRICES.newborn.base}€`, emoji:'🍼' },
                        { value: 'maternity', label: BASE_PRICES.maternity.label, hint: `${BASE_PRICES.maternity.duration} · ${BASE_PRICES.maternity.base}€`, emoji:'🤰' },
                        { value: 'kids',      label: BASE_PRICES.kids.label,      hint: `${BASE_PRICES.kids.duration} · ${BASE_PRICES.kids.base}€`,       emoji:'🧸' },
                        { value: 'family',    label: BASE_PRICES.family.label,    hint: `${BASE_PRICES.family.duration} · ${BASE_PRICES.family.base}€`,   emoji:'👨‍👩‍👧' },
                        { value: 'duo',       label: BASE_PRICES.duo.label,       hint: `${BASE_PRICES.duo.duration} · ${BASE_PRICES.duo.base}€`,         emoji:'💞' },
                      ].map(opt => (
                        <button
                          key={opt.value}
                          onClick={()=>setChoice({ ...choice, session: opt.value as any })}
                          className={`text-left rounded-xl border px-3 py-3 transition shadow-[0_8px_30px_rgba(0,0,0,.06)]
                            ${choice.session===opt.value ? 'bg-white border-black/10' : 'bg-white/70 hover:bg-white border-black/5'}`}>
                          <div className="text-sm font-semibold flex items-center gap-2">
                            <span>{opt.emoji}</span> {opt.label}
                          </div>
                          <div className="text-xs opacity-70">{opt.hint}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Participants & durée/jour */}
                  <div className="grid sm:grid-cols-2 gap-6 mb-6">
                    <div className="rounded-xl bg-white/70 border border-black/5 p-4">
                      <div className="text-sm font-medium mb-2">👶 Enfants photographiés</div>
                      <div className="flex items-center gap-2">
                        <button className="w-9 h-9 rounded-lg border bg-white hover:bg-white/80" onClick={()=>setChoice({ ...choice, kidsCount: Math.max(1, choice.kidsCount-1) })}>−</button>
                        <div className="px-3 py-2 bg-white rounded-lg border text-sm min-w-[64px] text-center">{choice.kidsCount}</div>
                        <button className="w-9 h-9 rounded-lg border bg-white hover:bg-white/80" onClick={()=>setChoice({ ...choice, kidsCount: Math.min(6, choice.kidsCount+1) })}>+</button>
                      </div>
                      <div className="text-xs opacity-70 mt-2">Pour enfant/famille, +{EXTRA_KID_FEE}€ dès le 2ᵉ.</div>
                    </div>

                    <div className="rounded-xl bg-white/70 border border-black/5 p-4 flex flex-col gap-3">
                      <div className="text-sm font-medium">👪 Parents & jumeaux</div>
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" className="accent-black/80" checked={choice.includeParents} onChange={(e)=>setChoice({ ...choice, includeParents: e.target.checked })} />
                        Inclure des portraits avec les parents
                      </label>
                      <label className={`flex items-center gap-2 text-sm ${choice.session!=='newborn' ? 'opacity-40' : ''}`}>
                        <input type="checkbox" className="accent-black/80" disabled={choice.session!=='newborn'}
                          checked={choice.twins} onChange={(e)=>setChoice({ ...choice, twins: e.target.checked })}/>
                        Jumeaux (nouveau-né) <span className="ml-auto text-xs opacity-70">+{TWINS_FEE}€</span>
                      </label>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6 mb-6">
                    <div className="rounded-xl bg-white/70 border border-black/5 p-4">
                      <div className="text-sm font-medium mb-2">🗓️ Jour</div>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { value:'weekday', label:'Semaine',  hint:'+0€' },
                          { value:'weekend', label:'Week-end', hint:`+${DAY_FEES.weekend}€` },
                        ].map(opt=>(
                          <button key={opt.value}
                            onClick={()=>setChoice({ ...choice, day: opt.value as any })}
                            className={`rounded-lg border px-3 py-2 text-left ${choice.day===opt.value?'bg-white border-black/10':'bg-white/70 hover:bg-white border-black/5'}`}>
                            <div className="text-sm font-medium">{opt.label}</div>
                            <div className="text-xs opacity-70">{opt.hint}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-xl bg-white/70 border border-black/5 p-4">
                      <div className="text-sm font-medium mb-2">⏱️ Durée</div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm opacity-80">Ajouter 1h</span>
                        <div className="flex items-center gap-2">
                          <button className="w-9 h-9 rounded-lg border bg-white hover:bg-white/80" onClick={()=>setChoice({ ...choice, extraHour: Math.max(0, (choice.extraHour||0)-1) })}>−</button>
                          <div className="px-3 py-2 bg-white rounded-lg border text-sm min-w-[64px] text-center">{choice.extraHour}</div>
                          <button className="w-9 h-9 rounded-lg border bg-white hover:bg-white/80" onClick={()=>setChoice({ ...choice, extraHour: Math.min(3, (choice.extraHour||0)+1) })}>+</button>
                        </div>
                      </div>
                      <div className="text-xs opacity-70 mt-2">+{EXTRA_HOUR_FEE}€/h</div>
                    </div>
                  </div>

                  {/* Pack digitaux & confort */}
                  <div className="grid sm:grid-cols-2 gap-6 mb-6">
                    <div className="rounded-xl bg-white/70 border border-black/5 p-4">
                      <div className="text-sm font-medium mb-3">📷 Pack de photos digitales</div>
                      <div className="grid grid-cols-2 gap-2">
                        {(Object.keys(PACKS) as PackKey[]).map((k)=>(
                          <button key={k} onClick={()=>setChoice({ ...choice, pack: k })}
                            className={`text-left rounded-lg border px-3 py-2 shadow-[0_8px_30px_rgba(0,0,0,.06)] ${choice.pack===k?'bg-white border-black/10':'bg-white/70 hover:bg-white border-black/5'}`}>
                            <div className="text-sm font-medium">{PACKS[k].label}</div>
                            <div className="text-xs opacity-70">{PACKS[k].add ? `+${PACKS[k].add}€` : 'Inclus'}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-xl bg-white/70 border border-black/5 p-4 flex flex-col gap-2">
                      <div className="text-sm font-medium">🌼 Confort & style</div>
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" className="accent-black/80" checked={choice.makeup} onChange={(e)=>setChoice({ ...choice, makeup: e.target.checked })}/>
                        Maquillage / coiffure partenaire <span className="ml-auto text-xs opacity-70">+{MAKEUP_PRICE}€</span>
                      </label>
                      <label className={`flex items-center gap-2 text-sm ${choice.session!=='maternity'?'opacity-40':''}`}>
                        <input type="checkbox" className="accent-black/80" disabled={choice.session!=='maternity'}
                          checked={choice.dresses} onChange={(e)=>setChoice({ ...choice, dresses: e.target.checked })}/>
                        Location robes & drapés <span className="ml-auto text-xs opacity-70">+{DRESSES_PRICE}€</span>
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" className="accent-black/80" checked={choice.rush} onChange={(e)=>setChoice({ ...choice, rush: e.target.checked })}/>
                        Livraison express 48h <span className="ml-auto text-xs opacity-70">+{RUSH_PRICE}€</span>
                      </label>
                    </div>
                  </div>

                  {/* Accessoires & décors */}
                  <div className="rounded-2xl bg-white/70 border border-black/5 p-4 sm:p-5">
                    <div className="text-sm font-medium mb-3">🧺 Accessoires & décors (inclus)</div>
                    <ChipGroup
                      title="Thèmes"
                      items={['Lumière artistique','Naturel/bois','Minimaliste','Fond sombre','Pastel doux']}
                      selected={choice.themes}
                      onToggle={(val)=>toggleInArray(choice.themes, val, (next)=>setChoice({ ...choice, themes: next }))}
                    />
                    <ChipGroup
                      title="Palettes de couleurs"
                      items={['Neutres','Rosés','Verts pastels','Beiges','Noir & Blanc']}
                      selected={choice.colors}
                      onToggle={(val)=>toggleInArray(choice.colors, val, (next)=>setChoice({ ...choice, colors: next }))}
                    />
                    <ChipGroup
                      title="Accessoires nouveau-né"
                      items={['Paniers','Couvertures','Bonnets','Wraps','Headbands']}
                      selected={choice.newbornProps}
                      onToggle={(val)=>toggleInArray(choice.newbornProps, val, (next)=>setChoice({ ...choice, newbornProps: next }))}
                    />
                    <ChipGroup
                      title="Robes de grossesse"
                      items={['Robe satin','Robe drapée','Voilage','Bohème','Classique']}
                      selected={choice.maternityGowns}
                      onToggle={(val)=>toggleInArray(choice.maternityGowns, val, (next)=>setChoice({ ...choice, maternityGowns: next }))}
                    />
                    <div className="text-xs opacity-70 mt-2">Ces choix orientent la préparation — sans coût supplémentaire.</div>
                  </div>

                  {/* Produits imprimés */}
                  <div className="grid md:grid-cols-2 gap-6 mt-6">
                    <div className="rounded-2xl bg-white/70 border border-black/5 p-4 sm:p-5">
                      <div className="text-sm font-medium mb-3">🖨️ Packs d’impressions</div>
                      <div className="grid grid-cols-1 gap-2">
                        {(Object.keys(PRINT_PACKS) as PrintPackKey[]).map((k) => (
                          <label key={k} className="flex items-center justify-between rounded-xl border px-3 py-2 bg-white/70 hover:bg-white cursor-pointer">
                            <div className="text-sm">
                              <div className="font-medium">{PRINT_PACKS[k].label}</div>
                              {PRINT_PACKS[k].note && <div className="text-xs opacity-70">{PRINT_PACKS[k].note}</div>}
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-medium">{PRINT_PACKS[k].price} €</span>
                              <input type="radio" name="prints" checked={choice.printPack===k}
                                onChange={()=>setChoice({ ...choice, printPack: choice.printPack===k?null:k })}/>
                            </div>
                          </label>
                        ))}
                        <button onClick={()=>setChoice({ ...choice, printPack: null })} className="text-left text-sm underline opacity-80 hover:opacity-100 mt-1">
                          Aucun pack d’impressions
                        </button>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="rounded-2xl bg-white/70 border border-black/5 p-4 sm:p-5">
                        <div className="text-sm font-medium mb-3">📖 Album principal</div>
                        <div className="grid grid-cols-1 gap-2">
                          {(Object.keys(ALBUMS) as AlbumKey[]).map((k) => (
                            <label key={k} className="flex items-center justify-between rounded-xl border px-3 py-2 bg-white/70 hover:bg-white cursor-pointer">
                              <div className="text-sm font-medium">{ALBUMS[k].label}</div>
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-medium">{ALBUMS[k].price} €</span>
                                <input type="radio" name="album" checked={choice.album===k}
                                  onChange={()=>setChoice({ ...choice, album: choice.album===k?null:k })}/>
                              </div>
                            </label>
                          ))}
                          <button onClick={()=>setChoice({ ...choice, album: null })} className="text-left text-sm underline opacity-80 hover:opacity-100 mt-1">
                            Pas d’album
                          </button>
                        </div>
                      </div>

                      <div className="rounded-2xl bg-white/70 border border-black/5 p-4 sm:p-5">
                        <div className="text-sm font-medium mb-3">🧩 Options d’album</div>
                        <div className="flex flex-col gap-2">
                          {(Object.keys(ALBUM_ADDONS) as AlbumAddonKey[]).map((k)=>(
                            <label key={k} className={`flex items-center gap-2 text-sm ${!choice.album?'opacity-40':''}`}>
                              <input type="checkbox" className="accent-black/80" disabled={!choice.album}
                                checked={choice.albumAddons.includes(k)}
                                onChange={()=>toggleInArray(choice.albumAddons, k, (next)=>setChoice({ ...choice, albumAddons: next }))}/>
                              {ALBUM_ADDONS[k].label}
                              <span className="ml-auto text-xs opacity-70">+{ALBUM_ADDONS[k].price}€</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-2xl bg-white/70 border border-black/5 p-4 sm:p-5">
                        <div className="text-sm font-medium mb-3">🖼️ Décoration murale</div>
                        <div className="flex flex-col gap-2">
                          {(Object.keys(WALL_ARTS) as WallArtKey[]).map((k)=>(
                            <label key={k} className="flex items-center gap-2 text-sm">
                              <input type="checkbox" className="accent-black/80"
                                checked={choice.wallArts.includes(k)}
                                onChange={()=>toggleInArray(choice.wallArts, k, (next)=>setChoice({ ...choice, wallArts: next }))}/>
                              {WALL_ARTS[k].label}
                              <span className="ml-auto text-xs opacity-70">+{WALL_ARTS[k].price}€</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Colonne droite : récap sticky */}
              <aside className="lg:col-span-2 p-5 sm:p-8">
                <div className="sticky top-6">
                  <div className="rounded-2xl bg-[rgba(255,255,255,.66)] p-5 sm:p-6 border border-black/5 shadow-[0_8px_30px_rgba(0,0,0,.06)]">
                    <h3 className="text-lg sm:text-xl font-semibold mb-4">Récapitulatif</h3>
                    <div className="space-y-2 mb-4">
                      <PriceLine label={BASE_PRICES[choice.session].label} value={BASE_PRICES[choice.session].base} />
                      <PriceLine label={`Jour: ${choice.day==='weekday' ? 'Semaine' : 'Week-end'}`} value={choice.day==='weekday' ? 0 : DAY_FEES.weekend} />
                      {(choice.session==='kids' || choice.session==='family') && choice.kidsCount>1 && (
                        <PriceLine label={`Enfants supplémentaires (${choice.kidsCount-1})`} value={(choice.kidsCount-1)*EXTRA_KID_FEE} />
                      )}
                      {(choice.session==='newborn' && choice.twins) && <PriceLine label="Jumeaux" value={TWINS_FEE} />}
                      <PriceLine label={`Pack digital: ${PACKS[choice.pack].label}`} value={PACKS[choice.pack].add} />
                      {choice.extraHour>0 && <PriceLine label={`Heures sup. (${choice.extraHour})`} value={choice.extraHour * EXTRA_HOUR_FEE} />}
                      {choice.makeup && <PriceLine label="Maquillage / coiffure" value={MAKEUP_PRICE} />}
                      {(choice.session==='maternity' && choice.dresses) && <PriceLine label="Location robes & drapés" value={DRESSES_PRICE} />}
                      {choice.printPack && <PriceLine label={PRINT_PACKS[choice.printPack].label} value={PRINT_PACKS[choice.printPack].price} />}
                      {choice.album && <PriceLine label={ALBUMS[choice.album].label} value={ALBUMS[choice.album].price} />}
                      {choice.albumAddons.map((k)=>(
                        <PriceLine key={k} label={`Option album — ${ALBUM_ADDONS[k].label}`} value={ALBUM_ADDONS[k].price} />
                      ))}
                      {choice.wallArts.map((k)=>(
                        <PriceLine key={k} label={WALL_ARTS[k].label} value={WALL_ARTS[k].price} />
                      ))}
                      {choice.rush && <PriceLine label="Livraison express 48h" value={RUSH_PRICE} />}
                    </div>

                    <div className="py-3 border-t border-b border-black/10/5 my-4">
                      <div className="flex items-center justify-between text-base">
                        <span>Total</span>
                        <span className="font-semibold">{total.toFixed(0)} €</span>
                      </div>
                      <div className="flex items-center justify-between text-sm opacity-80">
                        <span>Acompte (30%)</span>
                        <span className="font-medium">{deposit.toFixed(0)} €</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <button onClick={()=>setCalendlyOpen(true)}
                        className="h-11 rounded-xl border border-black/10/5 bg-white hover:bg-white/90 transition shadow-sm text-black">
                        Choisir un créneau
                      </button>
                      <button onClick={onCheckout}
                        className="h-11 rounded-xl bg-black text-white hover:opacity-90 transition shadow-sm">
                        Régler l’acompte et réserver
                      </button>
                    </div>
                    <p className="text-xs opacity-70 mt-3">Le solde sera réglé le jour de la séance. Un e-mail récapitulatif vous sera envoyé.</p>
                  </div>
                </div>
              </aside>
            </div>
          </div>

          {/* Calendly */}
          <CalendlyModal url={calendlyUrl} open={calendlyOpen} onClose={()=>setCalendlyOpen(false)} />
        </section>
      </main>
    </div>
  );
}

/* ============================================================
   UI utils
============================================================ */
function PriceLine({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="opacity-80">{label}</span>
      <span className="font-medium">{value.toFixed(0)} €</span>
    </div>
  );
}

function ChipGroup({ title, items, selected, onToggle }:{
  title: string; items: string[]; selected: string[]; onToggle: (v:string)=>void;
}) {
  return (
    <div className="mb-3">
      <div className="text-xs font-medium mb-2 opacity-80">{title}</div>
      <div className="flex flex-wrap gap-2">
        {items.map((it)=>(
          <button key={it}
            onClick={()=>onToggle(it)}
            className={`px-3 py-1 rounded-full border text-xs ${selected.includes(it) ? 'bg-white border-black/10' : 'bg-white/60 hover:bg-white border-black/5'}`}>
            {it}
          </button>
        ))}
      </div>
    </div>
  );
}

function toggleInArray<T extends string>(arr: T[], val: T, cb: (next: T[]) => void) {
  const set = new Set(arr);
  set.has(val) ? set.delete(val) : set.add(val);
  cb(Array.from(set) as T[]);
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="px-3 py-1 rounded-full bg-white/70 border border-black/5 shadow-sm">{children}</span>;
}