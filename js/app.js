// Carrega dados, gerencia navegação e animações simples de revelação em scroll.
(function(){
  const projectsList = document.getElementById('projects-list');
  const techList = document.getElementById('tech-list');
  const yearEl = document.getElementById('year');
  const navBtns = Array.from(document.querySelectorAll('.nav-btn'));
  const sections = Array.from(document.querySelectorAll('.section'));

  function createProjectCard(p){
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `<h3>${p.title}</h3><p>${p.desc}</p><div class="links">
      ${p.repo?`<a href="${p.repo}" target="_blank" rel="noopener noreferrer">Código</a>`:''}
      ${p.live?`<a href="${p.live}" target="_blank" rel="noopener noreferrer">Ao vivo</a>`:''}
    </div>`;
    return card;
  }

  function populate(){
    if(window.PROJECTS && projectsList){
      projectsList.innerHTML = '';
      window.PROJECTS.forEach(p => projectsList.appendChild(createProjectCard(p)));
    }
    if(window.TECHS && techList){
      techList.innerHTML = '';
      window.TECHS.forEach(t=>{
        const node = document.createElement('div');
        node.className = 'tech-item';
        node.innerHTML = `<img src="${t.icon}" alt="${t.name}" /><div>${t.name}</div>`;
        techList.appendChild(node);
      });
    }
    if(yearEl) yearEl.textContent = new Date().getFullYear();
  }

  // Smooth scroll and active state
  function scrollToSection(id){
    const el = document.getElementById(id);
    if(!el) return;
    el.scrollIntoView({behavior:'smooth',block:'start'});
  }

  navBtns.forEach(b=>{
    b.addEventListener('click', ()=>{
      navBtns.forEach(nb=>nb.classList.remove('active'));
      b.classList.add('active');
      const t = b.getAttribute('data-target');
      scrollToSection(t);
    });
  });

  // Reveal on scroll
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('show');
        // If you want one-time reveal:
        // observer.unobserve(entry.target);
      }
    });
  }, {threshold: 0.12});

  sections.forEach(s => observer.observe(s));

  // When loaded
  document.addEventListener('DOMContentLoaded', populate);
})();