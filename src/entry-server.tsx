import { renderToString } from 'react-dom/server';
import App from './App';

// Usato solo in fase di build: genera l'HTML della pagina con lo stesso React del browser,
// così il browser può riutilizzarlo invece di ricostruirlo.
export function render() {
  return renderToString(<App />);
}
