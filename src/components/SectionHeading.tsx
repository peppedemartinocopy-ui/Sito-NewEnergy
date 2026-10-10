import { type ReactNode } from 'react';
import { Reveal } from './Reveal';

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
  center?: boolean;
  light?: boolean;
  /** Su telefono: testo e spazi un po' più stretti (usato sopra il modulo, per farlo comparire prima). */
  compact?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = true,
  light = false,
  compact = false,
}: SectionHeadingProps) {
  return (
    <Reveal className={center ? 'text-center max-w-3xl mx-auto' : 'max-w-3xl'}>
      <div className={`inline-flex items-center gap-2 ${center ? 'justify-center' : ''}`}>
        <span className="h-px w-8 bg-brand-green" />
        <span className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-green-dark">
          {eyebrow}
        </span>
        <span className="h-px w-8 bg-brand-green" />
      </div>
      <h2
        className={`mt-4 text-3xl sm:text-4xl md:text-[2.75rem] font-bold leading-[1.1] ${
          light ? 'text-white' : 'text-ink-900'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`${compact ? 'mt-3 text-base sm:mt-5 sm:text-lg' : 'mt-5 text-lg'} leading-relaxed ${
            light ? 'text-white/80' : 'text-ink-700/80'
          }`}
        >
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
