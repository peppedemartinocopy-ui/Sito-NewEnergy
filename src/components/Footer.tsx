import { Phone, MessageCircle, Mail, MapPin, Facebook, Instagram } from 'lucide-react';
import { trackPhoneClick, trackWhatsAppClick, trackEvent } from '@/lib/analytics';
import { PHONE_DISPLAY, PHONE_HREF, WHATSAPP_HREF } from '@/lib/whatsapp';

const FACEBOOK_HREF = 'https://www.facebook.com/profile.php?id=61577339864356';
const INSTAGRAM_HREF = 'https://www.instagram.com/newenergyfotovoltaico';

const NAV = [
  { href: '#recensioni', label: 'Recensioni' },
  { href: '#perche', label: 'Perché noi' },
  { href: '#servizi', label: 'Servizi' },
  { href: '#gustavo', label: 'Chi siamo' },
  { href: '#contattaci', label: 'Richiedi un preventivo' },
  { href: '#lavori', label: 'Lavori' },
  { href: '#faq', label: 'FAQ' },
  { href: '#contatti', label: 'Contatti' },
];

export function Footer() {
  return (
    <footer className="bg-ink-900 text-white/70 pt-16 pb-8 border-t border-white/5">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center">
              <span className="inline-flex items-center rounded-xl bg-white/95 px-3 py-2">
                <img src="/images/logo-new-energy.png" alt="New Energy - Impianti Fotovoltaici" className="h-9 w-auto" />
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed">
              Ditta di impianti fotovoltaici e installatori di pannelli solari a Napoli, Pozzuoli e in tutta la Campania: Caserta, Avellino e Salerno.
              Parli direttamente col titolare.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <a
                href={PHONE_HREF}
                onClick={() => trackPhoneClick('footer_social')}
                aria-label="Chiama"
                className="grid place-items-center w-10 h-10 rounded-lg bg-white/5 hover:bg-brand-green text-white transition-colors"
              >
                <Phone className="w-4 h-4" />
              </a>
              <a
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick('footer')}
                aria-label="WhatsApp"
                className="grid place-items-center w-10 h-10 rounded-lg bg-white/5 hover:bg-[#25D366] text-white transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="mailto:Newenergyfotovoltaici@gmail.com"
                aria-label="Email"
                className="grid place-items-center w-10 h-10 rounded-lg bg-white/5 hover:bg-brand-blue text-white transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href={FACEBOOK_HREF}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('social_click', { event_category: 'social', event_label: 'facebook' })}
                aria-label="Facebook"
                className="grid place-items-center w-10 h-10 rounded-lg bg-white/5 hover:bg-[#1877F2] text-white transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={INSTAGRAM_HREF}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('social_click', { event_category: 'social', event_label: 'instagram' })}
                aria-label="Instagram"
                className="grid place-items-center w-10 h-10 rounded-lg bg-white/5 hover:bg-gradient-to-br hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] text-white transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Nav */}
          <div>
            <h3 className="font-display font-semibold text-white text-sm uppercase tracking-wider">Navigazione</h3>
            <ul className="mt-4 space-y-2.5">
              {NAV.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="text-sm hover:text-brand-green transition-colors">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-display font-semibold text-white text-sm uppercase tracking-wider">Servizi</h3>
            <ul className="mt-4 space-y-2.5">
              {['Fotovoltaico per la casa', 'Accumulo con batteria', 'Colonnine di ricarica', 'Manutenzione', 'Pratiche & detrazioni'].map((s) => (
                <li key={s} className="text-sm">{s}</li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold text-white text-sm uppercase tracking-wider">Contatti</h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-2.5 text-sm">
                <MapPin className="w-4 h-4 text-brand-green mt-0.5 shrink-0" />
                <span>Via Provinciale per Pianura, 20b<br />80078 Pozzuoli (NA)</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm">
                <Phone className="w-4 h-4 text-brand-green shrink-0" />
                <a href={PHONE_HREF} onClick={() => trackPhoneClick('footer_contact')} className="hover:text-brand-green transition-colors">
                  {PHONE_DISPLAY}
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-sm">
                <Mail className="w-4 h-4 text-brand-green shrink-0" />
                <a href="mailto:Newenergyfotovoltaici@gmail.com" className="hover:text-brand-green transition-colors break-all">
                  Newenergyfotovoltaici@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <p>© {new Date().getFullYear()} New Energy Srl — P.IVA 10491571211 — Tutti i diritti riservati</p>
          <div className="flex items-center gap-4">
            <a href="/privacy.html" target="_blank" rel="noopener noreferrer" className="hover:text-brand-green transition-colors">Privacy</a>
            <a href="/cookie.html" target="_blank" rel="noopener noreferrer" className="hover:text-brand-green transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
