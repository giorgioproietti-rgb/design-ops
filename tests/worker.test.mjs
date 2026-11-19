import { build } from 'esbuild';
import { pathToFileURL } from 'node:url';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
// Servizio delle risposte: si impacchetta come farà Cloudflare e si prova con un modello simulato.
// Richiede worker/kb.json e worker/search.js, che crea "python3 site/build_site.py".
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = resolve(root, 'dist', 'worker.bundle.mjs');
await build({ entryPoints: [resolve(root, 'worker', 'index.js')], bundle: true, format: 'esm', platform: 'neutral', mainFields: ['module', 'main'], outfile: out, logLevel: 'error' });
const worker = (await import(pathToFileURL(out).href)).default;
const ORIGIN = 'https://org.github.io';
let llmCalls = [], aiCalls = [], llmMode = 'ok', fails = 0, ip = 0, teamsCalls = [], teamsMode = 'ok', ghCalls = [], ghMode = 'ok';
globalThis.fetch = async (url, init) => {
  if (String(url).startsWith('https://api.github.com/repos/')) { ghCalls.push({ url: String(url), init }); if (ghMode === 'throw') throw new TypeError('network'); return new Response('{}', { status: ghMode === 'ok' ? 201 : parseInt(ghMode, 10) }); }
  if (String(url).startsWith('https://teams.test/')) { teamsCalls.push({ url: String(url), init }); if (teamsMode === 'throw') throw new TypeError('network'); return new Response('', { status: teamsMode === 'ko' ? 500 : teamsMode === '401' ? 401 : 202 }); }
  llmCalls.push({ url, init });
  if (llmMode === 'ko') return new Response('err', { status: 500 });
  if (String(url).includes('anthropic')) return new Response(JSON.stringify({ content: [{ type: 'text', text: 'Risposta Anthropic [1].' }] }), { status: 200 });
  return new Response(JSON.stringify({ choices: [{ message: { content: 'Risposta OpenAI [1].' } }] }), { status: 200 });
};
let aiMode = 'ok';
const AI = { run: async (model, args) => {
  aiCalls.push({ model, args });
  if (aiMode === 'dead-first' && model === '@cf/a') throw new Error('5007: No such model @cf/a');
  if (aiMode === 'limit') throw new Error('4006: you have used up your daily free allocation of 10,000 neurons');
  if (aiMode === 'allfail') throw new Error('boom');
  return { response: 'Risposta Workers AI [1] (' + model + ').' };
} };
const store = new Map();
globalThis.caches = { default: { match: async k => store.has(k.url) ? new Response(store.get(k.url), { headers: { 'Content-Type': 'application/json' } }) : undefined, put: async (k, r) => { store.set(k.url, await r.text()); } } };

const OPENAI = { ALLOWED_ORIGIN: ORIGIN, LLM_PROVIDER: 'openai', LLM_BASE_URL: 'https://api.groq.com/openai/v1/', LLM_MODEL: 'm', LLM_API_KEY: 'k' };
const WAI = { ALLOWED_ORIGIN: ORIGIN, LLM_MODELS: '@cf/a,@cf/b', AI };
const req = (body, o = {}) => new Request('https://w.dev/', { method: o.method || 'POST', headers: Object.assign({ 'Content-Type': 'application/json', 'CF-Connecting-IP': o.ip || ('10.0.0.' + (++ip)) }, o.origin === null ? {} : { Origin: o.origin || ORIGIN }), body: (o.method === 'OPTIONS' || o.method === 'GET') ? undefined : (typeof body === 'string' ? body : JSON.stringify(body)) });
function check(name, cond, extra) { if (!cond) fails++; console.log((cond ? 'OK  ' : 'KO  ') + name + (extra ? '  ' + extra : '')); }
const Q = 'come installo il plugin?';

