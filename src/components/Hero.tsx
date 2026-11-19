import { ArrowRight, MessageCircle, ShieldCheck, MapPin, Star, Zap } from 'lucide-react';
import { trackWhatsAppClick } from '@/lib/analytics';
import { WHATSAPP_HREF } from '@/lib/whatsapp';


export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-ink-900 pt-[72px]">
      {/* Background photo of a real installation */}
      <div className="absolute inset-0">
        <img
          src="/images/hero-v2.webp"
          srcSet="/images/hero-v2-720.webp 720w, /images/hero-v2.webp 1080w"
          sizes="100vw"
          alt="Pannelli solari fotovoltaici installati su un tetto in tegole"
          className="w-full h-full object-cover object-[center_60%]"
        />
        {/* Sfumatura: chiara in alto, sempre più scura verso il basso, per far leggere bene i testi */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.22) 14%, rgba(0,0,0,0.52) 28%, rgba(0,0,0,0.76) 56%, rgba(0,0,0,0.92) 100%)',
          }}
        />
      </div>

      <div className="relative max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-28">
        <div className="max-w-2xl animate-fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/15 text-white/90 text-xs font-medium">
            <MapPin className="w-3.5 h-3.5 text-brand-green" />
            Napoli · Pozzuoli · Caserta · Avellino · Salerno
          </div>

          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-brand-green [text-shadow:0_1px_10px_rgba(0,0,0,0.6)]">
            New Energy Srl · Pozzuoli (NA)
          </p>

          <h1 className="mt-3 text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-white leading-[1.08] [text-shadow:0_2px_20px_rgba(0,0,0,0.6)]">
            Il tuo impianto deve darti tranquillità,{' '}
            <span className="block text-gradient-green mt-1">non preoccupazioni.</span>
          </h1>

          <p className="mt-6 text-lg text-white/90 leading-relaxed max-w-xl [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]">
            Con New Energy hai la certezza del risparmio e dell’affidabilità, per i prossimi 25 anni.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a
              href="#contattaci"
              className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-green text-white font-semibold shadow-glow hover:bg-brand-green-dark transition-all hover:-translate-y-0.5"
            >
              Richiedi un preventivo
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick('hero')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 backdrop-blur border border-white/20 text-white font-semibold hover:bg-white/15 transition-all"
            >
              <MessageCircle className="w-4 h-4 text-brand-green" />
              Scrivici su WhatsApp
            </a>
          </div>

          {/* Trust strip */}
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

      {/* Wave divider */}
      <div className="relative">
        <svg viewBox="0 0 1440 80" className="w-full h-[40px] sm:h-[60px] fill-white" preserveAspectRatio="none">
          <path d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,40 1440,30 L1440,80 L0,80 Z" />
        </svg>
      </div>
    </section>
  );
}
