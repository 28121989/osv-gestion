/* OSV Gestion : l'application s'ouvre même sans réseau.
   Les pages et fichiers du site sont gardés sur le téléphone ; on demande toujours d'abord la version en ligne,
   et l'on se sert de la copie gardée seulement quand le réseau manque. Les données (serveur Supabase) ne passent jamais par ici. */
const V='osv-gestion-v1';
const BASE=['./','./index.html','./manifest.webmanifest','./icone-192.png','./icone-512.png','./fonts/public-sans.woff','./fonts/public-sans-italic.woff','./fonts/bricolage-grotesque.woff'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(BASE.map(u=>c.add(new Request(u,{cache:'reload'})).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
const delai=(p,ms)=>new Promise((ok,ko)=>{const t=setTimeout(()=>ko(new Error('délai')),ms);p.then(r=>{clearTimeout(t);ok(r)},e=>{clearTimeout(t);ko(e)})});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);if(u.origin!==self.location.origin)return;
 const nav=r.mode==='navigate',cle=nav?'./index.html':r;
 e.respondWith(delai(fetch(r),nav?8000:15000).then(res=>{if(res&&res.ok&&res.type==='basic'){const c=res.clone();caches.open(V).then(x=>x.put(cle,c))}return res})
  .catch(()=>caches.match(cle,{ignoreSearch:true}).then(m=>m||caches.match(r,{ignoreSearch:true})).then(m=>m||new Response('Hors ligne',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}}))))});
