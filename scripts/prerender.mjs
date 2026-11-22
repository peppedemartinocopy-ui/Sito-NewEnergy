// Genera l'HTML della pagina in fase di build.
// 1) Metodo principale: renderToString con lo stesso React del browser (riutilizzabile dal browser).
// 2) Se qualcosa va storto, si ricade sul metodo precedente (prerender-dom.mjs), così la build non si rompe mai.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Il file JavaScript viene scaricato subito (modulepreload, priorità bassa) ma eseguito solo dopo che la
// foto principale è stata disegnata: l'esecuzione occupa il browser per più di un secondo sui telefoni lenti
// e ritarderebbe la comparsa della foto. Se qualcosa non va, parte comunque dopo 2,5 secondi.
// Le immagini sotto la piega non devono contendere la banda alla foto principale.
function lowPriorityBelowFold(markup) {
  return markup.replace(/<img\b[^>]*>/g, (tag) =>
    /\/images\/brands\//.test(tag) && !/fetchpriority=/i.test(tag) && !/loading="lazy"/.test(tag)
      ? tag.replace('<img', '<img fetchpriority="low"')
      : tag,
  );
}

// La pagina compressa sta intorno ai 14 KB, la soglia oltre la quale serve un giro di rete in più
// prima di poterla mostrare. Togliamo solo spazi di formattazione: nessun contenuto cambia.
function compactHtml(html) {
  html = html.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/g, (m, a, b, c) => {
    try { return a + JSON.stringify(JSON.parse(b)) + c; } catch { return m; }
  });
  const i = html.indexOf('<body');
  if (i < 0) return html;
  const head = html.slice(0, i).split(/(<script[\s\S]*?<\/script>)/).map((part, k) => (k % 2 ? part : part.replace(/>\s+</g, '><'))).join('');
  return head + html.slice(i);
}

function deferScript(html) {
  const m = html.match(/<script type="module" crossorigin src="(\/assets\/[^"]+\.js)"><\/script>/);
  if (!m) return html;
  const src = m[1];
  const loader =
    `<link rel="modulepreload" crossorigin fetchpriority="low" href="${src}">\n    ` +
    `<script>(function(){var d=0;function go(){if(d)return;d=1;var s=document.createElement('script');s.type='module';s.crossOrigin='';s.src='${src}';document.head.appendChild(s);}` +
    `function after(){requestAnimationFrame(function(){setTimeout(go,0);});}` +
    `document.addEventListener('DOMContentLoaded',function(){var i=document.querySelector('#top img');if(!i||i.complete){after();}else{i.addEventListener('load',after,{once:true});i.addEventListener('error',go,{once:true});setTimeout(go,2500);}});})();</script>`;
  return html.replace(m[0], () => loader);
}


// Landing per le campagne Meta: non indicizzabile, senza schema, senza canonical verso la home.
function offertaPage(base, markup) {
  let h = base;
  const must = (re, repl, label) => {
    if (!re.test(h)) throw new Error(`[offerta] elemento non trovato: ${label}`);
    h = h.replace(re, repl);
  };
  must(/<title>[\s\S]*?<\/title>/, () => '<title>New Energy | Preventivo impianto fotovoltaico</title>', 'title');
  must(/<meta name="description" content="[^"]*"\s*\/?>/, () => '<meta name="description" content="Preventivo per il tuo impianto fotovoltaico, direttamente dai tecnici di New Energy.">', 'description');
  must(/<meta name="robots" content="[^"]*"\s*\/?>/, () => '<meta name="robots" content="noindex, nofollow">', 'robots');
  must(/<link rel="canonical" href="[^"]*"\s*\/?>/, () => '', 'canonical');
  h = h.replace(/(?:<!--[^>]*-->\s*)?<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/g, '');
  must(/<link rel="preload" as="image" href="\/images\/hero-tetto\.webp"[^>]*>/, () => '<link rel="preload" as="image" href="/images/hero-v2.webp" imagesrcset="/images/hero-v2-720.webp 720w, /images/hero-v2.webp 1080w" imagesizes="(min-width: 1040px) 500px, 100vw" fetchpriority="high">', 'preload hero');
  must(/<div id="root"><\/div>/, () => `<div id="root">${lowPriorityBelowFold(markup)}</div>`, 'root');
  return h;
}

const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

