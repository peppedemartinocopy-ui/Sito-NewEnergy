// Lightweight GA4 event helper. Safe no-op if gtag isn't loaded.
// Google Ads: inserisci l'ID account (es. 'AW-1234567890') e le etichette delle 3 conversioni
// (Google Ads → Obiettivi → Conversioni → Dettagli → Imposta tag → Installa il tag tu stesso).
// Finché sono vuoti, il codice non invia nulla a Google Ads e gli eventi GA4 funzionano come prima.
export const ADS_ID = '';
const ADS_LABELS: Record<string, string> = {
  generate_lead: '',
  phone_call: '',
  whatsapp_click: '',
};

export function trackEvent(
  eventName: string,
  params: Record<string, unknown> = {},
): void {
  const w = window as Window & { gtag?: (...args: unknown[]) => void };
  if (typeof w.gtag !== 'function') return;
  w.gtag('event', eventName, params);
  const label = ADS_LABELS[eventName];
  if (ADS_ID && label) {
    w.gtag('event', 'conversion', { send_to: `${ADS_ID}/${label}` });
  }
}

export function trackPhoneClick(context: string = 'phone') {
  trackEvent('phone_call', { event_category: 'contact', event_label: context });
}

export function trackWhatsAppClick(context: string) {
  trackEvent('whatsapp_click', { event_category: 'contact', event_label: context });
}

export function trackFormSubmit() {
  trackEvent('generate_lead', { event_category: 'form', event_label: 'lead_form_submit' });
}

export function trackScrollToSection(section: string) {
  trackEvent('scroll_to_section', { section });
}
