const P=window.PLATTERS,$=s=>document.querySelector(s),KEYS=['drink','bread','snack1','snack2','main','dip1','dip2','dessert'];
const LAB={drink:'Drink',bread:'Bread',snack1:'Snack 1',snack2:'Snack 2',main:'Main',dip1:'Dip 1',dip2:'Dip 2',dessert:'Dessert'};
const COL={drink:'#e8a317',bread:'#d9a066',snack1:'#c9822b',snack2:'#a85a2a',main:'#c8442b',dip1:'#5f8f3a',dip2:'#b8321f',dessert:'#8a4b7a'};
const SYM=k=>k.startsWith('dip')?'dip':k;
const ld=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}},sv=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}};
let filter='All',q='',favs=new Set(ld('fav',[])),cart=ld('cart',[]),checked=new Set(ld('chk',[])),letter='';
const slug=n=>n.toLowerCase().replace(/[^a-z0-9]+/g,'-'),esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const ico=(k,st='')=>`<svg data-k="${k}" class="${k=='main'?'big':''}" style="color:${COL[k]};${st}"><use href="#${SYM(k)}"/></svg>`;
const POS={drink:[50,14],bread:[82,32],snack1:[84,68],snack2:[50,87],dip1:[16,68],dip2:[18,32],dessert:[66,16]};
function plate(p,l){let h=`<div class="plate ${l?'l':''}">`+ico('main','left:50%;top:50%');
 for(const k in POS)h+=ico(k,`left:${POS[k][0]}%;top:${POS[k][1]}%`);return h+'</div>'}
const num=s=>{s=s.trim();let m=s.match(/^(\d+)\s+(\d+)\/(\d+)/);if(m)return[+m[1]+m[2]/m[3],m[0].length];m=s.match(/^(\d+)\/(\d+)/);if(m)return[m[1]/m[2],m[0].length];m=s.match(/^\d+(\.\d+)?/);return m?[+m[0],m[0].length]:null};
const fmt=x=>{const f=Math.floor(x),r=x-f,fr=[[.25,'1/4'],[.33,'1/3'],[.5,'1/2'],[.67,'2/3'],[.75,'3/4']].find(a=>Math.abs(a[0]-r)<.05);return r<.05?''+f:fr?(f?f+' ':'')+fr[1]:x.toFixed(1)};
const scale=(s,f)=>{if(f==1)return s;const n=num(s);return n?fmt(n[0]*f)+s.slice(n[1]):s};
function route(){const h=decodeURIComponent(location.hash.slice(2));const p=P.find(x=>slug(x.n)==h);p?detail(p):list();window.scrollTo(0,0)}
function list(){
 const t=q.toLowerCase(),r=P.filter(p=>(filter=='All'||p.g==filter||(filter=='★'&&favs.has(p.n)))&&(!letter||p.n[0]==letter)&&(!t||p.n.toLowerCase().includes(t)||Object.values(p.d).some(d=>(d.t+' '+d.i.join(' ')).toLowerCase().includes(t))));
 $('#app').innerHTML=(r.length?`<div class="grid">${r.map(p=>`<article class="pc" data-s="${slug(p.n)}"><button class="fav" data-f="${esc(p.n)}" aria-label="Favourite">${favs.has(p.n)?'♥':'♡'}</button>${plate(p)}<h3>${esc(p.n)}</h3><small>${p.g=='India'?'🇮🇳 India':'🌍 World'} · ${esc(p.d.main.t)}</small></article>`).join('')}</div>`:'<p class="empty">No platters found. Try another dish or ingredient 🌿</p>')}
function detail(p){
 $('#app').innerHTML=`<button class="back" id="bk">← All platters</button><div class="det"><div>${plate(p,1)}<p class="empty" style="padding:8px 0;font-size:13px">Tap a dish on the plate</p></div><div><p class="eyebrow" style="color:var(--red)">${p.g=='India'?'India':'World cuisine'}</p><h2>${esc(p.n)}</h2><div class="acts"><button class="btn" id="ac">🛒 Add to shopping list</button><button class="btn alt" data-f="${esc(p.n)}">${favs.has(p.n)?'♥ Saved':'♡ Save'}</button></div><div class="dl">${KEYS.map(k=>`<button class="dr" data-k="${k}"><svg style="color:${COL[k]}"><use href="#${SYM(k)}"/></svg><div><b>${esc(p.d[k].t)}</b><span>${esc(p.d[k].s)}</span></div><i>${LAB[k]}</i></button>`).join('')}</div></div></div>`;
 $('#bk').onclick=()=>history.back();
 KEYS.forEach(k=>photo(p.d[k].t).then(u=>{const s=u&&document.querySelector(`.dr[data-k=${k}] svg`);if(s)s.outerHTML=`<img class="th" src="${u}" alt="" loading="lazy">`}));
 $('#ac').onclick=()=>{if(!cart.some(c=>c.n==p.n))cart.push({n:p.n,items:KEYS.flatMap(k=>p.d[k].i)});sv('cart',cart);cc();drawer(1)};
 $('#app').onclick=e=>{const k=e.target.closest('[data-k]')?.dataset.k;if(k)recipe(p,k)}}
