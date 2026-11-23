import { useEffect, useRef, useState, type FormEvent } from 'react';
import { CalendarClock, CheckCircle2, Clock, Euro, FileText, Loader2, MessageCircle, Send, type LucideIcon } from 'lucide-react';
import { trackFormSubmit, trackWhatsAppClick } from '@/lib/analytics';
import { WHATSAPP_HREF } from '@/lib/whatsapp';
import { ReviewsCarousel } from '@/components/ReviewsCarousel';
import { BrandsMarquee } from '@/components/BrandsMarquee';

// Landing per la campagna Meta (noindex). Il modulo è copiato identico da src/components/Contact.tsx del sito:
// stessi campi, stesso payload (source 'website_newenergy'), stesso webhook Make, stesso evento Lead.


const NEL_PREVENTIVO: { icon: LucideIcon; testo: string }[] = [
  { icon: Euro, testo: "Quanto risparmierai dopo aver installato l'impianto e quanto tempo ci metterai per recuperare l'investimento." },
  { icon: FileText, testo: 'Tutti i componenti che installeremo sul tuo tetto, spiegati nella relazione tecnica: non saltiamo niente.' },
  { icon: Clock, testo: 'Quando ti consegniamo i materiali e quando installiamo: entro 15 giorni dalla firma del contratto.' },
];

// Sezioni: la successiva si sovrappone con gli angoli arrotondati, così non c'è il taglio netto tra scuro e chiaro.
const sec = 'relative -mt-6 rounded-t-[28px] sm:-mt-10 sm:rounded-t-[44px] px-5 pt-11 pb-[68px] sm:px-6 sm:pt-24 sm:pb-[136px]';

// Riquadro con numero grande per i fatti forti
function StatTile({ numero, unita, children }: { numero: string; unita: string; children: React.ReactNode }) {
  return (
    <div className="soft-box flex items-center gap-4 rounded-xl border border-brand-green/25 bg-white px-4 py-3.5 min-[820px]:gap-5 min-[820px]:px-5 min-[820px]:py-4">
      <div className="shrink-0 text-center leading-none">
        <span className="block font-display font-extrabold text-[40px] min-[820px]:text-[52px] tracking-[-0.04em] text-brand-green">{numero}</span>
        <span className="mt-1 block text-[11px] min-[820px]:text-[13px] font-bold uppercase tracking-[0.12em] text-ink-700">{unita}</span>
      </div>
      <p className="border-l border-ink-900/10 pl-4 min-[820px]:pl-5 text-[15px] min-[820px]:text-[18px] leading-[1.45] text-ink-900">{children}</p>
    </div>
  );
}

// Scadenza reale della detrazione: il badge mostra i giorni rimasti e sparisce a scadenza avvenuta.
const SCADENZA = new Date(2027, 0, 1); // fino al 31/12/2026 incluso
function giorniAllaScadenza() {
  const oggi = new Date();
  oggi.setHours(0, 0, 0, 0);
  return Math.round((SCADENZA.getTime() - oggi.getTime()) / 86400000);
}

const h2 = 'font-display font-bold text-[24px] min-[820px]:text-[clamp(30px,4.2vw,46px)] leading-[1.12] min-[820px]:leading-[1.08] tracking-[-0.03em]';
const wrap = 'max-w-[1040px] mx-auto';

const COMUNI = [
  'Napoli', 'Pozzuoli', 'Bacoli', 'Giugliano', 'Caserta', 'Aversa',
  'Avellino', 'Salerno', 'Benevento', 'Casoria', 'Ercolano', 'Torre del Greco',
  'Marano', 'Quarto', 'Ischia', 'Sorrento', 'Altro comune in Campania',
];

const TIPI = [
  'Casa / residenziale',
  'Pergolato fotovoltaico',
  'Aggiunta batterie di accumulo',
  'Colonnina di ricarica',
  'Manutenzione / assistenza',
  'Non lo so ancora',
];

const TEMPISTICHE = [
  { value: 'subito', label: 'Il prima possibile' },
  { value: 'entro-fine-anno', label: "Entro la fine dell'anno" },
  { value: 'nel-2027', label: 'Nel 2027' },
];

