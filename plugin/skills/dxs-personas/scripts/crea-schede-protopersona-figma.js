// Crea nella pagina "Personas" del FigJam del progetto un frame col nome del progetto
// e una scheda per ogni protopersona validata, senza foto, secondo il template delle schede Corriere.
// USO: sostituire __DATA__ con l'oggetto JSON descritto in references/fase1-creazione-schede-figma-protopersona.md, poi eseguire con use_figma.

const DATA = __DATA__;
const PAGE_NAME = 'Personas';

const page = figma.root.children.find((p) => p.name === PAGE_NAME);
if (!page) throw new Error('Pagina ' + PAGE_NAME + ' non trovata nel FigJam del progetto');
await figma.setCurrentPageAsync(page);

const F = {
  r: { family: 'Inter', style: 'Regular' },
  b: { family: 'Inter', style: 'Bold' },
  s: { family: 'Inter', style: 'Semi Bold' },
  i: { family: 'Inter', style: 'Italic' },
};
await Promise.all(Object.values(F).map((f) => figma.loadFontAsync(f)));

const hex = (h) => ({
  r: parseInt(h.slice(1, 3), 16) / 255,
  g: parseInt(h.slice(3, 5), 16) / 255,
  b: parseInt(h.slice(5, 7), 16) / 255,
});
const solid = (h) => [{ type: 'SOLID', color: hex(h) }];
const C = {
  blue: '#0B4F7C', navy: '#032E4A', grey: '#F3F4F5', text: '#2B2B2B',
  muted: '#5F6B75', white: '#FFFFFF', track: '#DCE3E8', badge: '#F2C94C',
};

// Frame auto-layout. width: larghezza fissa (altezza sempre adattiva).
function box(name, dir, o = {}) {
  const f = figma.createFrame();
  f.name = name;
  f.layoutMode = dir;
  if (o.width) f.resize(o.width, 10);
  f.primaryAxisSizingMode = 'AUTO';
  f.counterAxisSizingMode = o.width && dir === 'VERTICAL' ? 'FIXED' : 'AUTO';
  if (o.width && dir === 'HORIZONTAL') { f.primaryAxisSizingMode = 'FIXED'; }
  f.itemSpacing = o.gap ?? 0;
  const p = o.pad ?? 0;
  f.paddingTop = o.pt ?? p; f.paddingBottom = o.pb ?? p;
  f.paddingLeft = o.pl ?? p; f.paddingRight = o.pr ?? p;
  f.fills = o.fill ? solid(o.fill) : [];
  if (o.stroke) { f.strokes = solid(o.stroke); f.strokeWeight = o.sw ?? 1; }
  if (o.radius) f.cornerRadius = o.radius;
  f.clipsContent = false;
  return f;
}

function txt(parent, str, size, font, color, width) {
  const t = figma.createText();
  t.fontName = font;
  t.characters = (str && String(str).trim()) || '—';
  t.fontSize = size;
  t.fills = solid(color);
  t.lineHeight = { unit: 'PERCENT', value: 140 };
  parent.appendChild(t);
  if (width) { t.textAutoResize = 'HEIGHT'; t.resize(width, t.height); }
  return t;
}

const bullets = (arr) => (arr && arr.length ? arr.map((x) => '• ' + x).join('\n') : '—');

function bar(parent, label, left, right, value, w) {
  const g = box('Dimensione – ' + label, 'VERTICAL', { gap: 6, width: w });
  parent.appendChild(g);
  txt(g, label, 18, F.s, C.text);
  const track = box('Barra', 'HORIZONTAL', { width: w });
  track.resize(w, 6);
  track.counterAxisSizingMode = 'FIXED';
  g.appendChild(track);
  const v = Math.min(5, Math.max(1, Number(value) || 1));
  const fw = Math.round((w * v) / 5);
  const on = figma.createRectangle(); on.resize(fw, 6); on.fills = solid(C.blue); track.appendChild(on);
  if (w - fw > 0) { const off = figma.createRectangle(); off.resize(w - fw, 6); off.fills = solid(C.track); track.appendChild(off); }
  const ends = box('Estremi', 'HORIZONTAL', { width: w });
  ends.primaryAxisAlignItems = 'SPACE_BETWEEN';
  g.appendChild(ends);
  txt(ends, left, 14, F.r, C.muted);
  txt(ends, right, 14, F.r, C.muted);
}

function block(parent, title, body, w) {
  const b = box('Blocco – ' + title, 'VERTICAL', { width: w, stroke: C.blue });
  parent.appendChild(b);
  const h = box('Titolo', 'HORIZONTAL', { pad: 12, pl: 20, fill: C.navy });
  b.appendChild(h); h.layoutSizingHorizontal = 'FILL';
  txt(h, title, 20, F.b, C.white);
  const c = box('Contenuto', 'VERTICAL', { pad: 16, pl: 20, pr: 20 });
  b.appendChild(c); c.layoutSizingHorizontal = 'FILL';
  txt(c, body, 15, F.r, C.text, w - 40);
}

