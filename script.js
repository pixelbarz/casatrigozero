document.documentElement.classList.add("js");

const menuBtn = document.getElementById("menuBtn");
const mainNav = document.getElementById("mainNav");
const year = document.getElementById("year");
const siteHeader = document.querySelector(".site-header");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (year) {
  year.textContent = new Date().getFullYear();
}

if (siteHeader) {
  const updateHeaderState = () => {
    siteHeader.classList.toggle("is-scrolled", window.scrollY > 8);
  };

  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });
}

if (menuBtn && mainNav) {
  const closeMenu = () => {
    mainNav.classList.remove("is-open");
    menuBtn.setAttribute("aria-expanded", "false");
  };

  menuBtn.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");
    menuBtn.setAttribute("aria-expanded", String(isOpen));
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Node)) return;
    if (!mainNav.classList.contains("is-open")) return;
    if (mainNav.contains(target) || menuBtn.contains(target)) return;
    closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    closeMenu();
    menuBtn.blur();
  });
}

const setRevealDelay = (selector, stepMs) => {
  document.querySelectorAll(selector).forEach((el, index) => {
    el.style.setProperty("--reveal-delay", `${index * stepMs}ms`);
  });
};

setRevealDelay(".hero-tags .reveal", 80);
setRevealDelay(".cards .reveal", 110);
setRevealDelay(".feature-list .reveal", 120);
setRevealDelay(".value-points .reveal", 120);

const revealEls = document.querySelectorAll(".reveal");

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealEls.forEach((el) => el.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -6% 0px" }
  );

  revealEls.forEach((el) => revealObserver.observe(el));
}

const internalNavLinks = Array.from(document.querySelectorAll('.nav-link[href^="#"]'));

if (internalNavLinks.length && "IntersectionObserver" in window) {
  const targets = internalNavLinks
    .map((link) => {
      const href = link.getAttribute("href");
      const target = href ? document.querySelector(href) : null;
      return href && target ? { href, link, target } : null;
    })
    .filter(Boolean);

  if (targets.length) {
    const markCurrentLink = (href) => {
      internalNavLinks.forEach((link) => {
        link.classList.toggle("is-current", link.getAttribute("href") === href);
      });
    };

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const active = targets.find((item) => item.target === entry.target);
          if (active) markCurrentLink(active.href);
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    targets.forEach(({ target }) => sectionObserver.observe(target));
  }
}
