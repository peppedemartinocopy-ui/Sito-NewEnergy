import { ArrowRight, MessageCircle, ShieldCheck, MapPin, Star, Zap, Home, Wrench, FileCheck2, Clock } from 'lucide-react';
import { useHashScroll } from '@/lib/useHashScroll';
import { trackWhatsAppClick } from '@/lib/analytics';
import { WHATSAPP_HREF } from '@/lib/whatsapp';
import { NAPOLI_FAQS, NAPOLI_WARRANTIES } from '@/data/napoli';
import { Header, type NavLink } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { SectionHeading } from '@/components/SectionHeading';
import { Reveal } from '@/components/Reveal';
import { FAQ } from '@/components/FAQ';
import { Contact } from '@/components/Contact';

const NAV: NavLink[] = [
  { href: '#cosa-facciamo', label: 'Cosa facciamo' },
  { href: '#tempi', label: 'Tempi' },
  { href: '#garanzie', label: 'Garanzie' },
  { href: '#chi-siamo', label: 'Chi siamo' },
  { href: '#faq', label: 'FAQ' },
  { href: '/', label: 'Home' },
];

const DISTINGUE = [
  {
    icon: Home,
    title: 'Veniamo da te per capire se si può fare, non per venderti qualcosa.',
    text: 'Guardiamo il tetto, i consumi e l’impianto elettrico, e se il fotovoltaico non è la scelta giusta per te, te lo diciamo. Non ci interessa chiudere un contratto a tutti i costi. Ci interessa fare un lavoro fatto bene e restare il tuo riferimento negli anni.',
  },
  {
    icon: Wrench,
    title: 'I problemi che altri lasciano lì, noi li affrontiamo.',
    text: 'Succede spesso che un’azienda si fermi davanti a un tetto complicato, a un impianto elettrico datato o a un impianto già installato che non rende come dovrebbe. Noi ci mettiamo le mani, e lo facciamo anche su impianti fatti da altri, perché veniamo dall’impiantistica elettrica e sappiamo cosa c’è dietro un impianto.',
  },
  {
    icon: Star,
    title: 'È per questo che le recensioni che riceviamo su Google sono tutte a 5 stelle.',
    text: 'Chi lavora così non ha bisogno di chiedere un voto: il cliente lo dà da solo.',
  },
];

