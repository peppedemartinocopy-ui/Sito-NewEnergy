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
