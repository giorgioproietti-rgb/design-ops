// Compila i due testi della pagina "Cover" del file Figma di progetto (template Template-Progetto-*).
// USO: non a mano. Il payload lo genera scripts/build_cover.py (sostituisce __DATA__).
// DATA = { nome, area, tipo, owner, links:[{label,url}], dry }
// Tocca solo due nodi di testo. Riga per riga, con inserimento+cancellazione: lo stile della riga (grassetto, corsivo) resta.
// Rilanciabile: i nodi si ritrovano dall'etichetta salvata (o dal testo segnaposto al primo giro).
const DATA = __DATA__;
const page = figma.root.children.find((p) => p.name.replace(/^[-\s]+/, '').toLowerCase() === 'cover');
if (!page) throw new Error('Pagina Cover non trovata');
await figma.setCurrentPageAsync(page);
const texts = page.findAllWithCriteria({ types: ['TEXT'] });
const tag = (n) => n.getSharedPluginData('dxs', 'cover');
const pick = (t, test) => texts.find((n) => tag(n) === t) || texts.find((n) => !tag(n) && test(n.characters));
const title = pick('titolo', (c) => /^Nome Progetto/i.test(c));
const info = pick('info', (c) => /^Tipo di attivit/i.test(c));
if (!title || !info) throw new Error('Testi della Cover non trovati: ' + JSON.stringify({ titolo: !!title, info: !!info }));

const linkLine = (DATA.links && DATA.links.length) ? DATA.links.map((l) => l.label).join(' · ') : '—';
const plan = [
  { node: title, tag: 'titolo', lines: [DATA.nome, DATA.area] },
  { node: info, tag: 'info', lines: [DATA.tipo, DATA.owner, linkLine] },
];
const before = plan.map((p) => p.node.characters.split('\n'));
if (DATA.dry) return { dry: true, page: page.name, nodes: plan.map((p) => ({ id: p.node.id, tag: p.tag })), before, after: plan.map((p) => p.lines) };

const loadAll = async (n) => { if (!n.characters.length) return; for (const f of n.getRangeAllFontNames(0, n.characters.length)) await figma.loadFontAsync(f); };
const setLine = (n, i, text) => { // sostituisce la riga i mantenendo lo stile della riga
  const lines = n.characters.split('\n');
  if (i >= lines.length) { const last = n.characters.length; n.insertCharacters(last, '\n' + text, 'BEFORE'); return; }
  const start = lines.slice(0, i).reduce((s, l) => s + l.length + 1, 0), old = lines[i].length;
  if (old === 0) { n.insertCharacters(start, text, 'BEFORE'); return; }
  n.setRangeHyperlink(start, start + old, null);
  n.insertCharacters(start, text, 'AFTER');
  n.deleteCharacters(start + text.length, start + text.length + old);
};
const mutated = [];
for (const p of plan) {
  await loadAll(p.node);
  p.lines.forEach((t, i) => setLine(p.node, i, String(t)));
  p.node.setSharedPluginData('dxs', 'cover', p.tag);
  mutated.push(p.node.id);
}
// hyperlink sulla terza riga della scheda info
if (DATA.links && DATA.links.length) {
  const lines = info.characters.split('\n'); let pos = lines[0].length + 1 + lines[1].length + 1;
  for (const l of DATA.links) { info.setRangeHyperlink(pos, pos + l.label.length, { type: 'URL', value: l.url }); pos += l.label.length + 3; }
}
return { mutatedNodeIds: mutated, after: plan.map((p) => p.node.characters.split('\n')) };
