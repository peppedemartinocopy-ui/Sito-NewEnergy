import { Phone, MessageCircle, Mail, MapPin, Clock } from 'lucide-react';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './Reveal';
import { trackPhoneClick, trackWhatsAppClick } from '@/lib/analytics';
import { PHONE_DISPLAY, PHONE_HREF, WHATSAPP_HREF } from '@/lib/whatsapp';

export function ContactInfo() {
  return (
    <section id="contatti" className="py-20 lg:py-24 bg-white">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Contatti"
          title={<>Dove <span className="text-gradient-green">trovarci</span></>}
        />

        <div className="mt-12 grid lg:grid-cols-2 gap-6 items-stretch">
          <Reveal>
            <div className="h-full rounded-3xl bg-white border border-ink-900/8 shadow-card p-6 sm:p-8 space-y-5">
              <ContactRow icon={Phone} label="Telefono">
                <a href={PHONE_HREF} onClick={() => trackPhoneClick('contact_info')} className="hover:text-brand-green-dark transition-colors">{PHONE_DISPLAY}</a>
              </ContactRow>
              <ContactRow icon={MessageCircle} label="WhatsApp">
                <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsAppClick('contact_info')} className="hover:text-brand-green-dark transition-colors">
                  Scrivici su WhatsApp
                </a>
              </ContactRow>
              <ContactRow icon={Mail} label="Email">
                <a href="mailto:Newenergyfotovoltaici@gmail.com" className="hover:text-brand-green-dark transition-colors break-all">
                  Newenergyfotovoltaici@gmail.com
                </a>
              </ContactRow>
              <ContactRow icon={MapPin} label="Sede">
                Via Provinciale per Pianura, 20b<br />80078 Pozzuoli (NA)
              </ContactRow>
              <ContactRow icon={Clock} label="Orari">
                Lun – Sab · 08:00 – 20:00
              </ContactRow>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="h-full min-h-[260px] rounded-3xl overflow-hidden border border-ink-900/8 shadow-card">
              <iframe
                title="Mappa New Energy Srl - Pozzuoli"
                src="https://www.google.com/maps?q=40.8621188,14.1273025&z=16&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: 260 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ContactRow({ icon: Icon, label, children }: { icon: typeof Phone; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="shrink-0 grid place-items-center w-10 h-10 rounded-xl bg-brand-green/10 text-brand-green-dark">
        <Icon className="w-5 h-5" />
      </span>
      <div className="text-ink-800">
        <div className="text-xs uppercase tracking-wider text-ink-700/60 font-semibold">{label}</div>
        <div className="mt-0.5 text-[15px] leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
