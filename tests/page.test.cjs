// Pagina del sito, simulata in un browser virtuale: home, suggerimenti, risultati, percorso interattivo, feedback verso Teams.
const { JSDOM } = require('jsdom'); const fs = require('fs'); const path = require('path'); const { execFileSync } = require('child_process');
const root = path.resolve(__dirname, '..');
const build = (out, url) => execFileSync('python3', [path.join(root, 'site', 'build_site.py'), '--worker-url', url, '--out', out, '--kb-out', path.join(root, 'dist', 'kb_test.json')], { cwd: root, stdio: 'ignore' });
fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
const WITH = path.join(root, 'dist', 'site_worker.html'), WITHOUT = path.join(root, 'dist', 'site_noworker.html');
build(WITH, 'http://127.0.0.1:8787'); build(WITHOUT, '');
let fails = 0; const check = (n, c, x) => { if (!c) fails++; console.log((c ? 'OK  ' : 'KO  ') + n + (x ? '  ' + x : '')); };
const tick = (ms = 40) => new Promise(r => setTimeout(r, ms));
async function load(file, fetchImpl, claude) {
  const dom = new JSDOM(fs.readFileSync(file, 'utf8'), { runScripts: 'dangerously', pretendToBeVisual: true, url: 'https://org.github.io/repo/', beforeParse(w) { if (fetchImpl) w.fetch = fetchImpl; if (claude) w.claude = claude; w.scrollTo = () => {}; w.HTMLElement.prototype.scrollIntoView = () => {}; } });
  await tick(); return dom;
}
const kbOf = f => JSON.parse(fs.readFileSync(f, 'utf8').match(/id="kb">([\s\S]*?)<\/script>/)[1].replace(/<\\\//g, '</'));
(async () => {
  const DATA = kbOf(WITH), kb = DATA.sections, FAQ = kb.filter(s => s.group === 'Domande frequenti'), PERC = kb.filter(s => s.group === 'Il percorso');
  const inst = kb.find(s => s.title === 'Come installo il plugin?'), upd = kb.find(s => s.title === 'Come si aggiorna il plugin?');
  const calls = [], fbCalls = []; let mode = 'ok', fbStatus = 200;
  const fakeFetch = async (url, init) => {
    const body = JSON.parse(init.body);
    if (String(url).endsWith('/feedback')) { fbCalls.push({ url, body }); return { ok: fbStatus === 200, status: fbStatus, json: async () => ({ ok: fbStatus === 200 }) }; }
    calls.push({ url, body }); if (mode === '429') return { ok: false, status: 429, json: async () => ({}) };
    return { ok: true, status: 200, json: async () => ({ answer: 'Rimuovi le skill singole [1]. Poi carica lo zip [2].', sources: [{ n: 1, id: inst.id, title: inst.title }, { n: 2, id: upd.id, title: upd.title }] }) };
  };
  let dom = await load(WITH, fakeFetch), w = dom.window, d = w.document;
  const $ = s => d.querySelector(s), $$ = s => [...d.querySelectorAll(s)];
  const type = v => { $('#q').value = v; $('#q').dispatchEvent(new w.Event('input', { bubbles: true })); };
  const key = (k, el) => (el || $('#q')).dispatchEvent(new w.KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }));
  const submit = v => { $('#q').value = v; $('#f').dispatchEvent(new w.Event('submit', { cancelable: true, bubbles: true })); };
  const go = async h => { w.location.hash = h; await tick(); };

  console.log('— home');
  check('ogni domanda ha un argomento, ci sono 5 argomenti', FAQ.every(s => s.topic) && DATA.topics.length === 5);
  check('titolo e ricerca al centro', $('.hero h1').textContent === 'Come possiamo aiutarti?' && $('#f').parentNode.id === 'hero-slot');
  check('domande più cercate: 4', $$('.try .chip').length === 4);
  check('argomenti: 5 schede con icone vettoriali, senza emoji', $$('.topics .card').length === 5 && $$('.topics .card svg').length === 5 && !/\p{Extended_Pictographic}/u.test($('.topics').textContent));
  check('invito al percorso interattivo', !!$('.banner') && $('.banner').getAttribute('href') === '#percorso');
  check('home leggera: nessun elenco di domande', $$('details').length === 0 && $$('main li').length === 0);
  check('intestazione con le sezioni principali e il feedback', $$('#hnav a').map(a => a.textContent).join('|') === 'Il percorso|Tutte le domande' && [...d.querySelectorAll('#hnav button')].some(b => b.textContent === 'Feedback'));
  check('versione e data nel piè di pagina, non nell\'intestazione', /v\d+\.\d+\.\d+/.test($('#foot').textContent) && !$('header').textContent.match(/aggiornata il/));
  check('accessibilità: salto al contenuto, combobox, etichetta', !!$('.skip') && $('#q').getAttribute('role') === 'combobox' && !!$('label[for="q"]'));

  console.log('— suggerimenti mentre si scrive');
  type('install'); await tick(150);
  check('suggerimenti e primo corretto', $$('#sug li').length >= 1 && $$('#sug li .t')[0].textContent === 'Come installo il plugin?');
  key('ArrowDown'); key('Enter'); await tick(80);
  check('freccia giù + Invio aprono la pagina', $('h1.t').textContent === 'Come installo il plugin?' && w.location.hash === '#' + inst.id);
  check('briciole e "Vedi anche"', $('.crumbs').textContent.includes('Installazione e aggiornamenti') && $$('.rel a').length >= 1);
  check('in fondo all\'articolo il collegamento per scrivere al team', !!$('.fbline button'));
  d.body.dispatchEvent(new w.KeyboardEvent('keydown', { key: '/', bubbles: true, cancelable: true })); check('"/" porta il cursore nella ricerca', d.activeElement === $('#q'));

  console.log('— risultati: correzioni di qualità');
  submit('come installo il plugin'); await tick();
  check('risposta migliore subito, senza clic', $('.best h2').textContent === 'Come installo il plugin?' && $('.best .prose').textContent.includes('Rimuovi'));
  const bad = $$('mark').filter(m => { const pv = m.previousSibling && m.previousSibling.textContent ? m.previousSibling.textContent.slice(-1) : ''; return /[A-Za-zÀ-ÿ0-9]/.test(pv); });
  check('le parole si evidenziano solo dall\'inizio ("disinstalla" non si spezza)', $$('mark').length > 0 && bad.length === 0, $$('mark').length + ' evidenziazioni');
  const sn = $$('.res').map(a => ({ id: a.getAttribute('href').slice(1), txt: a.querySelector('.sn').textContent.replace(/^… /, '').replace(/ …$/, '') }));
  const midword = sn.filter(x => { const t = byText(x.id), i = t.indexOf(x.txt.slice(0, 18)); return i > 0 && t[i - 1] !== ' '; });
  function byText(id) { return kb.find(s => s.id === id).text.replace(/\s+/g, ' ').trim(); }
  check('le anteprime partono da inizio parola', sn.length > 0 && midword.length === 0);
  check('i risultati fuori dalle domande mostrano il percorso nel titolo ("Guida › …")', $$('.res').filter(a => a.querySelector('.tag').textContent !== 'Domande frequenti').every(a => a.querySelector('b').textContent.startsWith(a.querySelector('.tag').textContent + ' › ')) && $$('.res').some(a => a.querySelector('.tag').textContent !== 'Domande frequenti'));
  submit('dxs-wireframe specifica pagine'); await tick();
  const tb = $('.techbtn');
  check('i dettagli tecnici stanno dietro a un pulsante', !!tb && /^Mostra anche \d+ dettagli? tecnic/.test(tb.textContent) && $$('.res .tag').every(t => t.textContent !== 'Dettaglio tecnico'));
  if (tb) { const n0 = $$('.res').length; tb.click(); check('il pulsante mostra i dettagli tecnici', $$('.res').length > n0 && $$('.res .tag').some(t => t.textContent === 'Dettaglio tecnico') && !$('.techbtn')); }
  submit('input output wireframe'); await tick();
  check('la ricerca trova anche i passi del percorso', [...$$('.best h2'), ...$$('.res b')].some(x => x.textContent.includes('Passo: Wireframe')));

  console.log('— assistente');
  submit('come installo il plugin'); await tick(); $('.ask button').click(); await tick(200);
  check('risposta con fonti cliccabili e avviso', $$('.ai .ans a').length === 2 && $('.ai .src').textContent.includes('generata automaticamente') && calls.length === 1 && calls[0].body.q === 'come installo il plugin');
  check('dopo la risposta: segnala un problema', [...$$('.ai .src button')].some(b => b.textContent.includes('Segnala un problema')));
  mode = '429'; submit('come aggiorno il plugin'); await tick(); $('.ask button').click(); await tick(200);
  check('limite di richieste: messaggio chiaro e "Riprova"', $('.ai .ans').textContent.includes('Troppe richieste') && $('.ask button').textContent === 'Riprova'); mode = 'ok';
  submit('ricetta della carbonara'); await tick();
  check('nessun risultato: spiegazione, domande e segnalazione', $('h1.t').textContent.startsWith('Nessun risultato') && $$('.empty .chip').length === 4 && !$('.ask') && [...$$('.empty button')].some(b => b.textContent.includes('senza risposta')));

  console.log('— percorso interattivo');
  d.getElementById('brand').click(); await tick(); $('.banner').click(); await go('#percorso');
  check('pagina del percorso: titolo, tre aiuti "Se ti perdi", schema', $('h1.t').textContent.startsWith('Il percorso') && $$('.help3 .h').length === 3 && $$('.help3 .h b')[0].textContent.includes('Stato') && !!$('.flow'));
  check('schema completo: partenza, 6 passi, 4 scambi, lavoro sulla UI', $$('.steps > li').length === 12 && $$('.steps .node').length === 12 && $$('.xc').length === 4);
  check('i quattro controlli sono sui passi giusti', $$('.node .ctl').map(c => c.textContent).join('|') === 'Controllo 1|Controllo 2|Controllo 3|Controllo 4');
  check('senza selezione: invito a scegliere un passo', $('.placeholder').textContent.includes('Seleziona un passo'));
  $('[data-id="wireframe"]').click(); await tick();
  check('clic su un passo: indirizzo condivisibile', w.location.hash === '#percorso-wireframe' && $('[data-id="wireframe"]').getAttribute('aria-current') === 'true');
  check('pannello: titolo, input, output, comandi', $('.panel h2').textContent === 'Wireframe' && $$('.panel h3').map(h => h.textContent).join('|').startsWith('Input|Output|Comandi') && $$('.panel .cmd').map(c => c.textContent).includes('Crea WF --ADV'));
  check('pannello: controllo, sessione e "se ti perdi"', $$('.panel h3').some(h => h.textContent.startsWith('Controllo 2')) && $('.panel').textContent.includes('Wireframe pronti') && $('.panel').textContent.includes('Sessione nuova') && $('.panel .lost').textContent.includes('Stato'));
  check('domande correlate con collegamenti validi', $$('.panel .links a').length === 2 && $$('.panel .links a').every(a => kb.some(s => '#' + s.id === a.getAttribute('href'))));
  [...$$('.pnav button')].find(b => b.textContent.includes('Successivo')).click(); await tick();
  check('"Successivo" porta allo scambio, segnato come proposta', w.location.hash === '#percorso-x1' && $('.panel h2').textContent === 'Durante i wireframe' && $('.panel').textContent.includes('Proposta da definire') && $('.panel').textContent.includes('Dal design allo snapshot') && $('.panel').textContent.includes('Dallo snapshot al design'));
  await go('#percorso-validazione');
  check('indirizzo diretto a un passo', $('.panel h2').textContent === 'Validazione' && $$('.panel .cmd').map(c => c.textContent).includes('accetto 1 2 · respingo 3 · rimando 4') && $$('.panel h3').some(h => h.textContent === 'Comandi e risposte'));
  await go('#percorso-lavoro-ui'); check('"Lavoro sulla UI" spiega che è fuori dal percorso', $('.panel').textContent.includes('regole proprie'));
  const wf = PERC.find(s => s.flowId === 'wireframe'); await go('#' + wf.id);
  check('dalla pagina di un passo si torna allo schema', !!$('main a[href="#percorso-wireframe"]'));
  check('percorso dai dati: nessun passo manca', ['partenza', 'avvio', 'ricerca', 'personas', 'wireframe', 'validazione', 'ui', 'lavoro-ui', 'x1', 'x2', 'x3', 'x4'].every(id => DATA.flow.start.id === id || DATA.flow.steps.some(s => s.id === id) || DATA.flow.outside.id === id || DATA.flow.exchanges.some(x => x.id === id)));

  console.log('— feedback verso Teams');
  const openFb = async () => { [...$$('#hnav button')].find(b => b.textContent === 'Feedback').click(); await tick(); };
  await go('#' + inst.id); await openFb();
  check('si apre una finestra con messaggio, tipo e contatto', $('#fb-ov [role="dialog"]').getAttribute('aria-modal') === 'true' && $$('#fb-ov input[type="radio"]').length === 4 && !!$('#fb-msg') && !!$('#fb-con') && d.activeElement === $('#fb-msg'));
  check('campo trappola nascosto alle persone', !!$('#fb-ov input[name="sito"]') && $('#fb-ov input[name="sito"]').getAttribute('aria-hidden') === 'true' && $('#fb-ov input[name="sito"]').tabIndex === -1);
  check('avviso sulla riservatezza e contesto inviato', $('#fb-ov').textContent.includes('Non scrivere dati personali') && $('#fb-ov').textContent.includes('Come installo il plugin?'));
  $('#fb-ov form').dispatchEvent(new w.Event('submit', { cancelable: true, bubbles: true })); await tick();
  check('messaggio vuoto: errore leggibile, nessun invio', $('#fb-ov .msg.err').textContent.includes('almeno 3 caratteri') && fbCalls.length === 0);
  $('#fb-msg').value = 'Manca il comando Handoff nella guida'; $('#fb-con').value = 'Anna'; $$('#fb-ov input[type="radio"]')[1].checked = true;
  $('#fb-ov form').dispatchEvent(new w.Event('submit', { cancelable: true, bubbles: true })); await tick(80);
  const c = fbCalls[0] && fbCalls[0].body;
  check('invio al servizio: indirizzo e campi', fbCalls.length === 1 && fbCalls[0].url === 'http://127.0.0.1:8787/feedback' && c.tipo === 'errore' && c.messaggio === 'Manca il comando Handoff nella guida' && c.contatto === 'Anna' && /^\d+\.\d+\.\d+$/.test(c.versione) && c.sito === '');
  check('il contesto è quello della pagina aperta', c.pagina.id === inst.id && c.pagina.titolo === 'Come installo il plugin?' && c.pagina.path === '/repo/');
  check('conferma all\'utente e pulsante "Chiudi"', $('#fb-ov').textContent.includes('Grazie') && [...$$('#fb-ov button')].some(b => b.textContent === 'Chiudi'));
  [...$$('#fb-ov button')].find(b => b.textContent === 'Chiudi').click(); check('la finestra si chiude', !$('#fb-ov'));
  fbStatus = 429; await openFb(); $('#fb-msg').value = 'Un altro messaggio'; $('#fb-ov form').dispatchEvent(new w.Event('submit', { cancelable: true, bubbles: true })); await tick(80);
  check('troppi invii: messaggio chiaro e finestra ancora aperta', $('#fb-ov .msg.err').textContent.includes('troppi messaggi') && !!$('#fb-msg').value);
  fbStatus = 503; $('#fb-ov form').dispatchEvent(new w.Event('submit', { cancelable: true, bubbles: true })); await tick(80);
  check('feedback non attivo: spiegazione', $('#fb-ov .msg.err').textContent.includes('non è ancora attivo'));
  fbStatus = 200; key('Escape', $('#fb-msg')); check('Esc chiude la finestra e riporta il cursore dove era', !$('#fb-ov'));
  submit('ricetta della carbonara'); await tick(); [...$$('.empty button')].find(b => b.textContent.includes('senza risposta')).click(); await tick();
  check('da "domanda senza risposta" il testo cercato viene allegato', $('#fb-ov').textContent.includes('ricerca “ricetta della carbonara”'));
  key('Escape', $('#fb-msg'));

  console.log('— senza servizio');
  dom = await load(WITHOUT, null, null); w = dom.window; d = w.document;
  submit('come installo il plugin'); await tick();
  check('solo ricerca: risposta migliore presente, nessun assistente né feedback', !!$('.best') && !$('.ask') && ![...$$('button')].some(b => /Feedback|feedback|Scrivi al team/.test(b.textContent)));
  await go('#percorso'); check('il percorso funziona anche senza servizio', $$('.steps > li').length === 12);
  console.log(fails ? '\n' + fails + ' controlli falliti' : '\nPagina: tutti i controlli superati'); process.exit(fails ? 1 : 0);
})().catch(e => { console.error('ERRORE', e); process.exit(2); });
