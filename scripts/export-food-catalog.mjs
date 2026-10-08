import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from '@playwright/test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Apple, BreadSlice, Chocolate, Droplet, Egg, GlassHalf, Leaf } from 'iconoir-react';

const root = process.cwd();
const output = resolve(root, 'exports');
const baseURL = process.env.FOOD_CATALOG_URL ?? 'http://127.0.0.1:5173';
const date = '08.10.2026';
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const icons = { apple: Apple, wheat: BreadSlice, candy: Chocolate, droplet: Droplet, nut: Droplet, egg: Egg, milk: GlassHalf, carrot: Leaf };
const icon = group => renderToStaticMarkup(createElement(icons[group.icon], { width: 15, height: 15, strokeWidth: 1.5, 'aria-hidden': true }));
const browser = await chromium.launch();

try {
  const page = await browser.newPage({ viewport: { width: 1100, height: 1250 } });
  await page.goto(baseURL);
  const catalog = await page.evaluate(async () => {
    const [{ MOCK_FOODS }, { FOOD_GROUPS, PORTIONS_PER_DOT }, { FOOD_IMAGES }, pyramid, scoring] = await Promise.all([
      import('/src/data/mockRestaurants.ts'), import('/src/data/foodGroups.ts'), import('/src/data/foodImages.ts'),
      import('/src/game/foodPyramid.ts'), import('/src/game/scoring.ts'),
    ]);
    return {
      groups: FOOD_GROUPS,
      pointsPerDot: scoring.POINTS_PER_DOT,
      portionsPerDot: PORTIONS_PER_DOT,
      fullDayBonus: scoring.FULL_DAY_BONUS,
      dailyMax: scoring.MAX_DAILY_SCORE,
      gameMax: scoring.MAX_GAME_SCORE,
      foods: MOCK_FOODS.map(food => ({
        ...food,
        imagePath: FOOD_IMAGES[food.id],
        contributions: pyramid.getFoodContributions(food, pyramid.emptyTotals()),
        points: scoring.calculateScore(food, pyramid.emptyTotals()),
      })),
    };
  });
  assert.equal(new Set(catalog.foods.map(food => food.id)).size, catalog.foods.length);
  assert.equal(catalog.foods.length, 40);
  const imageURLs = new Map();
  for (const food of catalog.foods) {
    assert(food.imagePath, `Missing artwork for ${food.id}`);
    imageURLs.set(food.id, `data:image/png;base64,${(await readFile(resolve(root, 'public', food.imagePath.slice(1)))).toString('base64')}`);
    assert.equal(food.points, food.contributions.filter(value => value.groupId !== 'treats').reduce((sum, value) => sum + value.points, 0) * catalog.pointsPerDot);
    assert(food.contributions.filter(value => value.groupId === 'treats').every(value => value.points === 1));
  }
  const fontURL = `data:font/ttf;base64,${(await readFile(resolve(root, 'public/fonts/nunito-latin.ttf'))).toString('base64')}`;
  const perPage = 6;
  const pages = Math.ceil(catalog.foods.length / perPage) + 1;
  const footer = number => `<footer><span>TOIDUSEIKLUS · TÜHI PÄEVAPÜRAMIID</span><span>${date} · ${number} / ${pages}</span></footer>`;
  const shortMeals = { breakfast: 'Hommik', lunch: 'Lõuna', dinner: 'Õhtu' };
  const groupLegend = catalog.groups.map(group => `<div class="legend-row"><span class="legend-icon" style="color:${group.color}">${icon(group)}</span><span>${escape(group.shortName)}</span><strong>${group.maxTarget}</strong><small>${group.maxTarget * catalog.portionsPerDot} portsjonit · ${group.id === 'treats' ? 'valikuline piir' : 'päeva eesmärk'}</small></div>`).join('');
  const heroFoods = ['oats', 'burger', 'berrymuffin'].map(id => `<img src="${imageURLs.get(id)}" alt="${escape(catalog.foods.find(food => food.id === id).name)}">`).join('');
  const cover = `<section class="sheet cover" aria-label="Ülevaade ja lugemisjuhis">
    <div class="eyebrow">TOIDUSEIKLUS / TOITUDE ÜLEVAADE</div>
    <h1>Kõik toidud.<br><span>Esimese valiku<br>atribuudid.</span></h1>
    <p class="cover-intro">${catalog.foods.length} mängutoitu koos pildi, punktide ja lisanduvate mummudega. Arvutuse alus on <strong>tühi päevapüramiid</strong>.</p>
    <div class="hero-foods">${heroFoods}</div>
    <div class="cover-stats"><div><strong>${catalog.foods.length}</strong><span>toitu</span></div><div><strong>${catalog.groups.length}</strong><span>toidugruppi</span></div><div><strong>${catalog.pointsPerDot}</strong><span>punkti põhigrupi mummu eest</span></div></div>
    <div class="cover-columns"><div><h2>Päeva mummud</h2><div class="legend">${groupLegend}</div></div><div class="reading-guide"><h2>Kuidas lugeda?</h2>
      <p><strong>+N</strong> näitab, mitu mummu see toit tühja püramiidi lisab. Kaardilt puuduv grupp annab <strong>0 mummu</strong>.</p>
      <p><strong>1 mumm = ${catalog.portionsPerDot} portsjonit.</strong> Kogused ümardatakse üles: 3 portsjonit annab 2 tervet mummu.</p>
      <p><strong>Punktid</strong> tulevad kuuest põhigrupist. Näksimumm punkte ei anna. Kõigi põhigruppide täitmine annab päeva lõpus ${catalog.fullDayBonus} boonuspunkti. Päeva maksimum on ${catalog.dailyMax}, mängu maksimum ${catalog.gameMax} punkti.</p>
      <p><strong>Hilisematel valikutel</strong> lisanduvad põhigruppide mummud ainult päeva eesmärgi täitumiseni, mistõttu võib punktisumma olla väiksem.</p>
      <p><strong>Maiustused ja näksid</strong> lisavad iga toiduvalikuga ühe mummu. Päeva teine ja kolmas näksivalik teevad tegelasel olemise halvaks.</p>
      <p><strong>Toidukorrad</strong> näitavad, millal toit võib menüüs esineda. „Taimne“ vastab mängu toiduandmetes olevale märkele.</p>
    </div></div>
    <div class="source-note">Kogused on lihtsustatud mänguportsjonid ja terved mummud. Andmed pärinevad mängu toidukaartidest ja punktiarvestusest.</div>
    ${footer(1)}
  </section>`;
  const card = (food, index) => {
    const gains = food.contributions.map(value => {
      const group = catalog.groups.find(group => group.id === value.groupId);
      return `<div class="gain" style="--color:${group.color}">${icon(group)}<strong>+${value.points}</strong><span>${escape(group.shortName)}</span></div>`;
    }).join('');
    return `<article class="food-card" data-food-id="${escape(food.id)}">
      <div class="card-meta"><span class="food-number">${String(index + 1).padStart(2, '0')}</span><span class="meals">${food.mealTimes.map(meal => shortMeals[meal]).join(' · ')}</span><span class="points">+${food.points} p</span></div>
      <div class="card-top"><img src="${imageURLs.get(food.id)}" alt="${escape(food.name)}"><div><h3>${escape(food.name)}</h3><p>${escape(food.description)}</p>${food.plantBased ? '<span class="plant-badge">TAIMNE</span>' : ''}</div></div>
      <div class="gains">${gains}</div>
    </article>`;
  };
  const foodPages = [];
  for (let start = 0; start < catalog.foods.length; start += perPage) {
    const foods = catalog.foods.slice(start, start + perPage);
    foodPages.push(`<section class="sheet catalog-page" aria-label="Toidud ${start + 1}–${start + foods.length}">
      <header class="catalog-heading"><div><span class="eyebrow">ESIMESE VALIKU ATRIBUUDID</span><h2>Toidud ${String(start + 1).padStart(2, '0')}–${String(start + foods.length).padStart(2, '0')}</h2></div><span class="baseline">Tühi püramiid · lisanduvad mummud</span></header>
      <div class="food-grid">${foods.map((food, offset) => card(food, start + offset)).join('')}</div>${footer(foodPages.length + 2)}
    </section>`);
  }
  const html = `<!doctype html><html lang="et"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Toiduseiklus — kõik toidud ja esimese valiku atribuudid</title><style>
    @font-face{font-family:Nunito;src:url('${fontURL}') format('truetype');font-weight:200 1000;font-display:swap}
    *{box-sizing:border-box}body{margin:0;background:#e8e6dc;color:#17384a;font-family:Nunito,sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}h1,h2,h3,p{margin:0}svg{flex-shrink:0}img{object-fit:contain}
    .toolbar{position:sticky;top:0;z-index:10;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 24px;background:#17384a;color:#fff8e7;font-size:14px}.toolbar button{border:0;border-radius:10px;padding:10px 16px;background:#ddecbb;color:#17384a;font:inherit;font-weight:800;cursor:pointer}
    .sheet{position:relative;width:210mm;height:297mm;margin:24px auto;padding:12mm 14mm 15mm;background:#fff9eb;box-shadow:0 5px 24px #17384a20;break-after:page;page-break-after:always}.sheet:last-child{break-after:auto;page-break-after:auto}
    .eyebrow{font-size:8pt;letter-spacing:1.4px;font-weight:900;color:#6b7f64}.cover h1{margin-top:5mm;font-size:35pt;line-height:1.08;letter-spacing:-1.5px;font-weight:1000}.cover h1 span{color:#2c713f}.cover-intro{max-width:154mm;margin-top:4mm;font-size:11pt;line-height:1.45;color:#53624f}.hero-foods{display:flex;align-items:center;justify-content:center;gap:7mm;height:44mm;margin:2mm 0}.hero-foods img{width:45mm;height:41mm}
    .cover-stats{display:grid;grid-template-columns:1fr 1fr 1.65fr;gap:4mm;margin-bottom:7mm}.cover-stats>div{display:flex;align-items:center;gap:3mm;min-height:19mm;padding:3mm;border:1px solid #dec79e;border-radius:4mm;background:#fff1d4}.cover-stats strong{font-size:23pt;font-weight:1000}.cover-stats span{font-size:8pt;line-height:1.35;font-weight:800}
    .cover-columns{display:grid;grid-template-columns:1fr 1.18fr;gap:7mm}.cover-columns h2{font-size:15pt;line-height:1.2;font-weight:900;margin-bottom:3mm}.legend{border:1px solid #dfc99f;border-radius:4mm;padding:2mm 3mm;background:#fffef6}.legend-row{display:grid;grid-template-columns:5mm 1fr auto;gap:2mm;align-items:center;padding:1.7mm 0;border-bottom:1px solid #eee1c7}.legend-row:last-child{border:0}.legend-icon{display:flex}.legend-row>span:nth-child(2){font-size:9pt;font-weight:800}.legend-row strong{font-size:12pt}.legend-row small{grid-column:2 / -1;color:#74806a;font-size:7pt;margin-top:-1.3mm}.reading-guide p{margin-bottom:2.8mm;font-size:8.6pt;line-height:1.42;color:#51604d}.reading-guide strong{color:#17384a}.source-note{margin-top:4mm;padding-top:3mm;border-top:1px solid #dec79e;font-size:8pt;line-height:1.4;color:#71806b}
    footer{position:absolute;left:14mm;right:14mm;bottom:8mm;display:flex;justify-content:space-between;gap:10px;padding-top:2.5mm;border-top:1px solid #dec79e;font-size:6.5pt;letter-spacing:.4px;color:#75816c}
    .catalog-heading{display:flex;align-items:end;justify-content:space-between;gap:4mm;margin-bottom:6mm}.catalog-heading h2{margin-top:1.5mm;font-size:21pt;line-height:1.1;font-weight:1000}.baseline{max-width:64mm;text-align:right;font-size:8pt;line-height:1.4;color:#75816c}.food-grid{display:grid;grid-template-columns:1fr 1fr;gap:6mm}.food-card{height:74mm;min-width:0;padding:4mm;border:1px solid #dabc87;border-radius:5mm;background:linear-gradient(135deg,#fffdf5,#fff1d6);break-inside:avoid}.card-meta{display:flex;align-items:center;gap:2mm;margin-bottom:2mm}.food-number{color:#8b9c7c;font-size:8pt;font-weight:900}.meals{font-size:7pt;color:#69755f;white-space:nowrap}.points{margin-left:auto;border-radius:2mm;padding:1.3mm 2mm;background:#e5efd1;color:#2a693c;font-size:10pt;font-weight:1000;white-space:nowrap}
    .card-top{display:grid;grid-template-columns:28mm minmax(0,1fr);gap:3mm;height:32mm;margin-bottom:2mm;align-items:center}.card-top>img{width:28mm;height:31mm}.card-top h3{font-size:13pt;font-weight:1000;line-height:1.15;overflow-wrap:anywhere}.card-top p{margin-top:1.4mm;font-size:7.9pt;line-height:1.32;color:#67755e}.plant-badge{display:inline-block;margin-top:1.8mm;padding:.6mm 1.4mm;background:#e4edd8;border-radius:1.5mm;color:#40704b;font-size:6pt;font-weight:900;letter-spacing:.6px}.gains{display:grid;grid-template-columns:1fr 1fr;gap:1.8mm}.gain{display:flex;align-items:center;gap:1.2mm;min-width:0;padding:1.1mm 1.2mm;border:1px solid color-mix(in srgb,var(--color),transparent 70%);border-radius:2mm;background:#fffaf0;color:var(--color);font-size:7.2pt;line-height:1.2;white-space:nowrap}.gain strong{font-size:9pt;font-weight:1000}.gain svg{width:12px;height:12px}.gain span{color:#526048;font-weight:800}
    @page{size:A4;margin:0}@media print{body{background:#fff}.toolbar{display:none}.sheet{margin:0;box-shadow:none}}
    @media screen and (max-width:820px){.sheet{width:calc(100% - 24px);height:auto;min-height:0;padding:24px 20px 66px}.cover h1{font-size:32px;letter-spacing:-.7px}.cover-intro{font-size:15px}.hero-foods{height:120px;gap:10px}.hero-foods img{width:30%;height:110px}.cover-stats{gap:8px}.cover-stats>div{display:block;padding:10px}.cover-stats strong{display:block;font-size:27px}.cover-stats span{font-size:11px}.cover-columns{grid-template-columns:1fr;gap:22px}.catalog-heading{align-items:start}.catalog-heading h2{font-size:25px}.baseline{font-size:11px;max-width:110px}.food-grid{grid-template-columns:1fr;gap:18px}.food-card{height:auto;min-height:265px}.card-top{height:auto;min-height:125px;grid-template-columns:105px minmax(0,1fr)}.card-top>img{width:105px;height:120px}.card-top h3{font-size:20px}.card-top p{font-size:12px}.gains{gap:7px}.gain{font-size:11px}.gain strong{font-size:13px}.gain svg{width:15px;height:15px}.meals{font-size:11px}.points{font-size:15px}.toolbar{font-size:12px;padding:12px}.toolbar span{max-width:190px}footer{left:20px;right:20px;font-size:8px}.plant-badge{font-size:9px}.source-note{font-size:11px}}
  </style></head><body><div class="toolbar"><span>Toiduseiklus · kõik ${catalog.foods.length} toitu</span><button onclick="window.print()">Prindi / salvesta PDF</button></div><main>${cover}${foodPages.join('')}</main></body></html>`;
  await mkdir(output, { recursive: true });
  const htmlPath = resolve(output, 'toidud-ulevaade.html');
  const pdfPath = resolve(output, 'toidud-ulevaade.pdf');
  await writeFile(htmlPath, html);
  await page.goto(`file://${htmlPath}`);
  await page.emulateMedia({ media: 'print' });
  await page.evaluate(async () => { await document.fonts.ready; await Promise.all(Array.from(document.images, image => image.decode())); });
  assert.equal(await page.locator('.food-card').count(), catalog.foods.length);
  assert.equal(await page.locator('.sheet').count(), pages);
  const overflow = await page.locator('.food-card, .card-top > div, .gains, .gain, .reading-guide, .legend').evaluateAll(elements => elements.filter(element => element.scrollWidth > element.clientWidth + 1 || element.scrollHeight > element.clientHeight + 1).map(element => ({ className: element.className, text: element.textContent.trim().slice(0, 70) })));
  assert.deepEqual(overflow, [], 'The report must not clip food names, attributes, or instructions');
  const footerOverlap = await page.locator('.sheet').evaluateAll(sheets => sheets.filter(sheet => {
    const footer = sheet.querySelector('footer').getBoundingClientRect();
    const content = sheet.querySelector('.food-grid, .source-note').getBoundingClientRect();
    return content.bottom > footer.top;
  }).map(sheet => sheet.getAttribute('aria-label')));
  assert.deepEqual(footerOverlap, [], 'Report content must clear every page footer');
  await page.pdf({ path: pdfPath, format: 'A4', preferCSSPageSize: true, printBackground: true, tagged: true, outline: true });
  const pdf = await readFile(pdfPath);
  assert.equal(pdf.subarray(0, 5).toString(), '%PDF-');
  const actualPages = (pdf.toString('latin1').match(/\/Type \/Page\b/g) ?? []).length;
  assert.equal(actualPages, pages, 'The PDF should contain exactly one page per report sheet');
  for (const number of [0, 1, pages - 1]) await page.locator('.sheet').nth(number).screenshot({ path: resolve(output, `toidud-eelvaade-${number + 1}.png`) });
  console.log(JSON.stringify({ foods: catalog.foods.length, pages: actualPages, html: htmlPath, pdf: pdfPath, pdfBytes: pdf.length }, null, 2));
} finally {
  await browser.close();
}
