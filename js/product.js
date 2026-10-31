document.addEventListener("DOMContentLoaded", () => {
  const detailContainer = document.getElementById("product-detail");
  const relatedSection = document.getElementById("related-section");
  const productId = new URLSearchParams(window.location.search).get("id");
  const product = products.find((entry) => entry.id === productId);

  if (!product) {
    document.title = "محصول پیدا نشد | پوشا";
    detailContainer.innerHTML = `<section class="empty-state missing-product"><p class="eyebrow">صفحهٔ محصول</p><h1>این محصول پیدا نشد.</h1><p>شناسهٔ واردشده معتبر نیست یا محصولی با آن شناسه وجود ندارد.</p><a class="button button-primary" href="products.html">بازگشت به همهٔ محصولات</a></section>`;
    return;
  }

  document.title = `${product.name} | پوشا`;
  detailContainer.innerHTML = `<nav class="breadcrumbs" aria-label="مسیر صفحه"><a href="index.html">خانه</a><span aria-hidden="true">/</span><a href="products.html?category=${encodeURIComponent(product.categoryId)}">${product.category}</a><span aria-hidden="true">/</span><span aria-current="page">${product.name}</span></nav>
    <section class="product-detail">
      <div class="detail-image-wrap"><img class="detail-image" src="${product.image}" alt="${product.alt}" data-fallback-image></div>
      <div class="detail-copy">
        <p class="eyebrow">${product.category}</p><h1>${product.name}</h1>
        <p class="detail-price">${Poosha.formatToman(product.price)}</p>
        <p class="detail-description">${product.description}</p>
        <dl class="product-facts"><div><dt>جنس پارچه</dt><dd>${product.fabric}</dd></div><div><dt>روش نگهداری</dt><dd>${product.care}</dd></div></dl>
        <form class="add-to-cart-form" id="add-to-cart-form" novalidate>
          <div class="form-row"><div class="field"><label for="size-select">انتخاب سایز <span aria-hidden="true">*</span></label><select id="size-select" required><option value="">سایز را انتخاب کن</option>${product.sizes.map((size) => `<option value="${size}">${size}</option>`).join("")}</select></div>
          <div class="field"><label for="color-select">انتخاب رنگ <span aria-hidden="true">*</span></label><select id="color-select" required><option value="">رنگ را انتخاب کن</option>${product.colors.map((color) => `<option value="${color}">${color}</option>`).join("")}</select></div></div>
          <div class="field quantity-field"><label for="quantity-input">تعداد</label><input id="quantity-input" type="number" min="1" max="10" step="1" value="1" inputmode="numeric"></div>
          <p class="form-message" id="form-message" role="status" aria-live="polite"></p>
          <button class="button button-primary add-button" type="submit">افزودن به سبد خرید</button>
        </form>
        <p class="demo-disclaimer">این فروشگاه نمایشی است و امکان ثبت سفارش یا پرداخت واقعی ندارد.</p>
      </div>
    </section>`;

  const form = document.getElementById("add-to-cart-form");
  const message = document.getElementById("form-message");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const size = document.getElementById("size-select").value;
    const color = document.getElementById("color-select").value;
    const quantity = Number(document.getElementById("quantity-input").value);
    if (!size || !color) {
      message.textContent = "لطفاً سایز و رنگ را انتخاب کن.";
      message.classList.add("is-error");
      return;
    }
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
      message.textContent = "تعداد باید عددی صحیح بین ۱ تا ۱۰ باشد.";
      message.classList.add("is-error");
      return;
    }
    if (!Poosha.addToCart(product, size, color, quantity)) {
      message.textContent = "ذخیرهٔ سبد خرید در این مرورگر در دسترس نیست.";
      message.classList.add("is-error");
      return;
    }
    message.textContent = `${product.name}، سایز ${size} و رنگ ${color} به سبد نمایشی اضافه شد.`;
    message.classList.remove("is-error");
  });

  const relatedProducts = products
    .filter(
      (entry) =>
        entry.categoryId === product.categoryId && entry.id !== product.id,
    )
    .slice(0, 3);
  if (relatedProducts.length) {
    document.getElementById("related-products").innerHTML = relatedProducts
      .map((entry) => Poosha.createProductCard(entry))
      .join("");
    relatedSection.hidden = false;
  }
});
