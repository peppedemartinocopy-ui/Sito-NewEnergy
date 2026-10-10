import { ArrowRight } from 'lucide-react';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './Reveal';

// Screenshot reali delle recensioni Google. La card tronca da sola con sfumatura solo se serve davvero.
// Per aggiungerne una: file da 800px + versione "-560.webp", e larghezza/altezza reali qui sotto.
const REVIEW_IMAGES = [
  { src: '/images/recensione-15.webp', w: 800, h: 381 },
  { src: '/images/recensione-16.webp', w: 800, h: 315 },
  { src: '/images/recensione-17.webp', w: 800, h: 273 },
  { src: '/images/recensione-01.webp', w: 800, h: 372 },
  { src: '/images/recensione-02.webp', w: 800, h: 429 },
  { src: '/images/recensione-03.webp', w: 800, h: 408 },
  { src: '/images/recensione-04.webp', w: 800, h: 432 },
  { src: '/images/recensione-05.webp', w: 800, h: 414 },
  { src: '/images/recensione-06.webp', w: 800, h: 362 },
  { src: '/images/recensione-07.webp', w: 800, h: 433 },
  { src: '/images/recensione-08.webp', w: 800, h: 452 },
  { src: '/images/recensione-09.webp', w: 800, h: 452 },
  { src: '/images/recensione-10.webp', w: 800, h: 452 },
  { src: '/images/recensione-11.webp', w: 800, h: 452 },
  { src: '/images/recensione-12.webp', w: 800, h: 452 },
  { src: '/images/recensione-13.webp', w: 800, h: 452 },
  { src: '/images/recensione-14.webp', w: 800, h: 452 },
];

const GOOGLE_REVIEWS_HREF =
  'https://www.google.com/maps/place/New+Energy+Srl+-+Impianti+Fotovoltaici/@40.8621188,14.1273025,17z/data=!4m8!3m7!1s0x133b0fb3b9e5cc73:0x9d29ebfa9ce56bf3!8m2!3d40.8621188!4d14.1273025!9m1!1b1!16s%2Fg%2F11t7dqh10x?entry=ttu&g_ep=EgoyMDI2MDkyOC4wIKXMDSoASAFQAw%3D%3D';

// Altezza massima della finestra di anteprima. La sfumatura compare solo se l'immagine,
// alla larghezza della card (300px su telefono, 360px da tablet in su), è più alta di così.
const MAX_PREVIEW_HEIGHT = 230;

function ReviewCard({ src, w, h, index }: { src: string; w: number; h: number; index: number }) {
  const fade = (h * 300) / w > MAX_PREVIEW_HEIGHT ? 'block' : (h * 360) / w > MAX_PREVIEW_HEIGHT ? 'hidden sm:block' : 'hidden';

  return (
    <div className="snap-start shrink-0 w-[300px] sm:w-[360px] flex flex-col rounded-2xl bg-white border border-ink-900/8 shadow-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-ink-900/8">
        <svg className="w-5 h-5" viewBox="0 0 48 48" aria-label="Google">
          <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/>
          <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/>
          <path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z"/>
          <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"/>
        </svg>
        <span className="text-xs font-semibold text-ink-700/70">Recensione Google</span>
      </div>

      <div className="relative overflow-hidden" style={{ maxHeight: MAX_PREVIEW_HEIGHT }}>
        <img
          src={src}
          srcSet={`${src.replace('.webp', '-560.webp')} 560w, ${src} 800w`}
          sizes="(min-width: 640px) 360px, 300px"
          width={w}
          height={h}
          alt={`Recensione Google cliente New Energy ${index + 1}`}
          loading={index < 2 ? 'eager' : 'lazy'}
          decoding="async"
          className="w-full h-auto block"
        />
        <div className={`${fade} absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none`} />
      </div>

      <div className="mt-auto px-4 py-3 border-t border-ink-900/8">
        <a
          href={GOOGLE_REVIEWS_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-green-dark hover:text-brand-green transition-colors"
        >
          Leggi su Google
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}

export function Reviews() {
  return (
    <section id="recensioni" className="py-20 lg:py-28 bg-white">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Recensioni verificate"
          title={<>Promettere un buon lavoro <span className="text-gradient-green">è facile.</span></>}
          subtitle="La differenza si vede quando l’impianto è sul tetto, hai già pagato e ti serve assistenza. Per questo lasciamo la parola a chi ci ha già scelto."
        />

        {/* Carosello scrollabile col dito (touch/swipe) */}
        <div className="mt-12 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div
            className="flex items-stretch gap-5 overflow-x-auto pb-6 snap-x snap-mandatory scroll-smooth"
            style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'thin' }}
          >
            {REVIEW_IMAGES.map((r, i) => (
              <ReviewCard key={r.src} src={r.src} w={r.w} h={r.h} index={i} />
            ))}
          </div>
        </div>

        <Reveal className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={GOOGLE_REVIEWS_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-green text-white font-semibold shadow-glow hover:bg-brand-green-dark transition-all group"
          >
            Leggi tutte le recensioni su Google
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#contattaci"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-ink-900/15 text-ink-800 font-semibold hover:bg-ink-900/5 transition-all"
          >
            Diventa il prossimo cliente soddisfatto
          </a>
        </Reveal>
      </div>
    </section>
  );
}