// "Come ci hai trovato?": serve a capire da dove arrivano i lead davvero, oltre ai dati degli annunci.
const PROVENIENZE = [
  { value: 'facebook-instagram', label: 'Facebook / Instagram' },
  { value: 'intelligenza-artificiale', label: 'Intelligenza Artificiale (ChatGPT, Gemini, Claude, Grok ecc.)' },
  { value: 'ricerca-google', label: 'Ricerca Google' },
];

type Status = 'idle' | 'loading' | 'success' | 'error';

// Legge i parametri di tracciamento (UTM + gclid) dalla query string corrente.
// Se un parametro non è presente, restituisce stringa vuota.
function getTrackingParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source') ?? '',
    utm_medium: params.get('utm_medium') ?? '',
    utm_campaign: params.get('utm_campaign') ?? '',
    gclid: params.get('gclid') ?? '',
  };
}

const inputCls =
  'w-full px-4 py-3 rounded-xl border border-ink-900/12 bg-white text-ink-900 placeholder:text-ink-700/40 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all text-base';

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-ink-800 mb-1">
        {label} {required && <span className="text-brand-green-dark">*</span>}
      </span>
      {children}
    </label>
  );
}

function LeadForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  // Anti-spam: istante in cui il modulo è stato aperto (i bot lo compilano in un attimo).
  const openedAt = useRef(Date.now());

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    const form = e.currentTarget;
    const formData = new FormData(form);
    // Campo trappola: un utente vero non lo vede e non lo compila. Se è pieno è un bot: finta conferma, nessun invio.
    if (String(formData.get('sito_web') ?? '').trim() !== '') {
      setStatus('success');
      form.reset();
      return;
    }
    formData.delete('sito_web');
    // Le chiavi partono tutte vuote: un campo facoltativo lasciato in bianco arriva comunque, come stringa vuota.
    const payload = {
      nome: '', telefono: '', email: '', comune: '', tipo: '', tempistica: '', provenienza: '', messaggio: '',
      ...Object.fromEntries(formData.entries()),
    };

    try {
      const res = await fetch('https://hook.eu1.make.com/ef142husr8dxld7j5xuis4efvksr58qk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          source: 'website_newenergy',
          submittedAt: new Date().toISOString(),
          fillMs: Date.now() - openedAt.current,
          pageUrl: window.location.href,
          ...getTrackingParams(),
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      trackFormSubmit(String(payload.provenienza || ''));
      setStatus('success');
      form.reset();
    } catch {
      setStatus('error');
      setErrorMsg('Non siamo riusciti a inviare la richiesta. Riprova o scrivici su WhatsApp.');
    }
  };


  if (status === 'success') {
    return (
      <div className="py-12 text-center">
        <div className="grid place-items-center w-16 h-16 rounded-full bg-brand-green/15 text-brand-green-dark mx-auto">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <h3 className="mt-5 font-display font-bold text-2xl text-ink-900">Grazie! Abbiamo ricevuto la tua richiesta.</h3>
        <p className="mt-3 text-ink-700/80 max-w-md mx-auto">
          Ti ricontatteremo in giornata per parlare del tuo impianto.
        </p>
        <a
          href={WHATSAPP_HREF}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWhatsAppClick('contact_success')}
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-green text-white font-semibold hover:bg-[#356a19] transition-all"
        >
          <MessageCircle className="w-4 h-4" /> Scrivici ora su WhatsApp
        </a>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-3 block mx-auto text-sm text-ink-700/60 hover:text-ink-900 underline"
        >
          Invia un'altra richiesta
        </button>
      </div>
    );
  }

  return (
      <form id="form-lead" onSubmit={handleSubmit} className="space-y-3">
        <div aria-hidden="true" className="absolute -left-[9999px] top-auto w-px h-px overflow-hidden">
          <label>
            Sito web
            <input type="text" name="sito_web" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Nome e cognome" required>
            <input type="text" name="nome" required placeholder="Mario Rossi"
              className={inputCls} />
          </Field>
          <Field label="Telefono" required>
            <input type="tel" name="telefono" required placeholder="333 1234567"
              className={inputCls} />
          </Field>
        </div>
        <Field label="Comune" required>
          <select name="comune" required defaultValue="" className={inputCls}>
            <option value="" disabled>Seleziona…</option>
            {COMUNI.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        {/* Campi precompilati e nascosti: il payload verso Make resta identico a quello del sito. */}
        <input type="hidden" name="tipo" value={TIPI[0]} />
        <input type="hidden" name="provenienza" value={PROVENIENZE[0].value} />
        <Field label="Quando vorresti installare?">
          <div className="flex flex-wrap gap-2">
            {TEMPISTICHE.map((t) => (
              <label key={t.value} className="cursor-pointer">
                <input type="radio" name="tempistica" value={t.value} className="peer sr-only" />
                <span className="inline-flex items-center px-4 py-2.5 rounded-xl border border-ink-900/12 bg-white text-sm font-medium text-ink-800 peer-checked:bg-brand-green peer-checked:text-white peer-checked:border-brand-green peer-focus-visible:ring-2 peer-focus-visible:ring-brand-green/30 transition-all">
                  {t.label}
                </span>
              </label>
            ))}
          </div>
        </Field>
        <Field label="Messaggio (opzionale)">
          <textarea name="messaggio" rows={3} placeholder="Es. ho un tetto a spioventi di circa 80 mq" className={inputCls} />
        </Field>

        <label className="flex items-start gap-3 text-xs text-ink-700/70 leading-relaxed">
          <input type="checkbox" required className="mt-0.5 accent-brand-green" />
          <span>
            Ho letto e accetto l'
            <a href="/privacy.html" target="_blank" rel="noopener noreferrer" className="underline hover:text-brand-green transition-colors">
              informativa sulla privacy
            </a>
            . Autorizzo New Energy a trattare i miei dati per essere ricontattato. (Richiesto)
          </span>
        </label>

        {status === 'error' && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
            {errorMsg}
          </p>
        )}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="cta-premium w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-brand-green text-white text-[16px] font-bold hover:bg-[#356a19] disabled:opacity-60"
        >
          {status === 'loading' ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Invio in corso…</>
          ) : (
            <>Richiedi un preventivo <Send className="w-4 h-4" /></>
          )}
        </button>
        <p className="text-center text-sm text-ink-700/70">Senza impegno e senza pressioni commerciali.</p>
      </form>
  );
}

