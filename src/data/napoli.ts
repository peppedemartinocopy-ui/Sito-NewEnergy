// Testi e dati SEO della pagina /pannelli-solari-napoli.
// Una sola fonte: li usano sia la pagina visibile sia il prerender (titolo, descrizione, schema).

export const NAPOLI_URL = 'https://newenergyfotovoltaico.it/pannelli-solari-napoli';
export const NAPOLI_TITLE = 'Pannelli solari Napoli: impianto fotovoltaico | New Energy';
export const NAPOLI_DESCRIPTION =
  'Pannelli solari a Napoli e provincia: progetto, installazione, pratiche e assistenza. Garanzie scritte e un referente tecnico. Richiedi il preventivo.';

export const NAPOLI_FAQS = [
  {
    q: 'Quanto costa un impianto fotovoltaico a Napoli?',
    a: 'Dipende da consumi, tetto e accumulo. Per questo non esiste un prezzo "da listino": ti mandiamo un preventivo su misura, con tutte le voci.',
  },
  {
    q: 'Conviene con l’accumulo?',
    a: 'Se consumi soprattutto la sera, di solito sì. Lo vediamo sui tuoi consumi reali, non a sensazione.',
  },
  {
    q: 'Dopo l’installazione chi mi segue?',
    a: 'Noi. Due anni di assistenza gratuita sul posto, il monitoraggio a vita e un numero a cui risponde chi ha fatto l’impianto.',
  },
  {
    q: 'Intervenite anche su un impianto fotovoltaico già installato da altri?',
    a: 'Sì. Se il tuo impianto produce meno del previsto, si blocca o non è stato mai messo a punto, lo guardiamo e ti diciamo cosa non va e cosa conviene fare.',
  },
];

export const NAPOLI_WARRANTIES = [
  { value: '25/30 anni', label: 'Pannelli', note: 'prodotto e prestazioni' },
  { value: '10 anni', label: 'Inverter' },
  { value: '10/15 anni', label: 'Batteria', note: 'in base al modello' },
  { value: '12 anni', label: 'Strutture di montaggio' },
  { value: '5 anni', label: 'Quadri' },
  { value: 'A vita', label: 'Monitoraggio' },
  { value: '2 anni', label: 'Assistenza gratuita sul posto' },
];

// Blocchi JSON-LD aggiuntivi della pagina (LocalBusiness e Person restano quelli di index.html).
export function napoliJsonLd() {
  const business = { '@id': 'https://newenergyfotovoltaico.it/#business' };
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': NAPOLI_URL,
      url: NAPOLI_URL,
      name: NAPOLI_TITLE,
      description: NAPOLI_DESCRIPTION,
      inLanguage: 'it-IT',
      about: { '@id': `${NAPOLI_URL}#servizio` },
      publisher: business,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': `${NAPOLI_URL}#servizio`,
      serviceType: 'Installazione di impianti fotovoltaici',
      name: 'Installazione pannelli solari a Napoli',
      description:
        'Progetto, installazione, pratiche con distributore e GSE e assistenza di impianti fotovoltaici, con o senza accumulo, a Napoli e provincia.',
      provider: business,
      areaServed: [
        { '@type': 'City', name: 'Napoli' },
        { '@type': 'AdministrativeArea', name: 'Provincia di Napoli' },
      ],
      url: NAPOLI_URL,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://newenergyfotovoltaico.it/' },
        { '@type': 'ListItem', position: 2, name: 'Pannelli solari Napoli', item: NAPOLI_URL },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: NAPOLI_FAQS.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ];
}
