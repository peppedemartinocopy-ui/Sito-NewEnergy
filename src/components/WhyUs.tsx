import { Eye, Wrench, Ruler, ArrowRight, Sun, Car } from 'lucide-react';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './Reveal';

const REASONS = [
  {
    icon: Ruler,
    title: 'Finiture curate, anche dove non guardi',
    text: [
      'Un pannello sul tetto sembra uguale a un altro. La differenza sta sotto: fissaggi, collegamenti, protezioni, passaggio dei cavi.',
      'Dettagli che quasi nessuno guarda, ma che fanno la differenza sull’affidabilità dell’impianto negli anni.',
    ],
  },
  {
    icon: Eye,
    title: 'Se la produzione ha un’anomalia, possiamo accorgercene prima di te',
    text: [
      'Controlliamo da remoto i dati del tuo impianto anche dopo l’installazione.',
      'Se rileviamo qualcosa che non va, possiamo verificarlo e capire come intervenire.',
      'Monitoraggio incluso a vita.',
    ],
  },
  {
    icon: Wrench,
    title: '2 anni di assistenza gratuita sul posto',
    text: [
      'Se qualcosa non funziona, sai già chi chiamare.',
      'Per i primi 24 mesi hai assistenza gratuita sul posto, secondo le condizioni del contratto.',
      'E anche dopo restiamo il tuo riferimento per manutenzioni e riparazioni, con tariffe chiare.',
    ],
  },
];

const PARTNERS = [
  { name: 'Huawei', src: '/images/brands/huawei.webp', size: 'h-14 sm:h-16', w: 128, h: 128 },
  { name: 'Viessmann', src: '/images/brands/viessmann.webp', size: 'h-8 sm:h-9', w: 299, h: 72 },
  { name: 'SolarEdge', src: '/images/brands/solaredge.webp', size: 'h-8 sm:h-9', w: 356, h: 72 },
  { name: 'Solplanet', src: '/images/brands/solplanet.webp', size: 'h-8 sm:h-9', w: 282, h: 72 },
];

// Barra compatta "Soluzioni per la tua casa": prende il posto della sezione servizi (ancora #servizi).
const SOLUTIONS = [
  { icon: Sun, title: 'Fotovoltaico', text: 'Con o senza accumulo' },
  { icon: Car, title: 'Ricarica auto elettriche', text: 'Wallbox per casa' },
];

export function WhyUs() {
  return (
    <section id="perche" className="py-20 lg:py-28 bg-gradient-to-b from-white to-[#f4f9ee]">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Perché New Energy"
          title={<>Quando scegli chi ti installerà il fotovoltaico, <span className="text-gradient-green">pensa anche a cosa succede dopo.</span></>}
          subtitle="Un impianto deve funzionare bene per anni. Per questo prestiamo attenzione a ogni dettaglio del montaggio, ne monitoriamo il funzionamento e restiamo a disposizione quando hai bisogno di assistenza."
        />

        <div className="mt-14 grid lg:grid-cols-3 gap-5">
          {REASONS.map((r, i) => {
            const Icon = r.icon;
            return (
              <Reveal key={r.title} delay={i * 70}>
                <div className="group h-full p-7 rounded-2xl bg-white border border-ink-900/8 hover:border-brand-green/40 shadow-card hover:shadow-cardhover transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 grid place-items-center w-12 h-12 rounded-xl bg-brand-green/10 text-brand-green-dark group-hover:bg-brand-green group-hover:text-white transition-all duration-300">
                      <Icon className="w-6 h-6" strokeWidth={2} />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg text-ink-900 leading-snug">{r.title}</h3>
                      <div className="mt-2 space-y-2 text-[15px] text-ink-700/80 leading-relaxed">
                        {r.text.map((t) => <p key={t}>{t}</p>)}
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Soluzioni per la tua casa */}
        <Reveal className="mt-14">
          <div id="servizi" className="rounded-3xl bg-ink-900 text-white px-6 py-5 sm:px-8">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
              Soluzioni per la tua casa
            </p>
            <div className="mt-4 grid sm:grid-cols-2 gap-4 sm:gap-8 max-w-2xl mx-auto">
              {SOLUTIONS.map((x) => {
                const Icon = x.icon;
                return (
                  <div key={x.title} className="flex items-center gap-3 sm:justify-center">
                    <span className="shrink-0 grid place-items-center w-10 h-10 rounded-xl bg-brand-green/15 text-brand-green">
                      <Icon className="w-5 h-5" strokeWidth={2} />
                    </span>
                    <div>
                      <div className="font-display font-bold text-[16px] leading-tight">{x.title}</div>
                      <div className="text-sm text-white/70">{x.text}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* CTA */}
        <Reveal className="mt-10 flex justify-center">
          <a
            href="#contattaci"
            className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-green text-white font-semibold shadow-glow hover:bg-brand-green-dark transition-all hover:-translate-y-0.5"
          >
            Richiedi un preventivo
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </Reveal>

        {/* Partners */}
        <Reveal className="mt-14">
          <p className="text-center text-sm font-semibold uppercase tracking-[0.18em] text-ink-700/60 mb-8">
            Lavoriamo con i migliori brand
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {PARTNERS.map((p) => (
              <img
                key={p.name}
                src={p.src}
                alt={p.name}
                width={p.w}
                height={p.h}
                className={`${p.size} w-auto object-contain`}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
