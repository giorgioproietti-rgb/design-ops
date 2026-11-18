#!/usr/bin/env python3
"""Handoff deterministico dai file del progetto (zero token di ragionamento).

Uso:
  handoff.py inventario 03_Wireframe/pagine.md
      pagine, varianti, device, "naviga a" ed elementi interattivi (testo esatto) per proporre le azioni
  handoff.py check 03_Wireframe/pagine.md 05_Handoff/handoff.md
      azioni e casi coerenti con i WF; pagine irraggiungibili, vicoli ciechi, punti aperti. Exit 1 se errori
  handoff.py mermaid 03_Wireframe/pagine.md 05_Handoff/handoff.md
      sorgente Mermaid (flowchart) per generate_diagram
  handoff.py payload 03_Wireframe/pagine.md 05_Handoff/handoff.md [--device m|d]
      codice pronto per use_figma (annotation di interazione sugli elementi)
"""
import json, re, sys
from pathlib import Path

HERE = Path(__file__).parent
DEV = {"m": "M", "d": "D"}
INTER = {"btn", "input", "textarea", "select", "check", "radio", "toggle", "tabs", "chips", "card", "banner", "modal"}


def pages(md):
    out = {}
    for raw in re.findall(r"```wf\s*\n(.*?)```", md, re.S):
        p = json.loads(raw)
        out[p["id"]] = p
    return out


def handoff(md):
    m = re.search(r"```handoff\s*\n(.*?)```", md, re.S)
    if not m:
        sys.exit("ERRORE: blocco ```handoff assente")
    return json.loads(m.group(1))


def texts(blocks, inter_only=False, acc=None):
    """Testi visibili dei blocchi (ricorsivo). inter_only: solo elementi interattivi."""
    acc = [] if acc is None else acc
    for b in blocks or []:
        if not isinstance(b, list) or not b:
            continue
        t = b[0]
        if t in ("row",):
            texts(b[1] if len(b) > 1 else [], inter_only, acc); continue
        if t in ("section", "modal"):
            if not inter_only and len(b) > 1 and b[1]:
                acc.append(b[1])
            texts(b[2] if len(b) > 2 else [], inter_only, acc); continue
        if inter_only and t not in INTER:
            continue
        if t == "card" and isinstance(b[1], dict):
            acc += [v for k, v in b[1].items() if k in ("title", "cta") and isinstance(v, str)]
        elif t in ("tabs", "chips"):
            acc += list(b[1] or [])
        elif len(b) > 1 and isinstance(b[1], str):
            acc.append(b[1])
    return acc


def apply_patch(base, patch):
    """Stessa logica di dxs-wireframe: set sostituisce, del rimuove, add inserisce dopo l'indice (-1 in testa)."""
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


def variant_blocks(p, var):
    patch = (p.get("varianti") or {}).get(var) if var != "base" else None
    return apply_patch(p.get("blocks", []), patch) if patch else p.get("blocks", [])


def ref(s):
    pid, _, var = s.partition(":")
    return pid, var or "base"


def fname(p, var, dev):
    return f"{p['area']} · {p['nome']} · {var} · {DEV[dev]}"


def node_id(pid, var):
    return re.sub(r"[^A-Za-z0-9]", "", pid.lower()) + ("" if var == "base" else re.sub(r"[^A-Za-z0-9]", "", var.title()))


def cmd_inventario(pg):
    for pid, p in pg.items():
        vs = ["base"] + list((p.get("varianti") or {}).keys())
        print(f"{pid} {p['nome']} · {p.get('template', 'Default')} · dev {','.join(p.get('devices', ['m', 'd']))} · var {', '.join(vs)}"
              + (f" · naviga a {', '.join(p['nav'])}" if p.get("nav") else ""))
        for v in vs:
            els = list(dict.fromkeys(texts(variant_blocks(p, v), True)))
            if els:
                print(f"  {v}: " + " | ".join(f"«{e}»" for e in els))


