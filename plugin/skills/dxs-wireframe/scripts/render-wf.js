// Disegna i wireframe partendo dai template WF/Page (DXS Corriere – Wireframe library) nella pagina "Wireframe" del file di progetto.
// v3: WF/Page con slot Contenuto / Aside / PreFooter (Device × Header × Colonne), nessun booleano; ADV solo da payload.
// USO: non a mano. Il payload lo genera scripts/build_payload.py (sostituisce __DATA__, inserisce ADV e minifica).
// DATA = { page, lib:{tpl:{"HomePage/D":key,...}, block, textBlock}, adv:{d:setKey,m:setKey}, specs:[spec] }
// spec = { name, device:"m"|"d", tpl:"Articolo/D", tplKey:"Articolo/D/1", ann, aside:bool, pre:bool, top:[], content:[], asideBlocks:[]|null, preBlocks:[]|null }
// Upsert: frame con lo stesso nome sostituito nella stessa posizione, anche dentro i contenitori per device (v2). Gli altri non si toccano.
// Protezione: ogni frame salva un'impronta (struttura e testi). Se al giro successivo l'impronta non coincide, il frame è stato ritoccato a mano: non si sostituisce e finisce in out.protected. DATA.force = true lo sostituisce comunque.
const DATA = __DATA__;
const G1 = { r: .949, g: .949, b: .949 }, G2 = { r: .824, g: .824, b: .824 }, INK = { r: .169, g: .169, b: .169 }, WH = { r: 1, g: 1, b: 1 };
const fill = (c) => [{ type: 'SOLID', color: c }];
const FR = { family: 'Inter', style: 'Regular' }, FB = { family: 'Inter', style: 'Bold' };
await Promise.all([figma.loadFontAsync(FR), figma.loadFontAsync(FB)]);
let page = figma.root.children.find((p) => p.name === (DATA.page || 'Wireframe'));
if (!page) { page = figma.createPage(); page.name = DATA.page || 'Wireframe'; }
await figma.setCurrentPageAsync(page);
const out = { created: [], replaced: [], protected: [], warnings: [], pageId: page.id };
const fp = (n) => { // impronta: tipo, nome e testo di ogni nodo (senza misure, che cambiano con i font)
  let h = 5381; const all = [n, ...n.findAll(() => true)];
  for (const x of all) { const s = x.type + '|' + x.name + '|' + (x.type === 'TEXT' ? x.characters : ''); for (let i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0; }
  return h.toString(16) + ':' + all.length;
};
const fontsDone = new Set();
const loadFonts = async (root) => { // i template DXS usano Brera/Solferino: vanno caricati prima di spostare i frame
  for (const t of root.findAllWithCriteria({ types: ['TEXT'] })) {
    if (!t.characters.length) continue;
    for (const fn of t.getRangeAllFontNames(0, t.characters.length)) { const k = fn.family + '|' + fn.style; if (!fontsDone.has(k)) { fontsDone.add(k); await figma.loadFontAsync(fn); } }
  }
};
const cache = {};
const comp = async (k) => (cache[k] = cache[k] || await figma.importComponentByKeyAsync(k));
const cset = async (k) => (cache[k] = cache[k] || await figma.importComponentSetByKeyAsync(k));
const al = (dir, gap = 0, pad = 0) => {
  const f = figma.createFrame(); f.layoutMode = dir; f.itemSpacing = gap; f.fills = [];
  f.paddingTop = f.paddingBottom = f.paddingLeft = f.paddingRight = pad;
  f.primaryAxisSizingMode = 'AUTO'; f.counterAxisSizingMode = 'AUTO'; return f;
};
const fixW = (f, w) => { if (f.layoutMode === 'VERTICAL') f.counterAxisSizingMode = 'FIXED'; else f.primaryAxisSizingMode = 'FIXED'; f.resize(w, f.height); return f; };
const txt = (s, size = 16, bold = false, color = INK) => {
  const t = figma.createText(); t.fontName = bold ? FB : FR; t.fontSize = size; t.characters = String(s); t.fills = fill(color); return t;
};
const wrapTxt = (s, size, bold, w) => { const t = txt(s, size, bold); t.resize(w, t.height); t.textAutoResize = 'HEIGHT'; return t; };
const box = (w, h, label, dashed) => { // area grigia con etichetta centrata
  const f = al('VERTICAL', 0); f.primaryAxisAlignItems = 'CENTER'; f.counterAxisAlignItems = 'CENTER';
  f.primaryAxisSizingMode = 'FIXED'; f.counterAxisSizingMode = 'FIXED'; f.resize(w, h); f.cornerRadius = 8;
  f.fills = dashed ? [] : fill(G1); f.strokes = fill(G2); f.strokeWeight = 1; if (dashed) f.dashPattern = [6, 4];
  if (label) f.appendChild(txt(label, 12, true)); return f;
};
const center = (n, w) => { const r = al('HORIZONTAL', 0); r.primaryAxisAlignItems = 'CENTER'; fixW(r, w); r.appendChild(n); return r; };
const btn = (label, kind, dev, w) => {
  const f = al('HORIZONTAL', 0); f.name = 'btn'; f.paddingLeft = f.paddingRight = 24; f.cornerRadius = 4;
  f.primaryAxisAlignItems = 'CENTER'; f.counterAxisAlignItems = 'CENTER';
  if (kind === 'secondary') { f.strokes = fill(INK); f.strokeWeight = 1; } else if (kind !== 'link') f.fills = fill(INK);
  const t = txt(label, 16, true, kind === 'primary' || !kind ? WH : INK); if (kind === 'link') { t.textDecoration = 'UNDERLINE'; f.paddingLeft = f.paddingRight = 0; }
  f.appendChild(t); f.counterAxisSizingMode = 'FIXED';
  if (dev === 'm' && kind !== 'link') { f.primaryAxisSizingMode = 'FIXED'; f.resize(w, 48); } else f.resize(f.width, 48);
  return f;
};
const field = (label, w, h = 48) => {
  const f = al('VERTICAL', 8); f.name = 'input'; f.appendChild(txt(label, 14, true));
  const r = figma.createFrame(); r.fills = fill(WH); r.strokes = fill(G2); r.cornerRadius = 4; r.resize(w, h); f.appendChild(r); return f;
};
const bars = async (n, w) => { // paragrafi con WF/Text block (3 righe ciascuno)
  const tb = await comp(DATA.lib.textBlock); const f = al('VERTICAL', 8); f.name = 'testo';
  for (let i = 0; i < Math.max(1, Math.ceil(n / 3)); i++) {
    const t = tb.createInstance(); f.appendChild(t); t.resize(w, t.height);
    t.findAll((x) => x.type === 'INSTANCE').forEach((l) => { l.fills = fill(G1); });
  }
  return f;
};
const img = async (w, ratio = '16:9') => {
  const [a, b] = String(ratio).split(':').map(Number); const i = (await comp(DATA.lib.block)).createInstance();
  i.resize(w, Math.round(w * (b || 9) / (a || 16))); i.name = 'img'; return i;
};
const adv = async (pos, dev, w) => {
  try {
    const s = await cset(DATA.adv[dev]); const v = s.children.find((c) => c.name === 'Position=' + pos);
    if (!v) throw new Error('variante ' + pos);
    const i = v.createInstance(); i.name = 'ADV · ' + pos;
    if (i.width > w) out.warnings.push(`ADV ${pos} (${Math.round(i.width)}) più largo dello slot (${Math.round(w)})`);
    return i;
  } catch (e) { out.warnings.push('ADV ' + pos + ': ' + e.message + ', uso box'); return box(Math.min(300, w), 250, 'ADV · ' + pos, true); }
};

// Blocchi: [tipo, a, c, d]. Catalogo in references/spec.md
async function block(b, w, dev, inAside) {
  const [t, a, c, d] = b;
  const ctr = (n) => (inAside || n.width >= w ? n : center(n, w));
  switch (t) {
    case 'h1': return wrapTxt(a, dev === 'm' ? 26 : 36, true, w);
    case 'h2': return wrapTxt(a, dev === 'm' ? 20 : 26, true, w);
    case 'label': return txt(a, 14, true);
    case 'text': return bars(a || 3, w);
    case 'img': return img(w, a);
    case 'avatar': { const e = figma.createEllipse(); e.resize(a || 48, a || 48); e.fills = fill(G1); return e; }
    case 'btn': return btn(a, c || 'primary', dev, w);
    case 'input': return field(a, w);
    case 'textarea': return field(a, w, 120);
    case 'select': { const f = field(a, w); const t = txt('▾', 14); f.children[1].appendChild(t); t.x = w - 24; t.y = 14; return f; }
    case 'check': case 'radio': case 'toggle': {
      const f = al('HORIZONTAL', 12); f.counterAxisAlignItems = 'CENTER';
      const s = figma.createFrame(); s.fills = fill(WH); s.strokes = fill(G2);
      if (t === 'toggle') { s.resize(44, 24); s.cornerRadius = 12; f.appendChild(txt(a, 16)); f.appendChild(s); }
      else { s.resize(20, 20); s.cornerRadius = t === 'radio' ? 10 : 4; f.appendChild(s); f.appendChild(txt(a, 16)); }
      return f;
    }
    case 'tabs': {
      const f = al('HORIZONTAL', 24); f.name = 'tabs';
      (a || []).forEach((l, i) => { const x = al('VERTICAL', 6); x.appendChild(txt(l, 16, i === 0)); if (i === 0) { const r = figma.createRectangle(); r.fills = fill(INK); r.resize(32, 2); x.appendChild(r); } f.appendChild(x); });
      return f;
    }
    case 'chips': {
      const f = al('HORIZONTAL', 8); f.name = 'chips'; f.layoutWrap = 'WRAP'; f.counterAxisSpacing = 8; fixW(f, w);
      (a || []).forEach((l) => { const x = al('HORIZONTAL', 0, 8); x.paddingLeft = x.paddingRight = 12; x.cornerRadius = 16; x.strokes = fill(G2); x.appendChild(txt(l, 14)); f.appendChild(x); });
      return f;
    }
    case 'card': {
      const o = a || {}; const f = al('VERTICAL', 12, 16); f.name = 'card ' + (o.title || ''); f.cornerRadius = 8; f.strokes = fill(G2); f.fills = fill(WH);
      const iw = w - 32;
      if (o.img) f.appendChild(await img(iw, o.img === true ? '16:9' : o.img));
      if (o.title) f.appendChild(wrapTxt(o.title, 18, true, iw));
      if (o.lines) f.appendChild(await bars(o.lines, iw));
      if (o.cta) f.appendChild(btn(o.cta, o.ctaKind || 'secondary', 'm', iw));
      return fixW(f, w);
    }
    case 'list': {
      const o = typeof a === 'object' ? a : { n: a }; const f = al('VERTICAL', 16); f.name = 'lista'; const tw = dev === 'm' ? 96 : 160;
      for (let i = 0; i < (o.n || 3); i++) {
        const r = al('HORIZONTAL', 12); r.counterAxisAlignItems = 'CENTER';
        if (o.avatar) { const e = figma.createEllipse(); e.resize(40, 40); e.fills = fill(G1); r.appendChild(e); } else if (o.img !== false) r.appendChild(await img(tw, '4:3'));
        r.appendChild(await bars(o.lines || 2, Math.max(80, w - (o.img === false ? 0 : (o.avatar ? 52 : tw + 12))))); f.appendChild(r);
        if (o.divider) { const dv = figma.createRectangle(); dv.fills = fill(G2); dv.resize(w, 1); f.appendChild(dv); }
      }
      return f;
    }
    case 'divider': { const r = figma.createRectangle(); r.fills = fill(G2); r.resize(w, 1); return r; }
    case 'space': { const r = figma.createFrame(); r.fills = []; r.resize(w, a || 24); return r; }
    case 'banner': { const f = al('VERTICAL', 8, 16); f.name = 'banner'; f.cornerRadius = 8; f.fills = fill(G1); f.appendChild(wrapTxt(a, 16, true, w - 32)); if (c) f.appendChild(await bars(c, w - 32)); return fixW(f, w); }
    case 'modal': {
      const f = al('VERTICAL', 16, 24); f.name = 'modal'; f.fills = fill(WH); f.strokes = fill(G2); f.cornerRadius = 8;
      if (a) f.appendChild(wrapTxt(a, 20, true, w - 48));
      for (const x of (c || [])) f.appendChild(await block(x, w - 48, dev));
      return fixW(f, w);
    }
    case 'row': {
      const kids = a || []; const cols = dev === 'd' ? (c || kids.length) : 1; const cw = Math.floor((w - 24 * (cols - 1)) / cols);
      const f = al(cols > 1 ? 'HORIZONTAL' : 'VERTICAL', 24); f.name = 'row';
      if (cols > 1) { f.layoutWrap = 'WRAP'; f.counterAxisSpacing = 24; fixW(f, w); }
      for (const x of kids) f.appendChild(await block(x, cw, dev));
      return f;
    }
    case 'section': {
      const f = al('VERTICAL', 16); f.name = 'sezione ' + (a || '');
      if (a) f.appendChild(wrapTxt(a, dev === 'm' ? 20 : 26, true, w));
      for (const x of (c || [])) f.appendChild(await block(x, w, dev));
      return f;
    }
    case 'adv': return ctr(await adv(a, dev, w));
    case 'advbox': return ctr(box(Math.min(c || 300, w), d || 250, 'ADV · ' + a + (c ? ` · ${c}x${d}` : ''), true));
    case 'ed': return box(w, c || 200, a, false);
    case 'sticky': { const f = box(w, a || 1000, `Area sticky ${a || 1000} px`, true); f.fills = []; return f; }
    default: out.warnings.push('blocco sconosciuto: ' + t); return txt('[' + t + ']', 14);
  }
}
const fillSlot = async (slot, blocks, dev, inAside, sname) => {
  const w = slot.width - slot.paddingLeft - slot.paddingRight;
  for (const b of blocks) {
    try { const n = await block(b, w, dev, inAside); slot.appendChild(n); if (!inAside && 'layoutSizingHorizontal' in n && n.type !== 'TEXT' && n.width === w) n.layoutSizingHorizontal = 'FILL'; }
    catch (e) { out.warnings.push(`${sname}: ${b[0]} → ${e.message}`); }
  }
};

const bottom = () => page.children.reduce((m, n) => Math.max(m, n.y + n.height), 0);
let y0 = page.children.length ? bottom() + 200 : 0, x0 = 0, rowKey = null, rowH = 0;
for (const s of DATA.specs) {
  const dev = s.device === 'd' ? 'd' : 'm';
  const key = DATA.lib.tpl[s.tplKey || s.tpl] || DATA.lib.tpl[s.tpl];
  if (!key) { out.warnings.push(`${s.name}: template ${s.tplKey || s.tpl} non disponibile`); continue; }
  const inst = (await comp(key)).createInstance();
  const f = inst.detachInstance(); f.name = s.name;
  f.findAll((n) => n.name === '_placeholder').forEach((n) => n.remove());
  const SL = DATA.lib.slot || { content: 'Contenuto', aside: 'Aside', pre: 'PreFooter' };
  const byName = (a, b) => f.findOne((n) => !n.id.startsWith('I') && (n.name === a || n.name === b));
  const content = byName(SL.content, '_Content'), aside = byName(SL.aside, '_Aside'), pre = byName(SL.pre, '_preFooter');
  for (const sl of [content, aside, pre]) if (sl) { sl.fills = []; if ('layoutSizingVertical' in sl) { try { sl.layoutSizingVertical = 'HUG'; } catch (e) { } } }
  if (aside && (dev !== 'd' || s.aside === false)) { aside.remove(); }
  if (pre && (s.pre === false || !(s.preBlocks && s.preBlocks.length))) { pre.remove(); }
  if (!content) out.warnings.push(`${s.name}: il template ${s.tplKey || s.tpl} non ha lo slot Contenuto, frame lasciato vuoto`);
if (content) {
    content.itemSpacing = 24;
    if (dev === 'm') { content.paddingLeft = content.paddingRight = 16; content.paddingTop = content.paddingBottom = 24; }
    await fillSlot(content, s.content || [], dev, false, s.name);
  }
  if (aside && !aside.removed && s.asideBlocks) {
    aside.children.forEach((n) => n.remove()); aside.counterAxisAlignItems = 'CENTER'; aside.fills = [];
    await fillSlot(aside, s.asideBlocks, dev, true, s.name);
  }
  if (pre && !pre.removed && s.preBlocks) { pre.children.forEach((n) => n.remove()); await fillSlot(pre, s.preBlocks, dev, false, s.name); }
  if (s.top && s.top.length) { // Topleft: sotto l'header, sopra il contenuto
    const wrap = f.findOne((n) => n.name === '_Wrapper'); const parent = wrap.parent;
    const t = al('VERTICAL', 0, 16); t.name = '_Top'; t.counterAxisAlignItems = 'CENTER';
    parent.insertChild(parent.children.indexOf(wrap), t); t.layoutSizingHorizontal = 'FILL';
    for (const b of s.top) t.appendChild(await block(b, parent.width, dev, true));
  }
  const wrap0 = f.findOne((n) => n.name === '_Wrapper'); if (wrap0) wrap0.counterAxisAlignItems = 'MIN';
  if (content && aside && !aside.removed) { // condizione sticky: altezza sx − somma elementi dx ≥ 1000
    const dx = aside.children.reduce((m, n) => m + n.height, 0) + aside.itemSpacing * Math.max(0, aside.children.length - 1);
    const diff = Math.round(content.height - dx);
    if (diff < 1000) out.warnings.push(`${s.name}: sticky colonna dx non attivabile (sx − dx = ${diff} px < 1000)`);
  }
  if (s.ann) { f.setSharedPluginData('dxs', 'req', s.ann); try { f.annotations = [{ label: s.ann }]; } catch (e) { } }
  // v2: upsert anche sui frame annidati nei contenitori "WF · Mobile" / "WF · Desktop" (passo 5b)
  const old = page.findOne((n) => n.type === 'FRAME' && n.name === s.name && n.id !== f.id);
  if (old) {
    const stored = old.getSharedPluginData('dxs', 'fp');
    if (stored && !DATA.force && fp(old) !== stored) { out.protected.push({ name: s.name, id: old.id }); f.remove(); continue; }
    const par = old.parent;
    if (par && par.type !== 'PAGE') { await loadFonts(f); await loadFonts(par); par.insertChild(par.children.indexOf(old), f); }
    else { f.x = old.x; f.y = old.y; }
    old.remove(); out.replaced.push({ name: s.name, id: f.id });
  }
  else {
    const k = s.name.replace(/ · [MD]$/, '');
    if (rowKey !== null && k !== rowKey) { y0 += rowH + 160; x0 = 0; rowH = 0; }
    rowKey = k; f.x = x0; f.y = y0; x0 += f.width + 120; rowH = Math.max(rowH, f.height);
    out.created.push({ name: s.name, id: f.id });
  }
  f.setSharedPluginData('dxs', 'fp', fp(f));
}
return out;
