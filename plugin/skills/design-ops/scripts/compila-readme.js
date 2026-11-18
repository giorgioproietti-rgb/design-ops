// Compila i testi guida del Read Me e rinomina le pagine con "Nome progetto" nel file Figma di progetto.
// USO: non a mano. Il payload lo genera scripts/build_readme.py (sostituisce __DATA__).
// DATA = { nome, referenti:[righe], stime:[righe], links:[{label,url}], rinomina, dry }
// Per ogni testo: la prima riga (la guida del template) resta, le righe dopo sono il contenuto. Stile di riga mantenuto.
// Titolo "Nome progetto" e nomi delle pagine: solo il segnaposto. Overview e Legenda non si toccano.
const DATA = __DATA__;
const page = figma.root.children.find((p) => p.name.replace(/^[-\s]+/, '').toLowerCase() === 'read me');
if (!page) throw new Error('Pagina Read Me non trovata');
await figma.setCurrentPageAsync(page);
const texts = page.findAllWithCriteria({ types: ['TEXT'] });
const tag = (n) => n.getSharedPluginData('dxs', 'readme');
const pick = (t, test) => texts.find((n) => tag(n) === t) || texts.find((n) => !tag(n) && test(n.characters));
const titolo = pick('titolo', (c) => c === 'Nome progetto');
const stake = pick('stake', (c) => /^Elenco delle figure coinvolte/i.test(c));
const stime = pick('stime', (c) => /^Qui riportiamo le stime/i.test(c));
const link = pick('link', (c) => /^Qui è possibile inserire link/i.test(c));
const mancano = Object.entries({ titolo, stake, stime, link }).filter(([, v]) => !v).map(([k]) => k);
if (mancano.length) throw new Error('Testi del Read Me non trovati: ' + mancano.join(', '));

const refs = DATA.referenti && DATA.referenti.length ? DATA.referenti : ['Da definire'];
const times = DATA.stime && DATA.stime.length ? DATA.stime : ['Da definire'];
const lnk = DATA.links && DATA.links.length ? DATA.links : null;
const plan = [
  { node: titolo, tag: 'titolo', from: 0, lines: [DATA.nome], keep: 0 },
  { node: stake, tag: 'stake', from: 1, lines: refs },
  { node: stime, tag: 'stime', from: 1, lines: times },
  { node: link, tag: 'link', from: 1, lines: lnk ? lnk.map((l) => l.label) : ['—'] },
];
const rename = DATA.rinomina ? figma.root.children.filter((p) => p.name.includes('Nome progetto')).map((p) => ({ id: p.id, da: p.name, a: p.name.replace('Nome progetto', DATA.nome) })) : [];
const before = plan.map((p) => p.node.characters.split('\n'));
if (DATA.dry) return { dry: true, nodes: plan.map((p) => ({ id: p.node.id, tag: p.tag })), before, after: plan.map((p) => (p.from === 0 ? p.lines : [...p.node.characters.split('\n').slice(0, p.from), ...p.lines])), rinomina: rename };

const loadAll = async (n) => { if (!n.characters.length) return; for (const f of n.getRangeAllFontNames(0, n.characters.length)) await figma.loadFontAsync(f); };
const setLine = (n, i, text) => { // sostituisce la riga i mantenendo lo stile della riga; oltre l'ultima la aggiunge
  const lines = n.characters.split('\n');
  if (i >= lines.length) { n.insertCharacters(n.characters.length, '\n' + text, 'BEFORE'); return; }
  const start = lines.slice(0, i).reduce((s, l) => s + l.length + 1, 0), old = lines[i].length;
  if (old === 0) { n.insertCharacters(start, text, 'BEFORE'); return; }
  n.setRangeHyperlink(start, start + old, null);
  n.insertCharacters(start, text, 'AFTER');
  n.deleteCharacters(start + text.length, start + text.length + old);
};
const trimAfter = (n, count) => { // toglie le righe oltre le prime `count` (rilancio con meno righe)
  const lines = n.characters.split('\n');
  if (lines.length <= count) return;
  const start = lines.slice(0, count).reduce((s, l) => s + l.length + 1, 0) - 1;
  n.deleteCharacters(start, n.characters.length);
};
const mutated = [];
for (const p of plan) {
  await loadAll(p.node);
  p.lines.forEach((t, k) => setLine(p.node, p.from + k, String(t)));
  trimAfter(p.node, p.from + p.lines.length);
  p.node.setSharedPluginData('dxs', 'readme', p.tag);
  mutated.push(p.node.id);
}
if (lnk) { // hyperlink sulle righe dei link
  const lines = link.characters.split('\n'); let pos = lines[0].length + 1;
  lnk.forEach((l, k) => { link.setRangeHyperlink(pos, pos + l.label.length, { type: 'URL', value: l.url }); pos += l.label.length + 1; });
}
for (const r of rename) { const pg = figma.root.children.find((x) => x.id === r.id); if (pg) pg.name = r.a; }
return { mutatedNodeIds: mutated, rinominate: rename.length, after: plan.map((p) => p.node.characters.split('\n')) };