def check(pg, ho):
    err, warn = [], []
    edges = {}
    for i, a in enumerate(ho.get("azioni", []), 1):
        tag = f"azione {i} ({a.get('da')} «{a.get('el')}»)"
        p = pg.get(a.get("da"))
        var = a.get("var", "base")
        if not p:
            err.append(f"{tag}: pagina inesistente"); continue
        if var not in ("base", "*") and var not in (p.get("varianti") or {}):
            err.append(f"{tag}: variante {var} inesistente")
        vs = ["base"] + list((p.get("varianti") or {}).keys()) if var == "*" else [var]
        if not any(a.get("el") in texts(variant_blocks(p, v)) for v in vs):
            warn.append(f"{tag}: testo non trovato nei blocchi (header/footer DXS? verifica il testo esatto)")
        tap = a.get("tap", "")
        if tap.startswith("WF-"):
            tid, tvar = ref(tap)
            if tid not in pg:
                err.append(f"{tag}: destinazione {tid} inesistente")
            elif tvar != "base" and tvar not in (pg[tid].get("varianti") or {}):
                err.append(f"{tag}: variante destinazione {tvar} inesistente")
            for v in vs:
                edges.setdefault((a["da"], v), set()).add((tid, tvar))
        elif tap not in ("back", "none") and not tap.startswith("ext:"):
            err.append(f"{tag}: tap '{tap}' non valido (WF-xx[:var] | back | ext:url | none)")
    reach, finals = set(), set()
    for c in ho.get("casi", []):
        steps = [ref(s) for s in c.get("passi", [])]
        if not steps:
            err.append(f"{c.get('id')}: nessun passo"); continue
        for s in steps:
            if s[0] not in pg:
                err.append(f"{c['id']}: passo {s[0]} inesistente")
        for a, b in zip(steps, steps[1:]):
            if b not in edges.get(a, set()):
                err.append(f"{c['id']}: nessuna azione da {a[0]}:{a[1]} a {b[0]}:{b[1]}")
        finals.add(steps[-1])
        stack = [steps[0]]
        while stack:
            n = stack.pop()
            if n in reach:
                continue
            reach.add(n); stack += list(edges.get(n, []))
    for pid, p in pg.items():
        for v in ["base"] + list((p.get("varianti") or {}).keys()):
            if (pid, v) not in reach:
                warn.append(f"{pid}:{v} non raggiungibile da nessun caso")
            elif not edges.get((pid, v)) and (pid, v) not in finals:
                warn.append(f"{pid}:{v} vicolo cieco (nessuna azione in uscita e non è fine di un caso)")
    return err, warn


def cmd_check(pg, ho):
    err, warn = check(pg, ho)
    print(f"Azioni: {len(ho.get('azioni', []))} · Casi: {len(ho.get('casi', []))} · Aperti: {len(ho.get('aperti', []))}")
    for e in err:
        print("ERRORE " + e)
    for w in warn:
        print("AVVISO " + w)
    for o in ho.get("aperti", []):
        print("APERTO " + o)
    if not (err or warn):
        print("OK")
    sys.exit(1 if err else 0)


def q(s):
    return '"' + str(s).replace('"', "'") + '"'


def cmd_mermaid(pg, ho):
    lines, seen = ["flowchart LR"], set()
    used = {(a["da"], a.get("var", "base")) for a in ho.get("azioni", []) if a.get("var") != "*"}
    for a in ho.get("azioni", []):
        if a.get("tap", "").startswith("WF-"):
            used.add(ref(a["tap"]))
    for c in ho.get("casi", []):
        used |= {ref(s) for s in c.get("passi", [])}
    for pid, var in sorted(used):
        if pid in pg:
            lab = f"{pid} {pg[pid]['nome']}" + ("" if var == "base" else f" ({var})")
            lines.append(f"  {node_id(pid, var)}[{q(lab)}]")
    for a in ho.get("azioni", []):
        tap = a.get("tap", "")
        if not tap.startswith("WF-"):
            continue
        vs = ["base"] if a.get("var", "base") == "*" else [a.get("var", "base")]
        for v in vs:
            e = (node_id(a["da"], v), node_id(*ref(tap)), a["el"])
            if e in seen:
                continue
            seen.add(e)
            lines.append(f"  {e[0]} -->|{q(a['el'])}| {e[1]}")
    for c in ho.get("casi", []):
        if c.get("passi"):
            sid = "start" + re.sub(r"[^A-Za-z0-9]", "", c["id"])
            lines.append(f"  {sid}([{q(c['id'] + ' ' + c.get('nome', ''))}]) --> {node_id(*ref(c['passi'][0]))}")
    print("\n".join(lines))


