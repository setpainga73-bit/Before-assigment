/**
 * Bean Boutique — Plugins & Widgets JS
 *
 * Plugin 1 : Social Media Community Feed Widget
 *            Renders animated review/community cards into #community-feed-grid
 *
 * Plugin 2 : Interactive Map Widget — Scroll-reveal animation
 *            Triggers fade-in when the #location-widget enters the viewport
 *
 * Plugin 3 : Dark Mode Toggle
 *            Floating sun/moon button; persists preference in localStorage
 *            Applies [data-theme="dark"] on <html> to switch CSS variables
 */

document.addEventListener("DOMContentLoaded", () => {

  /* ═══════════════════════════════════════════════════════
     PLUGIN 1 — Social Media Community Feed Widget
     Renders rich animated cards into #community-feed-grid
     ═══════════════════════════════════════════════════════ */

  (function renderCommunityFeed() {
    const grid = document.getElementById("community-feed-grid");
    if (!grid) return;

    const posts = [
      {
        name: "Myo Thant",
        initial: "M",
        platform: "Instagram",
        platformIcon: "fa-brands fa-instagram",
        text: "The Ethiopia Yirgacheffe roast from Bean Boutique is absolutely incredible — bright, floral, and like nothing I've had before. My new morning ritual! ☕",
        likes: 142,
        stars: 5,
        time: "2 hours ago",
        color: "#E1306C"
      },
      {
        name: "Su Myat",
        initial: "S",
        platform: "Facebook",
        platformIcon: "fa-brands fa-facebook",
        text: "Just attended the Latte Art Workshop and I'm completely hooked! The baristas are so patient and talented. Managed to pour a rosetta on my first try!",
        likes: 98,
        stars: 5,
        time: "Yesterday",
        color: "#1877F2"
      },
      {
        name: "Aung Ko",
        initial: "A",
        platform: "X (Twitter)",
        platformIcon: "fa-brands fa-x-twitter",
        text: "Cozy atmosphere, friendly staff, and the Cappuccino is perfection. Bean Boutique is my go-to spot every Saturday morning. Highly recommend to everyone! 🌟",
        likes: 76,
        stars: 5,
        time: "3 days ago",
        color: "#000000"
      },
      {
        name: "Khin Moe",
        initial: "K",
        platform: "Instagram",
        platformIcon: "fa-brands fa-instagram",
        text: "The Cold Brew here is a game-changer. Rich, smooth, and never bitter. I've been coming every week and I never get tired of it. Bean Boutique never disappoints!",
        likes: 203,
        stars: 5,
        time: "5 days ago",
        color: "#E1306C"
      }
    ];

    posts.forEach((post, i) => {
      const stars = "★".repeat(post.stars) + "☆".repeat(5 - post.stars);
      const card = document.createElement("article");
      card.className = "cf-card";
      card.style.animationDelay = (i * 0.12) + "s";
      card.setAttribute("aria-label", "Community post by " + post.name);
      card.innerHTML = `
        <div class="cf-card-header">
          <div class="cf-avatar" style="background:linear-gradient(135deg,#c8752a,#f0b97a)">
            ${post.initial}
          </div>
          <div class="cf-user-info">
            <div class="cf-username">${post.name}</div>
            <div class="cf-platform">
              <i class="${post.platformIcon}" style="color:${post.color}"></i>
              ${post.platform}
            </div>
          </div>
          <i class="${post.platformIcon} cf-platform-icon" style="color:${post.color};font-size:22px;opacity:0.15"></i>
        </div>
        <p class="cf-text">${post.text}</p>
        <div class="cf-footer">
          <span class="cf-likes">
            <i class="fa-solid fa-heart"></i> ${post.likes} likes
          </span>
          <span class="cf-stars" title="${post.stars} out of 5 stars">${stars}</span>
          <span class="cf-time">${post.time}</span>
        </div>
      `;
      grid.appendChild(card);
    });

    // Stagger-reveal on scroll
    const feedSection = document.getElementById("community-feed");
    if (feedSection) {
      const feedObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              feedSection.classList.add("feed-revealed");
              feedObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );
      feedObserver.observe(feedSection);
    }
  })();


  /* ═══════════════════════════════════════════════════════
     PLUGIN 2 — Interactive Map Widget — Scroll Reveal
     Fades in the #location-widget when user scrolls to it
     ═══════════════════════════════════════════════════════ */

  (function initMapReveal() {
    const mapWidget   = document.getElementById("location-widget");
    const trustBadges = document.getElementById("trust-badges");

    const revealEls = [mapWidget, trustBadges].filter(Boolean);
    if (!revealEls.length) return;

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("widget-revealed");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealEls.forEach((el) => {
      el.classList.add("widget-hidden");
      revealObserver.observe(el);
    });
  })();


  /* ═══════════════════════════════════════════════════════
     PLUGIN 3 — Dark Mode Toggle
     Floating button with animated sun ↔ moon icon.
     Applies data-theme="dark" on <html>; persists in localStorage.
     ═══════════════════════════════════════════════════════ */

  (function initDarkMode() {

    /* ── 1. Create the floating toggle button ── */
    const btn = document.createElement("button");
    btn.id            = "dark-mode-toggle";
    btn.className     = "dm-toggle";
    btn.setAttribute("aria-label", "Toggle dark mode");
    btn.setAttribute("title",      "Toggle dark / light mode");
    btn.innerHTML = `
      <span class="dm-icon dm-sun"  aria-hidden="true">☀️</span>
      <span class="dm-icon dm-moon" aria-hidden="true">🌙</span>
      <span class="dm-ripple"></span>
    `;
    document.body.appendChild(btn);

    /* ── 2. Read saved preference (or system preference) ── */
    const stored = localStorage.getItem("bb_theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = stored ? stored === "dark" : prefersDark;

    function applyTheme(dark) {
      document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
      btn.classList.toggle("dm-is-dark", dark);
      btn.setAttribute("aria-pressed", dark ? "true" : "false");
      localStorage.setItem("bb_theme", dark ? "dark" : "light");
    }

    applyTheme(isDark);

    /* ── 3. Toggle on click (with ripple animation) ── */
    btn.addEventListener("click", () => {
      const ripple = btn.querySelector(".dm-ripple");
      ripple.classList.remove("dm-ripple-active");
      void ripple.offsetWidth; // reflow to restart animation
      ripple.classList.add("dm-ripple-active");

      const nowDark = document.documentElement.getAttribute("data-theme") !== "dark";
      applyTheme(nowDark);
    });

    /* ── 4. Listen for system-level theme changes ── */
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
      if (!localStorage.getItem("bb_theme")) applyTheme(e.matches);
    });

  })();

});
