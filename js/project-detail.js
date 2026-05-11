const API_HOST = 'http://localhost:3000';
const API_BASE = API_HOST + '/projeto';

function el(tag, cls, inner){
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (inner !== undefined) e.innerHTML = inner;
  return e;
}

function isVideoUrl(url){ return /\.(mp4|webm|ogg)(\?.*)?$/i.test(url); }
function isImageUrl(url){ return /\.(jpe?g|png|gif|webp|avif)(\?.*)?$/i.test(url); }
function isInstagramReel(url){ return /instagram\.com\/(reel|p)\/([^\/\?]+)/i.test(url); }

function instagramEmbedUrl(url){
  // extrai shortcode e monta URL de embed
  const m = url.match(/instagram\.com\/(reel|p)\/([^\/\?\&]+)/i);
  if (!m) return null;
  return `https://www.instagram.com/${m[1]}/${m[2]}/embed`;
}

function createMediaCarousel(mediaArray = []){
  const wrap = el('div','detail-media');
  wrap.style.display = 'flex';
  wrap.style.flexDirection = 'column';
  wrap.style.gap = '8px';

  if (!mediaArray.length){
    const img = el('img','carousel-media');
    img.src = '../assets/images/fotoedu.png';
    img.alt = 'imagem';
    img.style.width = '100%';
    wrap.appendChild(img);
    return wrap;
  }

  const viewport = el('div','carousel-viewport');
  viewport.style.position = 'relative';
  viewport.style.width = '100%';
  viewport.style.minHeight = '320px';
  viewport.style.background = '#061023';
  viewport.style.borderRadius = '12px';
  viewport.style.overflow = 'hidden';

  const items = mediaArray.map((src, i) => {
    let node;

    if (isInstagramReel(src)) {
      // monta URL de embed limpa (sem querystring)
      const m = src.match(/instagram\.com\/(reel|p)\/([^\/\?\&]+)/i);
      const shortcode = m ? m[2] : null;
      const embedUrl = shortcode ? `https://www.instagram.com/reel/${shortcode}/embed` : null;

      if (embedUrl) {
        // tentar inserir iframe do embed (muitas vezes funciona)
        const iframe = document.createElement('iframe');
        iframe.src = embedUrl;
        iframe.width = '100%';
        iframe.height = '520';
        iframe.style.border = '0';
        iframe.loading = 'lazy';
        iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
        iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
        node = iframe;
      } else {
        // fallback simples como link
        const fallback = el('div','media-link');
        const a = el('a', 'media-open-btn', 'Abrir no Instagram');
        a.href = src;
        a.target = '_blank';
        a.rel = 'noopener';
        fallback.appendChild(a);
        node = fallback;
      }

      // sempre adicione um botão de fallback para caso o embed seja bloqueado
      const fallbackBtn = el('a','media-open-fallback','Abrir no Instagram');
      fallbackBtn.href = src;
      fallbackBtn.target = '_blank';
      fallbackBtn.rel = 'noopener';
      fallbackBtn.style.display = 'inline-block';
      fallbackBtn.style.marginTop = '8px';
      fallbackBtn.style.padding = '8px 12px';
      fallbackBtn.style.background = 'rgba(255,255,255,0.06)';
      fallbackBtn.style.color = '#fff';
      fallbackBtn.style.borderRadius = '8px';

      const container = el('div','instagram-container');
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      container.style.gap = '8px';
      container.appendChild(node);
      container.appendChild(fallbackBtn);
      node = container;

    } else if (isVideoUrl(src)) {
      node = el('video','carousel-media');
      node.src = src;
      node.controls = true;
      node.style.width = '100%';
      node.style.height = '100%';
      node.style.minHeight = '320px';
      node.style.background = '#000';
    } else if (isImageUrl(src)) {
      node = el('img','carousel-media');
      node.src = src;
      node.alt = 'project media';
      node.style.width = '100%';
      node.style.display = 'block';
      node.style.objectFit = 'cover';
      node.style.maxHeight = '520px';
    } else {
      // fallback: clickable preview that opens the link
      const wrapLink = el('div','media-link');
      const btn = el('a','media-open-btn','Abrir mídia');
      btn.href = src;
      btn.target = '_blank';
      btn.rel = 'noopener';
      btn.style.display = 'inline-block';
      btn.style.padding = '10px 14px';
      btn.style.borderRadius = '8px';
      btn.style.background = 'rgba(255,255,255,0.06)';
      btn.style.color = '#fff';
      wrapLink.appendChild(btn);
      node = wrapLink;
    }

    node.dataset.index = i;
    node.style.display = i === 0 ? 'block' : 'none';
    node.style.position = 'relative';
    return node;
  });

  const list = el('div','carousel-list');
  list.style.position = 'relative';
  list.style.width = '100%';
  items.forEach(n => list.appendChild(n));

  if (items.length > 1){
    const prev = el('button','carousel-nav carousel-prev','‹');
    const next = el('button','carousel-nav carousel-next','›');
    prev.onclick = () => rotate(list, -1);
    next.onclick = () => rotate(list, +1);
    prev.style.position = next.style.position = 'absolute';
    prev.style.top = next.style.top = '50%';
    prev.style.transform = next.style.transform = 'translateY(-50%)';
    prev.style.left = '10px';
    next.style.right = '10px';
    viewport.appendChild(prev);
    viewport.appendChild(next);
  }

  viewport.appendChild(list);
  wrap.appendChild(viewport);
  return wrap;
}