export default function NapoliPage() {
  useHashScroll();

  return (
    <div className="min-h-screen bg-white text-ink-900 font-body">
      <Header links={NAV} logoHref="/" />
      <main>
        {/* Hero */}
        <section id="top" className="relative overflow-hidden bg-ink-900 pt-[72px]">
          <div className="absolute inset-0">
            <img
              src="/images/hero-napoli.webp"
              srcSet="/images/hero-napoli-720.webp 720w, /images/hero-napoli.webp 1080w"
              sizes="100vw"
              alt="Pannelli fotovoltaici su un tetto a tegole"
              className="w-full h-full object-cover object-[center_45%]"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.22) 14%, rgba(0,0,0,0.52) 28%, rgba(0,0,0,0.76) 56%, rgba(0,0,0,0.92) 100%)',
              }}
            />
          </div>

          <div className="relative max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="max-w-2xl lg:max-w-3xl animate-fade-up">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/15 text-white/90 text-xs font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#8fbf6c]" />
                Napoli e provincia
              </div>

              <h1 className="mt-5 text-3xl sm:text-4xl lg:text-[2.9rem] font-extrabold text-white leading-[1.1] [text-shadow:0_2px_20px_rgba(0,0,0,0.6)]">
                Pannelli solari a Napoli: un impianto fatto bene,{' '}
                <span className="block text-[#8fbf6c] mt-1">con una persona che ne risponde.</span>
              </h1>

              <p className="mt-6 text-lg text-white/90 leading-relaxed max-w-xl [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]">
                Se cerchi pannelli solari a Napoli, il problema non è trovare qualcuno che li monti. Il problema è
                trovare chi, dopo, risponde ancora al telefono.
              </p>

              <div className="mt-8 flex flex-col items-start sm:flex-row gap-2.5 sm:gap-3">
                <a
                  href="#contattaci"
                  className="group inline-flex items-center justify-center gap-2 w-[232px] sm:w-auto h-11 sm:h-auto px-5 sm:px-6 sm:py-3.5 text-[15px] sm:text-base rounded-lg sm:rounded-xl bg-brand-green-deep text-white font-semibold hover:bg-[#356a19] transition-all hover:-translate-y-0.5"
                >
                  Richiedi un preventivo
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </a>
                <a
                  href={WHATSAPP_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsAppClick('napoli_hero')}
                  className="inline-flex items-center justify-center gap-2 w-[232px] sm:w-auto h-11 sm:h-auto px-5 sm:px-6 sm:py-3.5 text-[15px] sm:text-base rounded-lg sm:rounded-xl bg-white/10 backdrop-blur border border-white/25 text-white font-semibold hover:bg-white/15 transition-all"
                >
                  <MessageCircle className="w-4 h-4 text-white/80" />
                  Scrivici su WhatsApp
                </a>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-white/80 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-brand-orange fill-current" />
                  5 stelle su Google
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-brand-green" />
                  Garanzia 25 anni
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-brand-orange" />
                  Installazione in 15 giorni dalla firma
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <svg viewBox="0 0 1440 80" className="w-full h-[40px] sm:h-[60px] fill-white" preserveAspectRatio="none">
              <path d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,40 1440,30 L1440,80 L0,80 Z" />
            </svg>
          </div>
        </section>

        {/* Cosa facciamo e cosa ci distingue */}
        <section id="cosa-facciamo" className="pt-6 pb-20 lg:pb-24 bg-white">
          <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal className="max-w-3xl mx-auto text-center">
              <p className="text-lg text-ink-700/85 leading-relaxed">
                Noi siamo New Energy, lavoriamo da oltre 30 anni nell’impiantistica elettrica e dal nostro ufficio di
                Pozzuoli seguiamo famiglie e aziende di Napoli e provincia.
              </p>
            </Reveal>

            <div className="mt-14">
              <SectionHeading
                eyebrow="Il nostro lavoro"
                title={<>Cosa facciamo, in concreto, <span className="text-gradient-green">e cosa ci distingue</span></>}
              />
            </div>

            <Reveal className="mt-8 max-w-3xl mx-auto space-y-4 text-[17px] text-ink-700/85 leading-relaxed">
              <p>
                Progettiamo l’impianto sui tuoi consumi e sul tuo tetto, lo installiamo e ci occupiamo delle pratiche
                con il distributore e con il GSE. Se serve, aggiungiamo l’accumulo per usare di notte l’energia
                prodotta di giorno e prepariamo l’impianto alla ricarica dell’auto elettrica.
              </p>
              <p>
                Usiamo componenti di marchi come Viessmann, Huawei, SolarEdge e Solplanet. A fine lavori controlli
                produzione e consumi dal telefono con il monitoraggio.
              </p>
            </Reveal>

            {/* Telefono e tablet: card da scorrere con il dito. Desktop: tre colonne. */}
            <Reveal className="mt-12 -mx-4 sm:-mx-6 lg:mx-0">
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar px-4 sm:px-6 pb-3 lg:grid lg:grid-cols-3 lg:gap-5 lg:overflow-visible lg:px-0 lg:pb-0">
              {DISTINGUE.map((d) => {
                const Icon = d.icon;
                return (
                  <div key={d.title} className="snap-center shrink-0 w-[86%] sm:w-[60%] lg:w-auto">
                    <div className="group h-full p-6 sm:p-7 rounded-2xl bg-white border border-ink-900/8 hover:border-brand-green/40 shadow-card hover:shadow-cardhover transition-all duration-300">
                      <div className="grid place-items-center w-12 h-12 rounded-xl bg-brand-green/10 text-brand-green-dark group-hover:bg-brand-green group-hover:text-white transition-all duration-300">
                        <Icon className="w-6 h-6" strokeWidth={2} />
                      </div>
                      <h3 className="mt-4 font-display font-bold text-lg text-ink-900 leading-snug">{d.title}</h3>
                      <p className="mt-2 text-[15px] text-ink-700/80 leading-relaxed">{d.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            </Reveal>
          </div>
        </section>

        {/* Tempi */}
        <section id="tempi" className="py-16 lg:py-20 bg-gradient-to-b from-white to-[#f4f9ee]">
          <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="Tempi" title={<>Quanto ci vuole, <span className="text-gradient-green">davvero</span></>} />
            <Reveal className="mt-10 max-w-3xl mx-auto">
              <div className="rounded-3xl bg-white border border-ink-900/8 shadow-card p-7 sm:p-9">
                <div className="grid sm:grid-cols-2 gap-6 text-center">
                  <div>
                    <div className="font-display font-extrabold text-4xl sm:text-5xl text-brand-green-deep whitespace-nowrap">15 giorni</div>
                    <div className="mt-1 text-sm text-ink-700/85">dalla firma all’impianto installato</div>
                  </div>
                  <div>
                    <div className="font-display font-extrabold text-4xl sm:text-5xl text-brand-green-deep whitespace-nowrap">&lt; 1 settimana</div>
                    <div className="mt-1 text-sm text-ink-700/85">di cantiere</div>
                  </div>
                </div>
                <p className="mt-6 flex items-start justify-center gap-3 text-[16px] text-ink-800 leading-relaxed">
                  <Clock className="shrink-0 w-5 h-5 text-brand-green-deep mt-1" />
                  <span>
                    Dalla firma del contratto l’impianto è installato in 15 giorni, materiali e lavori compresi. Il
                    cantiere in sé dura meno di una settimana.
                  </span>
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Garanzie */}
        <section id="garanzie" className="py-16 lg:py-20 bg-[#f4f9ee]">
          <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="Garanzie" title={<>Garanzie, <span className="text-gradient-green">scritte nell’offerta</span></>} />
            <Reveal className="mt-10">
              <div className="rounded-3xl bg-white border border-ink-900/8 shadow-card px-6 py-7 sm:px-10 sm:py-9">
                <dl className="-mx-6 sm:-mx-10 lg:mx-0 px-6 sm:px-10 lg:px-0 flex gap-3 overflow-x-auto snap-x no-scrollbar pb-1 lg:flex-wrap lg:justify-center lg:gap-x-4 lg:gap-y-6 lg:overflow-visible text-center">
                  {NAPOLI_WARRANTIES.map((w) => (
                    <div key={w.label} className="snap-start shrink-0 w-[136px] sm:w-[150px] lg:w-[calc(25%-0.75rem)]">
                      <dt className="font-display font-extrabold text-xl sm:text-2xl text-brand-green-deep">{w.value}</dt>
                      <dd className="mt-1 text-sm text-ink-700/85 leading-snug">
                        {w.label}
                        {w.note && <span className="block text-xs text-ink-700/60">{w.note}</span>}
                      </dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-7 pt-5 border-t border-ink-900/8 text-center text-[15px] text-ink-800">
                  Le durate esatte dipendono dai componenti che scegli e le trovi sempre indicate nell’offerta, voce per voce.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Chi ci mette la faccia */}
        <section id="chi-siamo" className="py-16 lg:py-24 bg-gradient-to-b from-[#f4f9ee] to-white">
          <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-[260px_1fr] gap-8 md:gap-12 items-center max-w-4xl mx-auto">
              <Reveal>
                <div className="aspect-[4/5] max-w-[260px] mx-auto rounded-3xl overflow-hidden shadow-cardhover">
                  <img
                    src="/images/gustavo-titolare.webp"
                    loading="lazy"
                    decoding="async"
                    alt="Gustavo Loporchio, titolare e responsabile tecnico di New Energy, al lavoro su un impianto fotovoltaico"
                    className="w-full h-full object-cover"
                  />
                </div>
              </Reveal>
              <div>
                <SectionHeading
                  center={false}
                  eyebrow="Chi ci mette la faccia"
                  title={<>Un nome e un cognome <span className="text-gradient-green">dietro ogni impianto</span></>}
                />
                <Reveal className="mt-6 space-y-4 text-[17px] text-ink-700/85 leading-relaxed">
                  <p>
                    L’impianto lo segue Gustavo Loporchio, perito industriale, titolare e responsabile tecnico. Alla
                    fine dei lavori ricevi la dichiarazione di conformità secondo il D.M. 37/08.
                  </p>
                  <p className="flex items-start gap-3 text-ink-800">
                    <FileCheck2 className="shrink-0 w-5 h-5 text-brand-green-deep mt-1" />
                    <span>Sono oltre 50 gli impianti consegnati, e le recensioni su Google parlano da sole.</span>
                  </p>
                </Reveal>
                <Reveal className="mt-7">
                  <a
                    href="#contattaci"
                    className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-green-deep text-white font-semibold hover:bg-[#356a19] transition-all hover:-translate-y-0.5"
                  >
                    Parla con Gustavo
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* Incentivi e zone */}
        <section id="incentivi" className="pb-16 lg:pb-20 bg-white">
          <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
              <Reveal>
                <div className="h-full p-7 rounded-2xl bg-white border border-ink-900/8 shadow-card">
                  <h2 className="font-display font-bold text-xl text-ink-900">Incentivi</h2>
                  <p className="mt-3 text-[15px] text-ink-700/85 leading-relaxed">
                    Per il fotovoltaico esiste una detrazione fiscale, recuperata in 10 anni, e l’IVA agevolata. Le
                    aliquote cambiano da un anno all’altro: ti diciamo quelle in vigore al momento del preventivo, non
                    quelle di un articolo vecchio.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={70}>
                <div className="h-full p-7 rounded-2xl bg-white border border-ink-900/8 shadow-card">
                  <h2 className="font-display font-bold text-xl text-ink-900">Dove lavoriamo</h2>
                  <p className="mt-3 text-[15px] text-ink-700/85 leading-relaxed">
                    Napoli e provincia, con ufficio a Pozzuoli. Lavoriamo anche a Caserta, Avellino e Salerno.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <FAQ items={NAPOLI_FAQS} />
        <Contact />
      </main>
      <Footer homePrefix="/" />
      <FloatingWhatsApp />
    </div>
  );
}
