// Preloader, scroll reveal, and stat count-up.
// Everything below is sequenced to start only once the preloader has cleared.

document.body.classList.add('loading');

window.addEventListener('load', () => {
  const pre = document.getElementById('preloader');
  const minDelay = 500; // avoid a flash-of-nothing on fast loads
  setTimeout(() => {
    if (pre) pre.classList.add('hide');
    document.body.classList.remove('loading');
    document.body.classList.add('ready'); // triggers hero entrance (see preloader.css)
    setupMotion();
  }, minDelay);
});

function setupMotion(){
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mark reveal targets: section heads, cards, steps, stat bar, grids.
  const targets = document.querySelectorAll(
    '.section-head, .card, .step, .stats-bar, .cta-band, .booking-card, .page-hero + section .grid'
  );
  targets.forEach(el => el.classList.add('reveal'));

  // Stagger cards inside the same grid
  document.querySelectorAll('.grid').forEach(grid => {
    Array.from(grid.children).forEach((child, i) => {
      child.classList.add('reveal');
      child.style.transitionDelay = `${i * 80}ms`;
    });
  });

  if (reduceMotion) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // Stat count-up — starts only once the stats bar is in view, well after
  // the preloader and hero entrance are done.
  const statNums = document.querySelectorAll('.stat .num');
  if (statNums.length) {
    const statIo = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        statIo.unobserve(entry.target);
        const el = entry.target;
        const raw = el.textContent.trim();
        const match = raw.match(/^([\d,]+)(.*)$/);
        if (!match) return;
        const end = parseInt(match[1].replace(/,/g, ''), 10);
        const suffix = match[2];
        const duration = 1800; // slow, legible count
        const start = performance.now();
        function tick(now){
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(end * eased).toLocaleString() + suffix;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.5 });
    statNums.forEach(el => statIo.observe(el));
  }
}
