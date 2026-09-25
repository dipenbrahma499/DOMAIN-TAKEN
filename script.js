/* ============================================================
   DOMAIN TAKEN — by Dipen
   script.js
   ============================================================ */
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

 
 

  /* ----------------------------------------------------------
     2. TYPEWRITER EFFECT
     ---------------------------------------------------------- */
  const phrases = [
    'This domain has found its home.',
    'Registered and maintained by Dipen.',
    'Not for sale — but you can still say hi.',
    'Thanks for stopping by.'
  ];

  const typingEl = document.getElementById('typing');
  const caret    = document.createElement('span');
  caret.className = 'caret';

  if (reduceMotion) {
    typingEl.textContent = phrases[0];
    typingEl.appendChild(caret);
  } else {
    let pIndex   = 0;
    let cIndex   = 0;
    let deleting = false;

    (function type() {
      const full = phrases[pIndex];

      typingEl.textContent = full.slice(0, cIndex);
      typingEl.appendChild(caret);

      let delay = deleting ? 38 : 68;

      if (!deleting && cIndex === full.length) {
        delay    = 1800;
        deleting = true;
      } else if (deleting && cIndex === 0) {
        deleting = false;
        pIndex   = (pIndex + 1) % phrases.length;
        delay    = 400;
      } else {
        cIndex += deleting ? -1 : 1;
      }

      setTimeout(type, delay);
    })();
  }

  /* ----------------------------------------------------------
     3. PARTICLE NETWORK BACKGROUND
     ---------------------------------------------------------- */
  const canvas = document.getElementById('bg');
  const ctx    = canvas.getContext('2d');

  let w = 0;
  let h = 0;
  let dpr = 1;
  let particles = [];

  const mouse = { x: null, y: null, r: 150 };
  const LINK_DIST = 130;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    const vw = window.visualViewport ? window.visualViewport.width  : window.innerWidth;
    const vh = window.visualViewport ? window.visualViewport.height : window.innerHeight;

    w = vw;
    h = vh;

    canvas.width  = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width  = w + 'px';
    canvas.style.height = h + 'px';

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildParticles();
  }

  function buildParticles() {
    const base     = (w * h) / 16000;
    const minCount = w < 400 ? 18 : 28;
    const maxCount = w > 2000 ? 140 : 100;

    const count = Math.max(minCount, Math.min(maxCount, Math.floor(base)));

    particles = Array.from({ length: count }, () => ({
      x:  Math.random() * w,
      y:  Math.random() * h,
      vx: (Math.random() - 0.5) * 0.38,
      vy: (Math.random() - 0.5) * 0.38,
      r:  Math.random() * 1.7 + 0.7
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x <= 0 || p.x >= w) p.vx *= -1;
      if (p.y <= 0 || p.y >= h) p.vy *= -1;
    }

    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];

      for (let j = i + 1; j < particles.length; j++) {
        const b  = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;

        if (d2 < LINK_DIST * LINK_DIST) {
          const alpha = (1 - Math.sqrt(d2) / LINK_DIST) * 0.3;
          ctx.strokeStyle = 'rgba(94,234,212,' + alpha.toFixed(3) + ')';
          ctx.lineWidth   = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    if (mouse.x !== null) {
      for (const p of particles) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d  = Math.hypot(dx, dy);

        if (d < mouse.r) {
          const f = (1 - d / mouse.r) * 0.4;
          ctx.strokeStyle = 'rgba(129,140,248,' + f.toFixed(3) + ')';
          ctx.lineWidth   = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }

    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(170,190,255,.7)';
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  /* ---- pointer events ---- */
  if (window.PointerEvent) {
    window.addEventListener('pointermove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }, { passive: true });

    window.addEventListener('pointerleave', () => {
      mouse.x = null;
      mouse.y = null;
    });
  } else {
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    });

    window.addEventListener('touchmove', (e) => {
      if (e.touches[0]) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      mouse.x = null;
      mouse.y = null;
    });
  }

  /* ---- resize + orientation change ---- */
  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('orientationchange', () => setTimeout(resize, 120));

  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', resize, { passive: true });
  }

   document.addEventListener("DOMContentLoaded", () => {
    const domainName = document.getElementById("domainName");

    if (domainName) {
        domainName.textContent = window.location.hostname;
    }
});

  /* ---- init ---- */
  resize();
  if (!reduceMotion) requestAnimationFrame(draw);

})();
