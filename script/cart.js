const DEFAULT_CART = [
  { id: "black-coffee", name: "Black Coffee", price: 2, qty: 1, img: "../photo/coffee-card/blackcoffee.coffee.jpg" },
  { id: "cappuccino", name: "Cappuccino", price: 2, qty: 1, img: "../photo/coffee-card/Cappuccino.jpg" },
  { id: "iced-latte", name: "Iced Latte", price: 2, qty: 1, img: "../photo/coffee-card/ice latte.jpg" }
];

const SHIPPING = 1;
const el = (id) => document.getElementById(id);

function readCart() {
  try {
    const stored = JSON.parse(localStorage.getItem("bb_cart") || "null");
    return Array.isArray(stored) ? stored : DEFAULT_CART.map((item) => ({ ...item }));
  } catch (_error) {
    return DEFAULT_CART.map((item) => ({ ...item }));
  }
}

let cart = readCart();

function persistCart() {
  localStorage.setItem("bb_cart", JSON.stringify(cart));
}

function render() {
  const tbody = el("cart-body");
  if (!tbody) return;

  tbody.innerHTML = cart.map((item) => `
    <tr>
      <td data-label="Product"><div class="product-cell"><img class="cart-thumb" src="${item.img}" alt="${item.name}"><span>${item.name}</span></div></td>
      <td data-label="Price">$${Number(item.price).toFixed(2)}</td>
      <td data-label="Quantity"><div class="qty-control"><button class="qty-btn" aria-label="Decrease ${item.name} quantity" onclick="updateQty('${item.id}', -1)">−</button><span class="qty-val">${item.qty}</span><button class="qty-btn" aria-label="Increase ${item.name} quantity" onclick="updateQty('${item.id}', 1)">+</button></div></td>
      <td data-label="Subtotal">$${(Number(item.price) * item.qty).toFixed(2)}</td>
      <td><button class="remove-btn" aria-label="Remove ${item.name}" onclick="removeItem('${item.id}')"><i class="fa-solid fa-xmark"></i></button></td>
    </tr>`).join("");

  const subtotal = cart.reduce((sum, item) => sum + Number(item.price) * item.qty, 0);
  if (el("sum-subtotal")) el("sum-subtotal").textContent = `$${subtotal.toFixed(2)}`;
  if (el("sum-shipping")) el("sum-shipping").textContent = `$${cart.length ? SHIPPING.toFixed(2) : "0.00"}`;
  if (el("sum-total")) el("sum-total").textContent = `$${cart.length ? (subtotal + SHIPPING).toFixed(2) : "0.00"}`;
  if (el("cart-empty")) el("cart-empty").style.display = cart.length ? "none" : "flex";
  if (el("cart-actions")) el("cart-actions").style.display = cart.length ? "flex" : "none";
  if (el("checkout-btn")) el("checkout-btn").disabled = !cart.length;

  const navCount = document.getElementById("cart-count");
  if (navCount) navCount.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
}

function updateQty(id, delta) {
  const item = cart.find((entry) => entry.id === id);
  if (item) item.qty = Math.max(1, item.qty + delta);
  persistCart();
  render();
  window.dispatchEvent(new CustomEvent("bb-cart-updated"));
}

function removeItem(id) {
  cart = cart.filter((item) => item.id !== id);
  persistCart();
  render();
  window.dispatchEvent(new CustomEvent("bb-cart-updated"));
}

window.updateQty = updateQty;
window.removeItem = removeItem;

document.addEventListener("DOMContentLoaded", () => {
  el("checkout-btn")?.addEventListener("click", () => alert("Thank you for shopping at Bean Boutique!\nYour order is being processed."));
  render();
});
