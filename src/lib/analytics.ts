// Lightweight GA4 event helper. Safe no-op if gtag isn't loaded.
export function trackEvent(
  eventName: string,
  params: Record<string, unknown> = {},
): void {
  const w = window as Window & { gtag?: (...args: unknown[]) => void };
  if (typeof w.gtag === 'function') {
    w.gtag('event', eventName, params);
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
