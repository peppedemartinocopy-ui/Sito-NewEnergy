# BRIEF PER BOLT.NEW — Sito New Energy (Fotovoltaico)

> **NOTA IMMAGINI:** Le immagini (hero, logo, foto titolare, galleria impianti, screenshot recensioni) vengono gestite e inserite separatamente, non sono incluse in questo brief. I placeholder nel documento indicano dove vanno posizionate.


## OBIETTIVO DEL REDESIGN
Trasformare la landing attuale (troppo carica di testo e leva emotiva) in un sito **aziendale, professionale, pulito, orientato al risultato**. Nel fotovoltaico i clienti vogliono chiarezza e concretezza, non muri di testo persuasivo.

**Principi di design:**
- Meno testo, più spazio bianco
- Look "azienda seria", non "landing page aggressiva"
- Informazioni essenziali, gerarchia visiva chiara
- Mobile-first, veloce
- Palette: verde #7BC143, verde scuro #5a9e2e, arancione #F7B731, blu #0097C1, tanto bianco/grigio chiaro

---

## ⚠️ ELEMENTI TECNICI DA NON PERDERE (CRITICO)

Questi vanno reintegrati esattamente, altrimenti si rompe tracking, SEO e collegamento con Google Ads.

### 1. Google Analytics 4 (nel <head>)
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XBNYY8RQ4N"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XBNYY8RQ4N');
</script>
```

### 2. Eventi di conversione (DEVONO scattare sugli stessi trigger)
- **Click su numero di telefono** → `gtag('event','phone_call',{event_category:'contact',event_label:'...'})`
- **Click su WhatsApp** → `gtag('event','whatsapp_click',{event_category:'contact',event_label:'...'})`
- **Invio form** (dopo successo) → `gtag('event','generate_lead',{event_category:'form',event_label:'lead_form_submit'})`

### 3. Form → invio al webhook Make
Il form deve fare POST a questo endpoint con questi campi:
```javascript
await fetch('https://hook.eu1.make.com/qe5owsa7ecyzv7qjjl2mhwt4qx4bh1nz', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    nome: nome,
    telefono: telefono,
    sorgente: 'Sito New Energy',
    data: new Date().toISOString()
  })
});
```
Dopo invio riuscito: mostrare messaggio conferma + sparare evento `generate_lead`.

### 4. Ancore sezioni (ID) — servono per i sitelink di Google Ads
Le sezioni DEVONO avere questi ID esatti:
- `id="recensioni"` (sezione recensioni)
- `id="gustavo"` (sezione titolare)
- `id="lavori"` (galleria impianti)
- `id="form-lead"` (il form)
- `id="contattaci"` (sezione contatti finale)

### 5. Numero di telefono e WhatsApp
- Telefono: **392 053 2648** → link `tel:+393920532648`
- WhatsApp: `https://wa.me/393920532648?text=Ciao,%20vorrei%20informazioni%20sul%20fotovoltaico`

---

## SEO — DA MANTENERE NEL <head>

### Title
```
Impianti Fotovoltaici Napoli, Pozzuoli e Campania | New Energy Srl
```

### Meta description
```
New Energy Srl - Impianti Fotovoltaici a Pozzuoli, Napoli e in tutta la Campania. Pannelli Viessmann, inverter Huawei e SolarEdge, dal 1995. Sopralluogo gratuito.
```

### Meta tag aggiuntivi
```html
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="geo.region" content="IT-72">
<meta name="geo.placename" content="Pozzuoli, Napoli, Campania">
<link rel="canonical" href="https://newenergyfotovoltaico.it/">
<meta property="og:type" content="website">
<meta property="og:locale" content="it_IT">
<meta property="og:site_name" content="New Energy - Impianti Fotovoltaici">
<meta property="og:title" content="Impianti Fotovoltaici Napoli, Pozzuoli e Campania | New Energy Srl">
<meta property="og:description" content="Installatore di fotovoltaico dal 1995. Parli direttamente con il titolare, niente venditori. Sopralluogo gratuito a Napoli, Caserta, Avellino e Salerno.">
<meta property="og:url" content="https://newenergyfotovoltaico.it/">
<meta property="og:image" content="https://newenergyfotovoltaico.it/apple-touch-icon.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Impianti Fotovoltaici Napoli e Campania | New Energy Srl">
<meta name="twitter:description" content="Installatore di fotovoltaico dal 1995. Parli col titolare, niente venditori. Sopralluogo gratuito in Campania.">
<meta name="twitter:image" content="https://newenergyfotovoltaico.it/apple-touch-icon.png">
```

