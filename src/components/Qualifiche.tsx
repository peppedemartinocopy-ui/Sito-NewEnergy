import { BadgeCheck } from 'lucide-react';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './Reveal';

// Qualifiche e conformità: testo semplice e con titolo, così lo leggono anche i motori di ricerca e le AI.
const ITEMS = [
  {
    title: 'D.M. 37/08',
    text: 'Operiamo come impresa abilitata ai sensi del D.M. 37/08. A fine lavori ricevi la dichiarazione di conformità dell’impianto.',
  },
  {
    title: 'Responsabile tecnico',
    text: 'Per. Ind. Gustavo Loporchio, perito industriale, titolare di New Energy. Segue personalmente ogni impianto.',
  },
  {
    title: 'Esperto in Gestione dell’Energia (EGE)',
    text: 'Qualifica secondo la norma UNI CEI 11339:2023.',
  },
  {
    title: 'Diagnosi energetiche',
    text: 'Competenze secondo la norma UNI CEI EN 16247-5:2015, relativa all’auditor energetico.',
  },
];

export function Qualifiche() {
  return (
    <section id="qualifiche" className="py-16 lg:py-20 bg-white">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Qualifiche"
          title={<>Qualifiche e <span className="text-gradient-green">conformità</span></>}
          subtitle="Quello che puoi verificare prima di firmare."
        />
        <Reveal className="mt-10 grid sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {ITEMS.map((it) => (
            <div key={it.title} className="p-6 rounded-2xl bg-white border border-ink-900/8 shadow-card">
              <h3 className="flex items-start gap-2 font-display font-bold text-lg text-ink-900 leading-snug">
                <BadgeCheck className="shrink-0 w-5 h-5 mt-0.5 text-brand-green-deep" />
                {it.title}
              </h3>
              <p className="mt-2 text-[15px] text-ink-700/85 leading-relaxed">{it.text}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