console.log('— sicurezza e validazione');
let r = await worker.fetch(req({ q: 'ciao' }), {}); check('senza ALLOWED_ORIGIN → 500', r.status === 500);
r = await worker.fetch(req(null, { method: 'OPTIONS' }), WAI); check('preflight → 204 con CORS', r.status === 204 && r.headers.get('Access-Control-Allow-Origin') === ORIGIN);
r = await worker.fetch(req(null, { method: 'GET' }), WAI); let d = await r.json(); check('GET → stato del servizio, senza chiamare il modello', r.status === 200 && d.ok && d.sections > 100 && aiCalls.length === 0, 'v' + d.version + ', ' + d.sections + ' sezioni');
r = await worker.fetch(req({ q: Q }, { origin: 'https://altro.it' }), WAI); check('origine diversa → 403', r.status === 403);
r = await worker.fetch(req({ q: Q }, { origin: null }), WAI); check('senza origine → 403', r.status === 403);
r = await worker.fetch(req({ q: 'ab' }), WAI); check('domanda troppo corta → 400', r.status === 400);
r = await worker.fetch(req({ q: 'x'.repeat(301) }), WAI); check('domanda troppo lunga → 400', r.status === 400);
r = await worker.fetch(req('non è json'), WAI); check('corpo non valido → 400', r.status === 400);
r = await worker.fetch(req({ q: Q }), { ALLOWED_ORIGIN: ORIGIN, LLM_MODELS: '@cf/a' }); check('senza binding AI → 500', r.status === 500);
r = await worker.fetch(req({ q: Q }), { ALLOWED_ORIGIN: ORIGIN, AI }); check('senza elenco modelli → 500', r.status === 500);

console.log('— Workers AI (gratuito)');
aiCalls = [];
r = await worker.fetch(req({ q: 'ricetta della carbonara' }), WAI); d = await r.json();
check('fuori tema → "Non è documentato", modello NON chiamato', r.status === 200 && /Non è documentato/.test(d.answer) && aiCalls.length === 0 && d.sources.length === 0);
aiCalls = [];
r = await worker.fetch(req({ q: Q }), WAI); d = await r.json();
const sent = aiCalls[0] && aiCalls[0].args;
check('in tema → primo modello, una sola chiamata', r.status === 200 && aiCalls.length === 1 && aiCalls[0].model === '@cf/a');
check('prompt: regole + domanda + 4 sezioni numerate', sent.messages[0].content.includes('ESCLUSIVAMENTE') && sent.messages[1].content.includes('DOMANDA: ' + Q) && /\[4\] /.test(sent.messages[1].content) && !/\[5\] /.test(sent.messages[1].content));
check('limiti: max_tokens e temperatura', sent.max_tokens === 400 && sent.temperature === 0.2);
check('risposta con fonti e id del sito', d.answer.startsWith('Risposta Workers AI') && /^s-\d+$/.test(d.sources[0].id), d.sources[0].title);
const approxTokens = Math.round((sent.messages[0].content.length + sent.messages[1].content.length) / 3.5);
console.log('     (richiesta di circa ' + approxTokens + ' token in ingresso)');
aiCalls = [];
r = await worker.fetch(req({ q: 'plugin installo come?' }), WAI); const hit = r.headers.get('X-Cache');
check('stessa domanda con parole in altro ordine → dalla cache, nessun consumo', hit === 'HIT' && aiCalls.length === 0);
aiCalls = []; aiMode = 'dead-first';
r = await worker.fetch(req({ q: 'cosa fa il comando Avvia' }), WAI); d = await r.json();
check('modello ritirato → passa al successivo', r.status === 200 && aiCalls.map(c => c.model).join() === '@cf/a,@cf/b' && d.answer.includes('@cf/b'));
aiCalls = []; aiMode = 'limit';
r = await worker.fetch(req({ q: 'come funziona la validazione dei wireframe' }), WAI);
check('quota giornaliera finita → 429, senza provare gli altri modelli', r.status === 429 && aiCalls.length === 1);
aiCalls = []; aiMode = 'allfail';
r = await worker.fetch(req({ q: 'come registro un vincolo' }), WAI); const t = await r.text();
check('tutti i modelli falliscono → 502 senza dettagli', r.status === 502 && !t.includes('boom') && aiCalls.length === 2);
aiMode = 'ok'; aiCalls = [];
r = await worker.fetch(req({ q: 'come funzionano le versioni del changelog' }), Object.assign({}, WAI, { MAX_SECTIONS: '2' })); d = await r.json();
check('MAX_SECTIONS regola il contesto', d.sources.length === 2 && !/\[3\] /.test(aiCalls[0].args.messages[1].content));

