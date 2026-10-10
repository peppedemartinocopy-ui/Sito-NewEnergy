import { useEffect } from 'react';

// Altezza della barra fissa in alto: coincide con scroll-padding-top in index.css.
const HEADER_OFFSET = 84;
const TOLERANCE = 8;
const RETRY_DELAYS = [400, 1200];

/**
 * Atterraggio affidabile sui link con ancora (es. https://…/#contattaci dagli annunci).
 * Il browser fa il primo salto da solo, ma le immagini caricate dopo spostano la pagina:
 * qui ri-allineiamo la sezione a fine caricamento e poi due volte (+400 ms, +1200 ms),
 * solo se non è già al suo posto. Appena l'utente tocca, scorre o usa la tastiera, smettiamo.
 */
export function useHashScroll() {
  useEffect(() => {
    let timers: number[] = [];
    let frame = 0;
    let active = false;

    const target = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      return id ? document.getElementById(id) : null;
    };

    // Salto immediato, senza animazione: con 'auto' il browser segue scroll-behavior: smooth di
    // index.css e anima lo scorrimento su tutta la pagina (misurato: circa mezzo secondo di
    // pagina che scorre davanti all'utente). Se un browser non accetta 'instant', ripiega su 'auto'.
    const align = () => {
      const el = target();
      if (!el) return;
      try {
        el.scrollIntoView({ behavior: 'instant', block: 'start' });
      } catch {
        el.scrollIntoView({ behavior: 'auto', block: 'start' });
      }
    };

    const alignIfOff = () => {
      if (!active) return;
      const el = target();
      if (el && Math.abs(el.getBoundingClientRect().top - HEADER_OFFSET) > TOLERANCE) align();
    };

    const stop = () => {
      active = false;
      timers.forEach((t) => window.clearTimeout(t));
      timers = [];
      window.cancelAnimationFrame(frame);
      window.removeEventListener('touchstart', stop);
      window.removeEventListener('wheel', stop);
      window.removeEventListener('keydown', stop);
    };

    const run = () => {
      stop();
      if (!target()) return;
      active = true;
      window.addEventListener('touchstart', stop, { once: true, passive: true });
      window.addEventListener('wheel', stop, { once: true, passive: true });
      window.addEventListener('keydown', stop, { once: true });
      frame = window.requestAnimationFrame(() => {
        if (!active) return;
        align();
        timers = RETRY_DELAYS.map((d) => window.setTimeout(alignIfOff, d));
      });
    };

    const start = () => {
      if (!target()) return;
      if (document.readyState === 'complete') run();
      else window.addEventListener('load', run, { once: true });
    };

    start();
    window.addEventListener('hashchange', run);
    return () => {
      stop();
      window.removeEventListener('load', run);
      window.removeEventListener('hashchange', run);
    };
  }, []);
}
