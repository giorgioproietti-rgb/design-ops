// Pagina del sito: simulata in un browser virtuale (ricerca, pulsante delle risposte, fonti, limiti, modalità senza servizio).
const { JSDOM } = require('jsdom'); const fs = require('fs'); const path = require('path'); const { execFileSync } = require('child_process');
const root = path.resolve(__dirname, '..');
const build = (out, url) => execFileSync('python3', [path.join(root, 'site', 'build_site.py'), '--worker-url', url, '--out', out, '--kb-out', path.join(root, 'dist', 'kb_test.json')], { cwd: root, stdio: 'ignore' });
fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
const WITH = path.join(root, 'dist', 'site_worker.html'), WITHOUT = path.join(root, 'dist', 'site_noworker.html');
build(WITH, 'http://127.0.0.1:8787'); build(WITHOUT, '');
let fails = 0; const check = (n, c, x) => { if (!c) fails++; console.log((c ? 'OK  ' : 'KO  ') + n + (x ? '  ' + x : '')); };
const tick = (ms = 60) => new Promise(r => setTimeout(r, ms));
async function load(file, fetchImpl, claude) {
  const html = fs.readFileSync(file, 'utf8');
  const dom = new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, url: 'https://org.github.io/repo/', beforeParse(w) { if (fetchImpl) w.fetch = fetchImpl; if (claude) w.claude = claude; w.scrollTo = () => {}; } });
  await tick(); return dom;
}
const kbOf = f => JSON.parse(fs.readFileSync(f, 'utf8').match(/id="kb">([\s\S]*?)<\/script>/)[1].replace(/<\\\//g, '</')).sections;
(async () => {
  const F = WITH, kb = kbOf(F);
  const inst = kb.find(s => s.title === 'Come installo il plugin?'), upd = kb.find(s => s.title === 'Come si aggiorna il plugin?');
  const calls = []; let mode = 'ok';
  const fakeFetch = async (url, init) => { calls.push({ url, body: JSON.parse(init.body) }); if (mode === '429') return { ok: false, status: 429, json: async () => ({}) }; return { ok: true, status: 200, json: async () => ({ answer: 'Rimuovi le skill singole [1]. Poi carica lo zip [2].', sources: [{ n: 1, id: inst.id, title: inst.title }, { n: 2, id: upd.id, title: upd.title }] }) }; };
  let dom = await load(F, fakeFetch), d = dom.window.document;
  check('home: titolo, tutte le domande frequenti, gruppi', d.querySelector('h1').textContent.includes('Come funziona') && d.querySelectorAll('details[id^="d-"]').length === kb.filter(x => x.group === 'Domande frequenti').length, d.querySelectorAll('details').length + ' blocchi');
  check('intestazione: versione e data', /^plugin v\d+\.\d+\.\d+ · aggiornata il /.test(d.getElementById('badge').textContent), d.getElementById('badge').textContent);
  const submit = q => { d.getElementById('q').value = q; d.getElementById('f').dispatchEvent(new dom.window.Event('submit', { cancelable: true, bubbles: true })); };
  submit('come installo il plugin'); await tick();
  check('ricerca: risultati e prima scheda corretta', d.querySelector('h1').textContent.startsWith('Risultati per') && d.querySelector('.card b').textContent === 'Come installo il plugin?');
  const btn = [...d.querySelectorAll('button.p')].find(b => b.textContent.includes('assistente'));
  check('pulsante "Chiedi all’assistente" presente con il servizio configurato', !!btn);
  btn.click(); await tick(200);
  const ans = d.querySelector('.ans');
  check('risposta mostrata con due fonti cliccabili', ans.textContent.includes('Rimuovi le skill singole') && ans.querySelectorAll('a').length === 2 && ans.querySelector('a').getAttribute('href') === '#' + inst.id);
  check('chiamata al servizio: indirizzo e corpo', calls.length === 1 && calls[0].url === 'http://127.0.0.1:8787' && calls[0].body.q === 'come installo il plugin');
  check('avviso "generata automaticamente" e fonti', d.querySelector('.src').textContent.includes('generata automaticamente') && d.querySelectorAll('.src a').length === 2);
  d.querySelector('.ans a').dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true, cancelable: true })); dom.window.location.hash = '#' + inst.id; await tick();
  check('apertura della fonte: articolo con la risposta', d.querySelector('h1').textContent === 'Come installo il plugin?' && d.querySelector('.back').textContent.includes('risultati'));
  // limite di richieste
  mode = '429'; dom = await load(F, fakeFetch); d = dom.window.document;
  d.getElementById('q').value = 'come installo il plugin'; d.getElementById('f').dispatchEvent(new dom.window.Event('submit', { cancelable: true, bubbles: true })); await tick();
  [...d.querySelectorAll('button.p')].find(b => b.textContent.includes('assistente')).click(); await tick(200);
  check('429 → messaggio "Troppe richieste" e pulsante "Riprova"', d.querySelector('.ans').textContent.includes('Troppe richieste') && [...d.querySelectorAll('button.p')].some(b => b.textContent === 'Riprova'));
  // fuori tema
  d.getElementById('q').value = 'ricetta della carbonara'; d.getElementById('f').dispatchEvent(new dom.window.Event('submit', { cancelable: true, bubbles: true })); await tick();
  check('fuori tema: "Nessun risultato", nessun pulsante di risposta', d.querySelector('main').textContent.includes('Nessun risultato') && ![...d.querySelectorAll('button.p')].some(b => b.textContent.includes('assistente')));
  // senza servizio e senza Claude
  dom = await load(WITHOUT, null, null); d = dom.window.document;
  d.getElementById('q').value = 'come installo il plugin'; d.getElementById('f').dispatchEvent(new dom.window.Event('submit', { cancelable: true, bubbles: true })); await tick();
  check('senza servizio: solo ricerca, nessun pulsante', d.querySelector('.card b').textContent === 'Come installo il plugin?' && !d.querySelector('.ai'));
  console.log(fails ? '\n' + fails + ' controlli falliti' : '\nPagina: tutti i controlli superati'); process.exit(fails ? 1 : 0);
})().catch(e => { console.error('ERRORE', e); process.exit(2); });
