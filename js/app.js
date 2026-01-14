window.AppData = {
  owner: {
    name: 'Eduardo Lahn',
    handle: '@edulf05',
    photo: 'assets/images/fotoedu.jpeg',
    bio: 'Desenvolvedor front-end focado em performance, acessibilidade e interfaces responsivas. Disponível para projetos e contratações remotas.'
  },
  
  contacts: {
    email: 'seuemail@exemplo.com',
    whatsapp: '+5511999999999',
    instagram: 'https://instagram.com/edulf05',
    youtube: 'https://youtube.com/channel/XXXXX',
    github: 'https://github.com/edulf05'
  }
}
  
const projetos = document.getElementById('projects');

const API_PROJECTS = 'http://localhost:3000/projeto'; // endpoint do backend

function el(tag, cls, inner) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (inner !== undefined) e.innerHTML = inner;
  return e;
}

/* replace per-button handlers with a delegated handler on .nav to keep clicks working after scroll/DOM changes */
(function setupNavDelegation(){
  const topbarSelector = '.topbar';
  const navEl = document.querySelector('.nav');

  function getTopOffset(){
    const topbar = document.querySelector(topbarSelector);
    return topbar ? Math.ceil(topbar.getBoundingClientRect().height) + 12 : 12;
  }

  function scrollToId(targetId){
    const el = document.getElementById(targetId);
    if (!el) return;
    const offset = getTopOffset();
    const rect = el.getBoundingClientRect();
    const scrollTop = window.pageYOffset + rect.top - offset;
    window.scrollTo({ top: scrollTop, behavior: 'smooth' });
    history.replaceState(null, '', '#' + targetId);
  }

  if (!navEl) return;
  // remove existing delegated handler if re-run
  if (navEl.__delegated_nav_handler) navEl.removeEventListener('click', navEl.__delegated_nav_handler);

  const handler = (e) => {
    const btn = e.target.closest('.nav-btn');
    if (!btn || !navEl.contains(btn)) return;
    e.preventDefault();
    const targetId = btn.dataset.target || (btn.getAttribute('href') || '').replace('#','');
    if (!targetId) return;
    // visual update
    Array.from(navEl.querySelectorAll('.nav-btn')).forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    scrollToId(targetId);
  };

  navEl.addEventListener('click', handler, { passive: false });
  navEl.__delegated_nav_handler = handler;
})();

/*
  Scroll-spy: atualiza .nav-btn.active conforme a seção visível.
  Cole esse trecho no final do arquivo (ou mescle com a inicialização existente).
*/
(function setupScrollSpy(){
  const topbar = document.querySelector('.topbar');
  const navBtns = Array.from(document.querySelectorAll('.nav-btn'));
  const sections = Array.from(document.querySelectorAll('section[id]'));

  if (!navBtns.length || !sections.length) return;

  function getTopOffset() {
    if (!topbar) return 12;
    return Math.ceil(topbar.getBoundingClientRect().height) + 8;
  }

  // map id -> nav button (procura por data-target ou href)
  const btnById = {};
  navBtns.forEach(b => {
    const id = b.dataset.target || (b.getAttribute('href') || '').replace('#','');
    if (id) btnById[id] = b;
  });

  function setActive(id) {
    navBtns.forEach(b => b.classList.toggle('active', (btnById[id] === b)));
  }

  // IntersectionObserver que considera o offset do topbar
  let observer;
  function createObserver() {
    if (observer) observer.disconnect();

    const offset = getTopOffset();
    // rootMargin: empurra a "janela" para cima pelo offset, assim a seção é considerada visível quando aparece abaixo do topbar
    const rootMargin = `-${offset}px 0px -40% 0px`; // ajustar -40% se desejar disparar mais cedo/tarde

    observer = new IntersectionObserver((entries) => {
      // escolher a entrada mais visível (maior intersectionRatio) para evitar trocas rápidas
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible) {
        const id = visible.target.id;
        setActive(id);
        // atualiza hash sem causar jump
        history.replaceState(null, '', '#' + id);
      }
    }, { root: null, rootMargin, threshold: [0.25, 0.5, 0.75] });

    sections.forEach(s => observer.observe(s));
  }

  // recriar observer ao redimensionar (pois offset muda)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(createObserver, 150);
  });

  // inicializa após DOM pronto / conteúdo dinâmico
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createObserver);
  } else {
    createObserver();
  }

  // sincroniza ao carregar com hash (se houver)
  if (location.hash) {
    const id = location.hash.replace('#','');
    if (id && btnById[id]) setTimeout(() => setActive(id), 80);
  }
})();

