import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import OffertaPage from './pages/OffertaPage';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <OffertaPage />
  </StrictMode>,
);
