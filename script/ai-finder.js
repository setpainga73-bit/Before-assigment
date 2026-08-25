document.addEventListener("DOMContentLoaded", () => {
  const PRODUCTS = [
    { id: "black-coffee", name: "Black Coffee", price: 2, img: "../photo/coffee-card/blackcoffee.coffee.jpg", tags: ["rich", "black", "focus", "morning"], reason: "A clean, bold classic for a focused start." },
    { id: "cappuccino", name: "Cappuccino", price: 2, img: "../photo/coffee-card/Cappuccino.jpg", tags: ["rich", "creamy", "morning", "social"], reason: "Foamy, balanced, and easy to settle into." },
    { id: "espresso", name: "Espresso", price: 2, img: "../photo/coffee-card/espresso.coffee.jpg", tags: ["rich", "black", "focus", "treat"], reason: "Small, intense, and built for a quick reset." },
    { id: "flat-white", name: "Flat White", price: 2, img: "../photo/coffee-card/flat-white.jpg", tags: ["creamy", "rich", "focus", "morning"], reason: "Velvety texture with enough structure to stay present." },
    { id: "iced-latte", name: "Iced Latte", price: 2, img: "../photo/coffee-card/ice latte.jpg", tags: ["creamy", "refreshing", "social", "morning"], reason: "A smooth, chilled pick-me-up with a soft finish." },
    { id: "irish-coffee", name: "Irish Coffee", price: 2, img: "../photo/coffee-card/Irish Coffee.jpg", tags: ["rich", "creamy", "treat", "social"], reason: "A warm, celebratory cup for slower evenings." },
    { id: "kiwi-soda", name: "Kiwi Soda", price: 2, img: "../photo/coffee-card/kiwi-soda.jpg", tags: ["refreshing", "different", "social", "treat"], reason: "Bright, sparkling, and a little outside the usual." },
    { id: "latte", name: "Latte", price: 2, img: "../photo/coffee-card/latte.jpg", tags: ["creamy", "morning", "social", "treat"], reason: "Gentle, familiar, and made for an unhurried moment." },
    { id: "matcha", name: "Matcha", price: 2, img: "../photo/coffee-card/macha.coffee.jpg", tags: ["different", "creamy", "focus", "morning"], reason: "Earthy and calm when you want a different kind of ritual." }
  ];

  const form = document.getElementById("brew-match-form");
  const prompt = document.getElementById("taste-prompt");
  const resultSection = document.getElementById("recommendation-section");
  const resultGrid = document.getElementById("recommendation-grid");
  const resultSummary = document.getElementById("recommendation-summary");
  const resetButton = document.getElementById("reset-match");
  const cartCount = document.getElementById("cart-count");
  const liveRegion = document.createElement("div");
  liveRegion.className = "sr-only";
  liveRegion.setAttribute("aria-live", "polite");
  document.body.appendChild(liveRegion);

  if (!form || !prompt) return;

  const getCart = () => {
    try { return JSON.parse(localStorage.getItem("bb_cart") || "[]"); } catch (_error) { return []; }
  };

  const saveCart = (cart) => {
    localStorage.setItem("bb_cart", JSON.stringify(cart));
    updateCartCount(cart);
  };

  const updateCartCount = (cart = getCart()) => {
    if (cartCount) cartCount.textContent = cart.reduce((total, item) => total + item.qty, 0);
  };

  const announce = (message) => {
    liveRegion.textContent = message;
    window.setTimeout(() => { liveRegion.textContent = ""; }, 2400);
  };

  const addToCart = (product) => {
    const cart = getCart();
    const existing = cart.find((item) => item.id === product.id);
    if (existing) existing.qty += 1;
    else cart.push({ id: product.id, name: product.name, price: product.price, qty: 1, img: product.img });
    saveCart(cart);
    announce(`${product.name} added to your cart.`);
  };

  const renderRecommendationCard = (product, index) => `
    <article class="recommendation-card" style="--recommendation-delay:${index * 70}ms">
      <div class="recommendation-image"><img src="${product.img}" alt="${product.name}" loading="lazy" /><span>Match ${index + 1}</span></div>
      <div class="recommendation-copy"><div class="recommendation-card-top"><span>For your ritual</span><strong>$${product.price.toFixed(2)}</strong></div><h3>${product.name}</h3><p>${product.reason}</p><button class="recommendation-add product-add" type="button" data-product="${product.id}"><i class="fa-solid fa-plus"></i> Add to cart</button></div>
    </article>`;

  const getRecommendations = () => {
    const words = prompt.value.toLowerCase();
    const moment = document.getElementById("moment-select")?.value || "morning";
    const milk = document.getElementById("milk-select")?.value || "any";
    const signals = new Set([moment]);
    const phraseSignals = [
      ["bold", "rich"], ["strong", "rich"], ["intense", "rich"], ["bitter", "rich"], ["chocolate", "rich"],
      ["smooth", "creamy"], ["creamy", "creamy"], ["milk", "creamy"], ["sweet", "treat"], ["treat", "treat"],
      ["cold", "refreshing"], ["iced", "refreshing"], ["ice", "refreshing"], ["fresh", "refreshing"], ["sparkling", "refreshing"],
      ["different", "different"], ["new", "different"], ["tea", "different"], ["matcha", "different"], ["black", "black"], ["no milk", "black"]
    ];
    phraseSignals.forEach(([phrase, signal]) => { if (words.includes(phrase)) signals.add(signal); });
    if (milk === "with-milk") signals.add("creamy");
    if (milk === "black") signals.add("black");
    if (milk === "fresh") signals.add("different");

    return PRODUCTS.map((product) => {
      const score = product.tags.reduce((total, tag) => total + (signals.has(tag) ? 3 : 0), 0);
      const diversityBonus = product.tags.includes("different") && signals.has("different") ? 1 : 0;
      return { ...product, score: score + diversityBonus };
    }).sort((a, b) => b.score - a.score || a.name.localeCompare(b.name)).slice(0, 3);
  };

  const runMatch = () => {
    const recommendations = getRecommendations();
    const momentLabel = document.getElementById("moment-select")?.selectedOptions[0]?.textContent || "your ritual";
    resultGrid.innerHTML = recommendations.map(renderRecommendationCard).join("");
    resultSummary.textContent = `Based on your preferences for ${momentLabel.toLowerCase()}, these are the three cups we would start with.`;
    resultSection.hidden = false;
    resultSection.classList.remove("is-visible");
    requestAnimationFrame(() => resultSection.classList.add("is-visible"));
    resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
    announce("Your three BrewMatch recommendations are ready.");
  };

  document.querySelectorAll(".prompt-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      prompt.value = chip.dataset.prompt || "";
      prompt.focus();
    });
  });

  form.addEventListener("submit", (event) => { event.preventDefault(); runMatch(); });
  resetButton?.addEventListener("click", () => {
    resultSection.hidden = true;
    prompt.focus();
    document.getElementById("brew-match")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  document.addEventListener("click", (event) => {
    const addButton = event.target.closest(".product-add");
    if (!addButton) return;
    const product = PRODUCTS.find((item) => item.id === addButton.dataset.product);
    if (!product) return;
    addToCart(product);
    const original = addButton.innerHTML;
    addButton.classList.add("added");
    addButton.innerHTML = '<i class="fa-solid fa-check"></i> Added';
    window.setTimeout(() => { addButton.innerHTML = original; addButton.classList.remove("added"); }, 1400);
  });

  const search = document.getElementById("coffee-search");
  const filterButtons = document.querySelectorAll(".filter-pill");
  const catalogCards = [...document.querySelectorAll(".redesigned-card")];
  const emptyCatalog = document.getElementById("empty-catalog");
  const catalogCount = document.getElementById("catalog-count");
  let activeFilter = "all";

  const filterCatalog = () => {
    const query = (search?.value || "").trim().toLowerCase();
    let visible = 0;
    catalogCards.forEach((card) => {
      const matchesQuery = !query || card.textContent.toLowerCase().includes(query);
      const tags = card.dataset.tags?.split(" ") || [];
      const matchesFilter = activeFilter === "all" || tags.includes(activeFilter);
      const show = matchesQuery && matchesFilter;
      card.hidden = !show;
      if (show) visible += 1;
    });
    if (catalogCount) catalogCount.textContent = `${visible} ${visible === 1 ? "drink" : "drinks"}`;
    if (emptyCatalog) emptyCatalog.hidden = visible !== 0;
  };

  search?.addEventListener("input", filterCatalog);
  filterButtons.forEach((button) => button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    activeFilter = button.dataset.filter || "all";
    filterCatalog();
  }));

  updateCartCount();
});
