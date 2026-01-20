// Dados — edite conforme desejar
window.TECHS = [
  { name: "HTML5", icon: "../assets/icons/html5.svg" },
  { name: "CSS3", icon: "../assets/icons/css3.svg" },
  { name: "JavaScript", icon: "../assets/icons/js.svg" },
  { name: "React", icon: "../assets/icons/react.svg" },
  { name: "Node.js", icon: "../assets/icons/nodejs.svg" }
];

window.CONTACT = {
  email: "eduardolf6753@gmail.com",
  phone: "(51) 99291-1724",
  socials: [
    { name: "GitHub", url: "https://github.com/edulf05" },
    { name: "LinkedIn", url: "https://www.linkedin.com/in/edulf05" }
  ]
};

/* Insere as tecnologias definidas em src/js/data.js no elemento #tech-grid */
(function renderTechsModule(){
  function createTechNode(tech){
    const wrap = document.createElement('div');
    wrap.className = 'tech-item';
    const img = document.createElement('img');
    img.className = 'tech-icon';
    img.src = tech.icon || '';
    img.alt = tech.name || 'tech';
    const name = document.createElement('span');
    name.className = 'tech-name';
    name.textContent = tech.name || '';
    wrap.appendChild(img);
    wrap.appendChild(name);
    return wrap;
  }

  function renderTechs(list){
    const grid = document.getElementById('tech-grid');
    if (!grid) return;
    grid.innerHTML = '';
    (list || []).forEach(t => grid.appendChild(createTechNode(t)));
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderTechs(Array.isArray(window.TECHS) ? window.TECHS : []);
  });

  // expõe para debug
  window.__renderTechs = renderTechs;
})();