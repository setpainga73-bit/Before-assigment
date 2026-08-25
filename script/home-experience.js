document.addEventListener("DOMContentLoaded", () => {
  const storage = {
    get(key) { try { return localStorage.getItem(key); } catch (_error) { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch (_error) { /* Storage may be blocked; UI remains usable. */ } }
  };

  // First-visit discount modal: opens once, three seconds after the homepage loads.
  const modal = document.getElementById("discount-modal");
  const backdrop = document.getElementById("discount-modal-backdrop");
  const closeButton = document.getElementById("discount-modal-close");
  const discountForm = document.getElementById("discount-form");
  const emailInput = document.getElementById("discount-email");
  let lastFocusedElement = null;

  if (modal && backdrop) {
    const closeModal = (remember = true) => {
      modal.hidden = true;
      backdrop.hidden = true;
      document.body.classList.remove("modal-open");
      if (remember) storage.set("bb_discount_seen", "true");
      lastFocusedElement?.focus({ preventScroll: true });
    };

    const openModal = () => {
      lastFocusedElement = document.activeElement;
      modal.hidden = false;
      backdrop.hidden = false;
      document.body.classList.add("modal-open");
      window.setTimeout(() => emailInput?.focus(), 80);
    };

    closeButton?.addEventListener("click", () => closeModal());
    backdrop.addEventListener("click", () => closeModal());
    document.addEventListener("keydown", (event) => {
      if (modal.hidden) return;
      if (event.key === "Escape") { closeModal(); return; }
      if (event.key !== "Tab") return;
      const focusable = [...modal.querySelectorAll("button, input, a[href]")].filter((element) => !element.disabled);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });

    discountForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!discountForm.reportValidity()) return;
      const email = emailInput.value.trim().toLowerCase();
      storage.set("bb_discount_seen", "true");
      storage.set("bb_discount_signup", JSON.stringify({ email, code: "FIRST15", joinedAt: new Date().toISOString() }));
      document.getElementById("discount-modal-content").innerHTML = '<div class="discount-success"><i class="fa-solid fa-circle-check"></i><span class="eyebrow">You’re on the list</span><h2>Your first cup is 15% off.</h2><p>Use <strong>FIRST15</strong> at checkout. We’ll keep the good stuff coming, never the noisy stuff.</p><a class="button button-primary" href="./html/coffee.html">Shop the menu <i class="fa-solid fa-arrow-right"></i></a></div>';
      closeButton?.focus({ preventScroll: true });
    });

    if (!storage.get("bb_discount_seen")) window.setTimeout(openModal, 3000);
  }

  // Hero auto-swiper with manual controls, keyboard support, and pause-on-interaction.
  const swiper = document.getElementById("hero-swiper");
  if (!swiper) return;
  const slides = [...swiper.querySelectorAll(".hero-slide")];
  const dots = [...document.querySelectorAll(".hero-swiper-dot")];
  const previous = document.getElementById("hero-swiper-prev");
  const next = document.getElementById("hero-swiper-next");
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  let current = 0;
  let timer = null;
  let paused = false;

  const showSlide = (index) => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === current;
      slide.hidden = !active;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", String(!active));
    });
    dots.forEach((dot, dotIndex) => {
      const active = dotIndex === current;
      dot.classList.toggle("is-active", active);
      dot.setAttribute("aria-current", active ? "true" : "false");
    });
    swiper.setAttribute("aria-label", `Bean Boutique featured story ${current + 1} of ${slides.length}`);
  };

  const restartTimer = () => {
    if (reduceMotion) return;
    window.clearInterval(timer);
    timer = window.setInterval(() => { if (!paused) showSlide(current + 1); }, 5200);
  };
  const pause = () => { paused = true; };
  const resume = () => { paused = false; restartTimer(); };

  previous?.addEventListener("click", () => { showSlide(current - 1); restartTimer(); });
  next?.addEventListener("click", () => { showSlide(current + 1); restartTimer(); });
  dots.forEach((dot, dotIndex) => dot.addEventListener("click", () => { showSlide(dotIndex); restartTimer(); }));
  swiper.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") { event.preventDefault(); showSlide(current - 1); restartTimer(); }
    if (event.key === "ArrowRight") { event.preventDefault(); showSlide(current + 1); restartTimer(); }
  });
  swiper.addEventListener("mouseenter", pause);
  swiper.addEventListener("mouseleave", resume);
  swiper.addEventListener("focusin", pause);
  swiper.addEventListener("focusout", (event) => { if (!swiper.contains(event.relatedTarget)) resume(); });
  swiper.addEventListener("touchstart", pause, { passive: true });
  swiper.addEventListener("touchend", () => window.setTimeout(resume, 2400), { passive: true });
  document.addEventListener("visibilitychange", () => { if (document.hidden) pause(); else resume(); });
  window.addEventListener("pagehide", () => window.clearInterval(timer));
  showSlide(0);
  restartTimer();
});
