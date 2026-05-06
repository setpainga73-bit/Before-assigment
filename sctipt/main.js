document.addEventListener("DOMContentLoaded", () => {
  // ── Mobile navigation toggle ────────────────────────────────────────────────
  const menuToggle = document.getElementById("menu-toggle");
  const navMenu = document.querySelector("nav ul");

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      const icon = menuToggle.querySelector("i");
      if (icon) {
        if (navMenu.classList.contains("active")) {
          icon.classList.remove("fa-bars");
          icon.classList.add("fa-xmark");
        } else {
          icon.classList.remove("fa-xmark");
          icon.classList.add("fa-bars");
        }
      }
    });
  }

  // ── Discount popup (index.html only) ────────────────────────────────────────
  setTimeout(function () {
    const popup = document.getElementById("popup-box");
    if (popup) popup.classList.add("pop-apper");
  }, 1000);

  const closeBtn = document.getElementById("close-btn");
  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      document.getElementById("popup-box").classList.remove("pop-apper");
    });
  }
});
