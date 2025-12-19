// Lógica para popular a página, filtros, navegação e animações simples
(function () {
  const projectsGrid = document.getElementById('projects-grid');
  const techGrid = document.getElementById('tech-grid');
  const socialsEl = document.getElementById('contact-socials');
  const yearEl = document.getElementById('year');
  const filters = Array.from(document.querySelectorAll('.filter-btn'));
  const navBtns = Array.from(document.querySelectorAll('.nav-btn'));
  const sections = Array.from(document.querySelectorAll('.section'));

  function el(tag, cls, inner) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (inner !== undefined) e.innerHTML = inner;
    return e;
  }

  function renderProjects(list) {
    projectsGrid.innerHTML = '';
    list.forEach(p => {
      const card = el('article', 'project-card reveal');
      card.innerHTML = `
        <img class="project-thumb" loading="lazy" src="${p.thumb}" alt="${p.title}">
        <h3>${p.title}</h3>
        <p class="muted">${p.desc}</p>
        <div class="project-meta">
          <div class="project-tags">${p.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div>
          <div class="links">
            ${p.live?`<a href="${p.live}" target="_blank" rel="noopener noreferrer">Ao vivo</a>`:''}
            ${p.repo?`<a href="${p.repo}" target="_blank" rel="noopener noreferrer">Código</a>`:''}
          </div>
        </div>`;
      projectsGrid.appendChild(card);
    });
    observeReveals();
  }

  function renderTech() {
    techGrid.innerHTML = '';
    (window.TECHS || []).forEach(t=>{
      const it = el('div','tech-item');
      it.innerHTML = `<img src="${t.icon}" alt="${t.name}"><div>${t.name}</div>`;
      techGrid.appendChild(it);
    });
  }

  function renderContact() {
    if(window.CONTACT) {
      document.getElementById('contact-email').href = 'mailto:' + window.CONTACT.email;
      document.getElementById('contact-email').textContent = window.CONTACT.email;
      document.getElementById('contact-phone').href = 'tel:' + window.CONTACT.phone;
      document.getElementById('contact-phone').textContent = window.CONTACT.phone;
      socialsEl.innerHTML = '';
      (window.CONTACT.socials || []).forEach(s=>{
        const a = el('a','',s.name);
        a.href = s.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        socialsEl.appendChild(a);
      });
    }
  }

  function applyFilter(filter) {
    const all = window.PROJECTS || [];
    if(filter === 'all') renderProjects(all);
    else renderProjects(all.filter(p => p.tags.includes(filter)));
  }

  // Filters
  filters.forEach(f=>{
    f.addEventListener('click', ()=>{
      filters.forEach(n=>n.classList.remove('active'));
      f.classList.add('active');
      applyFilter(f.getAttribute('data-filter'));
    });
  });

  // Nav buttons smooth scroll + active
  navBtns.forEach(b=>{
    b.addEventListener('click', ()=>{
      navBtns.forEach(nb=>nb.classList.remove('active'));
      b.classList.add('active');
      const id = b.getAttribute('data-target');
      const elm = document.getElementById(id);
      if(elm) elm.scrollIntoView({behavior:'smooth', block:'start'});
    });
  });

  // IntersectionObserver for reveal and updating active nav by section
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if(en.isIntersecting){
        en.target.classList.add('show');
        // update nav active
        const id = en.target.id;
        navBtns.forEach(nb=> {
          nb.classList.toggle('active', nb.getAttribute('data-target') === id);
        });
      } else {
        // optional: remove .show when out of view
      }
    });
  }, {threshold: 0.14});

  function observeReveals() {
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(r => io.observe(r));
  }

  // Inicialização
  document.addEventListener('DOMContentLoaded', ()=>{
    renderProjects(window.PROJECTS || []);
    renderTech();
    renderContact();
    yearEl.textContent = new Date().getFullYear();
    observeReveals();
  });
})();