function rotate(listEl, direction = 1){
  const items = Array.from(listEl.querySelectorAll('[data-index]'));
  if (!items.length) return;
  const currentIndex = items.findIndex(n => n.style.display !== 'none');
  let nextIndex = (currentIndex + direction + items.length) % items.length;
  // hide current
  const cur = items[currentIndex];
  const nxt = items[nextIndex];
  if (cur && cur.tagName === 'VIDEO') { cur.pause(); cur.currentTime = 0; }
  if (nxt && nxt.tagName === 'VIDEO') { try { nxt.play(); } catch(e){} }
  items.forEach(n => n.style.display = 'none');
  if (nxt) nxt.style.display = 'block';
}

function normalizeMediaField(row){
  let raw = row.media || row.medias || row.imagens || row.thumb || row.imagem || row.foto || '';
  if (!raw) return [];
  let arr = [];
  if (Array.isArray(raw)) arr = raw.slice();
  else if (typeof raw === 'string') {
    raw = raw.trim();
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) arr = parsed;
      else arr = [raw];
    } catch(e){
      arr = raw.includes(',') ? raw.split(',').map(s=>s.trim()).filter(Boolean) : [raw];
    }
  }

  arr = arr.map(m => {
    if (!m) return null;
    if (/^https?:\/\//i.test(m)) return m;
    m = m.replace(/^(\.\/|\.\.\/|src\/)/,'').trim();
    if (!m.startsWith('/') && !m.startsWith('assets')) m = 'assets/images/' + m;
    if (!m.startsWith('/')) m = '/' + m;
    return API_HOST + m;
  }).filter(Boolean);

  return arr;
}

function formatDateForDisplay(d){
  if (!d) return '';
  // assume string YYYY-MM-DD or Date
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return String(d);
  const dd = String(dt.getDate()).padStart(2,'0');
  const mm = String(dt.getMonth()+1).padStart(2,'0');
  const yyyy = dt.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

function renderDetail(project){
  const container = document.getElementById('project-detail');
  if (!container) return;
  container.innerHTML = '';

  // Title big and centered across the top (full width)
  const titleWrap = el('div','detail-title-wrap');
  titleWrap.style.gridColumn = '1 / -1';
  titleWrap.style.textAlign = 'center';
  titleWrap.style.marginBottom = '10px';
  const title = el('h1', 'detail-title', project.nome_projeto || project.titulo || project.title || 'Sem título');
  title.style.fontSize = '2.4rem';
  title.style.margin = '0 0 6px 0';
  title.style.lineHeight = '1.06';
  titleWrap.appendChild(title);

  // media column + meta column
  const media = normalizeMediaField(project);
  const mediaEl = createMediaCarousel(media);

  const meta = el('div','detail-meta');
  meta.style.padding = '6px 12px';
  meta.style.display = 'flex';
  meta.style.flexDirection = 'column';
  meta.style.gap = '10px';

  const creator = el('p','project-creator','<strong>Criador:</strong> ' + (project.criador || '—'));
  const category = el('p','project-category','<strong>Categoria:</strong> ' + (project.categoria || '—'));
  const dates = el('p','project-dates','<strong>Período:</strong> ' + (formatDateForDisplay(project.data_inicio) || '—') + (project.data_fim ? (' — ' + formatDateForDisplay(project.data_fim)) : ''));
  creator.style.margin = category.style.margin = dates.style.margin = '0';
  creator.style.fontSize = category.style.fontSize = dates.style.fontSize = '0.95rem';

  meta.appendChild(creator);
  meta.appendChild(category);
  meta.appendChild(dates);

  // assemble into grid: left media, right meta. keep same structure as projects.html CSS expects
  container.appendChild(titleWrap);

  const left = el('div','detail-media-col');
  left.appendChild(mediaEl);
  left.style.minHeight = '160px';

  const right = el('div','detail-meta-col');
  right.appendChild(meta);

  container.appendChild(left);
  container.appendChild(right);

  // full-width description below
  const descWrap = el('div','detail-desc');
  descWrap.style.gridColumn = '1 / -1';
  descWrap.style.marginTop = '18px';
  const descTitle = el('h2', null, 'Descrição');
  descTitle.style.fontSize = '1.1rem';
  descTitle.style.margin = '0 0 8px 0';
  const desc = el('p','muted', project.descricao || project.desc || '');
  desc.style.whiteSpace = 'pre-wrap';
  descWrap.appendChild(descTitle);
  descWrap.appendChild(desc);

  container.appendChild(descWrap);
}

function getIdFromUrl(){
  const q = new URLSearchParams(location.search);
  return q.get('id') || null;
}

document.addEventListener('DOMContentLoaded', async () => {
  const id = getIdFromUrl();
  if (!id) {
    document.getElementById('project-detail').innerHTML = '<p class="muted">Projeto não especificado.</p>';
    return;
  }
  try {
    const res = await fetch(API_BASE + '/' + encodeURIComponent(id));
    if (!res.ok) throw new Error('Resposta ' + res.status);
    const data = await res.json();
    renderDetail(data);
  } catch (err) {
    console.error('Erro ao carregar projeto:', err);
    document.getElementById('project-detail').innerHTML = '<p class="muted">Erro ao carregar projeto.</p>';
  }
});