// Riscrive il JSON-LD FAQPage di index.html partendo da src/data/faqs.json,
// la stessa fonte delle FAQ visibili: domande e risposte restano identiche per costruzione.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const faqs = JSON.parse(fs.readFileSync(path.join(root, 'src/data/faqs.json'), 'utf8'));
const file = path.join(root, 'index.html');
const html = fs.readFileSync(file, 'utf8');

const re = /(<!-- Schema: FAQPage -->\s*<script type="application\/ld\+json">)[\s\S]*?(<\/script>)/;
if (!re.test(html)) throw new Error('[faq-jsonld] blocco FAQPage non trovato in index.html');

const schema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};
const json = JSON.stringify(schema, null, 2).replace(/</g, '\\u003c');
fs.writeFileSync(file, html.replace(re, (m, a, b) => `${a}\n${json}\n    ${b}`));
console.log(`[faq-jsonld] ${faqs.length} domande scritte nel JSON-LD`);
