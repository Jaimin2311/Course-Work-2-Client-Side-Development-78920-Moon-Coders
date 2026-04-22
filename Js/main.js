// main.js here i have added the client side code for the shopping cart functionality, 
// as well as some utility functions for formatting currency and managing the cart state in localStorage.
(function () {
  const cartKey = "zilk-cart";
  const products = [
    {
      id: "macbook-air-m2",
      name: "Apple MacBook Air M2",
      brand: "Apple",
      type: "Laptop",
      condition: "Brand new",
      price: 1099,
      oldPrice: 1199,
      tag: "New arrival",
      image: "https://images.wsj.net/im-581987?width=1950&height=1463"
    },
    {
      id: "asus-zenbook-ux334",
      name: "ASUS ZenBook UX334",
      brand: "ASUS",
      type: "Laptop",
      condition: "Used - excellent",
      price: 649,
      oldPrice: 799,
      tag: "Used deal",
      image: "https://upload.wikimedia.org/wikipedia/commons/c/ce/ASUS_ZenBook_UX334_20190601.jpg"
    },
    {
      id: "airpods-pro-2",
      name: "Apple AirPods Pro 2nd Gen",
      brand: "Apple",
      type: "Earbuds",
      condition: "Brand new",
      price: 219,
      oldPrice: 249,
      tag: "Popular",
      image: "https://static.vecteezy.com/system/resources/previews/015/192/978/non_2x/kharkiv-ukraine-january-27-2022-apple-airpods-pro-on-a-white-background-wireless-headphones-with-charging-case-and-a-box-apple-inc-is-an-american-technology-company-free-photo.JPG"
    },
    {
      id: "sony-wf-1000xm4",
      name: "Sony WF-1000XM4 Earbuds",
      brand: "Sony",
      type: "Earbuds",
      condition: "Used - good",
      price: 179,
      oldPrice: 229,
      tag: "Sony audio",
      image: "https://upload.wikimedia.org/wikipedia/commons/f/f8/Sony_WF-1000XM4.jpg"
    },
    {
      id: "razer-deathadder",
      name: "Razer DeathAdder Mouse",
      brand: "Razer",
      type: "Mouse",
      condition: "Used - excellent",
      price: 59,
      oldPrice: 79,
      tag: "Gaming gear",
      image: "https://p16-oec-general-useast5.ttcdn-us.com/tos-useast5-i-omjb5zjo8w-tx/e32e3a4b2b824892b332068661f8dbf5~tplv-fhlh96nyum-crop-webp:2000:2000.webp?dr=12190&t=555f072d&ps=933b5bde&shp=8dbd94bf&shcp=e1be8f53&idc=useast5&from=2378011839"
    }
  ];
   // added constants and functions relating to server.js here for good code management as main.js is getting long.
  const productGrid = document.getElementById("product-grid");
  const cartCount = document.getElementById("cart-count");
  const cartItems = document.getElementById("cart-items");
  const cartSubtotal = document.getElementById("cart-subtotal");
  const cartDrawer = document.getElementById("cart-drawer");
  const overlay = document.getElementById("drawer-overlay");
  const cartToggle = document.getElementById("cart-toggle");
  const cartClose = document.getElementById("cart-close");
  const checkoutItems = document.getElementById("checkout-items");
  const subtotalNode = document.getElementById("summary-subtotal");
  const deliveryNode = document.getElementById("summary-delivery");
  const totalNode = document.getElementById("summary-total");
  const checkoutForm = document.getElementById("checkout-form");
  const checkoutMessage = document.getElementById("checkout-message");
  const contactForm = document.getElementById("contact-form");
  const contactMessage = document.getElementById("contact-message");
// currency format for GBP because our project is in the UK
  function formatCurrency(value) {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0
    }).format(value);
  }