console.log('— altri fornitori (facoltativi)');
llmCalls = [];
r = await worker.fetch(req({ q: 'come aggiungo gli ADV ai wireframe?' }), OPENAI); d = await r.json();
check('OpenAI-compatibile: URL senza doppia barra e chiave nell\'intestazione', llmCalls[0].url === 'https://api.groq.com/openai/v1/chat/completions' && llmCalls[0].init.headers.Authorization === 'Bearer k' && !llmCalls[0].init.body.includes('"k"') && d.answer.startsWith('Risposta OpenAI'));
llmCalls = [];
r = await worker.fetch(req({ q: 'come registro che ho condiviso un output' }), Object.assign({}, OPENAI, { LLM_PROVIDER: 'anthropic', LLM_BASE_URL: '', LLM_MODEL: 'claude-haiku-5-5' })); d = await r.json();
check('Anthropic: URL, intestazioni e risposta', llmCalls[0].url === 'https://api.anthropic.com/v1/messages' && llmCalls[0].init.headers['x-api-key'] === 'k' && d.answer.startsWith('Risposta Anthropic'));
llmMode = 'ko';
r = await worker.fetch(req({ q: 'quali comandi posso usare' }), OPENAI); check('errore del fornitore → 502', r.status === 502); llmMode = 'ok';


