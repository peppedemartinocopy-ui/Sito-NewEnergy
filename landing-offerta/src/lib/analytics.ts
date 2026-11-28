// Lightweight GA4 event helper. Safe no-op if gtag isn't loaded.
// Google Ads: ID account e etichette delle 3 conversioni (Obiettivi → Conversioni → snippet evento).
// Vengono inviate in parallelo agli eventi GA4, rispettando il consenso scelto nel banner.
export const ADS_ID = 'AW-17682742461';
const ADS_LABELS: Record<string, string> = {
  generate_lead: 'Ha2oCKHAip0dEL355O9B',
  phone_call: 'smXmCPTFip0dEL355O9B',
  whatsapp_click: 'CHVXCPfFip0dEL355O9B',
};

// Eventi standard Meta corrispondenti (Pixel ID 2067499853497440)
const META_EVENTS: Record<string, string> = {
  generate_lead: 'Lead',
  phone_call: 'Contact',
  whatsapp_click: 'Contact',
};

export function trackEvent(
  eventName: string,
  params: Record<string, unknown> = {},
  eventId?: string,
): void {
  const w = window as Window & {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  };
  // Meta Pixel: esiste solo dopo il consenso (vedi index.html)
  const metaEvent = META_EVENTS[eventName];
  // eventID = stesso valore inviato alla Conversions API dal server: Meta deduplica i due eventi.
  if (metaEvent && typeof w.fbq === 'function') {
    if (eventId) w.fbq('track', metaEvent, {}, { eventID: eventId });
    else w.fbq('track', metaEvent);
  }
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

export function trackFormSubmit(leadSource: string = '', eventId?: string) {
  trackEvent('generate_lead', {
    event_category: 'form',
    event_label: 'lead_form_submit',
    lead_source: leadSource || 'non_indicato',
  }, eventId);
}

export function trackScrollToSection(section: string) {
  trackEvent('scroll_to_section', { section });
}