function recipe(p,k,f=1){const d=p.d[k];
 $('#mc').innerHTML=`<button class="x" id="mx">✕</button><div id="ph">${PH[d.t]?`<img class="hi" src="${PH[d.t]}" alt="">`:''}</div><span class="tag">${LAB[k]} · ${esc(p.n)}</span><h2>${esc(d.t)}</h2><p style="color:var(--mut);margin:4px 0 10px">${esc(d.s)}</p><span class="yl">Makes ${esc(d.y)}</span><div class="sc">Scale: ${[1,2,3,4].map(x=>`<button data-x="${x}" class="${x==f?'on':''}">${x}×</button>`).join('')}</div><h4>Ingredients</h4><ul>${d.i.map(i=>`<li><label><input type="checkbox"><span>${esc(scale(i,f))}</span></label></li>`).join('')}</ul><h4>Method</h4><ol>${d.m.map(s=>`<li><span>${esc(s)}</span></li>`).join('')}</ol>`;
 $('#modal').classList.add('on');if(!(d.t in PH))photo(d.t).then(u=>{const e=u&&$('#ph');if(e)e.innerHTML=`<img class="hi" src="${u}" alt="">`});$('#mx').onclick=close;
 $('#mc').querySelector('.sc').onclick=e=>{const x=e.target.dataset.x;if(x)recipe(p,k,+x)}}
const close=()=>$('#modal').classList.remove('on');
function cc(){$('#cc').textContent=cart.length}
function drawer(on){$('#drawer').classList.toggle('on',!!on);if(on)dl()}
function dl(){$('#dl').innerHTML=cart.length?cart.map((c,ci)=>`<h5>${esc(c.n)} <button class="x" style="position:static;width:24px;height:24px;font-size:11px" data-r="${ci}">✕</button></h5><ul style="list-style:none;padding:0;margin:0">${c.items.map((i,ii)=>{const id=ci+'-'+ii+c.n;return`<li style="padding:3px 0"><label style="display:flex;gap:8px"><input type="checkbox" data-c="${esc(id)}" ${checked.has(id)?'checked':''}><span style="${checked.has(id)?'text-decoration:line-through;opacity:.5':''}">${esc(i)}</span></label></li>`}).join('')}</ul>`).join(''):'<p class="empty">Your list is empty. Open a platter and add it 🛒</p>'}
$('#dl').onclick=e=>{const r=e.target.dataset.r;if(r!=null){cart.splice(+r,1);sv('cart',cart);cc();dl()}};
$('#dl').onchange=e=>{const c=e.target.dataset.c;if(c){e.target.checked?checked.add(c):checked.delete(c);sv('chk',[...checked]);dl()}};
$('#cartBtn').onclick=()=>drawer(1);$('#dx').onclick=()=>drawer(0);
$('#clr').onclick=()=>{cart=[];sv('cart',cart);cc();dl()};
$('#copy').onclick=e=>{navigator.clipboard?.writeText(cart.map(c=>c.n+'\n'+c.items.map(i=>'- '+i).join('\n')).join('\n\n'));e.target.textContent='Copied ✓';setTimeout(()=>e.target.textContent='Copy list',1500)};
$('#modal').onclick=e=>{if(e.target.id=='modal')close()};document.onkeydown=e=>{if(e.key=='Escape'){close();drawer(0)}};
$('#q').oninput=e=>{q=e.target.value;if(location.hash)location.hash='';list()};
$('#rnd').onclick=()=>location.hash='/'+slug(P[Math.random()*P.length|0].n);
$('#chips').innerHTML=['All','India','World','★'].map(c=>`<button class="chip ${c==filter?'on':''}" data-c="${c}">${c=='★'?'♥ Saved':c}</button>`).join('')+'<select id="az" class="chip" aria-label="Letter"><option value="">A–Z</option>'+[...new Set(P.map(p=>p.n[0]))].sort().map(l=>`<option>${l}</option>`).join('')+'</select>';
$('#chips').onclick=e=>{const c=e.target.dataset.c;if(!c)return;filter=c;document.querySelectorAll('.chip.on').forEach(x=>x.classList.remove('on'));e.target.classList.add('on');location.hash?location.hash='':list()};
$('#az').onchange=e=>{letter=e.target.value;location.hash?location.hash='':list()};
$('#app').addEventListener('click',e=>{const f=e.target.closest('[data-f]');if(f){e.stopPropagation();const n=f.dataset.f;favs.has(n)?favs.delete(n):favs.add(n);sv('fav',[...favs]);route();return}const c=e.target.closest('.pc');if(c)location.hash='/'+c.dataset.s},true);
addEventListener('hashchange',route);cc();route();

const dlf=(n,t,m)=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([t],{type:m}));a.download=n;a.click()};
$('#exp').onclick=()=>{const s=P.filter(p=>favs.has(p.n));if(!s.length)return alert('Save some platters first (tap the heart)');
 dlf('my-saved-platters.md',s.map(p=>`# ${p.n}\n\n`+KEYS.map(k=>{const d=p.d[k];return `## ${LAB[k]}: ${d.t}\n_${d.s}_ · Makes ${d.y}\n\n**Ingredients**\n${d.i.map(i=>'- '+i).join('\n')}\n\n**Method**\n${d.m.map((m,i)=>`${i+1}. ${m}`).join('\n')}\n`}).join('\n')).join('\n---\n\n'),'text/markdown')};
$('#bj').onclick=()=>dlf('saved-platters.json',JSON.stringify([...favs]),'application/json');
$('#imp').onclick=()=>$('#fi').click();
$('#fi').onchange=async e=>{try{JSON.parse(await e.target.files[0].text()).forEach(n=>P.some(p=>p.n==n)&&favs.add(n));sv('fav',[...favs]);route()}catch{alert('Could not read that file')}};
