import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Check, CheckCircle2, Loader2, MessageCircle, Send } from 'lucide-react';
import { trackFormSubmit, trackWhatsAppClick } from '@/lib/analytics';
import { WHATSAPP_HREF } from '@/lib/whatsapp';

// Landing per la campagna Meta (noindex). Il modulo è copiato identico da src/components/Contact.tsx del sito:
// stessi campi, stesso payload (source 'website_newenergy'), stesso webhook Make, stesso evento Lead.

const REVIEWS = [
  { n: '15', h: 381 }, { n: '16', h: 315 }, { n: '17', h: 273 }, { n: '01', h: 372 },
  { n: '02', h: 429 }, { n: '03', h: 408 }, { n: '04', h: 432 }, { n: '05', h: 414 },
  { n: '06', h: 362 }, { n: '07', h: 433 }, { n: '08', h: 452 }, { n: '09', h: 452 },
  { n: '10', h: 452 }, { n: '11', h: 452 }, { n: '12', h: 452 }, { n: '13', h: 452 },
  { n: '14', h: 452 },
];

const GARANZIE = [
  {
    kicker: 'Stima del risparmio, anno per anno',
    title: 'Lo vedi con i tuoi occhi',
    text: 'Calcolata sulla tua bolletta, per vedere con i tuoi occhi quanto risparmierai.',
  },
  {
    kicker: 'Garanzie scritte',
    title: 'Il lavoro dura.',
    text: 'Moduli 25/30 anni, inverter 10, batteria 10/15, più assistenza gratuita sul posto per 2 anni. Se qualcosa non va veniamo noi.',
  },
  {
    kicker: 'Controllo a distanza, h24',
    title: 'Non aspetti la bolletta',
    text: 'Il tuo impianto è tenuto sotto controllo. Se qualcosa non va sarai avvisato direttamente quando è già stato risolto.',
  },
];