def md_note(a, pg, ho):
    tap = a.get("tap", "")
    if tap.startswith("WF-"):
        tid, tvar = ref(tap)
        dest = f"{tid} {pg[tid]['nome']}" + ("" if tvar == "base" else f" · {tvar}")
    else:
        dest = {"back": "pagina precedente", "none": "nessuna navigazione"}.get(tap, tap.replace("ext:", "link esterno "))
    src = (a["da"], a.get("var", "base"))
    dst = ref(a["tap"]) if a.get("tap", "").startswith("WF-") else None
    casi = [c["id"] for c in ho.get("casi", [])
            if dst and any(x == src and y == dst for x, y in zip(map(ref, c.get("passi", [])), map(ref, c.get("passi", [])[1:])))]
    md = f"**Tap «{a['el']}»** → {dest}"
    if a.get("stato"):
        md += f"\n**Cambia:** {a['stato']}"
    if a.get("fb"):
        md += f"\n**Feedback:** {a['fb']}"
    if a.get("nota"):
        md += f"\n**Nota:** {a['nota']}"
    if casi:
        md += f"\n**Casi:** {', '.join(casi)}"
    return md


def minify(js):
    js = re.sub(r"/\*.*?\*/", "", js, flags=re.S)
    out = []
    for ln in js.splitlines():
        s = ln.strip()
        if not s or s.startswith("//"):
            continue
        out.append(re.sub(r"\s+//\s.*$", "", s))
    return "\n".join(out)


def cmd_payload(pg, ho, args):
    err, _ = check(pg, ho)
    if err:
        sys.exit("ERRORE: risolvi prima gli errori di 'check'")
    only = args[args.index("--device") + 1] if "--device" in args else None
    actions, idx, frames = [], {}, []
    for a in ho.get("azioni", []):
        p = pg[a["da"]]
        vs = ["base"] + list((p.get("varianti") or {}).keys()) if a.get("var") == "*" else [a.get("var", "base")]
        for dev in p.get("devices", ["m", "d"]):
            if only and dev != only:
                continue
            for v in vs:
                s = fname(p, v, dev)
                if s not in frames:
                    frames.append(s)
                k = (s, a["el"])
                if k in idx:  # stesso elemento, esito alternativo: una sola annotation con "Oppure"
                    actions[idx[k]]["md"] += "\n\n**Oppure** " + md_note(a, pg, ho)[2:].replace("**", "", 1)
                    continue
                idx[k] = len(actions)
                actions.append({"src": s, "el": a["el"], "md": md_note(a, pg, ho)})
    data = {"wfPage": "Wireframe", "frames": frames, "actions": actions}
    js = minify((HERE / "render-handoff.js").read_text(encoding="utf-8"))
    print(f"=== payload ({len(frames)} frame, {len(actions)} annotation) ===")
    print(js.replace("__DATA__", json.dumps(data, ensure_ascii=False, separators=(",", ":")), 1))


def main(a):
    if len(a) < 2:
        sys.exit(__doc__)
    pg = pages(Path(a[1]).read_text(encoding="utf-8"))
    if a[0] == "inventario":
        return cmd_inventario(pg)
    ho = handoff(Path(a[2]).read_text(encoding="utf-8"))
    {"check": lambda: cmd_check(pg, ho), "mermaid": lambda: cmd_mermaid(pg, ho),
     "payload": lambda: cmd_payload(pg, ho, a[3:])}[a[0]]()


if __name__ == "__main__":
    main(sys.argv[1:])
