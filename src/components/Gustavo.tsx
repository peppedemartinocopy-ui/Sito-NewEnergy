import { ArrowRight } from 'lucide-react';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './Reveal';

export function Gustavo() {
  return (
    <section id="gustavo" className="py-20 lg:py-28 bg-gradient-to-b from-[#f4f9ee] to-white">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Telefono: titolo, foto, testo. Desktop: foto a sinistra, titolo e testo a destra. */}
        <div className="grid lg:grid-cols-2 gap-y-10 lg:gap-x-16 lg:gap-y-6">
          <div className="lg:col-start-2 lg:row-start-1 lg:self-end">
            <SectionHeading
              center={false}
              eyebrow="Conosci Gustavo"
              title={<>Prima di affidargli il tuo tetto, <span className="text-gradient-green">conosci chi seguirà i lavori.</span></>}
            />
          </div>

          {/* Portrait placeholder */}
          <Reveal className="lg:col-start-1 lg:row-start-1 lg:row-span-2 lg:self-center">
            <div className="relative">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-cardhover max-w-md mx-auto">
                <img
                  src="/images/gustavo-titolare.webp"
                  loading="lazy"
                  decoding="async"
                  alt="Gustavo, titolare di New Energy, al lavoro su un impianto fotovoltaico"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating quote card */}
              <div className="absolute -bottom-6 -right-2 sm:-right-6 max-w-[260px] bg-white rounded-2xl shadow-cardhover p-5">
                <p className="text-[15px] text-ink-800 italic leading-relaxed">
                  "Se l'impianto non funziona, mi chiami. Sempre."
                </p>
                <p className="mt-2 text-xs font-semibold text-brand-green-dark uppercase tracking-wider">
                  — Gustavo, titolare
                </p>
              </div>
            </div>
          </Reveal>

          {/* Testo */}
          <div className="mt-4 lg:mt-0 lg:col-start-2 lg:row-start-2 lg:self-start">
            <Reveal className="space-y-4 text-lg text-ink-700/85 leading-relaxed">
              <p>
                Gustavo è il titolare di New Energy. Ha oltre 30 anni di esperienza e segue personalmente
                il tuo progetto, dal primo incontro all’installazione.
              </p>
              <p>
                Parli direttamente con lui, senza passare da un venditore all’altro. E se un domani hai
                bisogno di assistenza, sai già a chi rivolgerti.
              </p>
            </Reveal>

            <Reveal className="mt-8">
              <a
                href="#contattaci"
                className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-green text-white font-semibold shadow-glow hover:bg-brand-green-dark transition-all hover:-translate-y-0.5"
              >
                Parla con Gustavo
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
