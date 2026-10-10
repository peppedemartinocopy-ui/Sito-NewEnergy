import { useEffect, useRef, useState } from 'react';

// Telefoni e tablet: niente animazione di comparsa. Su iPhone il segnale "elemento in vista" arriva
// spesso solo a scorrimento finito, e le sezioni restavano bianche mentre si scorreva.
function isTouchDevice() {
  return typeof window !== 'undefined' && window.matchMedia('(hover: none) and (pointer: coarse)').matches;
}

/**
 * Reveal-on-scroll (solo da computer).
 * - Nell'HTML generato in build tutto è già visibile.
 * - Su dispositivi touch resta tutto visibile, sempre.
 * - Da computer, ciò che è sotto la piega parte nascosto e compare quando manca il 30% dello
 *   schermo per arrivarci.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(() => typeof window === 'undefined' || isTouchDevice());

  useEffect(() => {
    const el = ref.current;
    if (!el || isTouchDevice()) return;
    if (!('IntersectionObserver' in window)) {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            obs.disconnect();
            return;
          }
          // HTML generato in build: ciò che è sotto la piega riparte nascosto, così l'animazione resta
          if (e.target.classList.contains('is-visible')) e.target.classList.remove('is-visible');
        }
      },
      { threshold: 0, rootMargin: '0px 0px 30% 0px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return { ref, visible };
}
