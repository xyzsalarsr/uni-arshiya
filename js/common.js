const cartStorageKey = "poosha-demo-cart";

function formatPersianNumber(value) {
  return new Intl.NumberFormat("fa-IR").format(value);
}

function formatToman(value) {
  return `${formatPersianNumber(value)} تومان`;
}

function escapeHTML(value) {
  return String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character],
  );
}

// دادهٔ خراب یا قدیمی سبد خرید را نادیده می‌گیریم تا صفحه همچنان باز شود.
function readCart() {
  try {
    const storedCart = localStorage.getItem(cartStorageKey);
    if (!storedCart) return [];
    const parsedCart = JSON.parse(storedCart);
    if (!Array.isArray(parsedCart))
      throw new Error("ساختار سبد خرید معتبر نیست.");
    return parsedCart.filter((item) => {
      const product = products.find((entry) => entry.id === item.productId);
      return (
        product &&
        product.sizes.includes(item.size) &&
        product.colors.includes(item.color) &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0
      );
    });
  } catch (error) {
    try {
      localStorage.removeItem(cartStorageKey);
    } catch (storageError) {
      /* دسترسی به storage ممکن است بسته باشد. */
    }
    return [];
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(cartStorageKey, JSON.stringify(cart));
    return true;
  } catch (error) {
    return false;
  }
}

function updateCartCount() {
  const count = readCart().reduce((total, item) => total + item.quantity, 0);
  document.querySelectorAll("[data-cart-count]").forEach((element) => {
    element.textContent = formatPersianNumber(count);
  });
}

function addToCart(product, size, color, quantity) {
  const cart = readCart();
  const existingItem = cart.find(
    (item) =>
      item.productId === product.id &&
      item.size === size &&
      item.color === color,
  );
  if (existingItem) existingItem.quantity += quantity;
  else cart.push({ productId: product.id, size, color, quantity });
  if (!saveCart(cart)) return false;
  updateCartCount();
  return true;
}

function createProductCard(product) {
  const detailsURL = `product.html?id=${encodeURIComponent(product.id)}`;
  return `<article class="product-card">
    <a class="product-image-link" href="${detailsURL}" aria-label="مشاهدهٔ ${escapeHTML(product.name)}">
      <img class="product-image" src="${escapeHTML(product.image)}" alt="${escapeHTML(product.alt)}" loading="lazy" data-fallback-image>
    </a>
    <div class="product-card-body">
      <p class="product-category">${escapeHTML(product.category)}</p>
      <h3><a href="${detailsURL}">${escapeHTML(product.name)}</a></h3>
      <div class="product-card-bottom"><span class="product-price">${formatToman(product.price)}</span><a class="card-arrow" href="${detailsURL}" aria-label="جزئیات ${escapeHTML(product.name)}">←</a></div>
    </div>
  </article>`;
}

function setUpSharedInteractions() {
  updateCartCount();
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".main-nav");
  if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
      const expanded = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!expanded));
      menuButton.setAttribute(
        "aria-label",
        expanded ? "باز کردن منو" : "بستن منو",
      );
      navigation.classList.toggle("is-open", !expanded);
    });
    navigation.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        navigation.classList.remove("is-open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "باز کردن منو");
      }
    });
  }

  document.addEventListener(
    "error",
    (event) => {
      const image = event.target;
      if (
        image instanceof HTMLImageElement &&
        image.hasAttribute("data-fallback-image") &&
        !image.dataset.fallbackApplied
      ) {
        image.dataset.fallbackApplied = "true";
        image.src = "assets/product-placeholder.svg";
      }
    },
    true,
  );
}

window.Poosha = {
  formatPersianNumber,
  formatToman,
  readCart,
  addToCart,
  createProductCard,
};
document.addEventListener("DOMContentLoaded", setUpSharedInteractions);
