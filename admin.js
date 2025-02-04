document.addEventListener("DOMContentLoaded", function () {
  loadProducts(); // Завантажуємо список товарів при завантаженні сторінки

  // Обробник події для форми додавання товару
  document
    .getElementById("product-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      // Зчитування даних з форми
      const productName = document.getElementById("product-name").value;
      const productSize = document.getElementById("product-size").value;
      const productPrice = document.getElementById("product-price").value; // Зчитування ціни
      const productImageInput = document.getElementById("product-image");
      const file = productImageInput.files[0];

      if (!file) {
        alert("Будь ласка, виберіть файл!");
        return;
      }

      // Читаємо файл і перетворюємо його у DataURL
      const reader = new FileReader();
      reader.onload = function (event) {
        const productImage = event.target.result;

        // Отримуємо існуючі товари з localStorage або створюємо порожній масив
        let products = JSON.parse(localStorage.getItem("products")) || [];
        products.push({
          name: productName,
          size: productSize,
          price: productPrice, // Додаємо ціну до об'єкта товару
          image: productImage,
        });

        localStorage.setItem("products", JSON.stringify(products));

        alert("Товар додано успішно!");
        // Очищаємо форму
        document.getElementById("product-form").reset();
        // Повертаємо початковий текст під полем завантаження файлу
        document.getElementById("file-name").textContent = "Файл не вибрано";

        loadProducts(); // Оновлюємо список товарів після додавання
      };

      reader.readAsDataURL(file);
    });

  // Обробник події для оновлення назви обраного файлу
  document
    .getElementById("product-image")
    .addEventListener("change", function () {
      const fileNameSpan = document.getElementById("file-name");
      if (this.files.length > 0) {
        fileNameSpan.textContent = this.files[0].name;
      } else {
        fileNameSpan.textContent = "Файл не вибрано";
      }
    });

  // Функція для завантаження товарів у адмін-панелі
  function loadProducts() {
    const productList = document.getElementById("product-list");
    productList.innerHTML = ""; // Очищаємо поточний список

    let products = JSON.parse(localStorage.getItem("products")) || [];

    if (products.length === 0) {
      productList.innerHTML = "<p>Немає доданих товарів</p>";
      return;
    }

    products.forEach((product, index) => {
      const productItem = document.createElement("div");
      productItem.className = "admin-product";
      productItem.innerHTML = `
          <img src="${product.image}" alt="${product.name}" class="admin-product-img">
          <div>
            <h3>${product.name}</h3>
            <p>Розмір: ${product.size}</p>
            <p>Ціна: ${product.price} грн</p>
          </div>
          <button class="delete-button" onclick="deleteProduct(${index})">❌ Видалити</button>
        `;
      productList.appendChild(productItem);
    });
  }

  // Робимо функцію видалення глобальною для використання через onclick
  window.deleteProduct = function (index) {
    let products = JSON.parse(localStorage.getItem("products")) || [];
    products.splice(index, 1); // Видаляємо товар за індексом
    localStorage.setItem("products", JSON.stringify(products));
    loadProducts(); // Оновлюємо список товарів
  };
});
