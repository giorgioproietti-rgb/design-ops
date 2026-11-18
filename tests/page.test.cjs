// Pagina del sito, simulata in un browser virtuale: home, suggerimenti, risposta migliore, assistente, argomenti, articoli.
const { JSDOM } = require('jsdom'); const fs = require('fs'); const path = require('path'); const { execFileSync } = require('child_process');
const root = path.resolve(__dirname, '..');
const build = (out, url) => execFileSync('python3', [path.join(root, 'site', 'build_site.py'), '--worker-url', url, '--out', out, '--kb-out', path.join(root, 'dist', 'kb_test.json')], { cwd: root, stdio: 'ignore' });
fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
const WITH = path.join(root, 'dist', 'site_worker.html'), WITHOUT = path.join(root, 'dist', 'site_noworker.html');
build(WITH, 'http://127.0.0.1:8787'); build(WITHOUT, '');
let fails = 0; const check = (n, c, x) => { if (!c) fails++; console.log((c ? 'OK  ' : 'KO  ') + n + (x ? '  ' + x : '')); };
const tick = (ms = 40) => new Promise(r => setTimeout(r, ms));
async function load(file, fetchImpl, claude) {
  const dom = new JSDOM(fs.readFileSync(file, 'utf8'), { runScripts: 'dangerously', pretendToBeVisual: true, url: 'https://org.github.io/repo/', beforeParse(w) { if (fetchImpl) w.fetch = fetchImpl; if (claude) w.claude = claude; w.scrollTo = () => {}; } });
  await tick(); return dom;
}
const kbOf = f => JSON.parse(fs.readFileSync(f, 'utf8').match(/id="kb">([\s\S]*?)<\/script>/)[1].replace(/<\\\//g, '</'));
(async () => {
  const DATA = kbOf(WITH), kb = DATA.sections, FAQ = kb.filter(s => s.group === 'Domande frequenti');
  const inst = kb.find(s => s.title === 'Come installo il plugin?'), upd = kb.find(s => s.title === 'Come si aggiorna il plugin?');
  const calls = []; let mode = 'ok';
  const fakeFetch = async (url, init) => { calls.push({ url, body: JSON.parse(init.body) }); if (mode === '429') return { ok: false, status: 429, json: async () => ({}) }; return { ok: true, status: 200, json: async () => ({ answer: 'Rimuovi le skill singole [1]. Poi carica lo zip [2].', sources: [{ n: 1, id: inst.id, title: inst.title }, { n: 2, id: upd.id, title: upd.title }] }) }; };
  let dom = await load(WITH, fakeFetch), w = dom.window, d = w.document;
  const $ = s => d.querySelector(s), $$ = s => [...d.querySelectorAll(s)];
  const type = v => { $('#q').value = v; $('#q').dispatchEvent(new w.Event('input', { bubbles: true })); };
  const key = (k, el) => (el || $('#q')).dispatchEvent(new w.KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }));
  const submit = v => { $('#q').value = v; $('#f').dispatchEvent(new w.Event('submit', { cancelable: true, bubbles: true })); };

  console.log('— home');
  check('ogni domanda ha un argomento', FAQ.length === 42 && FAQ.every(s => s.topic) && DATA.topics.length === 5);
  check('titolo e ricerca al centro (nell’area principale)', $('.hero h1').textContent === 'Come possiamo aiutarti?' && $('#f').parentNode.id === 'hero-slot');
  check('domande più cercate: 5 pulsanti', $$('.try .chip').length === 5);
  check('argomenti: 5 schede con numero di domande', $$('.topics .card').length === 5 && $$('.topics .card .n')[0].textContent.includes('domande'));
  check('home leggera: nessun elenco di domande', $$('details').length === 0 && $$('main li').length === 0);
  check('altre sezioni raggiungibili da un solo gruppo di link', $$('.more a').map(a => a.textContent).includes('Tutte le domande') && $$('.more a').length === 5);
  check('intestazione: versione e data', /^plugin v\d+\.\d+\.\d+ · aggiornata il /.test($('#badge').textContent));
  check('accessibilità: salto al contenuto, combobox, etichetta', !!$('.skip') && $('#q').getAttribute('role') === 'combobox' && !!$('label[for="q"]'));

  console.log('— suggerimenti mentre si scrive');
  type('install'); await tick(150);
  check('compaiono i suggerimenti, il primo è quello giusto', $$('#sug li').length >= 1 && $$('#sug li .t')[0].textContent === 'Come installo il plugin?' && $('#q').getAttribute('aria-expanded') === 'true');
  check('pulsante "Cancella" visibile durante la digitazione', $('.clr').hidden === false);
  key('ArrowDown'); check('freccia giù seleziona il primo', $('#sug li').getAttribute('aria-selected') === 'true' && $('#q').getAttribute('aria-activedescendant') === 'sg-0');
  key('Enter'); await tick(80);
  check('Invio apre la pagina scelta', $('h1.t').textContent === 'Come installo il plugin?' && w.location.hash === '#' + inst.id);
  check('la ricerca passa nell’intestazione', $('#f').parentNode.id === 'hs');
  check('briciole: Home › argomento › titolo', $$('.crumbs a')[0].textContent === 'Home' && $('.crumbs').textContent.includes('Installazione e aggiornamenti'));
  check('"Vedi anche" con pagine correlate', $$('.rel a').length >= 1 && $$('.rel a').every(a => a.textContent !== 'Come installo il plugin?'));
  type('wire'); await tick(150); key('Escape'); check('Esc chiude i suggerimenti', $('#sug').hidden === true);
  $('.clr').click(); check('"Cancella" svuota la ricerca', $('#q').value === '' && $('.clr').hidden === true);
  d.body.dispatchEvent(new w.KeyboardEvent('keydown', { key: '/', bubbles: true, cancelable: true })); check('"/" porta il cursore nella ricerca', d.activeElement === $('#q'));

  console.log('— risultati');
  submit('come installo il plugin'); await tick();
  check('risposta migliore mostrata subito, senza clic', $('.best h2').textContent === 'Come installo il plugin?' && $('.best .prose').textContent.includes('Rimuovi'));
  check('altri risultati in elenco compatto', $$('.res').length >= 1 && $$('.res .sn').length === $$('.res').length);
  check('pulsante dell’assistente come azione secondaria', !!$('.ask button') && $('.ask button').textContent === 'Chiedi all’assistente' && !!$('.ai[hidden]'));
  check('il numero dei risultati è annunciato', /risultat/.test($('main .sr').textContent));
  $('.ask button').click(); await tick(200);
  check('risposta con fonti cliccabili e avviso', $$('.ai .ans a').length === 2 && $('.ai .src').textContent.includes('generata automaticamente') && calls.length === 1 && calls[0].body.q === 'come installo il plugin');
  mode = '429'; submit('come aggiorno il plugin'); await tick(); $('.ask button').click(); await tick(200);
  check('limite di richieste: messaggio chiaro e "Riprova"', $('.ai .ans').textContent.includes('Troppe richieste') && $('.ask button').textContent === 'Riprova'); mode = 'ok';
  submit('ricetta della carbonara'); await tick();
  check('nessun risultato: spiegazione e domande da cui partire', $('h1.t').textContent.startsWith('Nessun risultato') && $$('.empty .chip').length === 5 && !$('.ask'));
  d.getElementById('brand').click(); await tick();
  check('il titolo riporta alla home', !!$('.hero h1') && $('#f').parentNode.id === 'hero-slot' && $('#q').value === '');

  console.log('— argomenti e sezioni');
  w.location.hash = '#t-per-iniziare'; await tick();
  const nTopic = FAQ.filter(s => s.topic === 'per-iniziare').length;
  check('argomento: titolo, descrizione e domande a fisarmonica', $('h1.t').textContent.includes('Per iniziare') && $$('details').length === nTopic && $('.lead').textContent.includes(nTopic + ' domande'));
  check('la domanda si apre senza cambiare pagina', (() => { const dd = $('details'); dd.open = true; return dd.open && dd.querySelector('.body').textContent.length > 20; })());
  w.location.hash = '#g-rilasci'; await tick();
  check('sezione "Rilasci": elenco di voci', $$('.links a').length >= 1 && $('.crumbs a').textContent === 'Home');
  w.location.hash = '#g-domande-frequenti'; await tick();
  check('"Tutte le domande": raggruppate per argomento', $$('h2.sec').length === 5 && $$('details').length === 42);

  console.log('— senza servizio');
  dom = await load(WITHOUT, null, null); w = dom.window; d = w.document;
  submit('come installo il plugin'); await tick();
  check('solo ricerca: risposta migliore presente, nessun assistente', !!$('.best') && !$('.ask'));
  console.log(fails ? '\n' + fails + ' controlli falliti' : '\nPagina: tutti i controlli superati'); process.exit(fails ? 1 : 0);
})().catch(e => { console.error('ERRORE', e); process.exit(2); });
