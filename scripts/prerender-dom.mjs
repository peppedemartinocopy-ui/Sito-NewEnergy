/**
 * Prerendering post-build per SPA Vite + React.
 *
 * Perché serve: i crawler degli AI answer engine (GPTBot, PerplexityBot,
 * ClaudeBot...) non eseguono JavaScript. Senza questo passaggio vedono solo
 * <div id="root"></div> e quindi una pagina vuota.
 *
 * Cosa fa: dopo `vite build`, serve dist/ in locale, renderizza "/" con Chrome
 * headless e riscrive dist/index.html con l'HTML già renderizzato, LASCIANDO
 * INTATTI i tag <script type="module"> della build, così React si idrata
 * normalmente lato client e il sito resta una SPA per l'utente.
 *
 * Fallback: se Chrome non è disponibile (CI senza browser, rete che blocca il
 * download di Chromium), usa jsdom per ottenere lo stesso risultato.
 */
import http from 'node:http';
import fs from 'node:fs/promises';
import fssync from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, '..', 'dist');
const INDEX = path.join(DIST, 'index.html');
const ROUTE = '/';
const WAIT_SELECTOR = '#contattaci'; // ultima sezione: se c'è, l'app è montata

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.webmanifest': 'application/manifest+json',
};

function startServer(opts = {}) {
  const server = http.createServer(async (req, res) => {
    try {
      const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
      let filePath = path.join(DIST, urlPath);
      if (urlPath === '/' || !path.extname(filePath)) filePath = INDEX; // SPA fallback
      if (!filePath.startsWith(DIST)) { res.writeHead(403).end(); return; }
      let buf = await fs.readFile(filePath);
      // jsdom non esegue gli ES module: per il solo render lo servo come script classico.
      // I tag originali vengono comunque ripristinati nell'output finale.
      if (opts.stripModuleType && filePath === INDEX) {
        buf = Buffer.from(
          buf.toString('utf8').replace(/<script([^>]*)type="module"([^>]*)>/g, '<script$1$2>'),
          'utf8',
        );
      }
      res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream' });
      res.end(buf);
    } catch {
      res.writeHead(404).end('Not found');
    }
  });
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve({ server, port: server.address().port }));
  });
}

/** Render con Chrome headless (percorso principale). */
async function renderWithPuppeteer(origin) {
  const { default: puppeteer } = await import('puppeteer');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 1200 });
    await page.goto(origin + ROUTE, { waitUntil: 'networkidle0', timeout: 60000 });
    await page.waitForSelector(WAIT_SELECTOR, { timeout: 30000 });
    // lascio concludere eventuali effetti/transizioni
    await new Promise((r) => setTimeout(r, 600));
    // il banner cookie dipende dal visitatore: non va incluso nell'HTML statico
    await page.evaluate(() => document.querySelectorAll('[data-cookie-banner]').forEach((el) => el.remove()));
    return await page.evaluate(() => document.documentElement.outerHTML);
  } finally {
    await browser.close();
  }
}

/** Render con jsdom (fallback senza browser). */
async function renderWithJsdom(origin) {
  const { JSDOM, VirtualConsole } = await import('jsdom');
  const virtualConsole = new VirtualConsole();

  const dom = await JSDOM.fromURL(origin + ROUTE, {
    runScripts: 'dangerously',
    resources: 'usable',
    pretendToBeVisual: true,
    virtualConsole,
    // gli stub devono esistere PRIMA che parta il bundle
    beforeParse(window) {
      window.IntersectionObserver = class {
        constructor(cb) { this._cb = cb; }
        observe(el) { this._cb([{ isIntersecting: true, target: el }], this); }
        unobserve() {} disconnect() {} takeRecords() { return []; }
      };
      window.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
      window.matchMedia = () => ({
        matches: false, media: '', onchange: null,
        addListener() {}, removeListener() {},
        addEventListener() {}, removeEventListener() {}, dispatchEvent() { return false; },
      });
      window.scrollTo = () => {};
    },
  });

  const { window } = dom;
  const deadline = Date.now() + 30000;
  while (Date.now() < deadline) {
    if (window.document.querySelector(WAIT_SELECTOR)) break;
    await new Promise((r) => setTimeout(r, 150));
  }
  await new Promise((r) => setTimeout(r, 500));
  // il banner cookie dipende dal visitatore: non va incluso nell'HTML statico
  window.document.querySelectorAll('[data-cookie-banner]').forEach((el) => el.remove());
  const html = window.document.documentElement.outerHTML;
  window.close();
  return html;
}

async function main() {
  if (!fssync.existsSync(INDEX)) {
    console.error('[prerender] dist/index.html non trovato: esegui prima `vite build`.');
    process.exit(1);
  }

  const original = await fs.readFile(INDEX, 'utf8');
  // I tag <script type="module"> generati da Vite: devono sopravvivere al prerender
  const moduleScripts = [...original.matchAll(/<script[^>]*type="module"[^>]*><\/script>/g)].map((m) => m[0]);

  let html;
  let engine = 'puppeteer';

  const s1 = await startServer();
  try {
    html = await renderWithPuppeteer(`http://127.0.0.1:${s1.port}`);
  } catch (err) {
    console.warn('[prerender] Chrome non disponibile (' + String(err.message).split('\n')[0] + ')');
    console.warn('[prerender] fallback su jsdom...');
    engine = 'jsdom';
    const s2 = await startServer({ stripModuleType: true });
    try {
      html = await renderWithJsdom(`http://127.0.0.1:${s2.port}`);
    } finally {
      s2.server.close();
    }
    // ripristino type="module" sui tag serviti "classici" al renderer
    html = html.replace(
      /<script([^>]*)src="(\/assets\/[^"]+\.js)"([^>]*)><\/script>/g,
      (m, a, src, b) => (/type="module"/.test(m) ? m : `<script type="module" crossorigin src="${src}"></script>`),
    );
  } finally {
    s1.server.close();
  }

  // Verifica: l'app deve essere davvero renderizzata
  if (/<div id="root"><\/div>/.test(html)) {
    console.error('[prerender] ERRORE: #root risulta ancora vuoto. index.html non modificato.');
    process.exit(1);
  }

  // Verifica: i module script devono essere ancora presenti (serve l'idratazione)
  for (const tag of moduleScripts) {
    const src = /src="([^"]+)"/.exec(tag)?.[1];
    if (src && !html.includes(src)) {
      console.warn(`[prerender] script module mancante, lo reinserisco: ${src}`);
      html = html.replace('</body>', `    ${tag}\n  </body>`);
    }
  }

  html = '<!DOCTYPE html>\n' + html;
  await fs.writeFile(INDEX, html, 'utf8');

  const kb = (Buffer.byteLength(html) / 1024).toFixed(1);
  console.log(`[prerender] OK (${engine}) — dist/index.html riscritto, ${kb} KB`);
}

main().catch((e) => { console.error('[prerender] fallito:', e); process.exit(1); });
