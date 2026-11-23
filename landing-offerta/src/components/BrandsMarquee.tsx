// Barra con i marchi dei materiali, scorre in orizzontale. Per aggiungere un marchio: file in public/images/brands/ + una riga qui.
const BRANDS = [
  { name: 'Huawei', src: '/images/brands/huawei.webp', w: 128, h: 128, cls: 'h-12' },
  { name: 'Viessmann', src: '/images/brands/viessmann.webp', w: 299, h: 72, cls: 'h-7' },
  { name: 'Solplanet', src: '/images/brands/solplanet.webp', w: 282, h: 72, cls: 'h-7' },
  { name: 'Afore', src: '/images/brands/afore.webp', w: 298, h: 144, cls: 'h-9' },
  { name: 'Lithium Valley', src: '/images/brands/lithium-valley.webp', w: 297, h: 160, cls: 'h-10' },
];

function Row({ hidden }: { hidden?: boolean }) {
  return (
    <ul className="flex shrink-0 items-center gap-12 pr-12" aria-hidden={hidden || undefined}>
      {BRANDS.concat(BRANDS).map((b, i) => (
        <li key={`${b.name}-${i}`} className="shrink-0">
          <img src={b.src} alt={hidden ? '' : b.name} width={b.w} height={b.h} loading="lazy" className={`${b.cls} w-auto`} />
        </li>
      ))}
    </ul>
  );
}

export function BrandsMarquee() {
  return (
    <div
      className="overflow-hidden rounded-xl border border-ink-900/10 bg-white py-5"
      style={{ WebkitMaskImage: 'linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)', maskImage: 'linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)' }}
    >
      <div className="marquee-track">
        <Row />
        <Row hidden />
      </div>
    </div>
  );
}
