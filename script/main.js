document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const navMenu = document.querySelector("nav ul");

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("active");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
      const icon = menuToggle.querySelector("i");
      icon?.classList.toggle("fa-bars", !isOpen);
      icon?.classList.toggle("fa-xmark", isOpen);
    });
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
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(Number(toast.dataset.timeout));
    toast.dataset.timeout = String(window.setTimeout(() => toast.classList.remove("is-visible"), 2600));
  };

  const addStoreItem = (button) => {
    const product = {
      id: button.dataset.product,
      name: button.dataset.name,
      price: Number(button.dataset.price || 0),
      img: button.dataset.img,
      qty: 1
    };
    const cart = readCart();
    const existing = cart.find((item) => item.id === product.id);
    if (existing) existing.qty += 1;
    else cart.push(product);
    localStorage.setItem("bb_cart", JSON.stringify(cart));
    updateCartCounts();
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

  updateCartCounts();
  window.addEventListener("storage", updateCartCounts);
});
