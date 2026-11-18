// Controllo di qualità della wiki: ogni domanda tipica deve trovare la sezione attesa nei primi 3 risultati,
// e le domande fuori tema non devono produrre risultati. Uso: node tools/test_wiki.js [wiki/index.html]
const fs = require('fs'), path = require('path');
const file = process.argv[2] || path.join(__dirname, '..', 'wiki', 'index.html');
const html = fs.readFileSync(file, 'utf8');
const kb = JSON.parse(html.match(/<script type="application\/json" id="kb">([\s\S]*?)<\/script>/)[1].replace(/<\\\//g, '</')).sections;
const W = require('./wiki-search.js'), ix = W.buildIndex(kb);
const q = JSON.parse(fs.readFileSync(path.join(__dirname, 'wiki-test-queries.json'), 'utf8'));
const n = s => s.replace(/[’']/g, "'").toLowerCase();
let ko = 0;
q.in_tema.forEach(([query, atteso]) => {
  const r = W.search(ix, query, 3);
  if (!r.some(x => n(x.s.title).includes(n(atteso)))) { ko++; console.log('KO  ' + query + '  → atteso: ' + atteso + ' | trovati: ' + r.map(x => x.s.title.slice(0, 40)).join(' | ')); }
});
q.fuori_tema.forEach(query => { if (W.search(ix, query, 3).length) { ko++; console.log('KO  fuori tema con risultati: ' + query); } });
console.log(ko ? ko + ' controlli falliti' : 'Wiki: ' + (q.in_tema.length + q.fuori_tema.length) + ' controlli superati (' + kb.length + ' sezioni)');
process.exit(ko ? 1 : 0);
