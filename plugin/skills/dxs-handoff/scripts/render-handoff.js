// Handoff: annotation di interazione sugli elementi dei frame della pagina "Wireframe" (lette in Dev Mode).
// USO: non a mano. Il payload lo genera scripts/handoff.py payload (sostituisce __DATA__ e minifica).
// DATA = { wfPage, frames:[name], actions:[{src,el,md}] }
const DATA = __DATA__;
const out = { notes: 0, warnings: [] };
const wf = figma.root.children.find((p) => p.name === DATA.wfPage);
if (!wf) return { error: 'pagina ' + DATA.wfPage + ' non trovata' };
await figma.setCurrentPageAsync(wf);
const names = new Set(DATA.frames);
const src = {}; wf.findAll((n) => n.type === 'FRAME' && names.has(n.name)).forEach((n) => { if (!src[n.name]) src[n.name] = n; });
for (const f of DATA.frames) if (!src[f]) out.warnings.push('frame mancante: ' + f);
const HIT = /^(btn|card|input|banner|modal|lista|tabs|chips)/;
const findEl = (frame, el) => { // testo esatto → contenitore interattivo più vicino
  const hits = frame.findAll((n) => n.type === 'TEXT' && n.characters.trim() === el);
  if (!hits.length) return null;
  let n = hits[0];
  for (let p = n.parent; p && p !== frame; p = p.parent) { if (HIT.test(p.name)) { n = p; break; } if (/^(Contenuto|Aside|PreFooter|_Top|_Content|_Aside|_preFooter)$/.test(p.name)) break; }
  return { node: n, dup: hits.length > 1 };
};
const note = (node, md) => {
  const keep = (node.annotations || []).filter((a) => !String(a.labelMarkdown || a.label || '').startsWith('**Tap'));
  try { node.annotations = keep.concat([{ labelMarkdown: md }]); }
  catch (e) { node.annotations = keep.concat([{ label: md.replace(/\*\*/g, '') }]); }
};
for (const a of DATA.actions) {
  const fr = src[a.src]; if (!fr) continue;
  const r = findEl(fr, a.el);
  if (!r) { out.warnings.push(`${a.src}: elemento «${a.el}» non trovato`); continue; }
  if (r.dup) out.warnings.push(`${a.src}: «${a.el}» presente più volte, uso il primo`);
  note(r.node, a.md); out.notes++;
}
return out;