### Schema markup LocalBusiness (nel <head>)
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://newenergyfotovoltaico.it/#business",
  "name": "New Energy Srl - Impianti Fotovoltaici",
  "image": "https://newenergyfotovoltaico.it/apple-touch-icon.png",
  "url": "https://newenergyfotovoltaico.it",
  "telephone": "+39-392-053-2648",
  "priceRange": "€€",
  "description": "Installatore di impianti fotovoltaici a Pozzuoli, Napoli e in tutta la Campania. Pannelli Viessmann, inverter Huawei e SolarEdge. Nel settore dal 1995.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Via Provinciale per Pianura, 20b",
    "addressLocality": "Pozzuoli",
    "addressRegion": "NA",
    "postalCode": "80078",
    "addressCountry": "IT"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "40.86126",
    "longitude": "14.12731"
  },
  "openingHoursSpecification": [{
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
    "opens": "08:00",
    "closes": "20:00"
  }],
  "areaServed": [
    {"@type":"City","name":"Napoli"},
    {"@type":"City","name":"Pozzuoli"},
    {"@type":"City","name":"Caserta"},
    {"@type":"City","name":"Avellino"},
    {"@type":"City","name":"Salerno"},
    {"@type":"AdministrativeArea","name":"Campania"}
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5.0",
    "reviewCount": "34",
    "bestRating": "5",
    "worstRating": "1"
  }
}
```
+ mantenere anche lo schema **FAQPage** con le 6 FAQ (vedi sotto).

---

## FILE DA NON TOCCARE (già su Netlify, restano validi)
Questi file esistono già nel deploy e vanno mantenuti:
- `sitemap.xml`
- `robots.txt`
- `google6f133a7a89dcd694.html` (verifica Search Console)
- Favicon set completo (favicon.ico, favicon-16/32/48/96, apple-touch-icon, android-chrome)
- `site.webmanifest`
- `privacy.html`, `cookie.html`

**IMPORTANTE:** Bolt genera in React/Next. Assicurarsi che il build finale sia esportabile come sito statico compatibile con Netlify, e che NON sovrascriva questi file esistenti.

---

## DATI AZIENDALI (per i contenuti)
- **Nome:** New Energy Srl - Impianti Fotovoltaici
- **Titolare:** Gustavo Loporchio (nel settore dal 1995)
- **Indirizzo:** Via Provinciale per Pianura, 20b — 80078 Pozzuoli (NA)
- **Telefono:** 392 053 2648
- **Orari:** Lun-Sab 8:00-20:00
- **P.IVA:** 10491571211
- **Componenti:** pannelli Viessmann, inverter Huawei e SolarEdge
- **Zone:** Napoli, Pozzuoli, Caserta, Avellino, Salerno, Campania
- **34 recensioni Google 5 stelle**

## SERVIZI (per struttura sito)
- Impianti fotovoltaici residenziali
- Sistemi di accumulo (batterie)
- Colonnine di ricarica auto elettriche
- Manutenzione e assistenza
- Pratiche e detrazione fiscale 50%

## STRUTTURA CONSIGLIATA (sito pulito, poche info)
1. **Hero** — headline chiara + CTA (chiama / richiedi sopralluogo). [IMMAGINE HERO: da inserire separatamente]
2. **Servizi** — 3-4 card pulite (impianti, accumulo, colonnine, assistenza)
3. **Perché New Energy** — 3-4 punti secchi (titolare presente dal 1995, squadra interna, materiali di qualità, assistenza inclusa). NO muri di testo.
4. **Recensioni** — carosello Google, screenshot recensioni (id="recensioni") [IMMAGINI: da inserire separatamente]
5. **Gustavo/Chi siamo** — breve, professionale (id="gustavo") [FOTO TITOLARE: da inserire separatamente]
6. **Galleria impianti** — foto reali impianti (id="lavori") [IMMAGINI GALLERIA: da inserire separatamente]
7. **FAQ** — 6 domande (con schema FAQPage)
8. **Contatti + form** — (id="contattaci" e id="form-lead")

## FAQ (mantenere, con schema)
1. **Quanto durano i pannelli?** Garanzia produzione 25 anni (80-85% potenza dopo 25 anni). Inverter 10-12 anni estendibili.
2. **E se piove/gradina/nevica?** Pannelli certificati per grandine standard. Al Sud eventi estremi molto rari. Esistono polizze dedicate (~100-150€/anno).
3. **Quanto tempo per l'installazione?** Circa 15 giorni dall'arrivo materiali. Totale (sopralluogo+pratiche+installazione) 4-5 settimane.
4. **Posso scaricare il costo dalle tasse?** Sì, detrazione 50% in 10 anni. Ce ne occupiamo noi.
5. **E se si rompe tra qualche anno?** Monitoraggio incluso a vita. Assistenza sul posto gratuita 2 anni. Poi restiamo il riferimento.
6. **Serve il permesso del comune?** Di solito basta CILA. Casi particolari (centri storici, vincoli) richiedono autorizzazioni. Gestiamo noi le pratiche.

## TONE DELLA HEADLINE (versione asciutta, meno emotiva)
Esempi possibili (scegliere/adattare):
- "Impianti fotovoltaici in Campania, dal 1995"
- "Il tuo impianto fotovoltaico, chiavi in mano"
- "Fotovoltaico a Napoli e in Campania — Preventivo gratuito"

Sub: concreta, orientata al risultato. NO leva emotiva pesante.



---

## GOOGLE MAPS — EMBED NELLA SEZIONE CONTATTI

Inserire una mappa Google Maps nella sezione contatti (id="contattaci") che mostri la posizione ESATTA della sede.

**IMPORTANTE:** l'indirizzo testuale "Via Provinciale per Pianura, 20b" viene geolocalizzato in modo incoerente da alcuni sistemi. Usare l'embed basato sulle COORDINATE ESATTE, non sull'indirizzo, per evitare che la mappa punti nel posto sbagliato.

### Coordinate sede
- Latitudine: **40.86126**
- Longitudine: **14.12731**

### Opzione A — Embed con iframe (semplice, consigliata)
```html
<iframe
  src="https://www.google.com/maps?q=40.86126,14.12731&z=17&output=embed"
  width="100%"
  height="350"
  style="border:0;border-radius:12px"
  allowfullscreen=""
  loading="lazy"
  referrerpolicy="no-referrer-when-downgrade"
  title="Sede New Energy - Via Provinciale per Pianura 20b, Pozzuoli">
