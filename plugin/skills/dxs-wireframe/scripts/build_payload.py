#!/usr/bin/env python3
"""Genera i payload per use_figma dai blocchi ```wf di pagine.md.

Uso:
  build_payload.py pagine.md                      # tutte le pagine
  build_payload.py pagine.md WF-01 WF-03          # solo alcune pagine (tutte le varianti)
  build_payload.py pagine.md WF-01:PER-02         # una sola variante
  opzioni: --device m|d   --max N (frame per payload, default 4)
           --adv <dxs-adv-placement>/placements/<testata>.json  solo con il comando utente --ADV.
           Senza --adv: nessun ADV (anche i blocchi adv/advbox scritti a mano vengono tolti, con avviso).
           --force  rigenera anche i frame ritoccati a mano in Figma (altrimenti restano protetti). Solo con ok esplicito.

Stampa su stdout un payload per chiamata, separati da '=== payload N/T (k frame) ==='.
Ogni payload e' codice pronto da passare a use_figma. Nessun file scritto.
"""
import json, re, sys
from pathlib import Path

HERE = Path(__file__).parent
DEV_LABEL = {"m": "M", "d": "D"}


def parse_pages(md):
    pages = []
    for i, raw in enumerate(re.findall(r"```wf\s*\n(.*?)```", md, re.S), 1):
        try:
            pages.append(json.loads(raw))
        except json.JSONDecodeError as e:
            sys.exit(f"ERRORE JSON nel blocco wf n.{i}: {e}")
    return pages


def apply_patch(base, patch):
    """patch: {"set":{"i":block}, "del":[i], "add":[[i, block]]}; i = indice nel base, -1 = in testa."""
    sets = {int(k): v for k, v in (patch.get("set") or {}).items()}
    dels = set(patch.get("del") or [])
    adds = {}
    for i, b in patch.get("add") or []:
        adds.setdefault(int(i), []).append(b)
    out = list(adds.get(-1, []))
    for i, b in enumerate(base):
        if i not in dels:
            out.append(sets.get(i, b))
        out.extend(adds.get(i, []))
    return out


OVR = ("template", "aside", "preFooter", "top", "adv", "taboola", "footer")


def inject_inline(blocks, rules, warn, name):
    """Inserisce gli ADV inline dopo il modulo n° (tutti i blocchi o solo il tipo 'count')."""
    out, n = [], {}
    hits = []
    for r in rules:
        c = r.get("count")
        idx = [i for i, b in enumerate(blocks) if not c or b[0] == c]
        targets = [r["after"]]
        if r.get("every"):
            k = r["after"] + r["every"]
            while k <= len(idx):
                targets.append(k); k += r["every"]
        for t in targets:
            if t <= len(idx):
                hits.append((idx[t - 1], r["block"]))
            else:
                warn.append(f"{name}: ADV {r.get('label', r['block'][1])} dopo il modulo {t} non posizionabile (moduli: {len(idx)})")
    for i, b in enumerate(blocks):
        out.append(b)
        out.extend(blk for j, blk in hits if j == i)
    return out


def frames(page, adv, warn, only_var=None, only_dev=None):
    base = page.get("blocks", [])
    variants = [("base", {})] + list((page.get("varianti") or {}).items())
    for vname, patch in variants:
        if only_var and vname != only_var:
            continue
        o = {k: patch.get(k, page.get(k)) for k in OVR}
        blocks = apply_patch(base, patch) if patch else base
        req = list(dict.fromkeys(page.get("req", []) + patch.get("req", [])))
        per = patch.get("personas") or ([vname.split()[0]] if vname.startswith("PER-") else page.get("personas", []))
        ann = f"{page['id']} · Req: {', '.join(req)}"
        if per:
            ann += f" · Personas: {', '.join(per)}"
        if page.get("nav"):
            ann += f" · Naviga a: {', '.join(page['nav'])}"
        if patch.get("nota"):
            ann += f" · {patch['nota']}"
        tpl = o["template"] or "Default"
        for dev in page.get("devices", ["m", "d"]):
            if only_dev and dev != only_dev:
                continue
            name = f"{page['area']} · {page['nome']} · {vname} · {DEV_LABEL[dev]}"
            key = f"{tpl}/{DEV_LABEL[dev]}"
            r = (adv or {}).get("template", {}).get(key, {}) if o["adv"] is not False else {}
            if adv and o["adv"] is not False and (not r or r.get("mancante")):
                warn.append(f"{name}: regole ADV mancanti per {key}")
                r = {}
            content = inject_inline(blocks, r.get("inline", []), warn, name)
            pre = o["preFooter"] if isinstance(o["preFooter"], list) else r.get("preFooter")
            if pre and o["taboola"] is False:
                pre = [b for b in pre if b[:2] != ["adv", "Taboola"]]
            aside = o["aside"] if isinstance(o["aside"], list) else r.get("aside")
            # variante WF/Page: su desktop il numero di colonne segue l'aside
            tpl_key = key
            if dev == "d":
                if o["aside"] is False and tpl in ("HomePage", "Articolo"):
                    tpl_key = f"{key}/1"
                elif tpl == "Default" and (isinstance(o["aside"], list) or (aside and o["aside"] is not False)):
                    tpl_key = f"{key}/2"
            yield {
                "name": name, "device": dev, "tpl": key, "tplKey": tpl_key, "ann": ann,
                "aside": o["aside"] is not False, "pre": o["preFooter"] is not False,
                "top": o["top"] if isinstance(o["top"], list) else r.get("top", []),
                "content": content, "asideBlocks": aside if dev == "d" else None, "preBlocks": pre,
            }


