const KEY = "unboxlove_products";

const defaults = [
  {
    id: 1,
    name: "Rose Ribbon Bouquet",
    cat: "Ribbon Bouquets",
    price: 899,
    desc: "Elegant handmade ribbon flowers.",
    emoji: "💐",
    image: ""
  },
  {
    id: 2,
    name: "Forever Love Hamper",
    cat: "Gift Hampers",
    price: 1299,
    desc: "A beautiful curated surprise hamper.",
    emoji: "🎁",
    image: ""
  },
  {
    id: 3,
    name: "Resin Heart Keepsake",
    cat: "Resin Art",
    price: 699,
    desc: "A glossy heart made to keep forever.",
    emoji: "💖",
    image: ""
  },
  {
    id: 4,
    name: "Handmade Memory Box",
    cat: "Handmade Gifts",
    price: 599,
    desc: "A sweet little personalised gift.",
    emoji: "🧸",
    image: ""
  },
  {
    id: 5,
    name: "Mini Ribbon Bouquet",
    cat: "Ribbon Bouquets",
    price: 499,
    desc: "A cute bouquet for a little surprise.",
    emoji: "🌷",
    image: ""
  },
  {
    id: 6,
    name: "Resin Initial Keychain",
    cat: "Keychains",
    price: 349,
    desc: "A pretty resin keepsake for your keys.",
    emoji: "✨",
    image: ""
  },
  {
    id: 7,
    name: "Birthday Gift Hamper",
    cat: "Gift Hampers",
    price: 1099,
    desc: "Thoughtful goodies packed together.",
    emoji: "🎀",
    image: ""
  },
  {
    id: 8,
    name: "Love Notes Gift Set",
    cat: "Handmade Gifts",
    price: 449,
    desc: "Tiny handmade notes with big feelings.",
    emoji: "💌",
    image: ""
  }
];

let products =
  JSON.parse(localStorage.getItem(KEY)) || defaults;

let cart =
  JSON.parse(localStorage.getItem("ul_cart")) || [];

let filter = "All";


function save() {
  localStorage.setItem(
    KEY,
    JSON.stringify(products)
  );

  localStorage.setItem(
    "ul_cart",
    JSON.stringify(cart)
  );
}


function escapeHtml(text) {
  return String(text ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}


function render() {

  const cats = [
    "All",
    "Ribbon Bouquets",
    "Gift Hampers",
    "Handmade Gifts",
    "Resin Art",
    "Keychains"
  ];

  document.getElementById("cats").innerHTML =
    cats.map(c => `
      <button
        class="cat ${filter === c ? "active" : ""}"
        onclick="setFilter('${c}')">
        ${c}
      </button>
    `).join("");


  const list =
    filter === "All"
      ? products
      : products.filter(p => p.cat === filter);


  document.getElementById("products").innerHTML =
    list.map(p => {

      let visual = p.image
        ? `
          <div
            class="visual"
            style="background-image:url('${p.image}')">
          </div>
        `
        : `
          <div class="visual">
            ${p.emoji || "🎁"}
          </div>
        `;


      return `
        <article class="card">

          ${visual}

          <div class="info">

            <h3>
              ${escapeHtml(p.name)}
            </h3>

            <p>
              ${escapeHtml(p.desc || "")}
            </p>

            <span class="price">
              ₹${Number(p.price).toLocaleString("en-IN")}
            </span>

            <button
              class="add"
              onclick="add(${p.id})">
              Add +
            </button>

          </div>

        </article>
      `;

    }).join("");


  document.getElementById("cartCount").textContent =
    cart.reduce(
      (total, item) => total + item.qty,
      0
    );
}


function setFilter(category) {
  filter = category;
  render();
}


function add(id) {

  let item =
    cart.find(x => x.id === id);

  if (item) {
    item.qty++;
  } else {
    cart.push({
      id: id,
      qty: 1
    });
  }

  save();
  render();
  openCart();
}


function openCart() {

  document
    .getElementById("modal")
    .classList.remove("hidden");

  renderCart();
}


function closeCart() {

  document
    .getElementById("modal")
    .classList.add("hidden");
}


function renderCart() {

  let total = 0;


  document.getElementById("items").innerHTML =
    cart.length

      ? cart.map(item => {

          let product =
            products.find(
              p => p.id === item.id
            );

          if (!product) {
            return "";
          }


          let subtotal =
            Number(product.price) * item.qty;

          total += subtotal;


          return `
            <div class="row">

              <span>
                ${escapeHtml(product.name)}
                × ${item.qty}
              </span>

              <b>
                ₹${subtotal.toLocaleString("en-IN")}
              </b>

              <button
                onclick="removeItem(${item.id})">
                ×
              </button>

            </div>
          `;

        }).join("")

      : "<p>Your bag is empty.</p>";


  document.getElementById("total").textContent =
    total.toLocaleString("en-IN");
}


function removeItem(id) {

  cart =
    cart.filter(
      item => item.id !== id
    );

  save();
  render();
  renderCart();
}


/* =========================================
   WHATSAPP ORDER
   ========================================= */

function orderWhatsApp() {

  if (!cart.length) {
    return alert("Your bag is empty");
  }


  const name =
    document
      .getElementById("custName")
      .value
      .trim();


  const customerPhone =
    document
      .getElementById("custPhone")
      .value
      .trim();


  const address =
    document
      .getElementById("custAddress")
      .value
      .trim();


  const city =
    document
      .getElementById("custCity")
      .value
      .trim();


  const pincode =
    document
      .getElementById("custPincode")
      .value
      .trim();


  if (
    !name ||
    !customerPhone ||
    !address ||
    !city ||
    !pincode
  ) {
    return alert(
      "Please fill all delivery details ❤️"
    );
  }


  const cleanCustomerPhone =
    customerPhone.replace(/\D/g, "");


  if (!/^\d{10}$/.test(cleanCustomerPhone)) {
    return alert(
      "Please enter a valid 10-digit mobile number"
    );
  }


  if (!/^\d{6}$/.test(pincode)) {
    return alert(
      "Please enter a valid 6-digit pincode"
    );
  }


  /*
   * YOUR UNBOX LOVE WHATSAPP NUMBER
   *
   * 9043094724
   * India country code = 91
   *
   * Final WhatsApp number:
   * 919043094724
   */

  const shopWhatsApp =
    "919043094724";


  let total = 0;


  const orderItems =
    cart.map(item => {

      const product =
        products.find(
          p => p.id === item.id
        );


      if (!product) {
        return "";
      }


      const subtotal =
        Number(product.price) *
        item.qty;


      total += subtotal;


      return (
        `${product.name} x ${item.qty}` +
        ` = ₹${subtotal}`
      );

    })
    .filter(Boolean)
    .join("\n");


  const message =
`Hi Unbox Love! ❤️

*NEW ORDER*

${orderItems}

*CUSTOMER DETAILS*

Name: ${name}
Mobile: ${cleanCustomerPhone}
Address: ${address}
City: ${city}
Pincode: ${pincode}

*TOTAL: ₹${total}*

Please send me the WhatsApp payment QR. ❤️`;


  /*
   * Directly opens WhatsApp chat
   * with 9043094724.
   */

  const whatsappURL =
    "https://api.whatsapp.com/send" +
    "?phone=" +
    shopWhatsApp +
    "&text=" +
    encodeURIComponent(message);


  window.location.href =
    whatsappURL;
}


/* CART BUTTON */

document
  .getElementById("cartBtn")
  .onclick = openCart;


/* START STORE */

render();