</iframe>
```

### Opzione B — Link "Apri in Google Maps" / "Indicazioni stradali"
Aggiungere sotto la mappa un pulsante che apre le indicazioni con le coordinate esatte:
```html
<a href="https://www.google.com/maps/dir/?api=1&destination=40.86126,14.12731" target="_blank" rel="noopener">
  Come raggiungerci
</a>
```

**Nota:** usare SEMPRE le coordinate (40.86126,14.12731) e non l'indirizzo testuale nei link, così il cliente arriva al punto giusto indipendentemente da come Google interpreta la via.


---

## SCHEMA FAQPAGE COMPLETO (da mantenere nel <head>)
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Quanto durano davvero i pannelli?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "I pannelli che installiamo hanno garanzia di produzione di 25 anni: dopo 25 anni producono ancora almeno l'80-85% della potenza iniziale. Gli inverter hanno garanzia tra 10 e 12 anni, estendibile."
      }
    },
    {
      "@type": "Question",
      "name": "E se piove, gradina o nevica?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "I pannelli sono certificati per resistere a grandine di dimensioni standard. Al Sud è molto raro che si verifichino eventi estremi, ma comunque esistono polizze assicurative dedicate che costano circa 100-150 euro all'anno."
      }
    },
    {
      "@type": "Question",
      "name": "Quanto tempo ci vuole dall'inizio alla fine?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Dall'arrivo dei materiali, l'installazione dura circa 15 giorni. Considerando sopralluogo, progetto e pratiche, il tempo totale è di circa 4 settimane, massimo 5."
      }
    },
    {
      "@type": "Question",
      "name": "Posso scaricare il costo dalle tasse?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sì, c'è la detrazione fiscale del 50% in 10 anni. Ce ne occupiamo noi, se vuoi. Te ne parliamo nel dettaglio durante il sopralluogo."
      }
    },
    {
      "@type": "Question",
      "name": "Cosa succede se l'impianto si rompe tra qualche anno?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Il monitoraggio è incluso a vita: controlliamo ogni giorno i dati di produzione dell'impianto e se c'è un'anomalia la individuiamo subito. L'assistenza sul posto è gratuita per i primi 2 anni."
      }
    },
    {
      "@type": "Question",
      "name": "Serve il permesso del comune?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Per la maggior parte degli impianti residenziali basta una comunicazione semplificata (CILA), non un permesso edilizio. Nei casi particolari (centri storici, vincoli paesaggistici) servono autorizzazioni specifiche. Se ci occupiamo noi delle pratiche, ce ne facciamo carico completamente."
      }
    }
  ]
}
```