def minify(js):
    js = re.sub(r"/\*.*?\*/", "", js, flags=re.S)
    lines = []
    for ln in js.splitlines():
        s = ln.strip()
        if not s or s.startswith("//"):
            continue
        s = re.sub(r"\s+//\s.*$", "", s)
        lines.append(s)
    return "\n".join(lines)


def main(argv):
    if not argv:
        sys.exit(__doc__)
    md_path, sel, dev, mx, adv_path, force = Path(argv[0]), [], None, 4, None, False
    it = iter(argv[1:])
    for a in it:
        if a == "--device":
            dev = next(it)
        elif a == "--max":
            mx = int(next(it))
        elif a == "--adv":
            adv_path = next(it)
        elif a == "--force":
            force = True
        else:
            sel.append(a)
    md = md_path.read_text(encoding="utf-8")
    lib = json.loads((HERE.parent / "references" / "wf-library.json").read_text(encoding="utf-8"))
    adv = json.loads(Path(adv_path).read_text(encoding="utf-8")) if adv_path else None
    want = {}
    for s_ in sel:
        pid, _, var = s_.partition(":")
        want.setdefault(pid, set()).add(var or None)
    specs, warn = [], []
    for p in parse_pages(md):
        if want and p["id"] not in want:
            continue
        for v in want.get(p["id"], {None}):
            specs.extend(frames(p, adv, warn, v, dev))
    if not specs:
        sys.exit("Nessun frame selezionato.")
    names = [x["name"] for x in specs]
    dup = {n for n in names if names.count(n) > 1}
    if dup:
        sys.exit(f"ERRORE nomi frame duplicati: {sorted(dup)}")
    if not adv:  # default: wireframe senza ADV
        strip = lambda bl: [b for b in (bl or []) if b[0] not in ("adv", "advbox")] if bl is not None else None
        for x in specs:
            before = sum(1 for k in ("top", "content", "asideBlocks", "preBlocks") for b in (x[k] or []) if b[0] in ("adv", "advbox"))
            for k in ("top", "content", "asideBlocks", "preBlocks"):
                x[k] = strip(x[k])
            if before:
                warn.append(f"{x['name']}: {before} blocchi ADV ignorati (serve --ADV)")
    if adv:
        for x in specs:
            d = x["device"]
            for b in (x["top"] or []) + (x["content"] or []) + (x["asideBlocks"] or []) + (x["preBlocks"] or []):
                if b[0] == "adv" and b[1] not in adv["varianti"][d]:
                    sys.exit(f"ERRORE {x['name']}: ADV '{b[1]}' non esiste in {adv['componenti'][d]['nome']}")
    for w in warn:
        print("AVVISO " + w)
    js = minify((HERE / "render-wf.js").read_text(encoding="utf-8"))
    advk = {k: v["setKey"] for k, v in adv["componenti"].items()} if adv else {}
    chunks = [specs[i:i + mx] for i in range(0, len(specs), mx)]
    for n, ch in enumerate(chunks, 1):
        data = json.dumps({"page": lib["pagina"], "lib": lib, "adv": advk, "specs": ch, **({"force": True} if force else {})}, ensure_ascii=False, separators=(",", ":"))
        print(f"=== payload {n}/{len(chunks)} ({len(ch)} frame) ===")
        print(js.replace("__DATA__", data, 1))


if __name__ == "__main__":
    main(sys.argv[1:])