document.querySelectorAll('.nav-btn').forEach(button => {
  button.addEventListener('click', () => {
    const targetId = button.getAttribute('data-target');
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

function normalizeRow(row) {
  const title = row.nome_projeto || row.titulo || row.name || 'Sem título';
  const desc = row.descricao || row.descrip || '';
  const categoria = row.categoria || row.categoria || '';
  const tags = categoria ? [String(categoria).toLowerCase()] : [];

  // thumb: se vier vazio usa padrão relativo a view/home.html
  let thumb = row.thumb || row.imagem || row.foto || '';
  if (thumb && !/^https?:\/\//i.test(thumb)) {
    thumb = String(thumb).trim();
    // se for só nome do arquivo, montar ../assets/images/<nome>
    if (!thumb.startsWith('/') && !thumb.startsWith('assets') && !thumb.startsWith('../')) {
      thumb = '../assets/images/' + thumb;
    } else if (thumb.startsWith('assets')) {
      thumb = '../' + thumb; // assets/... -> ../assets/...
    }
  }
  if (!thumb) thumb = '../assets/images/fotoedu.png';

  return {
    id: row.id_projeto || row.id || '',
    title,
    desc,
    tags,
    thumb,
    data_inicio: row.data_inicio || null,
    data_fim: row.data_fim || null
  };
}

function renderProjects(list) {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;
  grid.innerHTML = '';
  if (!list || list.length === 0) {
    grid.innerHTML = '<p class="muted">Nenhum projeto encontrado.</p>';
    return;
  }
  list.forEach(p => {
    const card = el('article', 'project-card reveal');
    card.innerHTML = `
      <img class="project-thumb" loading="lazy" src="${p.thumb}" alt="${p.title}">
      <h3>${p.title}</h3>
      <p class="muted">${p.desc || ''}</p>
      <div class="project-meta">
        <div class="project-tags">${(p.tags||[]).map(t=>`<span class="tag">${t}</span>`).join('')}</div>
        <div class="project-dates">${p.data_inicio ? p.data_inicio : ''} ${p.data_fim ? '— ' + p.data_fim : ''}</div>
      </div>`;
    grid.appendChild(card);
  });
}

function applyFilter(filter) {
  const all = window.LAST_PROJECTS || [];
  if (filter === 'all') renderProjects(all);
  else renderProjects(all.filter(p => (p.tags || []).includes(filter)));
}

async function fetchProjectsFromApi() {
  try {
    const res = await fetch(API_PROJECTS, { cache: 'no-store' });
    if (!res.ok) throw new Error('Resposta não OK: ' + res.status);
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error('Resposta inesperada do servidor (não é array)');
    const list = data.map(normalizeRow);
    window.LAST_PROJECTS = list;
    renderProjects(list);
  } catch (err) {
    console.error('Erro ao buscar projetos do backend:', err);
    // fallback somente se você quiser - mantém compatibilidade com data.js (opcional)
    if (window.PROJECTS && Array.isArray(window.PROJECTS)) {
      const fallback = window.PROJECTS.map(normalizeRow);
      window.LAST_PROJECTS = fallback;
      renderProjects(fallback);
    } else {
      renderProjects([]);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // buscar projetos do banco
  fetchProjectsFromApi();

  // configurar filtros (usa botões dentro do container #project-filters)
  const filtersContainer = document.getElementById('project-filters');
  if (filtersContainer) {
    const buttons = Array.from(filtersContainer.querySelectorAll('.filter-btn'));
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        applyFilter(filter);
      });
    });
  }

  // opcional: atualizar ano no footer se existir
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  
});