console.log('— feedback su Teams');
const TEAMS = 'https://teams.test/workflows/abc?sig=SEGRETO';
const WFB = Object.assign({}, WAI, { TEAMS_WEBHOOK_URL: TEAMS });
const fb = (body, o = {}) => req(body, Object.assign({}, o));
r = await worker.fetch(req(null, { method: 'GET' }), WAI); d = await r.json(); check('stato: feedback non attivo senza secret', d.feedback === false);
r = await worker.fetch(req(null, { method: 'GET' }), WFB); d = await r.json(); check('stato: feedback attivo con secret, senza mostrarlo', d.feedback === true && !JSON.stringify(d).includes('SEGRETO'));
const post = (body, env, o) => { const u = new Request('https://w.dev/feedback', { method: 'POST', headers: Object.assign({ 'Content-Type': 'application/json', 'CF-Connecting-IP': (o && o.ip) || ('11.0.0.' + (++ip)) }, o && o.origin === null ? {} : { Origin: (o && o.origin) || ORIGIN }), body: typeof body === 'string' ? body : JSON.stringify(body) }); return worker.fetch(u, env); };
r = await post({ messaggio: 'ciao a tutti' }, WAI); check('senza secret → 503', r.status === 503);
teamsCalls = [];
r = await post({ messaggio: 'ciao a tutti' }, WFB, { origin: 'https://altro.it' }); check('origine diversa → 403 e Teams non chiamato', r.status === 403 && teamsCalls.length === 0);
r = await post({ messaggio: 'ciao a tutti' }, WFB, { origin: null }); check('senza origine → 403', r.status === 403);
r = await post({ messaggio: 'ab' }, WFB); check('messaggio troppo corto → 400', r.status === 400);
r = await post('non è json', WFB); check('corpo non valido → 400', r.status === 400);
r = await post({ messaggio: 'x'.repeat(5000) }, WFB); check('corpo enorme → 413', r.status === 413);
teamsCalls = [];
r = await post({ tipo: 'errore', messaggio: 'Il passo 4 non è chiaro [clicca](http://x.it)', contatto: 'Anna', pagina: { titolo: 'Il percorso · Wireframe', id: 's-5', path: '/design-ops/' }, ricerca: 'validazione', versione: '1.0.3', sito: '' }, WFB); d = await r.json();
const card = teamsCalls[0] && JSON.parse(teamsCalls[0].init.body), cont = card && card.attachments[0].content, facts = cont && cont.body[3].facts.map(f => f.title + '=' + f.value);
check('valido → 200 e una sola chiamata a Teams all\'indirizzo del flusso', r.status === 200 && d.ok && teamsCalls.length === 1 && teamsCalls[0].url === TEAMS && teamsCalls[0].init.headers['Content-Type'] === 'application/json');
check('formato della scheda adattiva per Teams', card.type === 'message' && card.attachments[0].contentType === 'application/vnd.microsoft.card.adaptive' && cont.type === 'AdaptiveCard' && cont.version === '1.2' && cont.$schema.includes('adaptivecards.io'));
check('tipo e colore: errore → Attention', cont.body[1].text === 'Errore' && cont.body[1].color === 'Attention');
check('i link nel testo vengono neutralizzati', cont.body[2].text === 'Il passo 4 non è chiaro (clicca)(http://x.it)');
check('dati di contesto nella scheda', facts.includes('Pagina=Il percorso · Wireframe') && facts.includes('Ricerca=validazione') && facts.includes('Contatto=Anna') && facts.includes('Plugin=v1.0.3') && facts.some(f => f.startsWith('Ricevuto=')));
check('pulsante "Apri la pagina" con l\'indirizzo giusto', cont.actions[0].type === 'Action.OpenUrl' && cont.actions[0].url === ORIGIN + '/design-ops/#s-5');
check('la risposta non rivela il secret', !JSON.stringify(d).includes('SEGRETO'));
teamsCalls = [];
r = await post({ tipo: 'inventato', messaggio: 'solo un messaggio', pagina: { id: '<script>', path: 'http://evil' } }, WFB); const c2 = JSON.parse(teamsCalls[0].init.body).attachments[0].content;
check('tipo sconosciuto → Altro; pagina non valida → nessun pulsante', c2.body[1].text === 'Altro' && c2.body[1].color === 'Accent' && !c2.actions);
teamsCalls = [];
r = await post({ messaggio: 'm'.repeat(1500) }, WFB); check('messaggio lungo → tagliato a 1000 caratteri', JSON.parse(teamsCalls[0].init.body).attachments[0].content.body[2].text.length === 1000);
teamsCalls = [];
r = await post({ messaggio: 'sono un programma', sito: 'http://spam.it' }, WFB); d = await r.json(); check('campo trappola riempito → finto successo, Teams NON chiamato', r.status === 200 && d.ok && teamsCalls.length === 0);
teamsMode = 'ko'; r = await post({ messaggio: 'prova con Teams spento' }, WFB); const tt = await r.text(); check('Teams non risponde → 502 senza dettagli né indirizzo', r.status === 502 && !tt.includes('teams.test') && !tt.includes('SEGRETO')); 
teamsMode = '401'; r = await post({ messaggio: 'prova con indirizzo senza firma' }, WFB); const t401 = await r.text(); check('Teams rifiuta (401) → 502 con il codice di Teams, senza indirizzo né secret', r.status === 502 && JSON.parse(t401).teams === 401 && !t401.includes('teams.test') && !t401.includes('SEGRETO'));
teamsMode = 'throw'; r = await post({ messaggio: 'prova con rete assente' }, WFB); check('errore di rete verso Teams → 502 con teams: 0', r.status === 502 && JSON.parse(await r.text()).teams === 0); teamsMode = 'ok';