const h2 = 'font-display font-bold text-[clamp(30px,4.2vw,46px)] leading-[1.08] tracking-[-0.03em]';
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
  { value: 'subito', label: 'Subito' },
  { value: '1-3-mesi', label: '1-3 mesi' },
  { value: 'sto-valutando', label: 'Sto valutando' },
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
      const res = await fetch('https://hook.eu1.make.com/qe5owsa7ecyzv7qjjl2mhwt4qx4bh1nz', {
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
          Ti ricontatteremo entro 24 ore per parlare del tuo impianto.
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
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Email">
            <input type="email" name="email" placeholder="mario@email.it"
              className={inputCls} />
          </Field>
          <Field label="Comune" required>
            <select name="comune" required defaultValue="" className={inputCls}>
              <option value="" disabled>Seleziona…</option>
              {COMUNI.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Cosa ti serve?">
          <select name="tipo" defaultValue="" className={inputCls}>
            <option value="">Seleziona…</option>
            {TIPI.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
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
        <Field label="Come ci hai trovato?">
          <div className="flex flex-wrap gap-2">
            {PROVENIENZE.map((t) => (
              <label key={t.value} className="cursor-pointer">
                <input type="radio" name="provenienza" value={t.value} className="peer sr-only" />
                <span className="inline-flex items-center px-4 py-2.5 rounded-xl border border-ink-900/12 bg-white text-sm font-medium text-ink-800 peer-checked:bg-brand-green peer-checked:text-white peer-checked:border-brand-green peer-focus-visible:ring-2 peer-focus-visible:ring-brand-green/30 transition-all">
                  {t.label}
                </span>
              </label>
            ))}
          </div>
        </Field>
        <Field label="Messaggio (opzionale)">
          <textarea name="messaggio" rows={3} placeholder="Es. ho un tetto a spioventi di circa 80 mq"
            className={inputCls} />
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
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-brand-green text-white text-[17px] font-bold hover:bg-[#356a19] transition-all disabled:opacity-60"
        >
          {status === 'loading' ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Invio in corso…</>
          ) : (
            <>Richiedi il tuo preventivo <Send className="w-4 h-4" /></>
          )}
        </button>
        <p className="text-center text-sm text-ink-700/70">Senza impegno e senza pressioni commerciali.</p>
      </form>
  );
}

export default function OffertaPage() {
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

  const cta =
    'inline-flex items-center justify-center rounded-[10px] bg-brand-green text-white font-bold no-underline transition-colors hover:bg-[#356a19] shadow-[0_0_52px_rgba(110,175,60,0.6),0_6px_18px_rgba(0,0,0,0.45)]';

  return (
    <div className="min-h-screen bg-ink-900 text-[#E9EFE6] font-body">
      {/* Header: solo logo, nessun link in uscita */}
      <header className="sticky top-0 z-10 bg-ink-900 border-b border-white/10">
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
          className="px-6 pt-16 pb-[72px]"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%,rgba(63,122,31,0.38),rgba(15,28,20,0) 70%),#0F1C14' }}
        >
          <div className={`${wrap} flex flex-col gap-11`}>
            <h1 className="mx-auto max-w-[860px] text-center font-display font-bold text-[clamp(36px,6vw,60px)] leading-[1.06] tracking-[-0.03em] text-white">
              Fotovoltaico:<br />Esistono 2 tipi di installatori.
            </h1>
            <div className="flex flex-wrap items-center gap-10">
              <div className="flex-[1_1_420px] min-w-0 flex flex-col gap-[22px]">
                <p className="font-display text-[clamp(21px,3vw,27px)] leading-[1.25] font-medium text-white">
                  Quelli che ti attirano con una super promo e poi ti abbandonano...
                  <br /><br />
                  E quelli che resteranno con te per sempre, come noi di New Energy.
                </p>
                <div className="flex flex-col items-start gap-3 pt-2.5">
                  <a href="#form" className={`${cta} text-[clamp(19px,3vw,24px)] h-[72px] px-[clamp(28px,5vw,52px)]`}>
                    Richiedi un preventivo
                  </a>
                  <span className="text-[15px] text-[#E9EFE6]/65">Ti richiamiamo entro 24 ore, senza impegno.</span>
                </div>
              </div>
              <div className="flex-[1_1_360px] min-w-0">
                <img
                  src="/images/hero-v2.webp"
                  srcSet="/images/hero-v2-720.webp 720w, /images/hero-v2.webp 1080w"
                  sizes="(min-width: 1040px) 500px, 100vw"
                  alt="Impianto fotovoltaico installato da New Energy in Campania"
                  width="1080"
                  height="1350"
                  className="w-full aspect-[5/4] object-cover object-[center_60%] rounded-[10px] border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* GUSTAVO */}
        <section className="bg-[#F4F9EE] px-6 py-24 text-ink-900">
          <div className={`${wrap} flex flex-wrap items-center gap-14`}>
            <div className="flex-[1_1_440px] min-w-0 flex flex-col gap-5">
              <h2 className={h2}>Ci chiamano continuamente persone che hanno problemi ad impianti che non abbiamo installato noi...</h2>
              <p className="text-[19px] leading-normal text-ink-700">Persone che sono rimaste senza assistenza o con un impianto lasciato a metà al primo problema del progetto.</p>
              <p className="text-[21px] leading-snug font-semibold">Tu non vuoi essere uno di loro.</p>
              <p className="text-[19px] leading-normal text-ink-700">Per questo ci teniamo a metterci la faccia e dirti le cose come stanno, anche contro i nostri interessi.</p>
              <p className="text-[19px] leading-normal text-ink-700">Per questo il tuo preventivo viene fatto direttamente dai tecnici e da chi installerà l'impianto, non da un commerciale.</p>
            </div>
            <div className="flex-[1_1_320px] min-w-0 max-w-[380px] overflow-hidden rounded-3xl border border-ink-900 bg-white">
              <img
                src="/images/gustavo-titolare.webp"
                alt="Gustavo Loporchio, titolare di New Energy"
                width="600"
                height="800"
                loading="lazy"
                className="w-full aspect-square object-cover object-top"
              />
              <div className="px-6 pt-[22px] pb-[26px]">
                <div className="font-display font-semibold text-[27px] tracking-[-0.02em] leading-[1.1] text-ink-900">Gustavo Loporchio</div>
                <div className="mt-2 text-base leading-snug text-[#5B6B60]">Perito industriale · Esperto in Gestione dell'Energia · 30 anni di esperienza</div>
              </div>
            </div>
          </div>
        </section>

        {/* COSA SAPRAI PRIMA DI FIRMARE */}
        <section className="bg-ink-900 px-6 py-24">
          <div className={`${wrap} flex flex-col gap-12`}>
            <h2 className={`${h2} max-w-[760px] text-white`}>Cosa saprai prima di firmare:</h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(290px,1fr))] gap-7">
              {GARANZIE.map((g) => (
                <div key={g.kicker} className="relative rounded-[17px] border border-white/85 bg-[#F4F9EE]">
                  <div className="absolute -top-3.5 -right-2.5 grid place-items-center w-[38px] h-[38px] rounded-full bg-brand-green border-4 border-ink-900">
                    <Check className="w-4 h-4 text-white" strokeWidth={3.2} aria-hidden="true" />
                  </div>
                  <div className="rounded-t-2xl bg-gradient-to-b from-brand-green to-[#2a5614] px-[26px] pt-7 pb-[26px]">
                    <div className="font-display font-bold text-[26px] leading-[1.12] tracking-[-0.02em] text-white">{g.kicker}</div>
                  </div>
                  <div className="px-[26px] pt-[22px] pb-[26px] text-ink-900">
                    <div className="font-display font-semibold text-[22px] tracking-[-0.02em] leading-[1.15]">{g.title}</div>
                    <p className="mt-2 text-[17px] leading-[1.45] text-[#5B6B60]">{g.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* IL CONTO */}
        <section className="bg-[#F4F9EE] px-6 py-24 text-ink-900">
          <div className={`${wrap} flex flex-col gap-11`}>
            <div className="flex flex-col gap-3.5 max-w-[760px]">
              <h2 className={h2}>Come ci assicuriamo che l'impianto ti conviene?</h2>
              <p className="text-[22px] leading-snug">Fai questo calcolo velocissimo, con la tua bolletta alla mano:</p>
            </div>
            <div className="flex flex-wrap items-stretch gap-4">
              <div className="flex-[1_1_230px] min-w-0 rounded-3xl border border-ink-900 bg-[#F4F9EE] p-[26px] font-display font-semibold text-[26px] leading-[1.15] tracking-[-0.02em]">
                Quanto spendi in bolletta in un anno?
              </div>
              <div aria-hidden="true" className="self-center text-[34px] font-bold text-brand-green">→</div>
              <div className="flex-[1_1_230px] min-w-0 rounded-3xl border border-ink-900 bg-[#F4F9EE] p-[26px] font-display font-semibold text-[26px] leading-[1.15] tracking-[-0.02em]">
                Moltiplica per 10
              </div>
              <div aria-hidden="true" className="self-center text-[34px] font-bold text-brand-green">→</div>
              <div className="flex-[1_1_230px] min-w-0 rounded-3xl border border-ink-900 bg-ink-900 p-[26px] font-display font-semibold text-[24px] leading-[1.15] tracking-[-0.02em] text-white">
                Il numero che ottieni è quello che pagherai a prescindere, sicuro.
              </div>
            </div>
            <div className="flex flex-col gap-[18px] max-w-[760px]">
              <p className="text-[22px] leading-normal">Con i rincari, quella cifra può facilmente essere più alta, ma alla fine, non ti ritrovi nulla.</p>
              <p className="text-[27px] leading-[1.35] font-semibold tracking-[-0.01em]">
                Noi facciamo in modo che tu rientri nell'investimento in meno di 10 anni, e poi ti goda i risparmi per tutti gli anni che restano all'impianto.
              </p>
              <p className="rounded-[17px] border border-ink-900 px-[22px] py-5 text-lg leading-[1.55] text-[#C80000]">
                Un impianto non possiamo regalartelo. Se cerchi un impianto a costo zero o per poche migliaia di euro, in giro ci sono tantissime offerte. Buona fortuna.
              </p>
            </div>
          </div>
        </section>

        {/* RECENSIONI */}
        <section className="bg-ink-900 px-6 py-24">
          <div className={`${wrap} flex flex-col gap-11`}>
            <div className="flex flex-col gap-4 max-w-[780px]">
              <h2 className={`${h2} text-[#E9EFE6]`}>I nostri clienti sono pienamente soddisfatti.</h2>
              <p className="text-[19px] leading-normal text-[#E9EFE6]/80">
                Per la qualità del lavoro, per il rapporto diretto che costruiamo con loro, e perché ci prendiamo anche i problemi su cui molte ditte rifiutano di mettere mano.
              </p>
            </div>
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 [&>*]:mb-4">
              {REVIEWS.map((r) => (
                <img
                  key={r.n}
                  src={`/images/recensione-${r.n}-560.webp`}
                  srcSet={`/images/recensione-${r.n}-560.webp 560w, /images/recensione-${r.n}.webp 800w`}
                  sizes="(min-width: 1024px) 330px, (min-width: 640px) 45vw, 100vw"
                  width="800"
                  height={r.h}
                  loading="lazy"
                  alt="Recensione Google di un cliente New Energy"
                  className="block w-full h-auto rounded-[17px] border border-white/15 bg-white"
                />
              ))}
            </div>
          </div>
        </section>

        {/* FORM */}
        <section id="form" className="bg-[#F4F9EE] px-6 py-24 scroll-mt-16">
          <div className={`${wrap} max-w-[1040px] flex flex-wrap items-start gap-12`}>
            <div className="flex-[1_1_400px] min-w-0 flex flex-col gap-5 text-ink-900">
              <h2 className={h2}>
                Vuoi installare l'impianto <span className="text-brand-green">prima che finisca la detrazione?</span>
              </h2>
              <p className="text-[19px] leading-normal text-ink-700">
                Se sei davvero intenzionato e non vuoi perdere il 50%, compila il modulo. Ti richiamiamo entro 24 ore, senza impegno.
              </p>
            </div>
            <div className="relative flex-[1_1_400px] min-w-0 bg-white rounded-3xl p-5 sm:p-8 shadow-[0_24px_60px_rgba(15,28,20,0.18)]">
              <LeadForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-ink-900 border-t border-white/10 px-6 py-10 pb-28 text-center text-sm text-white/60">
        <p>New Energy Srl · P.IVA IT10491571211 · Via Provinciale per Pianura, 20b, 80078 Pozzuoli (NA)</p>
        <p className="mt-2">
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