// Pagina di base (quella della home, con scheda "root" vuota) -> pagina Napoli.
function napoliPage(base, seo, markup) {
  let h = base;
  const must = (re, repl, label) => {
    if (!re.test(h)) throw new Error(`[napoli] elemento non trovato: ${label}`);
    h = h.replace(re, repl);
  };
  must(/<title>[\s\S]*?<\/title>/, () => `<title>${esc(seo.title)}</title>`, 'title');
  must(/<meta name="description" content="[^"]*"\s*\/?>/, () => `<meta name="description" content="${esc(seo.description)}">`, 'description');
  must(/<link rel="canonical" href="[^"]*"\s*\/?>/, () => `<link rel="canonical" href="${seo.url}">`, 'canonical');
  must(/<meta property="og:title" content="[^"]*"\s*\/?>/, () => `<meta property="og:title" content="${esc(seo.title)}">`, 'og:title');
  must(/<meta property="og:description" content="[^"]*"\s*\/?>/, () => `<meta property="og:description" content="${esc(seo.description)}">`, 'og:description');
  must(/<meta property="og:url" content="[^"]*"\s*\/?>/, () => `<meta property="og:url" content="${seo.url}">`, 'og:url');
  must(/<meta name="twitter:title" content="[^"]*"\s*\/?>/, () => `<meta name="twitter:title" content="${esc(seo.title)}">`, 'twitter:title');
  must(/<meta name="twitter:description" content="[^"]*"\s*\/?>/, () => `<meta name="twitter:description" content="${esc(seo.description)}">`, 'twitter:description');
  // Via il FAQPage della home (le sue domande non sono su questa pagina); restano LocalBusiness e Person.
  let removed = 0;
  h = h.replace(/(?:<!--[^>]*-->\s*)?<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/g, (m) => {
    if (m.includes('"FAQPage"')) { removed++; return ''; }
    return m;
  });
  if (removed !== 1) throw new Error(`[napoli] FAQPage della home: attesi 1 blocco, trovati ${removed}`);
  const blocks = seo.jsonLd
    .map((o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`)
    .join('\n    ');
  // La foto principale di questa pagina è diversa da quella della home: il preload deve puntare a quella giusta.
  must(/<link rel="preload" as="image" href="\/images\/hero-tetto\.webp"[^>]*>/, () => '<link rel="preload" as="image" href="/images/hero-v2.webp" imagesrcset="/images/hero-v2-720.webp 720w, /images/hero-v2.webp 1080w" imagesizes="100vw" fetchpriority="high">', 'preload hero');
  must(/<\/head>/, () => `    ${blocks}\n  </head>`, 'head');
  must(/<div id="root"><\/div>/, () => `<div id="root">${lowPriorityBelowFold(markup)}</div>`, 'root');
  return h;
}

async function viaSsr() {
  const { build } = await import('vite');
  await build({
    root,
    logLevel: 'error',
    build: { ssr: 'src/entry-server.tsx', outDir: 'dist-ssr', emptyOutDir: true, copyPublicDir: false },
    ssr: { noExternal: ['lucide-react'] },
  });
  const mod = await import(pathToFileURL(path.join(root, 'dist-ssr', 'entry-server.js')).href);
  const markup = mod.render();
  if (typeof markup !== 'string' || markup.length < 5000) throw new Error('HTML generato troppo corto');
  const file = path.join(root, 'dist', 'index.html');
  const html = fs.readFileSync(file, 'utf8');
  if (!html.includes('<div id="root"></div>')) throw new Error('contenitore #root non trovato');
  let out = html.replace('<div id="root"></div>', () => `<div id="root">${lowPriorityBelowFold(markup)}</div>`);
  out = deferScript(out);
  out = compactHtml(out);
  fs.writeFileSync(file, out);

  // Seconda pagina: /pannelli-solari-napoli (file dist/pannelli-solari-napoli.html, servito senza estensione da Netlify,
  // come privacy e cookie). Parte dalla stessa pagina di base della home, con titolo, descrizione e schema propri.
  const napoliFile = path.join(root, 'dist', 'pannelli-solari-napoli.html');
  const napoliMarkup = mod.renderNapoli();
  if (typeof napoliMarkup !== 'string' || napoliMarkup.length < 5000) throw new Error('HTML pagina Napoli troppo corto');
  let np = napoliPage(html, mod.napoliSeo, napoliMarkup);
  np = compactHtml(deferScript(np));
  fs.writeFileSync(napoliFile, np);
  console.log(`[prerender] OK (SSR) — dist/pannelli-solari-napoli.html creato, ${(fs.statSync(napoliFile).size / 1024).toFixed(1)} KB`);
  // Terza pagina: /offerta (dist/offerta.html), la landing delle campagne Meta.
  const offertaFile = path.join(root, 'dist', 'offerta.html');
  const offertaMarkup = mod.renderOfferta();
  if (typeof offertaMarkup !== 'string' || offertaMarkup.length < 5000) throw new Error('HTML pagina offerta troppo corto');
  fs.writeFileSync(offertaFile, compactHtml(deferScript(offertaPage(html, offertaMarkup))));
  console.log(`[prerender] OK (SSR) — dist/offerta.html creato, ${(fs.statSync(offertaFile).size / 1024).toFixed(1)} KB`);
  fs.rmSync(path.join(root, 'dist-ssr'), { recursive: true, force: true });
  console.log(`[prerender] OK (SSR) — dist/index.html aggiornato, ${(fs.statSync(file).size / 1024).toFixed(1)} KB`);
}

try {
  await viaSsr();
} catch (e) {
  console.warn('[prerender] SSR non riuscito, uso il metodo precedente:', e && e.message ? e.message : e);
  fs.rmSync(path.join(root, 'dist-ssr'), { recursive: true, force: true });
  const r = spawnSync(process.execPath, [path.join(root, 'scripts', 'prerender-dom.mjs')], { stdio: 'inherit' });
  process.exit(r.status === null ? 1 : r.status);
}
