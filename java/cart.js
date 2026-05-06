// ── Cart data ────────────────────────────────────────────────────────────────
let cart = [
  { id: 1, name: "Black Coffee", price: 2.0, qty: 1, img: "../photo/coffee-card/blackcoffee.coffee.jpg" },
  { id: 2, name: "Cappuccino",   price: 2.0, qty: 1, img: "../photo/coffee-card/Cappuccino.jpg" },
  { id: 3, name: "Iced Latte",   price: 2.0, qty: 1, img: "../photo/coffee-card/ice latte.jpg" }
];

const SHIPPING = 1.0;
const el = (id) => document.getElementById(id);

// ── Render cart table ────────────────────────────────────────────────────────
function render() {
  const tbody = el("cart-body");
  if (!tbody) return;

  tbody.innerHTML = cart
    .map(
      (item) => `
    <tr>
      <td data-label="Product"><div class="product-cell">
        <img class="cart-thumb" src="${item.img}" alt="${item.name}">
        <span>${item.name}</span>
      </div></td>
      <td data-label="Price">$${item.price.toFixed(2)}</td>
      <td data-label="Quantity">
        <div class="qty-control">
          <button onclick="updateQty(${item.id}, -1)">−</button>
          <span>${item.qty}</span>
          <button onclick="updateQty(${item.id}, 1)">+</button>
        </div>
      </td>
      <td data-label="Subtotal">$${(item.price * item.qty).toFixed(2)}</td>
      <td><button class="remove-btn" onclick="removeItem(${item.id})"><i class="fa-solid fa-xmark"></i></button></td>
    </tr>`
    )
    .join("");

  const sub = cart.reduce((s, i) => s + i.price * i.qty, 0);
  el("sum-subtotal").textContent = `$${sub.toFixed(2)}`;
  el("sum-shipping").textContent = `$${(cart.length ? SHIPPING : 0).toFixed(2)}`;
  el("sum-total").textContent    = `$${(cart.length ? sub + SHIPPING : 0).toFixed(2)}`;

  el("cart-empty").style.display   = cart.length ? "none" : "flex";
  el("cart-actions").style.display = cart.length ? "flex" : "none";
  el("checkout-btn").disabled      = !cart.length;
}

// ── Quantity update ──────────────────────────────────────────────────────────
function updateQty(id, delta) {
  const item = cart.find((i) => i.id === id);
  if (item) item.qty = Math.max(1, item.qty + delta);
  render();
}

// ── Remove item ──────────────────────────────────────────────────────────────
function removeItem(id) {
  cart = cart.filter((i) => i.id !== id);
  render();
}

// ── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  const checkoutBtn = el("checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () =>
      alert("Thank you for shopping at Bean Boutique!\nYour order is being processed.")
    );
  }
  render();
});
