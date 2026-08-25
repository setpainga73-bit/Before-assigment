document.addEventListener("DOMContentLoaded", () => {
  const feed = document.getElementById("community-feed-grid");
  if (feed) {
    const posts = [
      { name: "Myo Thant", initial: "M", platform: "Instagram", icon: "fa-brands fa-instagram", color: "#e1306c", text: "The Ethiopia Yirgacheffe is bright, floral, and like nothing I have had before. My new morning ritual.", likes: 142, time: "2 hours ago" },
      { name: "Su Myat", initial: "S", platform: "Facebook", icon: "fa-brands fa-facebook", color: "#1877f2", text: "The Latte Art Workshop was so welcoming. I poured a rosetta on my first try and cannot stop practising.", likes: 98, time: "Yesterday" },
      { name: "Aung Ko", initial: "A", platform: "X", icon: "fa-brands fa-x-twitter", color: "#111", text: "Cozy atmosphere, friendly staff, and a Cappuccino that is absolute perfection. My Saturday place.", likes: 76, time: "3 days ago" },
      { name: "Khin Moe", initial: "K", platform: "Instagram", icon: "fa-brands fa-instagram", color: "#e1306c", text: "The Cold Brew is smooth, rich, and never bitter. I keep coming back every week.", likes: 203, time: "5 days ago" }
    ];
    feed.innerHTML = posts.map((post, index) => `
      <article class="cf-card" style="animation-delay:${index * 70}ms" aria-label="Community post by ${post.name}">
        <div class="cf-card-header"><div class="cf-avatar">${post.initial}</div><div class="cf-user-info"><div class="cf-username">${post.name}</div><div class="cf-platform"><i class="${post.icon}" style="color:${post.color}"></i>${post.platform}</div></div><i class="${post.icon} cf-platform-icon" style="color:${post.color}"></i></div>
        <p class="cf-text">${post.text}</p><div class="cf-footer"><span class="cf-likes"><i class="fa-solid fa-heart"></i> ${post.likes} likes</span><span class="cf-stars" aria-label="5 out of 5 stars">★★★★★</span><span class="cf-time">${post.time}</span></div>
      </article>`).join("");
  }

  const revealTargets = [document.getElementById("community-feed"), document.getElementById("location-widget"), document.getElementById("trust-badges")].filter(Boolean);
  if ("IntersectionObserver" in window && revealTargets.length) {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("widget-revealed", "feed-revealed"); observer.unobserve(entry.target); }
    }), { threshold: .12 });
    revealTargets.forEach((target) => { target.classList.add("widget-hidden"); observer.observe(target); });
  }

  const button = document.createElement("button");
  button.id = "dark-mode-toggle";
  button.className = "dm-toggle redesign-theme-toggle";
  button.setAttribute("aria-label", "Toggle dark mode");
  button.setAttribute("title", "Toggle dark / light mode");
  button.innerHTML = '<i class="fa-solid fa-sun dm-sun dm-icon" aria-hidden="true"></i><i class="fa-solid fa-moon dm-moon dm-icon" aria-hidden="true"></i>';
  document.body.appendChild(button);

  const preference = localStorage.getItem("bb_theme");
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  const applyTheme = (dark) => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    button.classList.toggle("dm-is-dark", dark);
    button.setAttribute("aria-pressed", String(dark));
    localStorage.setItem("bb_theme", dark ? "dark" : "light");
  };
  applyTheme(preference ? preference === "dark" : Boolean(prefersDark));
  button.addEventListener("click", () => applyTheme(document.documentElement.getAttribute("data-theme") !== "dark"));
});
