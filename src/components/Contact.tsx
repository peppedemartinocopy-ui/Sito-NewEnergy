import { useState, type FormEvent } from 'react';
import { MessageCircle, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './Reveal';
import { trackFormSubmit, trackWhatsAppClick } from '@/lib/analytics';
import { WHATSAPP_HREF } from '@/lib/whatsapp';


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

export function Contact() {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    const form = e.currentTarget;
    const formData = new FormData(form);
    // Le chiavi partono tutte vuote: un campo facoltativo lasciato in bianco arriva comunque, come stringa vuota.
    const payload = {
      nome: '', telefono: '', email: '', comune: '', tipo: '', tempistica: '', messaggio: '',
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
          pageUrl: window.location.href,
          ...getTrackingParams(),
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      trackFormSubmit();
      setStatus('success');
      form.reset();
    } catch {
      setStatus('error');
      setErrorMsg('Non siamo riusciti a inviare la richiesta. Riprova o scrivici su WhatsApp.');
    }
  };

  return (
    <section id="contattaci" className="pt-6 pb-20 sm:py-20 lg:py-28 bg-ink-900 relative overflow-hidden">
      <div className="absolute -top-32 -right-24 w-[420px] h-[420px] rounded-full bg-brand-green/15 blur-[120px]" />
      <div className="absolute -bottom-32 -left-24 w-[360px] h-[360px] rounded-full bg-brand-blue/10 blur-[120px]" />

      <div className="relative max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          light
          compact
          eyebrow="Richiedi un preventivo"
          title={<>Vediamo insieme la miglior soluzione <span className="text-gradient-green">per casa tua.</span></>}
          subtitle={
            <>
              Parla direttamente con Gustavo. Ti aiuterà a valutare le soluzioni più adatte ai tuoi consumi,
              chiarire ogni dubbio e preparare un preventivo su misura.
              <span className="block mt-2 sm:mt-3 text-base font-semibold text-brand-green">
                Ti richiamiamo entro 24 ore, senza impegno.
              </span>
            </>
          }
        />

        <div className="mt-5 sm:mt-8 max-w-2xl mx-auto">
          <Reveal>
            <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-cardhover">
              {status === 'success' ? (
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
                    className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-green text-white font-semibold shadow-glow hover:bg-brand-green-dark transition-all"
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
              ) : (
                <form id="form-lead" onSubmit={handleSubmit} className="space-y-3">
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
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-brand-green text-white text-[17px] font-bold shadow-glow hover:bg-brand-green-dark transition-all disabled:opacity-60"
                  >
                    {status === 'loading' ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Invio in corso…</>
                    ) : (
                      <>Richiedi il tuo preventivo <Send className="w-4 h-4" /></>
                    )}
                  </button>
                  <p className="text-center text-sm text-ink-700/70">Senza impegno e senza pressioni commerciali.</p>
                </form>
              )}
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  );
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