// cart management functions to manage the shopping cart functionality.
  function readCart() {
    try {
      return JSON.parse(localStorage.getItem(cartKey)) || [];
    } catch (error) {
      return [];
    }
  }

  function writeCart(cart) {
    localStorage.setItem(cartKey, JSON.stringify(cart));
  }

  function getCartDetails() {
    return readCart()
      .map(function (item) {
        const product = products.find(function (entry) {
          return entry.id === item.id;
        });

        if (!product) {
          return null;
        }

        return {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: item.quantity
        };
      })
      .filter(Boolean);
  }

  function renderProducts() {
    productGrid.innerHTML = products
      .map(function (product) {
        return `
          <article class="product-card" data-reveal>
            <div class="product-media">
              <img src="${product.image}" alt="${product.name}" />
              <span class="product-tag">${product.tag}</span>
            </div>
            <div class="product-body">
              <div class="product-meta">
                <span>${product.brand}</span>
                <small>${product.type}</small>
              </div>
              <h3>${product.name}</h3>
              <div class="price-row">
                <strong>${formatCurrency(product.price)}</strong>
                <small>${formatCurrency(product.oldPrice)}</small>
              </div>
              <div class="product-actions">
                <span class="product-condition">${product.condition}</span>
                <button class="add-cart-button" type="button" data-product-id="${product.id}">Add to cart</button>
              </div>
            </div>
          </article>
        `;
      })
      .join("");

    setupReveal();
  }

  function updateCartUI() {
    const cart = getCartDetails();
    const totalItems = cart.reduce(function (sum, item) {
      return sum + item.quantity;
    }, 0);
    const subtotal = cart.reduce(function (sum, item) {
      return sum + item.price * item.quantity;
    }, 0);
    const delivery = cart.length ? (subtotal >= 500 ? 0 : 15) : 0;
    const total = subtotal + delivery;

    cartCount.textContent = String(totalItems);
    cartSubtotal.textContent = formatCurrency(subtotal);
    subtotalNode.textContent = formatCurrency(subtotal);
    deliveryNode.textContent = delivery ? formatCurrency(delivery) : "Free";
    totalNode.textContent = formatCurrency(total);

    if (!cart.length) {
      const emptyText = '<div class="empty-state">Your cart is empty. Add a product to continue.</div>';
      cartItems.innerHTML = emptyText;
      checkoutItems.innerHTML = emptyText;
      return;
    }

    cartItems.innerHTML = cart
      .map(function (item) {
        return `
          <div class="cart-line">
            <div class="cart-line-info">
              <strong>${item.name}</strong>
              <span class="cart-line-meta">${item.quantity} x ${formatCurrency(item.price)}</span>
            </div>
            <button class="remove-line" type="button" data-remove-id="${item.id}">Remove</button>
          </div>
        `;
      })
      .join("");

    checkoutItems.innerHTML = cart
      .map(function (item) {
        return `
          <div class="checkout-item">
            <div class="checkout-item-info">
              <strong>${item.name}</strong>
              <span>${item.quantity} x ${formatCurrency(item.price)}</span>
            </div>
            <strong>${formatCurrency(item.price * item.quantity)}</strong>
          </div>
        `;
      })
      .join("");
  }
// add to cart, remove from cart, open cart, close cart functions 
  function addToCart(productId) {
    const cart = readCart();
    const existingItem = cart.find(function (item) {
      return item.id === productId;
    });

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ id: productId, quantity: 1 });
    }

    writeCart(cart);
    updateCartUI();
    openCart();
  }

  function removeFromCart(productId) {
    const nextCart = readCart().filter(function (item) {
      return item.id !== productId;
    });
    writeCart(nextCart);
    updateCartUI();
  }

  function openCart() {
    cartDrawer.classList.add("open");
    overlay.classList.add("visible");
    cartDrawer.setAttribute("aria-hidden", "false");
  }

  function closeCart() {
    cartDrawer.classList.remove("open");
    overlay.classList.remove("visible");
    cartDrawer.setAttribute("aria-hidden", "true");
  }

  function setupReveal() {
    const revealItems = document.querySelectorAll("[data-reveal]:not(.is-visible)");

    if (!("IntersectionObserver" in window)) {
      revealItems.forEach(function (item) {
        item.classList.add("is-visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealItems.forEach(function (item) {
      observer.observe(item);
    });
  }

  productGrid.addEventListener("click", function (event) {
    const button = event.target.closest("[data-product-id]");
    if (!button) {
      return;
    }
    addToCart(button.dataset.productId);
  });

  cartItems.addEventListener("click", function (event) {
    const button = event.target.closest("[data-remove-id]");
    if (!button) {
      return;
    }
    removeFromCart(button.dataset.removeId);
  });

  cartToggle.addEventListener("click", openCart);
  cartClose.addEventListener("click", closeCart);
  overlay.addEventListener("click", closeCart);

  checkoutForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!readCart().length) {
      checkoutMessage.textContent = "Add at least one product before placing the order.";
      return;
    }

    localStorage.removeItem(cartKey);
    checkoutForm.reset();
    checkoutMessage.textContent = "Order placed successfully. Thanks for shopping with Zilk.";
    updateCartUI();
    closeCart();
  });

  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();
    contactForm.reset();
    contactMessage.textContent = "Message sent successfully. We will reply soon.";
  });

  renderProducts();
  updateCartUI();
  setupReveal();
})();
