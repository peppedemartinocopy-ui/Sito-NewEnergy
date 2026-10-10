import { useEffect, useState } from 'react';
import { MessageCircle, Phone } from 'lucide-react';
import { trackPhoneClick, trackWhatsAppClick } from '@/lib/analytics';
import { PHONE_HREF, WHATSAPP_HREF } from '@/lib/whatsapp';


export function FloatingWhatsApp() {
  // Mentre il modulo preventivo è sullo schermo i pulsanti spariscono: su telefono coprirebbero i campi.
  const [overForm, setOverForm] = useState(false);

  useEffect(() => {
    const form = document.getElementById('contattaci');
    // Solo su telefono e tablet: su desktop il modulo è centrato e i pulsanti non lo coprono.
    if (!form || !('IntersectionObserver' in window) || !window.matchMedia('(max-width: 1023px)').matches) return;
    const io = new IntersectionObserver(([e]) => setOverForm(e.isIntersecting), { rootMargin: '-15% 0px -15% 0px' });
    io.observe(form);
    return () => io.disconnect();
  }, []);

  return (
    <div
      className={`fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 transition-[opacity,visibility] duration-200 ${
        overForm ? 'opacity-0 invisible' : 'opacity-100'
      }`}
    >
      <a
        href={PHONE_HREF}
        onClick={() => trackPhoneClick('floating')}
        aria-label="Chiamaci"
        className="group"
      >
        <span className="relative grid place-items-center w-14 h-14 rounded-full bg-ink-900 text-white shadow-[0_8px_24px_rgba(15,28,20,0.35)] hover:scale-110 transition-transform">
          <Phone className="w-6 h-6" strokeWidth={2.2} />
        </span>
      </a>
      <a
        href={WHATSAPP_HREF}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackWhatsAppClick('floating')}
        aria-label="Scrivici su WhatsApp"
        className="relative group"
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30 group-hover:opacity-50" />
        <span className="relative grid place-items-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_rgba(37,211,102,0.45)] hover:scale-110 transition-transform">
          <MessageCircle className="w-7 h-7" strokeWidth={2.2} />
        </span>
      </a>
    </div>
  );
}
