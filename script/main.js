document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const menuToggle = document.getElementById("menu-toggle");
  const nav = document.querySelector(".site-nav");
  const navMenu = document.querySelector(".site-nav ul");

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("active");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
      menuToggle.querySelector("i")?.classList.toggle("fa-bars", !isOpen);
      menuToggle.querySelector("i")?.classList.toggle("fa-xmark", isOpen);
    });
    navMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
      navMenu.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
    }));
  }

  const readCart = () => {
    try { return JSON.parse(localStorage.getItem("bb_cart") || "[]"); } catch (_error) { return []; }
  };
  const updateCartCounts = () => {
    const count = readCart().reduce((total, item) => total + Number(item.qty || 0), 0);
    document.querySelectorAll(".cart-count").forEach((badge) => { badge.textContent = count; });
  };

  const showToast = (message) => {
    let toast = document.getElementById("site-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "site-toast";
      toast.setAttribute("role", "status");
      body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(Number(toast.dataset.timeout));
    toast.dataset.timeout = String(window.setTimeout(() => toast.classList.remove("is-visible"), 2600));
  };

  const addStoreItem = (button) => {
    const product = { id: button.dataset.product, name: button.dataset.name, price: Number(button.dataset.price || 0), img: button.dataset.img, qty: 1 };
    const cart = readCart();
    const existing = cart.find((item) => item.id === product.id);
    if (existing) existing.qty += 1; else cart.push(product);
    localStorage.setItem("bb_cart", JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent("bb-cart-updated"));
    showToast(`${product.name} added to your cart.`);
    const original = button.innerHTML;
    button.classList.add("added");
    button.innerHTML = '<i class="fa-solid fa-check"></i> Added';
    window.setTimeout(() => { button.innerHTML = original; button.classList.remove("added"); }, 1400);
  };

  document.addEventListener("click", (event) => {
    const addButton = event.target.closest(".store-add");
    if (addButton) addStoreItem(addButton);

    const eventButton = event.target.closest(".event-select");
    if (eventButton) {
      const eventField = document.getElementById("event");
      if (eventField) eventField.value = eventButton.dataset.event || "";
      document.getElementById("registration")?.scrollIntoView({ behavior: "smooth", block: "start" });
      document.querySelector(".registration-form input")?.focus({ preventScroll: true });
    }
  });

  // Adds a subtle reading-progress cue and elevated nav state while scrolling.
  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  progress.setAttribute("aria-hidden", "true");
  body.prepend(progress);
  const updateScrollState = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${scrollable > 0 ? window.scrollY / scrollable : 0})`;
    nav?.classList.toggle("has-scrolled", window.scrollY > 12);
  };
  window.addEventListener("scroll", updateScrollState, { passive: true });
  updateScrollState();

  // Reveal long sections only when they enter view, preserving a calm first paint.
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("js-reveal-visible"); revealObserver.unobserve(entry.target); }
    }), { threshold: .08 });
    document.querySelectorAll(".home-section, .page-content, .guide-banner, .subscription-section, .redesign-cart-section, .newsletter-section").forEach((section) => {
      section.classList.add("js-reveal");
      revealObserver.observe(section);
    });
  }

  // Registration becomes a clear on-page confirmation instead of a dead-end mailto submit.
  const registrationForm = document.querySelector(".registration-form");
  if (registrationForm) {
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem("bb_event_registration") || "null"); } catch (_error) { localStorage.removeItem("bb_event_registration"); }
    if (saved) {
      registrationForm.classList.add("form-success-state");
      registrationForm.innerHTML = `<i class="fa-solid fa-circle-check"></i><h3>You’re on the list.</h3><p>We saved your interest in <strong>${saved.event || "the next event"}</strong>. We’ll confirm the details by email.</p><button class="button button-dark" type="button" id="new-registration">Register someone else</button>`;
    } else {
      registrationForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(registrationForm);
        const registration = { firstName: formData.get("firstName"), email: formData.get("email"), event: formData.get("event") };
        localStorage.setItem("bb_event_registration", JSON.stringify(registration));
        registrationForm.classList.add("form-success-state");
        registrationForm.innerHTML = `<i class="fa-solid fa-circle-check"></i><h3>You’re on the list.</h3><p>Thanks, ${registration.firstName || "friend"}. We saved your interest in <strong>${registration.event || "the next event"}</strong>.</p><button class="button button-dark" type="button" id="new-registration">Register someone else</button>`;
        showToast("Registration saved in this browser.");
      });
    }
  }

  document.addEventListener("click", (event) => {
    if (event.target.closest("#new-registration")) {
      localStorage.removeItem("bb_event_registration");
      window.location.reload();
    }
  });

  // Adds a clear-cart control only when the cart has items.
  const cartActions = document.getElementById("cart-actions");
  if (cartActions && readCart().length) {
    cartActions.innerHTML = '<button class="clear-cart-button" type="button"><i class="fa-solid fa-trash-can"></i> Clear cart</button>';
    cartActions.querySelector("button")?.addEventListener("click", () => {
      localStorage.setItem("bb_cart", "[]");
      window.dispatchEvent(new CustomEvent("bb-cart-updated"));
      window.location.reload();
    });
  }

  updateCartCounts();
  window.addEventListener("bb-cart-updated", updateCartCounts);
  window.addEventListener("storage", updateCartCounts);
});
