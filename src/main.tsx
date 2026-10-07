import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {Router} from 'wouter';
import {useHashLocation} from 'wouter/use-hash-location';
import App from './App.tsx';
import './index.css';

/**
 * The standalone preview build (`npm run build:preview`) is served as plain
 * static files from a sub-path, with no SPA rewrite rule to fall back on, so
 * deep links like /zh/cases would 404 on reload. Routing through the URL hash
 * keeps every route on one real document. The production build is unaffected:
 * it keeps clean history-API paths, with the rewrite handled by vercel.json.
 */
const useHashRouting = import.meta.env.VITE_HASH_ROUTER === 'true';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {useHashRouting ? (
      <Router hook={useHashLocation}>
        <App />
      </Router>
    ) : (
      <App />
    )}
  </StrictMode>,
);
