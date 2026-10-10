import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const container = document.getElementById('root')!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

if (container.hasChildNodes()) {
  // Pagina già generata in fase di build: la riutilizziamo invece di ricostruirla da zero.
  // Prima lasciamo al browser il tempo di disegnare la foto principale (i link funzionano già),
  // poi facciamo partire React. Limite massimo di attesa: 2,5 secondi.
  let started = false;
  const start = () => {
    if (started) return;
    started = true;
    hydrateRoot(container, app);
  };
  const afterPaint = () => requestAnimationFrame(() => setTimeout(start, 0));
  const hero = container.querySelector<HTMLImageElement>('#top img');
  if (!hero || hero.complete) {
    afterPaint();
  } else {
    hero.addEventListener('load', afterPaint, { once: true });
    hero.addEventListener('error', start, { once: true });
    setTimeout(start, 2500);
  }
} else {
  createRoot(container).render(app);
}
