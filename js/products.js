document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("product-search");
  const categoryFilter = document.getElementById("category-filter");
  const sortFilter = document.getElementById("sort-filter");
  const productsContainer = document.getElementById("all-products");
  const resultsCount = document.getElementById("results-count");
  const emptyState = document.getElementById("empty-state");
  const requestedCategory = new URLSearchParams(window.location.search).get(
    "category",
  );

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.label;
    categoryFilter.append(option);
  });
  if (categories.some((category) => category.id === requestedCategory))
    categoryFilter.value = requestedCategory;

  function renderProducts() {
    const query = searchInput.value.trim().toLocaleLowerCase("fa");
    let matchingProducts = products.filter((product) => {
      const matchesName = product.name.toLocaleLowerCase("fa").includes(query);
      const matchesCategory =
        !categoryFilter.value || product.categoryId === categoryFilter.value;
      return matchesName && matchesCategory;
    });

    if (sortFilter.value === "low")
      matchingProducts.sort((first, second) => first.price - second.price);
    if (sortFilter.value === "high")
      matchingProducts.sort((first, second) => second.price - first.price);

    resultsCount.textContent = `${Poosha.formatPersianNumber(matchingProducts.length)} محصول پیدا شد.`;
    productsContainer.innerHTML = matchingProducts
      .map((product) => Poosha.createProductCard(product))
      .join("");
    emptyState.hidden = matchingProducts.length > 0;
  }

  searchInput.addEventListener("input", renderProducts);
  categoryFilter.addEventListener("change", renderProducts);
  sortFilter.addEventListener("change", renderProducts);
  renderProducts();
});
