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
  const popup    = document.getElementById("popup-box");
  const backdrop = document.getElementById("popup-backdrop");

  function openPopup() {
    if (popup)    popup.classList.add("pop-apper");
    if (backdrop) backdrop.classList.add("active");
  }

  function closePopup() {
    if (popup)    popup.classList.remove("pop-apper");
    if (backdrop) backdrop.classList.remove("active");
  }

  setTimeout(openPopup, 1000);

  const closeBtn = document.getElementById("close-btn");
  if (closeBtn) closeBtn.addEventListener("click", closePopup);

  // Clicking the backdrop also closes the popup
  if (backdrop) backdrop.addEventListener("click", closePopup);

  // "No thanks" link closes popup
  const skipBtn = document.querySelector(".skip");
  if (skipBtn) skipBtn.addEventListener("click", closePopup);
});

