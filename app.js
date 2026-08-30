const KEY = "unboxlove_products";

const defaults = [
  {
    name: "Love Resin Keychain",
    price: 299,
    cat: "Keychains",
    desc: "A cute personalised resin keychain.",
    image: ""
  },
  {
    name: "Mini Gift Hamper",
    price: 799,
    cat: "Gift Hampers",
    desc: "A sweet little hamper for someone special.",
    image: ""
  },
  {
    name: "Resin Name Art",
    price: 699,
    cat: "Resin Art",
    desc: "Handmade resin art with a personalised touch.",
    image: ""
  },
  {
    name: "Ribbon Love Bouquet",
    price: 599,
    cat: "Ribbon Bouquets",
    desc: "A forever bouquet made with beautiful ribbons.",
    image: ""
  }
];


/* =========================
   YOUR WHATSAPP NUMBER
   ========================= */

const WHATSAPP_NUMBER = "919043094724";


/* =========================
   PRODUCTS
   ========================= */

function getProducts() {

  let savedProducts = localStorage.getItem(KEY);

  if (savedProducts) {

    try {

      const products = JSON.parse(savedProducts);

      if (Array.isArray(products)) {
        return products;
      }

    } catch (error) {

      console.log("Product data error:", error);

    }

  }

  localStorage.setItem(KEY, JSON.stringify(defaults));

  return defaults;
}


function money(n) {
  return "₹" + Number(n).toLocaleString("en-IN");
}


/* =========================
   CART
   ========================= */

let cart =
  JSON.parse(localStorage.getItem("unboxlove_cart")) || [];


function saveCart() {
  localStorage.setItem(
    "unboxlove_cart",
    JSON.stringify(cart)
  );
}


function cartCount() {

  return cart.reduce(
    (total, item) => total + item.qty,
    0
  );

}


function cartTotal() {

  return cart.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );

}


function updateCartCount() {

  const count =
    document.getElementById("cartCount");

  if (count) {
    count.textContent = cartCount();
  }

}


/* =========================
   ADD TO CART
   ========================= */

function addToCart(index) {

  const products = getProducts();

  const product = products[index];

  if (!product) {
    return;
  }


  const existing = cart.find(
    item => item.name === product.name
  );


  if (existing) {

    existing.qty++;

  } else {

    cart.push({
      name: product.name,
      price: Number(product.price),
      qty: 1
    });

  }


  saveCart();

  updateCartCount();

  renderCart();


  alert(
    product.name + " added to cart 🛒"
  );

}


/* =========================
   CHANGE QUANTITY
   ========================= */

function changeQty(index, change) {

  if (!cart[index]) {
    return;
  }


  cart[index].qty += change;


  if (cart[index].qty <= 0) {

    cart.splice(index, 1);

  }


  saveCart();

  updateCartCount();

  renderCart();

}


/* =========================
   RENDER CART
   ========================= */

function renderCart() {

  const container =
    document.getElementById("cartItems");

  const total =
    document.getElementById("cartTotal");


  if (!container || !total) {
    return;
  }


  if (cart.length === 0) {

    container.innerHTML = `
      <div class="empty">
        Your cart is empty 🛍️
      </div>
    `;

    total.textContent = "0";

    return;
  }


  container.innerHTML = cart.map(
    (item, index) => `

      <div class="cart-item">

        <div>

          <strong>
            ${item.name}
          </strong>

          <div>
            ${money(item.price)}
          </div>

        </div>


        <div class="quantity">

          <button
            onclick="changeQty(${index}, -1)"
          >
            −
          </button>

          <span>
            ${item.qty}
          </span>

          <button
            onclick="changeQty(${index}, 1)"
          >
            +
          </button>

        </div>

      </div>

    `
  ).join("");


  total.textContent =
    Number(cartTotal()).toLocaleString("en-IN");

}


/* =========================
   PRODUCTS DISPLAY
   ========================= */

