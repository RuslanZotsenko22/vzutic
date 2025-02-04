document.addEventListener("DOMContentLoaded", function () {
  // Отримуємо кнопки фільтрації та картки товарів (якщо вони вже є на сторінці)
  const sizeButtons = document.querySelectorAll(".buttons button");
  const productCards = document.querySelectorAll(".product-card");
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Кнопка кошика
  const cartButton = document.createElement("button");
  cartButton.textContent = "🛒 Кошик";
  cartButton.className = "cart-button";
  document.querySelector("header").appendChild(cartButton);

  // Функція оновлення кнопки кошика
  function updateCartButton() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cartButton.textContent =
      cart.length > 0 ? `🛒 Кошик +${cart.length}` : "🛒 Кошик";
  }
  updateCartButton();

  // Фільтрація товарів за розміром
  sizeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const selectedSize = this.textContent;
      if (selectedSize === "Всі") {
        productCards.forEach((card) => {
          card.style.display = "block";
        });
      } else {
        productCards.forEach((card) => {
          const productSize = card.getAttribute("data-size");
          card.style.display = productSize === selectedSize ? "block" : "none";
        });
      }
    });
  });

  // Додавання товарів у кошик
  function addToCart(product) {
    // Переконуємось, що властивість price існує, інакше присвоюємо дефолтне значення
    if (typeof product.price === "undefined" || product.price === null) {
      product.price = "Ціна не вказана";
    }
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartButton();
    renderCartItems();
  }

  // Модальне вікно кошика
  const cartModal = document.createElement("div");
  cartModal.className = "cart-modal hidden";
  cartModal.innerHTML = `
      <div class="cart-content">
        <span class="close-button">&times;</span>
        <h2>Ваш кошик</h2>
        <ul class="cart-items"></ul>
        <button class="clear-cart">Очистити кошик</button>
      </div>
    `;
  document.body.appendChild(cartModal);

  const cartItemsList = cartModal.querySelector(".cart-items");
  const closeButton = cartModal.querySelector(".close-button");
  const clearCartButton = cartModal.querySelector(".clear-cart");
  const modalOverlay = document.createElement("div");
  modalOverlay.className = "modal-overlay";
  document.body.appendChild(modalOverlay);

  // Функція для відображення товарів у кошику
  function renderCartItems() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cartItemsList.innerHTML = ""; // Очищаємо попередній вміст

    if (cart.length === 0) {
      cartItemsList.innerHTML = "<p>Кошик порожній</p>";
    } else {
      cart.forEach((product, index) => {
        const li = document.createElement("li");
        // Якщо product.price не визначена, виводимо дефолтний текст
        const priceText =
          typeof product.price !== "undefined"
            ? `${product.price} грн`
            : "Ціна не вказана";
        li.textContent = `${product.name} - ${product.size} - ${priceText}`;
        const removeButton = document.createElement("button");
        removeButton.textContent = "❌";
        removeButton.onclick = function () {
          removeFromCart(index);
        };
        li.appendChild(removeButton);
        cartItemsList.appendChild(li);
      });
    }
  }

  function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCartItems();
    updateCartButton();
  }

  function openCart() {
    renderCartItems();
    cartModal.classList.add("show");
    modalOverlay.classList.add("show");
  }

  function closeCart() {
    cartModal.classList.remove("show");
    modalOverlay.classList.remove("show");
  }

  cartButton.addEventListener("click", openCart);
  closeButton.addEventListener("click", closeCart);
  modalOverlay.addEventListener("click", closeCart);

  clearCartButton.addEventListener("click", function () {
    cart = [];
    localStorage.removeItem("cart");
    renderCartItems();
    updateCartButton();
  });

  // Функція для відображення товарів на сторінці
  function displayProducts(products) {
    const productContainer = document.querySelector(".products");
    productContainer.innerHTML = "";
    products.forEach((product) => {
      console.log(product); // Лог для перевірки даних продукту
      const productCard = document.createElement("div");
      productCard.className = "product-card";
      productCard.setAttribute("data-size", product.size);
      productCard.innerHTML = `
          <img src="${product.image}" alt="${product.name}">
          <h2>${product.name}</h2>
          <p>Розмір: ${product.size}</p>
          <p>${
            typeof product.price !== "undefined"
              ? product.price
              : "Ціна не вказана"
          } грн</p>
          <button class="add-to-cart">Додати в кошик</button>
        `;
      // Додаємо функціонал додавання товару в кошик
      productCard
        .querySelector(".add-to-cart")
        .addEventListener("click", function () {
          addToCart(product);
        });
      productContainer.appendChild(productCard);
    });
  }

  // Функція для завантаження товарів з localStorage
  function loadLocalProducts() {
    const products = JSON.parse(localStorage.getItem("products")) || [];
    displayProducts(products);
  }

  // Функція для збереження товарів у localStorage, якщо їх ще немає
  function saveProductsToLocalStorage() {
    const products = [
      {
        name: "Кросівки Nike",
        size: "37",
        price: 1500,
        image: "shoe1.jpg",
      },
      {
        name: "Кросівки Adidas",
        size: "39",
        price: 1600,
        image: "shoe2.jpg",
      },
      {
        name: "Кросівки Puma",
        size: "41",
        price: 1700,
        image: "shoe3.jpg",
      },
    ];
    localStorage.setItem("products", JSON.stringify(products));
  }

  // Якщо в localStorage немає товарів, зберігаємо їх
  if (!localStorage.getItem("products")) {
    saveProductsToLocalStorage();
  }

  // Завантажуємо товари з localStorage для відображення на сторінці
  loadLocalProducts();

  // Якщо API не використовується, можна прибрати fetchProducts()
  // async function fetchProducts() {
  //   try {
  //     const response = await fetch("/api/products");
  //     const products = await response.json();
  //     displayProducts(products);
  //   } catch (error) {
  //     console.error("Помилка отримання товарів:", error);
  //   }
  // }
  // fetchProducts();
});
