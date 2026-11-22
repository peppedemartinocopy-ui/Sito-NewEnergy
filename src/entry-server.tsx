import { renderToString } from 'react-dom/server';
import App from './App';
import NapoliPage from './pages/NapoliPage';
import OffertaPage from './pages/OffertaPage';
import { NAPOLI_URL, NAPOLI_TITLE, NAPOLI_DESCRIPTION, napoliJsonLd } from './data/napoli';

// Usato solo in fase di build: genera l'HTML della pagina con lo stesso React del browser,
// così il browser può riutilizzarlo invece di ricostruirlo.
export function render() {
  return renderToString(<App />);
}

export function renderNapoli() {
  return renderToString(<NapoliPage />);
}

export function renderOfferta() {
  return renderToString(<OffertaPage />);
}

export const napoliSeo = { url: NAPOLI_URL, title: NAPOLI_TITLE, description: NAPOLI_DESCRIPTION, jsonLd: napoliJsonLd() };