function render(cat = "All") {

  const allProducts = getProducts();


  const products = allProducts.filter(
    product =>
      cat === "All" ||
      product.cat === cat
  );


  const grid =
    document.querySelector("#productGrid");


  if (!grid) {
    return;
  }


  if (products.length === 0) {

    grid.innerHTML = `
      <div class="empty">
        No products in this category yet.
      </div>
    `;

    return;
  }


  grid.innerHTML = products.map(
    product => {

      const index =
        allProducts.findIndex(
          item =>
            item.name === product.name &&
            item.cat === product.cat
        );


      return `

        <article class="card">

          <div
            class="pic"
            ${
              product.image
                ? `style="background-image:url('${String(product.image).replaceAll("'", "%27")}')"`
                : ""
            }
          >
            ${
              product.image
                ? ""
                : "🎁"
            }
          </div>


          <div class="card-body">

            <small>
              ${product.cat}
            </small>


            <h3>
              ${product.name}
            </h3>


            <p class="desc">
              ${product.desc || ""}
            </p>


            <div class="price">
              ${money(product.price)}
            </div>


            <button
              class="add-cart-btn"
              onclick="addToCart(${index})"
            >
              🛒 Add to Cart
            </button>

          </div>

        </article>

      `;

    }
  ).join("");

}


/* =========================
   FILTERS
   ========================= */

function filters() {

  const buttons =
    document.querySelectorAll(".filter");


  buttons.forEach(button => {

    button.addEventListener(
      "click",
      function () {

        buttons.forEach(
          b => b.classList.remove("active")
        );


        this.classList.add("active");


        render(
          this.dataset.cat
        );

      }
    );

  });

}


/* =========================
   CART OPEN
   ========================= */

function openCart() {

  renderCart();


  const overlay =
    document.getElementById("cartOverlay");


  if (overlay) {

    overlay.style.display = "flex";

  }

}


/* =========================
   CART CLOSE
   ========================= */

function closeCart() {

  const overlay =
    document.getElementById("cartOverlay");


  if (overlay) {

    overlay.style.display = "none";

  }

}


/* =========================
   CHECKOUT OPEN
   ========================= */

function openCheckout() {

  if (cart.length === 0) {

    alert(
      "Your cart is empty 🛍️"
    );

    return;
  }


  closeCart();


  const overlay =
    document.getElementById(
      "checkoutOverlay"
    );


  if (overlay) {

    overlay.style.display = "flex";

  }

}


/* =========================
   CHECKOUT CLOSE
   ========================= */

function closeCheckout() {

  const overlay =
    document.getElementById(
      "checkoutOverlay"
    );


  if (overlay) {

    overlay.style.display = "none";

  }

}


/* =========================
   WHATSAPP ORDER
   ========================= */

function sendOrderToWhatsApp(
  name,
  phone,
  address,
  payment
) {


  if (
    !WHATSAPP_NUMBER ||
    WHATSAPP_NUMBER.includes("X")
  ) {

    alert(
      "WhatsApp number is not configured."
    );

    return;

  }


  let orderText = "";


  cart.forEach(
    (item, index) => {

      orderText +=
        `${index + 1}. ${item.name} x ${item.qty} - ${money(item.price * item.qty)}\n`;

    }
  );


  const message = `
🛍️ *NEW ORDER - UNBOX LOVE*

👤 Customer: ${name}
📱 Phone: ${phone}

📍 Address:
${address}

📦 *ORDER ITEMS*
${orderText}

💰 *TOTAL: ${money(cartTotal())}*

💳 Payment Method:
WhatsApp Payment

Please send me the payment QR code.

Thank you ❤️
`;


  const url =
    "https://wa.me/" +
    WHATSAPP_NUMBER +
    "?text=" +
    encodeURIComponent(message);


  window.open(
    url,
    "_blank"
  );

}


/* =========================
   PLACE ORDER
   ========================= */

function placeOrder(event) {

  event.preventDefault();


  if (cart.length === 0) {

    alert(
      "Your cart is empty."
    );

    return;

  }


  const name =
    document
      .getElementById("customerName")
      .value
      .trim();


  const phone =
    document
      .getElementById("customerPhone")
      .value
      .trim();


  const address =
    document
      .getElementById("customerAddress")
      .value
      .trim();


  if (
    !name ||
    !phone ||
    !address
  ) {

    alert(
      "Please fill all customer details."
    );

    return;

  }


  sendOrderToWhatsApp(
    name,
    phone,
    address,
    "WHATSAPP"
  );


  cart = [];


  saveCart();

  updateCartCount();

  renderCart();

  closeCheckout();


  alert(
    "Order details WhatsApp-la open aagum ❤️\n\n" +
    "Please press SEND in WhatsApp to confirm the order."
  );


  document
    .getElementById("orderForm")
    .reset();

}


/* =========================
   INITIALIZE
   ========================= */

function init() {

  filters();

  render();

  updateCartCount();

  renderCart();


  document
    .getElementById("cartBtn")
    ?.addEventListener(
      "click",
      openCart
    );


  document
    .getElementById("closeCart")
    ?.addEventListener(
      "click",
      closeCart
    );


  document
    .getElementById("checkoutBtn")
    ?.addEventListener(
      "click",
      openCheckout
    );


  document
    .getElementById("closeCheckout")
    ?.addEventListener(
      "click",
      closeCheckout
    );


  document
    .getElementById("orderForm")
    ?.addEventListener(
      "submit",
      placeOrder
    );

}


init();
