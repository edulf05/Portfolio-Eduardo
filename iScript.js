// Theme toggle with persistence (no reload)
(function(){
  const btn = document.getElementById('themeToggle');
  const stored = localStorage.getItem('theme');
  if(stored === 'light') {
    document.documentElement.classList.add('light');
    if(btn) btn.setAttribute('aria-pressed','true');
  }
  if(!btn) return;
  btn.addEventListener('click', () => {
    const isLight = document.documentElement.classList.toggle('light');
    if(isLight){
      localStorage.setItem('theme','light');
      btn.setAttribute('aria-pressed','true');
    } else {
      localStorage.removeItem('theme');
      btn.setAttribute('aria-pressed','false');
    }
  });
})();

// Reveal on scroll (IntersectionObserver)
(function(){
  const els = document.querySelectorAll('.reveal');
  if(!('IntersectionObserver' in window)){
    // fallback: show all
    els.forEach(e=>e.classList.add('show'));
    return;
  }
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting) { e.target.classList.add('show'); obs.unobserve(e.target); }
    });
  }, {threshold:0.12});
  els.forEach(el => obs.observe(el));
})();

// Menu for small screens
(function(){
  const btn = document.getElementById('menuBtn');
  if(!btn) return;
  btn.addEventListener('click', ()=>{
    const nav = document.querySelector('.nav-links');
    if(!nav) return;
    const isOpen = getComputedStyle(nav).display === 'flex';
    nav.style.display = isOpen ? 'none' : 'flex';
  });
})();

// Small utilities
const yearEl = document.getElementById('year');
if(yearEl) yearEl.textContent = new Date().getFullYear();

// Respect reduced motion preference for smooth scroll
if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', e=>{
      const t = document.querySelector(a.getAttribute('href'));
      if(t){ e.preventDefault(); t.scrollIntoView({behavior:'smooth', block:'start'}); }
    });
  });
}