console.log('— feedback tramite GitHub (archivio privato, poi un flusso lo porta in Teams)');
const GH = { GITHUB_TOKEN: 'ghp_SEGRETO', GITHUB_FEEDBACK_REPO: 'giorgioproietti-rgb/design-ops-feedback' };
const WGH = Object.assign({}, WAI, GH), WBOTH = Object.assign({}, WAI, GH, { TEAMS_WEBHOOK_URL: TEAMS });
r = await worker.fetch(req(null, { method: 'GET' }), WGH); d = await r.json(); check('stato: solo GitHub attivo', d.feedback === true && d.canali.github === true && d.canali.teams === false && !JSON.stringify(d).includes('SEGRETO'));
r = await post({ messaggio: 'ciao a tutti' }, Object.assign({}, WAI, { GITHUB_TOKEN: 'x' })); check('token senza repository → feedback non attivo (503)', r.status === 503);
r = await post({ messaggio: 'ciao a tutti' }, Object.assign({}, WAI, { GITHUB_TOKEN: 'x', GITHUB_FEEDBACK_REPO: '../../etc' })); check('nome del repository non valido → ignorato (503)', r.status === 503);
ghCalls = []; teamsCalls = [];
r = await post({ tipo: 'errore', messaggio: 'Scrivete a anna@example.com e a @mario [clicca](http://x.it) per il passo 4', contatto: 'anna@example.com', pagina: { titolo: 'Il percorso · Wireframe', id: 's-5', path: '/design-ops/' }, ricerca: 'validazione', versione: '1.0.3' }, WGH); d = await r.json();
const gc = ghCalls[0], issue = gc && JSON.parse(gc.init.body);
check('valido → issue creata nel repository dei feedback, Teams non toccato', r.status === 200 && d.ok && d.inviato.join() === 'github' && ghCalls.length === 1 && teamsCalls.length === 0 && gc.url === 'https://api.github.com/repos/giorgioproietti-rgb/design-ops-feedback/issues');
check('intestazioni: token, versione API, User-Agent', gc.init.headers.Authorization === 'Bearer ghp_SEGRETO' && gc.init.headers.Accept === 'application/vnd.github+json' && !!gc.init.headers['User-Agent'] && !gc.init.body.includes('ghp_SEGRETO'));
check('titolo e etichette', issue.title.startsWith('[Errore] Scrivete a anna@') && JSON.stringify(issue.labels) === '["feedback","errore"]');
check('corpo con contesto e link alla pagina', issue.body.includes('**Pagina:** Il percorso · Wireframe — ' + ORIGIN + '/design-ops/#s-5') && issue.body.includes('**Ricerca:** validazione') && issue.body.includes('**Plugin:** v1.0.3'));
check('le menzioni non avvisano nessuno e i link sono neutralizzati', !/@mario/.test(issue.body) && issue.body.includes('@\u200bmario') && issue.body.includes('(clicca)(http://x.it)') && !issue.title.includes('@mario'));
check('la risposta non rivela il token', !JSON.stringify(d).includes('SEGRETO'));
ghCalls = []; teamsCalls = []; teamsMode = 'ko';
r = await post({ messaggio: 'Teams giù, GitHub su' }, WBOTH); d = await r.json();
check('due canali: Teams rifiuta ma GitHub accetta → 200 con il codice dell\'errore', r.status === 200 && d.inviato.join() === 'github' && d.errori.teams === 500 && ghCalls.length === 1 && teamsCalls.length === 1); teamsMode = 'ok';
ghMode = '401'; teamsMode = 'ko';
r = await post({ messaggio: 'tutti e due falliscono' }, WBOTH); d = await r.json();
check('due canali che falliscono → 502 con i due codici, senza segreti', r.status === 502 && d.teams === 500 && d.github === 401 && !JSON.stringify(d).includes('SEGRETO') && !JSON.stringify(d).includes('teams.test'));
teamsMode = 'ok'; ghMode = '422'; r = await post({ messaggio: 'issue disattivate' }, WGH); d = await r.json(); check('GitHub rifiuta (422) → 502 con il codice', r.status === 502 && d.github === 422 && !('teams' in d));
ghMode = 'throw'; r = await post({ messaggio: 'rete assente' }, WGH); d = await r.json(); check('errore di rete verso GitHub → 502 con github: 0', r.status === 502 && d.github === 0); ghMode = 'ok';
ghCalls = []; r = await post({ messaggio: 'sono un programma', sito: 'x' }, WGH); check('campo trappola: nessuna issue', r.status === 200 && ghCalls.length === 0);

let lastFb; for (let i = 0; i < 7; i++) lastFb = await post({ messaggio: 'messaggio ripetuto ' + i }, WFB, { ip: '8.8.8.8' });
check('limite di 5 invii per indirizzo → 429', lastFb.status === 429);
r = await worker.fetch(req({ q: Q }), WAI); check('le domande all\'assistente funzionano ancora sul percorso principale', r.status === 200);

let last; for (let i = 0; i < 22; i++) last = await worker.fetch(req({ q: 'cosa fa Avvia' }, { ip: '9.9.9.9' }), WAI);
check('limite per indirizzo → 429', last.status === 429);
console.log(fails ? '\n' + fails + ' controlli falliti' : '\nTutti i controlli del servizio superati');
process.exit(fails ? 1 : 0);
