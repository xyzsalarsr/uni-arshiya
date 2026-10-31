document.addEventListener("DOMContentLoaded", () => {
  const featuredContainer = document.getElementById("featured-products");
  const featuredProducts = products
    .filter((product) => product.featured)
    .slice(0, 4);
  featuredContainer.innerHTML = featuredProducts
    .map((product) => Poosha.createProductCard(product))
    .join("");
});
