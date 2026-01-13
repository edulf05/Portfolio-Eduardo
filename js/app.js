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
const API_HOST = 'http://localhost:3000';
const API_PROJECTS = API_HOST + '/projeto'; // ajuste se backend usa outra porta/host

function el(tag, cls, inner) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (inner !== undefined) e.innerHTML = inner;
  return e;
}

function normalizeRow(row) {
  let thumb = row.thumb || row.imagem || row.foto || '';

  // se já for URL absoluta
  if (/^https?:\/\//i.test(thumb)) {
    // ok
  } else {
    thumb = String(thumb || '').trim();
    if (!thumb) {
      thumb = '/assets/images/fotoedu.png';
    } else {
      thumb = thumb.replace(/^(\.\/|\.\.\/|src\/)/, '');
      if (!/^assets\//.test(thumb)) {
        thumb = 'assets/images/' + thumb;
      }
      if (!thumb.startsWith('/')) thumb = '/' + thumb;
    }
    thumb = API_HOST + thumb;
  }

  return {
    id: row.id_projeto || row.id || '',
    // usa nome_projeto do seu schema
    title: row.nome_projeto || row.titulo || row.title || 'Sem título',
    desc: row.descricao || row.desc || '',
    thumb,
    tags: row.categoria ? [String(row.categoria).toLowerCase()] : []
  };
}

function renderProjects(list) {
  const projectsGrid = document.getElementById('projects-grid');
  if (!projectsGrid) return;
  projectsGrid.innerHTML = '';
  list.forEach(p => {
    const card = el('article', 'project-card reveal');
    card.innerHTML = `
      <img class="project-thumb" loading="lazy" src="${p.thumb}" alt="${p.title}">
      <h3>${p.title}</h3>
      <p class="muted">${p.desc || ''}</p>
      <div class="project-meta">
        <div class="project-tags">${(p.tags||[]).map(t=>`<span class="tag">${t}</span>`).join('')}</div>
      </div>`;
    projectsGrid.appendChild(card);
  });
}

async function fetchProjectsFromApi() {
  try {
    const res = await fetch(API_PROJECTS, { cache: 'no-store' });
    if (!res.ok) throw new Error('Resposta não OK: ' + res.status);
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error('Resposta inesperada do servidor');
    const list = data.map(normalizeRow);
    window.LAST_PROJECTS = list;
    renderProjects(list);
  } catch (err) {
    console.error('Erro ao buscar projetos do backend:', err);
    // fallback opcional: apenas se quiser, mantém para desenvolvimento local
    if (window.PROJECTS && Array.isArray(window.PROJECTS)) {
      const fallback = window.PROJECTS.map(normalizeRow);
      window.LAST_PROJECTS = fallback;
      renderProjects(fallback);
    }
  }
}

/* filtros simples (se tiver botões .filter-btn com data-filter) */
document.addEventListener('DOMContentLoaded', () => {
  fetchProjectsFromApi();

  const filters = Array.from(document.querySelectorAll('.filter-btn'));
  filters.forEach(f => f.addEventListener('click', () => {
    filters.forEach(n => n.classList.remove('active'));
    f.classList.add('active');
    const filter = f.getAttribute('data-filter');
    const all = window.LAST_PROJECTS || (window.PROJECTS || []).map(normalizeRow);
    if (filter === 'all') renderProjects(all);
    else renderProjects(all.filter(p => (p.tags || []).includes(filter)));
  }));
});