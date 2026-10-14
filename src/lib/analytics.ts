// Lightweight GA4 event helper. Safe no-op if gtag isn't loaded.
// Google Ads: ID account e etichette delle 3 conversioni (Obiettivi → Conversioni → snippet evento).
// Vengono inviate in parallelo agli eventi GA4, rispettando il consenso scelto nel banner.
export const ADS_ID = 'AW-17682742461';
const ADS_LABELS: Record<string, string> = {
  generate_lead: 'Ha2oCKHAip0dEL355O9B',
  phone_call: 'smXmCPTFip0dEL355O9B',
  whatsapp_click: 'CHVXCPfFip0dEL355O9B',
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
