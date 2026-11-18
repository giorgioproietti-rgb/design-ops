#!/usr/bin/env python3
"""Genera il sito (una pagina HTML autonoma) e l'indice per il servizio delle risposte.

Uso:  python3 site/build_site.py [--out dist/site/index.html] [--kb-out worker/kb.json]
                                 [--worker-url URL] [--date AAAA-MM-GG]

Legge: docs/*.md (faq, guida, altri), CHANGELOG.md e plugin/skills/*/ (SKILL.md e references).
La versione viene da plugin/.claude-plugin/plugin.json. Il sito e l'indice del servizio escono
dalla stessa esecuzione, quindi gli identificatori delle sezioni coincidono.
"""
import argparse, datetime, json, re, shutil
from pathlib import Path

import markdown

ROOT = Path(__file__).resolve().parent.parent
MESI = ["gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic"]


def typo(md):
    out = []
    for i, part in enumerate(re.split(r"(```.*?```|`[^`\n]*`)", md, flags=re.S)):
        if i % 2:
            out.append(part); continue
        part = re.sub(r"(?<=\w)'(?=\w)", "’", part)
        part = re.sub(r"\"([^\"\n]+)\"", r"“\1”", part)
        out.append(part)
    return "".join(out)


def plain(md):
    t = re.sub(r"```[a-z]*", " ", md)
    t = re.sub(r"[`*_>|#]", " ", t)
    t = re.sub(r"-{3,}", " ", t)
    t = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", t)
    return re.sub(r"\s+", " ", t).strip()


def frontmatter(text):
    m = re.match(r"^---\n(.*?)\n---\n?", text, re.S)
    if not m:
        return {}, text
    fm = {}
    for line in m.group(1).splitlines():
        k, sep, v = line.partition(":")
        if sep:
            fm[k.strip()] = v.strip().strip('"')
    return fm, text[m.end():]


