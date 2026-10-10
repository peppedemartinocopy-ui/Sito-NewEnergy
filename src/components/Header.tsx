import { useEffect, useState } from 'react';
import { Phone, MessageCircle, Menu, X } from 'lucide-react';
import { trackPhoneClick, trackWhatsAppClick } from '@/lib/analytics';
import { PHONE_DISPLAY, PHONE_HREF, WHATSAPP_HREF } from '@/lib/whatsapp';

const NAV_LINKS = [
  { href: '#recensioni', label: 'Recensioni' },
  { href: '#perche', label: 'Perché noi' },
  { href: '#servizi', label: 'Servizi' },
  { href: '#gustavo', label: 'Chi siamo' },
  { href: '#lavori', label: 'Lavori' },
  { href: '#faq', label: 'FAQ' },
  { href: '#contatti', label: 'Contatti' },
];


export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setOpen(false);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 sm:bg-white/90 sm:backdrop-blur-md shadow-[0_4px_24px_-12px_rgba(15,28,20,0.18)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <a href="#top" className="flex items-center group" onClick={closeMenu}>
            <span
              className={`inline-flex items-center rounded-xl transition-all ${
                scrolled ? '' : 'bg-white/95 px-2.5 py-1.5 shadow-sm'
              }`}
            >
              <img
                src="/images/logo-new-energy.png"
                alt="New Energy - Impianti Fotovoltaici"
                className="h-9 w-auto"
              />
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  scrolled
                    ? 'text-ink-800 hover:bg-brand-green/10 hover:text-brand-green-dark'
                    : 'text-white/90 hover:bg-white/10 hover:text-white'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTAs */}
          <div className="flex items-center gap-2">
            <a
              href={PHONE_HREF}
              onClick={() => trackPhoneClick('header')}
              className={`hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                scrolled
                  ? 'text-ink-800 hover:bg-ink-900/5'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Phone className="w-4 h-4" />
              <span className="hidden xl:inline">{PHONE_DISPLAY}</span>
            </a>
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick('header')}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-green text-white text-sm font-semibold shadow-glow hover:bg-brand-green-dark transition-all hover:-translate-y-0.5"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
            <button
              type="button"
              aria-label="Apri menu"
              onClick={() => setOpen((v) => !v)}
              className={`lg:hidden grid place-items-center w-10 h-10 rounded-lg ${
                scrolled ? 'text-ink-900 hover:bg-ink-900/5' : 'text-white hover:bg-white/10'
              }`}
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden overflow-hidden transition-[max-height,opacity] duration-300 bg-white ${
          open ? 'max-h-[480px] opacity-100 shadow-card' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="px-4 sm:px-6 py-3 flex flex-col">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className="px-3 py-3 rounded-lg text-base font-medium text-ink-800 hover:bg-brand-green/10 hover:text-brand-green-dark"
            >
              {link.label}
            </a>
          ))}
          <div className="flex gap-2 mt-2 px-1 pb-2">
            <a
              href={PHONE_HREF}
              onClick={() => trackPhoneClick('header_mobile')}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-ink-900/5 text-ink-800 text-sm font-semibold"
            >
              <Phone className="w-4 h-4" /> Chiama
            </a>
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick('mobile_menu')}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-brand-green text-white text-sm font-semibold"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
