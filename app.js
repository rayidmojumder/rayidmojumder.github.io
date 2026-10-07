'use strict';
(() => {
  const data = window.PORTFOLIO;
  const $ = id => document.getElementById(id);
  const safe = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeURL = value => { if (/^data:image\/(png|jpeg|webp|gif);base64,/i.test(value || '')) return safe(value); try { const u = new URL(value, location.href); return ['http:', 'https:', 'file:'].includes(u.protocol) ? safe(value) : ''; } catch { return ''; } };
  const external = (url, text, cls = '') => `<a href="${safeURL(url)}" target="_blank" rel="noopener noreferrer"${cls ? ` class="${cls}"` : ''}>${safe(text)}</a>`;
  const defaults = {font:100,theme:'system',background:'default',color:'#ffffff'};
  let preferences = {...defaults};
  try { Object.assign(preferences, JSON.parse(localStorage.getItem('rayid-appearance') || '{}')); } catch { /* Preferences remain usable without storage. */ }
  preferences.font = Math.max(90, Math.min(200, Number(preferences.font) || 100));
  if (!['system','light','dark'].includes(preferences.theme)) preferences.theme='system';
  if (!['default','paper','blue','custom'].includes(preferences.background)) preferences.background='default';
  if (!/^#[0-9a-f]{6}$/i.test(preferences.color)) preferences.color='#ffffff';
  const deviceTheme = matchMedia('(prefers-color-scheme: dark)');
  function applyAppearance() {
    const root = document.documentElement;
    const mode = preferences.theme === 'system' ? (deviceTheme.matches ? 'dark' : 'light') : preferences.theme;
    root.dataset.theme = mode;
    root.style.setProperty('--root-size', `${preferences.font}%`);
    ['--bg','--ink','--muted','--accent','--surface','--line','--panel'].forEach(p => root.style.removeProperty(p));
    const colors={light:{paper:'#f8f5ee',blue:'#eef5fb'},dark:{paper:'#24221e',blue:'#111f32'}};
    if (preferences.background === 'custom') {
      root.style.setProperty('--bg', preferences.color);
      const rgb = preferences.color.slice(1).match(/../g).map(x => parseInt(x,16)/255);
      const linear = rgb.map(x => x <= .04045 ? x/12.92 : ((x+.055)/1.055)**2.4);
      const luminance = linear[0]*.2126+linear[1]*.7152+linear[2]*.0722;
      const dark = luminance <= .179;
      root.style.setProperty('--ink', dark ? '#ffffff' : '#111111');
      root.style.setProperty('--muted', dark ? '#ffffff' : '#222222');
      root.style.setProperty('--accent', dark ? '#ffffff' : '#111111');
      root.style.setProperty('--surface', dark ? '#161616' : '#f6f6f6');
      root.style.setProperty('--panel', dark ? '#161616' : '#ffffff');
      root.style.setProperty('--line', dark ? '#666666' : '#777777');
    } else if (preferences.background !== 'default') root.style.setProperty('--bg', colors[mode][preferences.background]);
    $('font-value').textContent = `${preferences.font}%`;
    $('font-down').disabled=preferences.font<=90; $('font-up').disabled=preferences.font>=200;
    $('theme').value=preferences.theme; $('background').value=preferences.background;
    $('background-color').value=preferences.color;
    $('custom-background-field').hidden=preferences.background!=='custom';
    try { localStorage.setItem('rayid-appearance', JSON.stringify(preferences)); } catch {}
  }
  $('font-down').onclick=()=>{preferences.font=Math.max(90,preferences.font-10);applyAppearance();};
  $('font-up').onclick=()=>{preferences.font=Math.min(200,preferences.font+10);applyAppearance();};
  $('theme').onchange=e=>{preferences.theme=e.target.value;applyAppearance();};
  $('background').onchange=e=>{preferences.background=e.target.value;applyAppearance();};
  $('background-color').oninput=e=>{preferences.color=e.target.value;applyAppearance();};
  $('reset-appearance').onclick=()=>{preferences={...defaults};applyAppearance();};
  deviceTheme.addEventListener('change',applyAppearance);
  document.addEventListener('click',e=>{if (!e.target.closest('.appearance')) document.querySelector('.appearance').open=false;});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelector('.appearance').open=false;});
  applyAppearance();
  if (!data) { $('bio').textContent='Profile content could not be loaded. Please refresh the page.'; return; }
  const p=data.profile;
  document.title=`${p.shortName} | Research`;
  $('name').textContent=p.name; $('role').textContent=p.role; $('affiliation').textContent=p.institution;
  $('portrait').src=p.photo; $('portrait').alt=p.photoAlt; $('location').textContent=p.location;
  $('bio').innerHTML=p.bio.map(text=>`<p>${safe(text)}</p>`).join('');
  $('profile-links').innerHTML=p.links.map(l=>external(l.url,l.label)).join('');
  $('interests').innerHTML=p.interests.map(i=>`<span>${safe(i)}</span>`).join('');
  $('news').innerHTML=data.news.map(n=>`<li><time>${safe(n.date)}</time><p>${safe(n.text)}</p></li>`).join('');
  const scholar=p.links.find(l=>l.label==='Google Scholar');
  if(scholar)$('scholar-link').href=scholar.url;else $('scholar-link').hidden=true;
  $('copyright').textContent=`© ${new Date().getFullYear()} ${p.shortName}`;
  $('updated').textContent=`Updated ${data.updated}`;
  let researchIndex=0, slideIndex=0;
  function renderResearch(focus=false,focusTarget='') {
    const r=data.research[researchIndex],slides=r.slides||[];
    $('research-tabs').innerHTML=data.research.map((area,i)=>`<button id="research-tab-${i}" role="tab" aria-selected="${i===researchIndex}" aria-controls="research-panel" tabindex="${i===researchIndex?0:-1}" data-research-index="${i}">${safe(area.label)}</button>`).join('');
    $('research-panel').setAttribute('aria-labelledby',`research-tab-${researchIndex}`);
    const image=slides[slideIndex];
    const related=(r.publicationIds||[]).map(id=>data.publications.find(pub=>pub.id===id)).filter(Boolean);
    $('research-panel').innerHTML=`<div class="research-copy"><h3>${safe(r.title)}</h3><p>${safe(r.description)}</p><div class="research-tags">${r.tags.map(t=>`<span>${safe(t)}</span>`).join('')}</div>${related.length?`<div class="related"><h4>Related publications</h4>${related.map(pub=>external(pub.url,`${pub.title} (${pub.year})`)).join('')}</div>`:''}</div>${image?`<div id="research-gallery" role="region" aria-label="${safe(r.label)} figure slideshow"><figure class="research-figure"><button type="button" class="figure-frame" id="enlarge-figure" aria-label="Enlarge figure ${slideIndex+1}: ${safe(image.alt)}"><img src="${safeURL(image.src)}" alt="${safe(image.alt)}"><span class="enlarge-label">Enlarge</span></button><figcaption>${safe(image.caption)} ${image.source?external(image.source,'Source'):''}</figcaption></figure><div class="slide-controls"><span class="slide-counter" aria-live="polite">Figure ${slideIndex+1} / ${slides.length}</span><button class="outline-button" id="slide-prev" aria-label="Previous figure in ${safe(r.label)}" ${slides.length<2?'disabled':''}>Previous</button><button class="outline-button" id="slide-next" aria-label="Next figure in ${safe(r.label)}" ${slides.length<2?'disabled':''}>Next</button></div>${slides.length>1?`<div class="slide-thumbnails" aria-label="Select a research figure">${slides.map((slide,i)=>`<button id="figure-thumb-${i}" type="button" data-slide-index="${i}" aria-label="Show figure ${i+1}: ${safe(slide.alt)}" aria-pressed="${i===slideIndex}"><img src="${safeURL(slide.src)}" alt="" loading="lazy"></button>`).join('')}</div>`:''}</div>`:''}`;
    document.querySelectorAll('[data-research-index]').forEach(b=>b.onclick=()=>{researchIndex=Number(b.dataset.researchIndex);slideIndex=0;renderResearch(true);});
    $('research-tabs').onkeydown=e=>{
      if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
      e.preventDefault();researchIndex=e.key==='Home'?0:e.key==='End'?data.research.length-1:(researchIndex+(e.key==='ArrowRight'?1:-1)+data.research.length)%data.research.length;slideIndex=0;renderResearch(true);
    };
    function move(delta){slideIndex=(slideIndex+delta+slides.length)%slides.length;renderResearch(false,delta>0?'slide-next':'slide-prev');}
    if(image){
      $('slide-prev').onclick=()=>move(-1);$('slide-next').onclick=()=>move(1);
      document.querySelectorAll('[data-slide-index]').forEach(b=>b.onclick=()=>{slideIndex=Number(b.dataset.slideIndex);renderResearch(false,`figure-thumb-${slideIndex}`);});
      $('research-gallery').onkeydown=e=>{if(slides.length>1&&['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();move(e.key==='ArrowRight'?1:-1);}};
      $('enlarge-figure').onclick=()=>{$('figure-heading').textContent=r.label;$('enlarged-image').src=image.src;$('enlarged-image').alt=image.alt;$('enlarged-caption').innerHTML=`${safe(image.caption)} ${image.source?external(image.source,'Source'):''}`;$('figure-dialog').showModal();};
    }
    if(focus)$(`research-tab-${researchIndex}`).focus({preventScroll:true});
    else if(focusTarget)$(focusTarget)?.focus({preventScroll:true});
  }
  $('close-figure').onclick=()=>$('figure-dialog').close();
  renderResearch();
  const sorted=[...data.publications].sort((a,b)=>b.year-a.year);
  const normalizeDOI = value => String(value||'').trim().replace(/^https?:\/\/(?:dx\.)?doi\.org\//i,'').replace(/^doi:\s*/i,'').toLowerCase();
  const citationCache = new Map();
  const validRecord = record => record && record.source==='Crossref' && (record.count===null || Number.isInteger(record.count)&&record.count>=0) && Number.isFinite(Date.parse(record.asOf));
  try {const cached=JSON.parse(localStorage.getItem('rayid-crossref-counts-v1')||'{}');Object.entries(cached).forEach(([doi,record])=>{if(validRecord(record))citationCache.set(doi,record);});} catch {}
  sorted.forEach(pub=>{const doi=normalizeDOI(pub.doi),cached=citationCache.get(doi);if(validRecord(pub.citations)&&(!cached||Date.parse(pub.citations.asOf)>Date.parse(cached.asOf)))citationCache.set(doi,pub.citations);});
  function countFor(pub){return citationCache.get(normalizeDOI(pub.doi));}
  function countLabel(pub){const record=countFor(pub);return `Citation (${Number.isInteger(record?.count)?record.count.toLocaleString():'N/A'})`;}
  function countDetails(pub){
    const record=countFor(pub),known=Number.isInteger(record?.count),date=record?.asOf?new Date(record.asOf).toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'}):'';
    return known?`<p>${record.count.toLocaleString()} citation${record.count===1?'':'s'} indexed by Crossref. Updated ${safe(date)}.</p><p>Crossref counts may differ from Google Scholar and other databases.</p>`:`<p>A Crossref citation count is not available for this publication. An unavailable count is not zero.</p>`;
  }
  function updateCitationButtons(){document.querySelectorAll('[data-count]').forEach(button=>{const pub=sorted[Number(button.dataset.count)],record=countFor(pub);button.textContent=countLabel(pub);button.title=Number.isInteger(record?.count)?`Crossref citation count, checked ${record.asOf.slice(0,10)}`:'Crossref citation count unavailable';$(`count-details-${button.dataset.count}`).innerHTML=countDetails(pub);});}
  async function refreshCitationCounts(){
    if(data.citationSettings?.enabled===false||typeof fetch!=='function')return;
    const ttl=Math.max(1,Number(data.citationSettings?.refreshAfterHours)||24)*3600000;
    const pending=sorted.filter(pub=>{const doi=normalizeDOI(pub.doi),record=countFor(pub);return /^10\./.test(doi)&&!doi.startsWith('10.48550/')&&(!record||Date.now()-Date.parse(record.asOf)>ttl);});
    let next=0;
    async function worker(){while(next<pending.length){const pub=pending[next++],doi=normalizeDOI(pub.doi),controller=new AbortController(),timer=setTimeout(()=>controller.abort(),10000);try{
      const response=await fetch(`https://api.crossref.org/works/${encodeURIComponent(doi)}`,{signal:controller.signal,headers:{Accept:'application/json'}});
      if(response.status===429)return;
      if(response.status===404)citationCache.set(doi,{count:null,source:'Crossref',asOf:new Date().toISOString(),doi});
      else if(response.ok){const result=await response.json(),message=result.message,count=message?.['is-referenced-by-count'];if(normalizeDOI(message?.DOI)===doi&&Number.isInteger(count)&&count>=0)citationCache.set(doi,{count,source:'Crossref',asOf:new Date().toISOString(),doi});}
      updateCitationButtons();try{localStorage.setItem('rayid-crossref-counts-v1',JSON.stringify(Object.fromEntries(citationCache)));}catch{}
    }catch{/* Preserve verified saved counts during network failures. */}finally{clearTimeout(timer);}}}
    await Promise.all([worker(),worker()]);
  }
  [...new Set(sorted.map(pub=>pub.year))].forEach(y=>{const o=document.createElement('option');o.value=y;o.textContent=y;$('year-filter').append(o);});
  let filtered=sorted,currentCitation=null;
  function renderPublications(){
    const search=$('search').value.trim().toLowerCase(),year=$('year-filter').value,type=$('type-filter').value;
    filtered=sorted.filter(pub=>(year==='all'||String(pub.year)===year)&&(type==='all'||pub.type===type)&&[pub.title,pub.authors,pub.venue,pub.doi,pub.year].join(' ').toLowerCase().includes(search));
    $('results-count').textContent=`${filtered.length} of ${sorted.length} publications${search||year!=='all'||type!=='all'?' · filtered':''}`;
    $('export-bib').textContent=filtered.length===sorted.length?'Export BibTeX':'Export filtered BibTeX';$('export-bib').disabled=!filtered.length;
    if(!filtered.length){$('publication-list').innerHTML='<p class="empty-results">No matching publications. Try another search or clear the filters.</p>';return;}
    $('publication-list').innerHTML=[...new Set(filtered.map(pub=>pub.year))].map(y=>`<div class="year-group"><h3>${y}</h3><div>${filtered.filter(pub=>pub.year===y).map(pub=>{
      const i=sorted.indexOf(pub),authors=safe(pub.authors).replace(/(?:Md\.? )?Rayid Hasan Mojumder|M\.R\.H\. Mojumder/g,'<mark>$&</mark>');
      const detail=[pub.volume?`vol. ${pub.volume}`:'',pub.number?`no. ${pub.number}`:'',pub.pages?`pp. ${pub.pages}`:''].filter(Boolean).join(', ');
      return `<article class="publication"><h3>${pub.url?external(pub.url,pub.title):safe(pub.title)}</h3><p class="authors">${authors}</p><p class="venue">${safe(pub.venue)}${detail?`, ${safe(detail)}`:''} (${pub.year})<span class="paper-type">${safe(pub.type)}</span></p><div class="paper-actions">${pub.url?external(pub.url,'Paper'):''}<button data-abstract="${i}" aria-expanded="false" aria-controls="abstract-${i}" ${pub.abstract?'':'disabled title="Abstract not supplied"'}>Abstract</button><button data-citation="${i}">BibTeX</button><button data-count="${i}" aria-expanded="false" aria-controls="count-details-${i}" title="Crossref citation count">${safe(countLabel(pub))}</button></div><div class="abstract" id="abstract-${i}" hidden>${safe(pub.abstract)}</div><div class="citation-details" id="count-details-${i}" hidden>${countDetails(pub)}</div></article>`;
    }).join('')}</div></div>`).join('');
  }
  $('publication-list').onclick=e=>{
    const abs=e.target.closest('[data-abstract]'),cite=e.target.closest('[data-citation]'),count=e.target.closest('[data-count]');
    if(abs&&!abs.disabled){const panel=$(`abstract-${abs.dataset.abstract}`);panel.hidden=!panel.hidden;abs.setAttribute('aria-expanded',String(!panel.hidden));}
    if(count){const panel=$(`count-details-${count.dataset.count}`);panel.hidden=!panel.hidden;count.setAttribute('aria-expanded',String(!panel.hidden));}
    if(cite){currentCitation=sorted[Number(cite.dataset.citation)];$('citation-paper').textContent=currentCitation.title;$('citation-text').textContent=currentCitation.bibtex;$('copy-status').textContent='';$('citation-dialog').showModal();}
  };
  ['search','year-filter','type-filter'].forEach(id=>$(id).addEventListener(id==='search'?'input':'change',renderPublications));
  $('clear-filters').onclick=()=>{$('search').value='';$('year-filter').value='all';$('type-filter').value='all';renderPublications();};
  function download(text,filename){const blob=new Blob([text],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  $('export-bib').onclick=()=>download(filtered.map(pub=>pub.bibtex).join('\n\n')+'\n','rayid-publications.bib');
  $('download-citation').onclick=()=>{if(currentCitation)download(currentCitation.bibtex+'\n',`${currentCitation.id.replace(/[^a-z0-9_-]/gi,'_')}.bib`);};
  $('close-citation').onclick=()=>$('citation-dialog').close();
  $('copy-citation').onclick=async()=>{
    if(!currentCitation)return;
    try{if(navigator.clipboard&&window.isSecureContext)await navigator.clipboard.writeText(currentCitation.bibtex);else {const input=document.createElement('textarea');input.value=currentCitation.bibtex;input.style.position='fixed';input.style.opacity='0';$('citation-dialog').append(input);input.focus();input.select();const ok=document.execCommand('copy');input.remove();$('copy-citation').focus();if(!ok)throw Error('Clipboard unavailable');}$('copy-status').textContent='Citation copied.';}
    catch{$('copy-status').textContent='Select the citation above to copy it, or use Download .bib.';}
  };
  renderPublications();
  updateCitationButtons();
  refreshCitationCounts().catch(()=>{});
  if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting)document.querySelectorAll('nav a').forEach(a=>{const active=a.getAttribute('href')===`#${entry.target.id}`;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});});},{rootMargin:'-15% 0px -65% 0px'});['home','research','publications'].forEach(id=>observer.observe($(id)));}
})();