def split(text, level):
    rx = re.compile(r"^%s (.+)$" % ("#" * level), re.M)
    pos = [(m.start(), m.end(), m.group(1).strip()) for m in rx.finditer(text)]
    if not pos:
        return [(None, text)]
    parts = [(None, text[: pos[0][0]])]
    for i, (s, e, t) in enumerate(pos):
        parts.append((t, text[e: (pos[i + 1][0] if i + 1 < len(pos) else len(text))]))
    return parts


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default=str(ROOT / "dist" / "site" / "index.html"))
    ap.add_argument("--kb-out", default=str(ROOT / "worker" / "kb.json"))
    ap.add_argument("--worker-url", default="")
    ap.add_argument("--date", default=datetime.date.today().isoformat())
    a = ap.parse_args()

    version = json.loads((ROOT / "plugin" / ".claude-plugin" / "plugin.json").read_text(encoding="utf-8"))["version"]
    d = datetime.date.fromisoformat(a.date)
    date_it = "%d %s %d" % (d.day, MESI[d.month - 1], d.year)
    sections = []

    def add(group, title, body_md, boost):
        body_md = typo(body_md.strip())
        if len(plain(body_md)) < 40:
            return
        sections.append({"group": group, "title": typo(title), "html": markdown.markdown(body_md, extensions=["tables", "fenced_code"]),
                         "text": plain(body_md), "boost": boost})

    def doc(path, group, level, boost, intro_title=None):
        p = ROOT / path
        if not p.exists():
            return
        text = p.read_text(encoding="utf-8")
        top = re.match(r"^# (.+)$", text, re.M)
        text = re.sub(r"^# .+\n", "", text, count=1, flags=re.M) if top else text
        for t, body in split(text, level):
            add(group, t or intro_title or (top.group(1) if top else p.stem), body, boost)

    cfg = json.loads((ROOT / "site" / "topics.json").read_text(encoding="utf-8"))
    topic_ids = {t["id"] for t in cfg["topics"]}
    faq = (ROOT / "docs" / "faq.md").read_text(encoding="utf-8")
    for t, body in split(re.sub(r"^# .+\n", "", faq, count=1), 3):
        if t:
            m = re.match(r"\s*<!--\s*argomento:\s*([a-z0-9-]+)\s*-->\s*", body)
            if not m or m.group(1) not in topic_ids:
                raise SystemExit("ERRORE: la domanda %r in docs/faq.md non ha un argomento valido (commento '<!-- argomento: ... -->' sotto il titolo; validi: %s)" % (t, ", ".join(sorted(topic_ids))))
            add("Domande frequenti", t, body[m.end():], 1.3)
            if sections and sections[-1]["title"] == typo(t):
                sections[-1]["topic"] = m.group(1)
    doc("docs/guida.md", "Guida", 2, 1.15, "Panoramica")
    doc("CHANGELOG.md", "Rilasci", 2, 0.9, "Rilasci")
    for f in sorted((ROOT / "docs").glob("*.md")):
        if f.name not in ("faq.md", "guida.md"):
            doc("docs/" + f.name, "Per chi amministra", 2, 0.9)
    skills = ROOT / "plugin" / "skills"
    for sk in sorted(skills.iterdir()):
        sm = sk / "SKILL.md"
        if not sm.exists():
            continue
        fm, body = frontmatter(sm.read_text(encoding="utf-8"))
        if fm.get("description"):
            add("Dettaglio tecnico", "%s · a cosa serve" % sk.name, fm["description"], 0.9)
        for t, b in split(body, 2):
            add("Dettaglio tecnico", "%s · %s" % (sk.name, t or "panoramica"), b, 0.6)
        for ref in sorted((sk / "references").glob("*.md")) if (sk / "references").exists() else []:
            for t, b in split(re.sub(r"^# .+\n", "", ref.read_text(encoding="utf-8"), count=1, flags=re.M), 2):
                add("Dettaglio tecnico", "%s · %s%s" % (sk.name, ref.stem, (" · " + t) if t else ""), b, 0.6)

    for i, s in enumerate(sections, 1):
        s["id"] = "s-%d" % i
    ids_by_title = {s["title"]: s["id"] for s in sections if s["group"] == "Domande frequenti"}
    popular = []
    for ti in cfg["popular"]:
        if typo(ti) not in ids_by_title:
            raise SystemExit("ERRORE: la domanda popolare %r in site/topics.json non esiste in docs/faq.md" % ti)
        popular.append(ids_by_title[typo(ti)])
    topics_out = [{"id": t["id"], "title": typo(t["title"]), "icon": t["icon"], "desc": typo(t["desc"])} for t in cfg["topics"]]

    # pagina
    kb = json.dumps({"sections": sections, "topics": topics_out, "popular": popular}, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")
    meta = json.dumps({"version": version, "date": date_it, "workerUrl": a.worker_url}, ensure_ascii=False)
    tpl = (ROOT / "site" / "wiki-template.html").read_text(encoding="utf-8")
    js = (ROOT / "site" / "wiki-search.js").read_text(encoding="utf-8")
    out = Path(a.out); out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(tpl.replace("/*__SEARCH_JS__*/", js).replace("__KB__", kb).replace("__META__", meta), encoding="utf-8")

    # indice per il servizio delle risposte (senza HTML) e copia del motore di ricerca
    light = [{k: s[k] for k in ("id", "group", "title", "text", "boost")} for s in sections]
    kbo = Path(a.kb_out); kbo.parent.mkdir(parents=True, exist_ok=True)
    kbo.write_text(json.dumps({"version": version, "sections": light}, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    shutil.copy(ROOT / "site" / "wiki-search.js", kbo.parent / "search.js")

    by = {}
    for s in sections:
        by[s["group"]] = by.get(s["group"], 0) + 1
    print("Sito v%s (%s): %d sezioni %s · pagina %d KB · indice %d KB" % (version, date_it, len(sections), by, out.stat().st_size // 1024, kbo.stat().st_size // 1024))


if __name__ == "__main__":
    main()
