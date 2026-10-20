import { useState } from 'react';
import { ChevronDown, ArrowRight, MessageCircle } from 'lucide-react';
import { trackWhatsAppClick } from '@/lib/analytics';
import { WHATSAPP_HREF } from '@/lib/whatsapp';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './Reveal';

// Foto reali di impianti installati in Campania. Le più recenti in cima, in ordine di arrivo.
// cls: dimensione della tessera da tablet in su (griglia a 4 colonne, righe da 220px).
// Le prime 8 riempiono esattamente 4 righe: 2 verticali + 2 grandi + 4 singole.
// wide: ultima tessera larga anche su telefono, così l'ultima riga resta piena (usa la foto intera, non il ritaglio).
interface Photo {
  src: string;
  cls?: string;
  wide?: boolean;
}

const PHOTOS: Photo[] = [
  { src: '/images/galleria-13.webp', cls: 'sm:row-span-2' },
  { src: '/images/galleria-14.webp', cls: 'sm:row-span-2' },
  { src: '/images/galleria-15.webp', cls: 'sm:col-span-2 sm:row-span-2' },
  { src: '/images/galleria-16.webp', cls: 'sm:col-span-2 sm:row-span-2' },
  { src: '/images/galleria-01.webp' },
  { src: '/images/galleria-02.webp' },
  { src: '/images/galleria-03.webp' },
  { src: '/images/galleria-04.webp' },
  // dietro "Vedi altri lavori"
  { src: '/images/galleria-06.webp' },
  { src: '/images/galleria-07.webp' },
  { src: '/images/galleria-08.webp' },
  { src: '/images/galleria-09.webp' },
  { src: '/images/galleria-11.webp' },
  { src: '/images/galleria-12.webp' },
  { src: '/images/galleria-10.webp', cls: 'col-span-2', wide: true },
];

// Foto visibili prima di "Vedi altri lavori".
const VISIBLE = 8;

function GalleryPhoto({ src, wide }: { src: string; wide?: boolean }) {
  const n = src.match(/galleria-(\d+)/)?.[1] ?? '';
  return (
    <div className="group relative w-full h-full overflow-hidden rounded-2xl bg-ink-900 cursor-pointer">
      <picture>
        {/* Telefono: versione leggera, già ritagliata al centro per le tessere a due colonne */}
        {!wide && <source media="(max-width: 639px)" srcSet={src.replace('.webp', '-m.webp')} />}
        <img
          src={src}
          alt={`Impianto fotovoltaico e pannelli solari installati da New Energy in Campania${n ? ` - foto ${Number(n)}` : ''}`}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </picture>
    </div>
  );
}

export function Gallery() {
  const [showAll, setShowAll] = useState(false);

  return (
    <section id="lavori" className="py-20 lg:py-28 bg-white">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="I nostri lavori"
          title={<>Alcuni <span className="text-gradient-green">impianti installati</span></>}
          subtitle="Una selezione di installazioni realizzate in Campania. Ogni impianto è studiato su misura per il tetto e i consumi del cliente."
        />

        <Reveal className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 auto-rows-[200px] sm:auto-rows-[220px]">
          {PHOTOS.map((p, i) =>
            i < VISIBLE || showAll ? (
              <div key={p.src} className={p.cls ?? ''}>
                <GalleryPhoto src={p.src} wide={p.wide} />
              </div>
            ) : null,
          )}
        </Reveal>

        {!showAll && PHOTOS.length > VISIBLE && (
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-ink-900/15 text-ink-800 font-semibold hover:bg-ink-900/5 transition-all"
            >
              Vedi altri lavori
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}

        <Reveal className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="#contattaci"
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-green text-white font-semibold shadow-glow hover:bg-brand-green-dark transition-all hover:-translate-y-0.5"
          >
            Richiedi un preventivo
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick('gallery')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-ink-900/15 text-ink-800 font-semibold hover:bg-ink-900/5 transition-all"
          >
            <MessageCircle className="w-4 h-4 text-brand-green-dark" />
            Scrivici su WhatsApp
          </a>
        </Reveal>

      </div>
    </section>
  );
}
