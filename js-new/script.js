/* ==========================================================================
   Ravi Ranjan Singh — Portfolio interactions
   Vanilla JS, no dependencies.
   ========================================================================== */
(function () {
  "use strict";

  /* ---------------- Preloader ---------------- */
  window.addEventListener("load", () => {
    const preloader = document.getElementById("preloader");
    if (preloader) {
      setTimeout(() => preloader.classList.add("hidden"), 250);
    }
  });

  /* ---------------- Theme toggle (persisted) ---------------- */
  const THEME_KEY = "rrs-theme";
  const root = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");

  function applyTheme(theme) {
    if (theme === "light") {
      root.setAttribute("data-theme", "light");
    } else {
      root.removeAttribute("data-theme");
    }
  }

  function getPreferredTheme() {
    try {
      const stored = localStorage.getItem(THEME_KEY);
      if (stored) return stored;
    } catch (e) {
      /* localStorage unavailable (e.g. private browsing) — fall back silently */
    }
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }

  let currentTheme = getPreferredTheme();
  applyTheme(currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      currentTheme = currentTheme === "light" ? "dark" : "light";
      applyTheme(currentTheme);
      try {
        localStorage.setItem(THEME_KEY, currentTheme);
      } catch (e) {
        /* ignore persistence errors */
      }
    });
  }

  /* ---------------- Mobile nav ---------------- */
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      hamburger.setAttribute("aria-expanded", String(isOpen));
      hamburger.classList.toggle("active", isOpen);
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------------- Navbar scroll state + active link ---------------- */
  const navbar = document.getElementById("navbar");
  const sections = document.querySelectorAll("main section[id]");
  const navAnchors = document.querySelectorAll(".nav-link");

  function onScroll() {
    if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 20);

    let currentId = "";
    const scrollPos = window.scrollY + window.innerHeight * 0.35;
    sections.forEach((section) => {
      if (scrollPos >= section.offsetTop) currentId = section.id;
    });
    navAnchors.forEach((a) => {
      a.classList.toggle("active-link", a.getAttribute("href") === `#${currentId}`);
    });

    const backToTop = document.getElementById("backToTop");
    if (backToTop) backToTop.classList.toggle("visible", window.scrollY > 480);
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------------- Back to top ---------------- */
  const backToTop = document.getElementById("backToTop");
  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------------- Scroll reveal (IntersectionObserver) ---------------- */
  const revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in-view"));
  }

  /* ---------------- Animated counters ---------------- */
  const counters = document.querySelectorAll(".stat-number[data-count]");
  function animateCounter(el) {
    const target = parseInt(el.getAttribute("data-count"), 10);
    if (Number.isNaN(target)) return; // leave placeholder text (e.g. "[N]") untouched
    const duration = 1200;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor(progress * target);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = String(target);
    }
    requestAnimationFrame(tick);
  }
  if ("IntersectionObserver" in window && counters.length) {
    const counterIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterIO.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((c) => counterIO.observe(c));
  }

  /* ---------------- Typing effect for hero role ---------------- */
  const roles = [
    "Lead Technology",
    "Angular Architect",
    "Front-End Engineer",
    "ExtJS → Angular Migration Specialist",
  ];
  const typedEl = document.getElementById("typedRole");

  if (typedEl && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    let roleIndex = 0;
    let charIndex = roles[0].length;
    let deleting = false;

    function typeTick() {
      const currentWord = roles[roleIndex];
      if (!deleting) {
        charIndex++;
        if (charIndex > currentWord.length) {
          deleting = true;
          setTimeout(typeTick, 1400);
          return;
        }
      } else {
        charIndex--;
        if (charIndex < 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          charIndex = 0;
        }
      }
      typedEl.textContent = roles[roleIndex].substring(0, charIndex);
      setTimeout(typeTick, deleting ? 45 : 80);
    }
    setTimeout(typeTick, 1800);
  }

  /* ---------------- Lightweight particle background ---------------- */
  const canvas = document.getElementById("particles");
  if (canvas && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const ctx = canvas.getContext("2d");
    let width, height, particles;
    const PARTICLE_COUNT = 60;
    const MAX_DIST = 130;

    function resize() {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    }

    function createParticles() {
      particles = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
      }));
    }

    function step() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 212, 255, 0.65)";
        ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(124, 92, 255, ${1 - dist / MAX_DIST})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(step);
    }

    resize();
    createParticles();
    step();
    window.addEventListener("resize", () => {
      resize();
      createParticles();
    });
  }

  /* ---------------- Contact form (mailto fallback, no backend) ---------------- */
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();

      // TODO: replace "your.email@example.com" below (and in index.html) with your real email address.
      const subject = encodeURIComponent(`Portfolio contact from ${name}`);
      const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
      window.location.href = `mailto:your.email@example.com?subject=${subject}&body=${body}`;
    });
  }

  /* ---------------- Footer year ---------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
