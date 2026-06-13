/**
 * SportGear Finder — Premium Animations v4
 * Scroll reveals · Canvas particles · 3D tilt · Parallax · Sport effects
 */
(function () {
  'use strict';

  /* ─── Detect sport theme ─────────────────────────────────── */
  var body = document.body;
  var sport = body.classList.contains('sport-tennis') ? 'tennis'
            : body.classList.contains('sport-gym')    ? 'gym'
            : body.classList.contains('sport-boxing') ? 'boxing'
            : 'home';

  /* ─── Sport accent colors ────────────────────────────────── */
  var SPORT_COLORS = {
    home:   { primary: [200, 255,   0], secondary: [255, 255, 255] },
    tennis: { primary: [  0, 212, 255], secondary: [232, 255,   0] },
    gym:    { primary: [255,  51,  51], secondary: [192, 192, 192] },
    boxing: { primary: [255, 215,   0], secondary: [204,  24,   0] }
  };

  var colors = SPORT_COLORS[sport] || SPORT_COLORS.home;

  /* ═══════════════════════════════════════════════════════════
     SCROLL REVEAL — Intersection Observer
  ═══════════════════════════════════════════════════════════ */
  function initScrollReveal() {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var delay = el.dataset.revealDelay || 0;
          setTimeout(function () { el.classList.add('revealed'); }, +delay);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('[data-reveal], [data-reveal-stagger]').forEach(function (el) {
      io.observe(el);
    });
  }

  /* ═══════════════════════════════════════════════════════════
     STAT COUNTER ANIMATION
  ═══════════════════════════════════════════════════════════ */
  function initCounters() {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseInt(el.textContent, 10);
        if (isNaN(target)) return;
        io.unobserve(el);
        var start = 0;
        var duration = 1200;
        var startTime = null;
        function step(ts) {
          if (!startTime) startTime = ts;
          var progress = Math.min((ts - startTime) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(start + (target - start) * eased);
          if (progress < 1) requestAnimationFrame(step);
          else el.textContent = target;
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number').forEach(function (el) {
      io.observe(el);
    });
  }

  /* ═══════════════════════════════════════════════════════════
     3D CARD TILT
  ═══════════════════════════════════════════════════════════ */
  function initCardTilt() {
    document.querySelectorAll('.sport-card-v2, .hiw-step, .cat-card, .section-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        var tiltX = y * -10;
        var tiltY = x * 10;
        card.style.transform = 'perspective(800px) rotateX(' + tiltX + 'deg) rotateY(' + tiltY + 'deg) translateZ(4px)';
        card.style.transition = 'transform 0.08s ease';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';
      });
    });
  }

  /* ═══════════════════════════════════════════════════════════
     HERO CANVAS — Particle System
  ═══════════════════════════════════════════════════════════ */
  function initHeroCanvas(canvasId) {
    var canvas = document.getElementById(canvasId);
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var particles = [];
    var W, H;

    function resize() {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    /* Sport-specific particle factory */
    function makeParticle() {
      var p = {};
      p.x = Math.random() * W;
      p.y = Math.random() * H;
      p.vx = (Math.random() - 0.5) * 0.4;
      p.vy = -Math.random() * 0.6 - 0.2;
      p.life = 0;
      p.maxLife = 200 + Math.random() * 200;
      p.size = Math.random() * 2 + 0.5;
      p.r = colors.primary[0];
      p.g = colors.primary[1];
      p.b = colors.primary[2];

      /* Occasionally use accent color */
      if (Math.random() > 0.65) {
        p.r = colors.secondary[0];
        p.g = colors.secondary[1];
        p.b = colors.secondary[2];
      }
      return p;
    }

    /* Spawn initial particles */
    for (var i = 0; i < 80; i++) {
      var p = makeParticle();
      p.life = Math.random() * p.maxLife;
      particles.push(p);
    }

    /* Connection lines between nearby particles */
    function drawConnections() {
      var maxDist = 120;
      for (var i = 0; i < particles.length; i++) {
        for (var j = i + 1; j < particles.length; j++) {
          var dx = particles[i].x - particles[j].x;
          var dy = particles[i].y - particles[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            var a1 = (1 - particles[i].life / particles[i].maxLife);
            var a2 = (1 - particles[j].life / particles[j].maxLife);
            var alpha = Math.min(a1, a2) * (1 - dist / maxDist) * 0.2;
            ctx.strokeStyle = 'rgba(' + particles[i].r + ',' + particles[i].g + ',' + particles[i].b + ',' + alpha + ')';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, W, H);

      /* Update & draw */
      for (var i = particles.length - 1; i >= 0; i--) {
        var p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;

        var lifeRatio = p.life / p.maxLife;
        var alpha = lifeRatio < 0.2
          ? lifeRatio / 0.2
          : lifeRatio > 0.8
            ? (1 - lifeRatio) / 0.2
            : 1;
        alpha *= 0.55;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + p.r + ',' + p.g + ',' + p.b + ',' + alpha + ')';
        ctx.fill();

        /* Glow */
        if (p.size > 1.5) {
          var grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
          grad.addColorStop(0, 'rgba(' + p.r + ',' + p.g + ',' + p.b + ',' + (alpha * 0.4) + ')');
          grad.addColorStop(1, 'rgba(' + p.r + ',' + p.g + ',' + p.b + ',0)');
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        }

        if (p.life >= p.maxLife) {
          particles[i] = makeParticle();
        }
      }

      drawConnections();
      requestAnimationFrame(animate);
    }

    animate();
  }

  /* ═══════════════════════════════════════════════════════════
     SPORT CANVAS — Sport hub particle effects
  ═══════════════════════════════════════════════════════════ */
  function initSportCanvas() {
    var canvas = document.getElementById('sport-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var W, H;

    function resize() {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    if (sport === 'tennis') initTennisEffect(ctx);
    else if (sport === 'gym') initGymEffect(ctx);
    else if (sport === 'boxing') initBoxingEffect(ctx);
  }

  /* Tennis: animated ball trails */
  function initTennisEffect(ctx) {
    var balls = [
      { x: -50, y: 0.35, speed: 3.2, size: 14, trail: [] },
      { x: -50, y: 0.62, speed: 2.4, size: 10, trail: [], delay: 120 }
    ];
    var W, H;
    var frame = 0;

    function getSize() {
      var c = ctx.canvas;
      W = c.offsetWidth; H = c.offsetHeight;
    }
    getSize();
    window.addEventListener('resize', getSize);

    balls[0].x = -50;
    balls[1].x = -200;

    function animate() {
      ctx.canvas.width  = W;
      ctx.canvas.height = H;
      ctx.clearRect(0, 0, W, H);
      frame++;

      balls.forEach(function (ball) {
        ball.x += ball.speed;
        if (ball.x > W + 100) ball.x = -80;

        var bx = ball.x;
        var by = ball.y * H + Math.sin(frame * 0.03 + ball.y * 10) * 30;

        ball.trail.push({ x: bx, y: by });
        if (ball.trail.length > 28) ball.trail.shift();

        /* Draw trail */
        for (var i = 0; i < ball.trail.length; i++) {
          var t = ball.trail[i];
          var a = (i / ball.trail.length) * 0.4;
          var r = (ball.size * (i / ball.trail.length)) * 0.6;
          ctx.beginPath();
          ctx.arc(t.x, t.y, r, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(232,255,0,' + a + ')';
          ctx.fill();
        }

        /* Draw ball */
        var grad = ctx.createRadialGradient(bx - 3, by - 3, 0, bx, by, ball.size);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.4, '#e8ff00');
        grad.addColorStop(1, '#b8cc00');
        ctx.beginPath();
        ctx.arc(bx, by, ball.size, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        /* Glow */
        ctx.beginPath();
        ctx.arc(bx, by, ball.size * 2.5, 0, Math.PI * 2);
        var glow = ctx.createRadialGradient(bx, by, 0, bx, by, ball.size * 2.5);
        glow.addColorStop(0, 'rgba(232,255,0,0.25)');
        glow.addColorStop(1, 'rgba(232,255,0,0)');
        ctx.fillStyle = glow;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    }
    animate();
  }

  /* Gym: energy pulse rings */
  function initGymEffect(ctx) {
    var rings = [];
    var W, H;

    function getSize() {
      var c = ctx.canvas;
      W = c.offsetWidth; H = c.offsetHeight;
    }
    getSize();
    window.addEventListener('resize', getSize);

    function spawnRing() {
      rings.push({
        x: W * (0.1 + Math.random() * 0.3),
        y: H * (0.4 + Math.random() * 0.4),
        r: 0,
        maxR: 80 + Math.random() * 60,
        life: 0,
        maxLife: 90,
        color: Math.random() > 0.5 ? '255,51,51' : '192,192,192'
      });
    }

    setInterval(spawnRing, 800);
    spawnRing();

    function animate() {
      ctx.canvas.width  = W;
      ctx.canvas.height = H;
      ctx.clearRect(0, 0, W, H);

      rings = rings.filter(function (ring) { return ring.life < ring.maxLife; });

      rings.forEach(function (ring) {
        ring.life++;
        ring.r = (ring.life / ring.maxLife) * ring.maxR;
        var alpha = (1 - ring.life / ring.maxLife) * 0.4;
        ctx.beginPath();
        ctx.arc(ring.x, ring.y, ring.r, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(' + ring.color + ',' + alpha + ')';
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      requestAnimationFrame(animate);
    }
    animate();
  }

  /* Boxing: smoke particles + spotlight */
  function initBoxingEffect(ctx) {
    var smokes = [];
    var W, H;
    var frame = 0;

    function getSize() {
      var c = ctx.canvas;
      W = c.offsetWidth; H = c.offsetHeight;
    }
    getSize();
    window.addEventListener('resize', getSize);

    function spawnSmoke() {
      smokes.push({
        x: W * (0.2 + Math.random() * 0.3),
        y: H * 0.85,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -Math.random() * 1.2 - 0.5,
        r: 10 + Math.random() * 20,
        life: 0,
        maxLife: 120 + Math.random() * 80,
        color: Math.random() > 0.6 ? '255,215,0' : '180,80,0'
      });
    }

    setInterval(spawnSmoke, 300);

    function animate() {
      ctx.canvas.width  = W;
      ctx.canvas.height = H;
      ctx.clearRect(0, 0, W, H);
      frame++;

      /* Spotlight beam */
      var spotX = W * 0.35 + Math.sin(frame * 0.008) * W * 0.05;
      var beam = ctx.createRadialGradient(spotX, -80, 0, spotX, H * 0.6, H * 0.7);
      beam.addColorStop(0, 'rgba(255,215,0,0.07)');
      beam.addColorStop(0.4, 'rgba(255,180,0,0.04)');
      beam.addColorStop(1, 'rgba(255,215,0,0)');
      ctx.fillStyle = beam;
      ctx.fillRect(0, 0, W, H);

      smokes = smokes.filter(function (s) { return s.life < s.maxLife; });

      smokes.forEach(function (s) {
        s.life++;
        s.x += s.vx;
        s.y += s.vy;
        s.r += 0.4;
        var alpha = (1 - s.life / s.maxLife) * 0.18;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + s.color + ',' + alpha + ')';
        ctx.fill();
      });

      requestAnimationFrame(animate);
    }
    animate();
  }

  /* ═══════════════════════════════════════════════════════════
     PARALLAX — hero photo
  ═══════════════════════════════════════════════════════════ */
  function initParallax() {
    var heroPhoto = document.querySelector('.hero-v2 .hero-photo');
    if (!heroPhoto) return;

    window.addEventListener('scroll', function () {
      var scrollY = window.pageYOffset;
      if (scrollY < window.innerHeight) {
        heroPhoto.style.transform = 'scale(1.05) translateY(' + (scrollY * 0.25) + 'px)';
      }
    }, { passive: true });
  }

  /* ═══════════════════════════════════════════════════════════
     NAV — scroll state
  ═══════════════════════════════════════════════════════════ */
  function initNavScroll() {
    var nav = document.querySelector('nav');
    if (!nav) return;
    window.addEventListener('scroll', function () {
      if (window.pageYOffset > 40) {
        nav.style.background = 'rgba(13,17,23,0.97)';
        nav.style.boxShadow = '0 4px 32px rgba(0,0,0,0.8)';
      } else {
        nav.style.background = '';
        nav.style.boxShadow = '';
      }
    }, { passive: true });
  }

  /* ═══════════════════════════════════════════════════════════
     HOVER GLOW on product cards
  ═══════════════════════════════════════════════════════════ */
  function initCardGlow() {
    document.querySelectorAll('.pcard, .product-card-v2').forEach(function (card) {
      card.addEventListener('mouseenter', function () {
        this.style.boxShadow = '0 8px 40px rgba(0,0,0,0.5), 0 0 20px ' +
          'rgba(' + colors.primary.join(',') + ',0.08)';
      });
      card.addEventListener('mouseleave', function () {
        this.style.boxShadow = '';
      });
    });
  }

  /* ═══════════════════════════════════════════════════════════
     SMOOTH BUTTON RIPPLE
  ═══════════════════════════════════════════════════════════ */
  function initRipple() {
    document.querySelectorAll('.btn, .btn-hero-primary, .sc-cta').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        var rect = btn.getBoundingClientRect();
        var ripple = document.createElement('span');
        var size = Math.max(rect.width, rect.height) * 2;
        ripple.style.cssText = [
          'position:absolute',
          'border-radius:50%',
          'background:rgba(255,255,255,0.2)',
          'width:' + size + 'px',
          'height:' + size + 'px',
          'left:' + (e.clientX - rect.left - size / 2) + 'px',
          'top:' + (e.clientY - rect.top - size / 2) + 'px',
          'transform:scale(0)',
          'animation:rippleAnim 0.5s ease-out forwards',
          'pointer-events:none'
        ].join(';');
        btn.style.position = 'relative';
        btn.style.overflow = 'hidden';
        btn.appendChild(ripple);
        setTimeout(function () { ripple.remove(); }, 600);
      });
    });

    /* Inject ripple keyframe */
    if (!document.getElementById('ripple-style')) {
      var s = document.createElement('style');
      s.id = 'ripple-style';
      s.textContent = '@keyframes rippleAnim{to{transform:scale(1);opacity:0}}';
      document.head.appendChild(s);
    }
  }

  /* ═══════════════════════════════════════════════════════════
     CONTENT CANVAS — Sparse background particles (all pages)
  ═══════════════════════════════════════════════════════════ */
  function initContentParticles() {
    var canvas = document.createElement('canvas');
    canvas.id = 'content-canvas';
    document.body.insertBefore(canvas, document.body.firstChild);

    var ctx = canvas.getContext('2d');
    var particles = [];
    var W, H;

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function makeParticle() {
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -Math.random() * 0.3 - 0.1,
        life: 0,
        maxLife: 300 + Math.random() * 300,
        size: Math.random() * 1.2 + 0.3,
        r: colors.primary[0],
        g: colors.primary[1],
        b: colors.primary[2]
      };
    }

    for (var i = 0; i < 50; i++) {
      var p = makeParticle();
      p.life = Math.random() * p.maxLife;
      particles.push(p);
    }

    function animate() {
      ctx.clearRect(0, 0, W, H);

      for (var i = particles.length - 1; i >= 0; i--) {
        var p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < -10) { particles[i] = makeParticle(); continue; }

        var lr = p.life / p.maxLife;
        var alpha = (lr < 0.2 ? lr / 0.2 : lr > 0.8 ? (1 - lr) / 0.2 : 1) * 0.18;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + p.r + ',' + p.g + ',' + p.b + ',' + alpha + ')';
        ctx.fill();

        if (p.life >= p.maxLife) particles[i] = makeParticle();
      }

      requestAnimationFrame(animate);
    }
    animate();
  }

  /* ═══════════════════════════════════════════════════════════
     INIT
  ═══════════════════════════════════════════════════════════ */
  document.addEventListener('DOMContentLoaded', function () {
    initScrollReveal();
    initCounters();
    initCardTilt();
    initParallax();
    initNavScroll();
    initCardGlow();
    initRipple();

    /* Hero canvas (homepage) */
    initHeroCanvas('hero-canvas');

    /* Sport canvas (hub pages) */
    initSportCanvas();

    /* Subtle background particles on all pages */
    initContentParticles();
  });

})();
