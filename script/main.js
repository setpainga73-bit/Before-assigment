document.addEventListener("DOMContentLoaded", () => {
  // Mobile navigation toggle
  const menuToggle = document.getElementById("menu-toggle");
  const navMenu = document.querySelector("nav ul");

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("active");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
      const icon = menuToggle.querySelector("i");
      if (icon) {
        icon.classList.toggle("fa-bars", !isOpen);
        icon.classList.toggle("fa-xmark", isOpen);
      }
    });
  }

  // Discount popup is only present on the home page.
  const popup = document.getElementById("popup-box");
  const backdrop = document.getElementById("popup-backdrop");

  function closePopup() {
    popup?.classList.remove("pop-apper");
    backdrop?.classList.remove("active");
  }

  if (popup && backdrop) {
    window.setTimeout(() => popup.classList.add("pop-apper"), 1000);
    document.getElementById("close-btn")?.addEventListener("click", closePopup);
    backdrop.addEventListener("click", closePopup);
    document.querySelector(".skip")?.addEventListener("click", closePopup);
  }
});
