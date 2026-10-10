import { useState } from 'react';
import { Plus, Minus, ArrowRight } from 'lucide-react';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './Reveal';
import faqs from '@/data/faqs.json';

interface FAQItem {
  q: string;
  a: string;
}

// Le stesse domande e risposte finiscono nel JSON-LD di index.html (scripts/sync-faq-jsonld.mjs, a ogni build).
const FAQS: FAQItem[] = faqs;

// Domande visibili all'apertura: le altre restano nella pagina ma nascoste fino al click.
const VISIBLE = 6;

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const [showAll, setShowAll] = useState(false);

  return (
    <section id="faq" className="py-20 lg:py-28 bg-gradient-to-b from-white to-[#f4f9ee]">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Domande frequenti"
          title={<>Le risposte alle <span className="text-gradient-green">tue domande</span></>}
          subtitle="Le stesse cose che ci chiedono al telefono. Se non trovi la tua, scrivici su WhatsApp."
        />

        <div className="mt-12 max-w-3xl mx-auto space-y-3">
          {FAQS.map((faq, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={faq.q} delay={Math.min(i, VISIBLE) * 50} className={i >= VISIBLE && !showAll ? 'hidden' : ''}>
                <div
                  className={`rounded-2xl border bg-white transition-all duration-300 ${
                    isOpen ? 'border-brand-green/40 shadow-card' : 'border-ink-900/8 shadow-sm'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="font-display font-semibold text-ink-900 text-[16px] sm:text-lg leading-snug">
                      {faq.q}
                    </span>
                    <span
                      className={`shrink-0 grid place-items-center w-8 h-8 rounded-lg transition-all ${
                        isOpen ? 'bg-brand-green text-white' : 'bg-brand-green/10 text-brand-green-dark'
                      }`}
                    >
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </span>
                  </button>
                  <div
                    className="grid transition-all duration-300 ease-out"
                    style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 sm:px-6 pb-5 sm:pb-6 text-ink-700/85 leading-relaxed text-[15px]">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {!showAll && (
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-ink-900/15 text-ink-800 font-semibold hover:bg-ink-900/5 transition-all"
            >
              Mostra tutte le domande
              <Plus className="w-4 h-4" />
            </button>
          </div>
        )}

        <Reveal className="mt-12 flex justify-center">
          <a
            href="#contattaci"
            className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-green text-white font-semibold shadow-glow hover:bg-brand-green-dark transition-all hover:-translate-y-0.5"
          >
            Richiedi un preventivo gratuito
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