const created = [];

// Contenitore: frame col nome del progetto, a destra dei contenuti esistenti
const existing = page.children.map((n) => n.name);
const baseName = DATA.progetto;
const frameName = existing.includes(baseName) ? baseName + ' – ' + DATA.data : baseName;
const root = box(frameName, 'VERTICAL', { gap: 80, pad: 80, fill: C.white });
let maxX = 0;
for (const n of page.children) maxX = Math.max(maxX, n.x + n.width);
root.x = page.children.length ? maxX + 400 : 0;
root.y = 0;
page.appendChild(root);
created.push(root.id);

txt(root, 'Protopersona – ' + DATA.progetto, 56, F.b, C.navy);
txt(root, [DATA.testata, DATA.data, 'Personas DXS: ' + (DATA.personasDXS || '—')].join('  ·  '), 22, F.r, C.muted, 2000);

const row = box('Schede', 'HORIZONTAL', { gap: 80 });
root.appendChild(row);

for (const p of DATA.personas) {
  const card = box('Scheda – ' + p.nome, 'HORIZONTAL', { gap: 40, pr: 32, fill: C.white, stroke: C.track, radius: 8 });
  row.appendChild(card);
  created.push(card.id);

  // Colonna 1 – identità (al posto della foto)
  const left = box('Identità', 'VERTICAL', { width: 420, gap: 28, pad: 40, fill: C.blue });
  card.appendChild(left); left.layoutSizingVertical = 'FILL';
  const tag = box('Badge', 'HORIZONTAL', { pad: 8, pl: 14, pr: 14, fill: C.badge, radius: 4 });
  left.appendChild(tag);
  txt(tag, (p.id ? p.id + ' · ' : '') + 'PROTOPERSONA – da validare', 14, F.b, C.navy);
  txt(left, p.nome, 44, F.b, C.white, 340);
  if (p.etichetta) txt(left, p.etichetta, 20, F.s, C.white, 340);
  txt(left, p.citazione ? '“' + p.citazione + '”' : '“ ”', 22, F.i, C.white, 340);
  txt(left, bullets([p.genere, p.eta, p.occupazione].filter(Boolean)), 22, F.r, C.white, 340);

  // Colonna 2 – Bio e abitudini
  const mid = box('Bio e abitudini', 'VERTICAL', { width: 600, gap: 20, pt: 40, pb: 40 });
  card.appendChild(mid);
  txt(mid, 'Bio', 28, F.b, C.text);
  txt(mid, p.bio, 18, F.r, C.text, 600);
  txt(mid, 'Abitudini di fruizione delle informazioni', 28, F.b, C.text, 600);
  txt(mid, bullets(p.abitudini), 18, F.r, C.text, 600);

  // Colonna 3 – dimensioni e blocchi
  const right = box('Caratteristiche', 'VERTICAL', { width: 640, gap: 24, pt: 40, pb: 40 });
  card.appendChild(right);
  const dim = box('Dimensioni', 'VERTICAL', { width: 640, gap: 18, pad: 24, fill: C.grey });
  right.appendChild(dim);
  txt(dim, 'Dimensioni', 22, F.b, C.text);
  const d = p.dimensioni || {};
  bar(dim, 'Spesa per abbonamenti', 'Assente', 'Continuativa', d.spesa, 592);
  bar(dim, 'Modalità di fruizione', 'Passiva', 'Attiva', d.fruizione, 592);
  bar(dim, 'Ritmo lavorativo', 'Variabile/assente', 'Routiniero', d.ritmo, 592);
  bar(dim, 'Interesse per la notizia', 'Personale', 'Civico', d.interesse, 592);
  block(right, 'Motivazioni', bullets(p.motivazioni), 640);
  block(right, 'Bisogni e obiettivi', bullets(p.bisogni), 640);
  block(right, 'Frustrazioni', bullets(p.frustrazioni), 640);
  block(right, 'Bisogni informativi', bullets(p.bisogniInformativi), 640);
  const note = [];
  if (p.fonti && p.fonti.length) note.push('Fonti di ricerca: ' + p.fonti.join('; '));
  else note.push('Fonti di ricerca: nessuna');
  if (p.assunzioni && p.assunzioni.length) note.push('Assunzioni da verificare:\n' + bullets(p.assunzioni));
  txt(right, note.join('\n'), 14, F.r, C.muted, 640);
}

return {
  frameId: root.id,
  frameName: root.name,
  createdNodeIds: created,
  cards: DATA.personas.length,
  bounds: { x: root.x, y: root.y, width: root.width, height: root.height },
};
