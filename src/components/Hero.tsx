import { ArrowRight, Phone, MessageCircle, ShieldCheck, MapPin, Star, Zap } from 'lucide-react';
import { trackPhoneClick, trackWhatsAppClick } from '@/lib/analytics';
import { PHONE_DISPLAY, PHONE_HREF, WHATSAPP_HREF } from '@/lib/whatsapp';


export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-ink-900 pt-[72px]">
      {/* Background photo of a real installation */}
      <div className="absolute inset-0">
        <img
          src="/images/hero-impianto.webp"
          srcSet="/images/hero-impianto-960.webp 960w, /images/hero-impianto-1280.webp 1280w, /images/hero-impianto.webp 1600w"
          sizes="100vw"
          alt="Impianto fotovoltaico installato da New Energy in Campania"
          className="w-full h-full object-cover"
        />
        {/* Neutral dark overlay (grey/black) for a professional look */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-neutral-900/78 to-neutral-800/65" />
        <div className="absolute -top-32 -right-24 w-[520px] h-[520px] rounded-full bg-white/5 blur-[120px]" />
      </div>

      <div className="relative max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-28">
        <div className="max-w-2xl animate-fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/15 text-white/90 text-xs font-medium">
            <MapPin className="w-3.5 h-3.5 text-brand-green" />
            Napoli · Pozzuoli · Caserta · Avellino · Salerno
          </div>

          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-brand-green">
            Fotovoltaico in Campania
          </p>

          <h1 className="mt-3 text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-white leading-[1.05]">
            Installazione impianti{' '}
            <span className="block text-gradient-green mt-1">fotovoltaici in Campania</span>
          </h1>

          <p className="mt-6 text-lg text-white/85 leading-relaxed max-w-xl">
            Il tuo impianto fotovoltaico deve darti tranquillità, non preoccupazioni. Con 30 anni di
            esperienza, curiamo ogni dettaglio, lo installiamo in 15 giorni dalla firma e continuiamo
            a seguirti anche dopo il montaggio.
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
            <a href={PHONE_HREF} onClick={() => trackPhoneClick('hero_trust')} className="flex items-center gap-2 hover:text-white transition-colors">
              <Phone className="w-4 h-4 text-brand-green" />
              {PHONE_DISPLAY}
            </a>
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