export default function OffertaPage() {
  const giorni = giorniAllaScadenza();
  // CTA fissa in basso: compare dopo la prima schermata e sparisce quando il modulo è in vista.
  const [showSticky, setShowSticky] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const form = document.getElementById('form');
      const formTop = form ? form.getBoundingClientRect().top : Infinity;
      setShowSticky(window.scrollY > 600 && formTop > window.innerHeight * 0.85);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Comparsa morbida delle sezioni sotto la prima schermata
  useEffect(() => {
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const root = document.documentElement;
    const els = Array.from(document.querySelectorAll<HTMLElement>('main > section:not(#top) > div'));
    els.forEach((el) => el.classList.add('rv'));
    root.classList.add('js');
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('rv-in'); io.unobserve(e.target); } }),
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    );
    els.forEach((el) => io.observe(el));
    return () => { io.disconnect(); els.forEach((el) => el.classList.remove('rv', 'rv-in')); root.classList.remove('js'); };
  }, []);

  const cta =
    'cta-premium inline-flex items-center justify-center rounded-[10px] bg-brand-green text-white font-bold no-underline hover:bg-[#356a19]';

  return (
    <div className="min-h-screen bg-ink-900 text-[#E9EFE6] font-body">
      {/* Header: solo logo, nessun link in uscita */}
      <header className="sticky top-0 z-10 bg-ink-900/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-[1120px] mx-auto px-6 min-h-[64px] flex items-center">
          <span className="inline-flex items-center rounded-lg bg-white/95 px-2.5 py-1.5">
            <img src="/images/logo-new-energy.png" alt="New Energy - Impianti Fotovoltaici" className="h-8 w-auto" width="150" height="32" />
          </span>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section
          id="top"
          className="px-5 pt-6 pb-16 min-[820px]:px-6 min-[820px]:pt-16 min-[820px]:pb-[112px]"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%,rgba(63,122,31,0.38),rgba(15,28,20,0) 70%),#0F1C14' }}
        >
          {/* Mobile: titolo, foto, testo, CTA (colonna con "order"). Da 820px in su: titolo in alto, testo a sinistra e foto a destra come prima. */}
          <div className={`${wrap} grid grid-cols-1 gap-y-6 items-center min-[820px]:grid-cols-2 min-[820px]:gap-x-10 min-[820px]:gap-y-11`}>
            <div className="col-start-1 row-start-1 min-[820px]:col-span-2 mx-auto max-w-[860px] text-center">
              <p className="eyebrow-line mb-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#8FBF6C] min-[820px]:text-sm">Per proprietari di casa</p>
              <h1 className="font-display font-bold text-[31px] min-[820px]:text-[clamp(38px,6.4vw,66px)] leading-[1.12] min-[820px]:leading-[1.08] tracking-[-0.03em] text-white">
                Esistono 2 tipi di ditte nel fotovoltaico
              </h1>
            </div>
            <div className="col-start-1 row-start-3 min-[820px]:row-start-2 min-[820px]:col-span-1 min-w-0 flex flex-col gap-4 min-[820px]:gap-[22px]">
              <p className="font-display text-[16px] min-[820px]:text-[clamp(19px,2.6vw,24px)] leading-[1.35] min-[820px]:leading-[1.25] font-medium text-white">
                Quelle che ti attirano con una super promo e poi ti abbandonano...
                <br /><br />
                E quelle che resteranno con te per sempre, come noi di New Energy.
              </p>
              {giorni > 0 && (
                <div className="flex items-center gap-3 rounded-lg border border-brand-green/60 bg-brand-green/15 px-3.5 py-2.5 text-left">
                  <CalendarClock className="w-5 h-5 shrink-0 text-[#8FBF6C]" aria-hidden="true" />
                  <p className="text-[14px] min-[820px]:text-base leading-snug text-white">
                    <strong className="font-bold">Detrazione del 50% fino al 31 dicembre 2026.</strong>{' '}
                    <span className="text-[#E9EFE6]/80">Mancano {giorni} {giorni === 1 ? 'giorno' : 'giorni'}.</span>
                    <span className="mt-1 block text-[13px] min-[820px]:text-[15px] text-[#E9EFE6]/80">Puoi bloccare l'offerta prima del 2027 e installare a inizio anno.</span>
                  </p>
                </div>
              )}
              <div className="flex flex-col items-start gap-2.5 pt-1 min-[820px]:gap-3 min-[820px]:pt-2.5 max-[819px]:items-stretch">
                <a href="#form" className={`${cta} text-[16px] h-[52px] min-[820px]:text-[clamp(19px,3vw,24px)] min-[820px]:h-[72px] min-[820px]:px-[clamp(28px,5vw,52px)]`}>
                  Richiedi un preventivo
                </a>
                <span className="text-[13px] min-[820px]:text-[15px] text-[#E9EFE6]/65 max-[819px]:text-center">Ti richiamiamo in giornata, senza impegno.</span>
              </div>
            </div>
            <div className="col-start-1 row-start-2 min-[820px]:col-start-2 min-w-0 self-center">
              <img
                src="/images/hero-v2.webp"
                srcSet="/images/hero-v2-720.webp 720w, /images/hero-v2.webp 1080w"
                sizes="(min-width: 1040px) 500px, 100vw"
                alt="Impianto fotovoltaico installato da New Energy in Campania"
                width="1080"
                height="1350"
                className="w-full h-auto aspect-[16/10] min-[820px]:aspect-[5/4] object-cover object-[center_60%] rounded-[10px] border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
              />
            </div>
          </div>
        </section>

        {/* RECENSIONI */}
        <section className={`${sec} bg-[#F4F9EE] text-ink-900`}>
          <div className={`${wrap} flex flex-col gap-6 min-[820px]:gap-8`}>
            <div className="flex flex-col gap-4 max-w-[780px]">
              <h2 className={h2}>Perché i nostri clienti sono pienamente soddisfatti?</h2>
              <p className="text-[15px] min-[820px]:text-[19px] leading-[1.5] text-ink-700">
                <strong className="font-bold text-ink-900">Non proviamo a vendere l'impianto a tutti i costi.</strong> Se è fattibile e sei convinto, andiamo avanti. Se capiamo che non è il momento giusto, te lo diciamo e non ti spingiamo a firmare.
              </p>
              <p className="text-[15px] min-[820px]:text-[19px] leading-[1.5] text-ink-700">
                <strong className="font-bold text-ink-900">Non ci fermiamo davanti a lavori complessi,</strong> anche dove molte ditte si tirerebbero indietro. Vincoli strutturali, spazi poco adatti, impianti elettrici fatti male da altri: sono lavori che prendiamo, e ci mettiamo il tempo che serve.
              </p>
            </div>
            <ReviewsCarousel />
          </div>
        </section>

        {/* COSA TI GARANTIAMO */}
        <section className={`${sec} sec-dark text-[#E9EFE6]`}>
          <div className={`${wrap} flex flex-col gap-5 min-[820px]:gap-7`}>
            <div className="flex flex-col gap-2 max-w-[760px]">
              <h2 className={`${h2} text-white`}>Nel preventivo non troverai solo il prezzo dei componenti</h2>
            </div>
            <ul className="flex flex-col gap-3.5 min-[820px]:gap-4 max-w-[760px]">
              {NEL_PREVENTIVO.map(({ icon: Icon, testo }) => (
                <li key={testo} className="flex items-start gap-3.5 text-[16px] min-[820px]:text-[21px] leading-[1.4] text-white">
                  <span className="grid place-items-center shrink-0 w-10 h-10 min-[820px]:w-12 min-[820px]:h-12 rounded-xl border border-[#8FBF6C]/35 bg-[#8FBF6C]/10">
                    <Icon className="w-5 h-5 min-[820px]:w-6 min-[820px]:h-6 text-[#8FBF6C]" strokeWidth={1.6} aria-hidden="true" />
                  </span>
                  <span className="pt-1.5 min-[820px]:pt-2">{testo}</span>
                </li>
              ))}
            </ul>
            <p className="max-w-[760px] soft-box rounded-lg border-l-4 border-brand-green bg-white px-4 py-3 text-[15px] min-[820px]:text-[18px] leading-[1.5] text-ink-900">
              <strong className="font-bold">Scegli tu i materiali: premium oppure intermedi.</strong>{' '}
              La scelta non cambia la qualità dell'installazione.
            </p>
            <div className="flex flex-col gap-2.5 max-w-[760px]">
              <p className="text-[12px] min-[820px]:text-sm font-semibold uppercase tracking-[0.12em] text-[#E9EFE6]/70">Marchi con cui lavoriamo</p>
              <BrandsMarquee />
            </div>
          </div>
        </section>

        {/* MONITORAGGIO */}
        <section className={`${sec} overflow-x-clip bg-[#F4F9EE] text-ink-900`}>
          <div className={`${wrap} max-w-[1040px] flex flex-wrap items-center gap-8 min-[820px]:gap-14`}>
            <div className="flex-[1_1_380px] min-w-0 flex flex-col gap-3 min-[820px]:gap-5">
              <h2 className={h2}>Il tuo impianto sarà sempre sotto il nostro controllo.</h2>
              <p className="text-[16px] min-[820px]:text-[21px] leading-[1.45] text-ink-800">
                Controlliamo la produzione e ci assicuriamo che renda sempre al massimo. In caso di anomalie, ottimizziamo e interveniamo a distanza.
              </p>
              <StatTile numero="25" unita="anni">
                <strong className="font-bold">Il monitoraggio dal nostro ufficio è incluso</strong> per tutti i 25 anni di garanzia dell'impianto.
              </StatTile>
              <p className="font-display font-bold text-[20px] min-[820px]:text-[28px] leading-[1.25] tracking-[-0.02em]">
                E in più hai l'app sul tuo telefono: <span className="text-brand-green">lo vedi anche tu, quando vuoi.</span>
              </p>
            </div>
            <figure className="phone-glow flex-[1_1_240px] min-w-0 flex flex-col items-center gap-3">
              <div className="w-[230px] min-[820px]:w-[270px] rounded-[2rem] border-[7px] border-ink-900 bg-ink-900 shadow-[0_24px_50px_rgba(15,28,20,0.22)] overflow-hidden">
                <img
                  src="/images/app-monitoraggio.webp"
                  alt="Schermata dell'app di monitoraggio con produzione e consumi dell'impianto"
                  width="540"
                  height="1170"
                  loading="lazy"
                  className="block w-full h-auto rounded-[1.5rem]"
                />
              </div>
              <figcaption className="text-[13px] min-[820px]:text-[15px] text-ink-700 text-center">L'app che avrai sul tuo telefono.</figcaption>
            </figure>
          </div>
        </section>

        {/* QUANTO COSTA */}
        <section className={`${sec} sec-dark text-[#E9EFE6]`}>
          <div className={`${wrap} flex flex-col gap-4 min-[820px]:gap-6 max-w-[760px]`}>
            <h2 className={`${h2} text-white`}>Quanto costa un impianto?</h2>
            <p className="text-[16px] min-[820px]:text-[21px] leading-[1.45] text-[#E9EFE6]/80">
              Questa è la domanda che ci fanno moltissime persone al primo contatto.
            </p>
            <p className="font-display font-bold text-[20px] min-[820px]:text-[30px] leading-[1.25] min-[820px]:leading-[1.2] tracking-[-0.02em] text-white">
              La risposta è sempre la stessa: <span className="text-[#8FBF6C]">Dipende.</span>
            </p>
            <p className="text-[16px] min-[820px]:text-[21px] leading-[1.45] text-[#E9EFE6]/80">
              Ti mettiamo a disposizione più linee di componenti, così puoi scegliere in base a quanto vuoi investire.
            </p>
          </div>
        </section>

        {/* FORM */}
        <section className={`${sec} bg-[#F4F9EE] text-ink-900`}>
          <div className={`${wrap} max-w-[1040px] flex flex-wrap items-start gap-7 min-[820px]:gap-12`}>
            <div className="flex-[1_1_400px] min-w-0 flex flex-col gap-3 min-[820px]:gap-5 text-ink-900">
              <h2 className={h2}>Se sei veramente intenzionato ad installare un impianto e non vuoi perdere la detrazione del 50%...</h2>
              <p className="font-display font-bold text-[20px] min-[820px]:text-[28px] leading-[1.25] tracking-[-0.02em] text-ink-900">
                In <span className="text-brand-green">15 giorni</span> puoi già averlo sul tuo tetto.
              </p>
              <div className="flex items-start gap-3 rounded-lg border border-brand-green/40 bg-brand-green/10 px-3.5 py-3">
                <CalendarClock className="mt-0.5 w-5 h-5 shrink-0 text-brand-green" aria-hidden="true" />
                <p className="text-[14px] min-[820px]:text-[17px] leading-snug text-ink-900">
                  Se invece non sei ancora pronto ma vuoi comunque usufruire della detrazione, puoi preparare tutte le carte e far partire la pratica. Per l'installazione ci accorderemo dopo aver sistemato i documenti.
                </p>
              </div>
              <figure className="mt-1 overflow-hidden soft-box rounded-xl border border-ink-900/10 bg-white">
                <img
                  src="/images/gustavo-titolare.webp"
                  alt="Gustavo, titolare di New Energy, al lavoro su un impianto"
                  width="600"
                  height="800"
                  loading="lazy"
                  className="w-full aspect-[16/10] object-cover object-[50%_18%]"
                />
                <figcaption className="px-4 py-3 text-[15px] min-[820px]:text-[17px] leading-snug text-ink-800">
                  <strong className="font-bold text-ink-900">Il preventivo lo farà Gustavo, il titolare.</strong>{' '}
                  Un solo interlocutore, dal primo contatto all'assistenza.
                </figcaption>
              </figure>
            </div>
            <div id="form" className="relative scroll-mt-20 flex-[1_1_400px] min-w-0 bg-white rounded-3xl p-5 sm:p-8 shadow-[0_24px_60px_rgba(15,28,20,0.18)] ring-1 ring-ink-900/5">
              <LeadForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="relative -mt-6 sm:-mt-10 rounded-t-[28px] sm:rounded-t-[44px] bg-ink-900 border-t border-white/10 px-6 pt-11 pb-5 sm:pt-[60px] text-center text-xs leading-snug text-white/55">
        <p>New Energy Srl · P.IVA IT10491571211 · Via Provinciale per Pianura, 20b, 80078 Pozzuoli (NA)</p>
        <p className="mt-1.5">
          <a href="/privacy.html" target="_blank" rel="noopener noreferrer" className="underline">Privacy</a>
          {' · '}
          <a href="/cookie.html" target="_blank" rel="noopener noreferrer" className="underline">Cookie</a>
        </p>
      </footer>

      {/* CTA fissa */}
      <div
        className={`fixed inset-x-0 bottom-0 z-20 p-3 bg-ink-900/95 border-t border-white/10 transition-transform duration-200 ${showSticky ? 'translate-y-0' : 'translate-y-full'}`}
        aria-hidden={!showSticky}
      >
        <a href="#form" tabIndex={showSticky ? 0 : -1} className={`${cta} w-full h-14 text-lg`}>
          Richiedi un preventivo
        </a>
      </div>
    </div>
  );
}
