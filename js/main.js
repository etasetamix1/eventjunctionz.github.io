(() => {
  const THEME_KEY = "ej-theme";
  const THEMES = ["soft", "ink"];
  const DEFAULT_THEME = "ink";
  const THEME_MS = 700;
  const isMedicalPage = /medical-travel\.html(?:$|\?|#)/i.test(location.pathname + location.search) ||
    document.documentElement.hasAttribute("data-force-soft");

  const reducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const getTheme = () => {
    // Medical travel always opens in soft (light) theme
    if (isMedicalPage) return "soft";
    const saved = localStorage.getItem(THEME_KEY);
    return THEMES.includes(saved) ? saved : DEFAULT_THEME;
  };

  const setToggleState = (theme) => {
    document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
      const isInk = theme === "ink";
      btn.setAttribute("aria-pressed", String(isInk));
      btn.setAttribute(
        "aria-label",
        isInk ? "Switch to Soft Clinical theme" : "Switch to Ink & Brass theme"
      );
      btn.title = isInk ? "Switch to Soft Clinical" : "Switch to Ink & Brass";
    });
  };

  const setThemeOrigin = (fromEl) => {
    const root = document.documentElement;
    if (fromEl) {
      const rect = fromEl.getBoundingClientRect();
      root.style.setProperty("--theme-x", `${rect.left + rect.width / 2}px`);
      root.style.setProperty("--theme-y", `${rect.top + rect.height / 2}px`);
    } else {
      root.style.setProperty("--theme-x", "90%");
      root.style.setProperty("--theme-y", "36px");
    }
  };

  const applyTheme = (theme, { persist = true } = {}) => {
    const next = THEMES.includes(theme) ? theme : DEFAULT_THEME;
    document.documentElement.setAttribute("data-theme", next);
    // Don't overwrite saved preference when medical page auto-forces light
    if (persist) localStorage.setItem(THEME_KEY, next);
    setToggleState(next);
  };

  const runFallbackRipple = (next, btn) => {
    const root = document.documentElement;
    root.classList.add("theme-animating");

    const ripple = document.createElement("div");
    ripple.className = "theme-ripple";
    ripple.style.background = next === "ink" ? "#0b1c24" : "#ffffff";
    document.body.appendChild(ripple);

    // Paint ripple growing over current theme, then swap
    requestAnimationFrame(() => {
      window.setTimeout(() => {
        applyTheme(next);
        ripple.classList.add("is-exit");
        window.setTimeout(() => {
          ripple.remove();
          root.classList.remove("theme-animating", "theme-to-soft", "theme-to-ink");
          if (btn) btn.classList.remove("is-switching");
        }, 280);
      }, THEME_MS * 0.55);
    });
  };

  const switchTheme = (btn) => {
    const current = document.documentElement.getAttribute("data-theme") || DEFAULT_THEME;
    const next = current === "ink" ? "soft" : "ink";
    const root = document.documentElement;

    if (btn) btn.classList.add("is-switching");
    setThemeOrigin(btn);

    root.classList.remove("theme-to-soft", "theme-to-ink");
    root.classList.add(next === "soft" ? "theme-to-soft" : "theme-to-ink");

    if (reducedMotion()) {
      applyTheme(next);
      if (btn) btn.classList.remove("is-switching");
      root.classList.remove("theme-to-soft", "theme-to-ink");
      return;
    }

    if (typeof document.startViewTransition === "function") {
      const transition = document.startViewTransition(() => {
        applyTheme(next);
      });

      transition.finished.finally(() => {
        root.classList.remove("theme-to-soft", "theme-to-ink");
        if (btn) btn.classList.remove("is-switching");
      });
      return;
    }

    runFallbackRipple(next, btn);
  };

  // Initial theme (no animation). Medical page forces light without saving.
  applyTheme(getTheme(), { persist: !isMedicalPage });

  document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => switchTheme(btn));
  });

  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav-links");

  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  const form = document.querySelector(".contact-form");
  if (form) {
    const params = new URLSearchParams(window.location.search);
    const interestParam = params.get("interest");
    const interestSelect = form.querySelector('[name="interest"]');
    if (interestParam && interestSelect) {
      const match = Array.from(interestSelect.options).find(
        (opt) => opt.value.toLowerCase() === interestParam.toLowerCase()
      );
      if (match) interestSelect.value = match.value;
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = data.get("name") || "";
      const email = data.get("email") || "";
      const phone = data.get("phone") || "";
      const interest = data.get("interest") || "";
      const message = data.get("message") || "";

      const subject = encodeURIComponent(`Event Junctionz enquiry — ${interest}`);
      const body = encodeURIComponent(
        [
          `Name: ${name}`,
          `Phone: ${phone}`,
          email ? `Email: ${email}` : null,
          `Interest: ${interest}`,
          ``,
          message,
        ]
          .filter(Boolean)
          .join("\n")
      );
      window.location.href = `mailto:eventjunctionz@gmail.com?subject=${subject}&body=${body}`;
    });
  }

  // Gallery lightbox — supports mixed portrait / landscape naturally
  const gallery = document.querySelector("[data-gallery]");
  const lightbox = document.getElementById("lightbox");
  if (gallery && lightbox) {
    const items = Array.from(gallery.querySelectorAll(".gallery-item img"));
    const imgEl = lightbox.querySelector("[data-lightbox-img]");
    const captionEl = lightbox.querySelector("[data-lightbox-caption]");
    let index = 0;

    const show = (i) => {
      index = (i + items.length) % items.length;
      const srcImg = items[index];
      imgEl.src = srcImg.currentSrc || srcImg.src;
      imgEl.alt = srcImg.alt || "Event Junctionz work";
      captionEl.textContent = srcImg.closest("figure")?.querySelector("figcaption")?.textContent || "";
    };

    const open = (i) => {
      show(i);
      lightbox.hidden = false;
      lightbox.setAttribute("aria-hidden", "false");
      requestAnimationFrame(() => lightbox.classList.add("is-open"));
      document.body.style.overflow = "hidden";
    };

    const close = () => {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      window.setTimeout(() => {
        if (!lightbox.classList.contains("is-open")) lightbox.hidden = true;
      }, 280);
    };

    items.forEach((img, i) => {
      const figure = img.closest(".gallery-item");
      figure?.setAttribute("tabindex", "0");
      figure?.setAttribute("role", "button");
      figure?.setAttribute("aria-label", `View ${img.alt || "photo"} larger`);
      const activate = () => open(i);
      figure?.addEventListener("click", activate);
      figure?.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          activate();
        }
      });
    });

    lightbox.querySelector("[data-lightbox-close]")?.addEventListener("click", close);
    lightbox.querySelector("[data-lightbox-prev]")?.addEventListener("click", () => show(index - 1));
    lightbox.querySelector("[data-lightbox-next]")?.addEventListener("click", () => show(index + 1));
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) close();
    });

    window.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(index - 1);
      if (e.key === "ArrowRight") show(index + 1);
    });
  }
})();
