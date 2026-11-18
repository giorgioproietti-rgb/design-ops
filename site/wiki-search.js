// Ricerca locale della wiki (BM25 semplificato). Usata dalla pagina e dai test.
(function (root) {
  var STOP = new Set('il lo la i gli le un uno una di a da in con su per tra fra e ed o ma che chi cui come cosa quale quali dove quando perche non si se del dello della dei degli delle al allo alla ai agli alle dal dallo dalla dai dagli dalle nel nello nella nei negli nelle sul sullo sulla sui sugli sulle mi ti ci vi ne sono ho ha posso puo possono devo deve fare fa faccio fanno questo questa questi queste quello quella'.split(/\s+/));
  function norm(s) { return String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }
  function stem(w) {
    if (w.length <= 4) return w;
    w = w.replace(/(mente|zione|zioni|amento|amenti|ando|endo|ano|ono|are|ere|ire|ato|ati|ata|ate)$/, '');
    return w.length > 4 ? w.replace(/[aeiou]$/, '') : w;
  }
  function tokens(s) { return (norm(s).match(/[a-z0-9]+/g) || []).filter(function (w) { return w.length > 1 && !STOP.has(w); }).map(stem); }
  function buildIndex(kb) {
    var docs = kb.map(function (s) {
      var all = tokens(s.title + ' ' + s.title + ' ' + s.title).concat(tokens(s.text));
      var tf = new Map(); all.forEach(function (t) { tf.set(t, (tf.get(t) || 0) + 1); });
      return { s: s, tf: tf, len: all.length, norm: norm(s.title + ' ' + s.text) };
    });
    var df = new Map(); docs.forEach(function (d) { d.tf.forEach(function (_, t) { df.set(t, (df.get(t) || 0) + 1); }); });
    var avg = docs.reduce(function (a, d) { return a + d.len; }, 0) / Math.max(1, docs.length);
    return { docs: docs, df: df, avg: avg, N: docs.length };
  }
  function search(ix, q, limit) {
    var qt = Array.from(new Set(tokens(q))); if (!qt.length) return [];
    var k1 = 1.2, b = 0.75, qn = norm(q).trim(), res = [];
    var core = qt.filter(function (t) { return !/^\d+$/.test(t); }).length, minHit = core >= 3 ? 2 : 1;
    ix.docs.forEach(function (d) {
      var sc = 0, hit = 0;
      qt.forEach(function (t) {
        var f = d.tf.get(t); if (!f) return; hit++;
        var n = ix.df.get(t) || 0, idf = Math.log(1 + (ix.N - n + 0.5) / (n + 0.5));
        sc += idf * f * (k1 + 1) / (f + k1 * (1 - b + b * d.len / ix.avg));
      });
      if (hit < minHit) return;
      sc *= 0.5 + 0.5 * hit / qt.length;
      if (qn.length > 8 && d.norm.indexOf(qn) >= 0) sc *= 1.5;
      sc *= d.s.boost || 1;
      res.push({ s: d.s, score: sc, hit: hit });
    });
    res.sort(function (a, c) { return c.score - a.score; });
    return res.slice(0, limit || 8);
  }
  function firstMatch(text, q) {
    var low = norm(text), pos = -1;
    tokens(q).forEach(function (t) { var i = low.indexOf(t.slice(0, Math.max(3, t.length - 1))); if (i >= 0 && (pos < 0 || i < pos)) pos = i; });
    return pos;
  }
  function excerpt(s, q, n) {
    var t = s.text.replace(/\s+/g, ' ').trim();
    if (t.length <= n) return t;
    var p = firstMatch(t, q), start = p > 60 ? p - 60 : 0;
    return (start ? '… ' : '') + t.slice(start, start + n) + (start + n < t.length ? ' …' : '');
  }
  root.WikiSearch = { norm: norm, tokens: tokens, buildIndex: buildIndex, search: search, excerpt: excerpt, firstMatch: firstMatch };
  if (typeof module !== 'undefined') module.exports = root.WikiSearch;
})(typeof window !== 'undefined' ? window : globalThis);
