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
    cat: "Resin Art",
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

let products = JSON.parse(localStorage.getItem(KEY)) || defaults;
let cart = JSON.parse(localStorage.getItem("ul_cart")) || [];
let filter = "All";

function save() {
  localStorage.setItem(KEY, JSON.stringify(products));
  localStorage.setItem("ul_cart", JSON.stringify(cart));
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
    cats.map(c =>
      `<button class="cat ${filter === c ? "active" : ""}"
        onclick="setFilter('${c}')">${c}</button>`
    ).join("");

  const list =
    filter === "All"
      ? products
      : products.filter(p => p.cat === filter);

  document.getElementById("products").innerHTML =
    list.map(p => {

      let visual = p.image
        ? `<div class="visual" style="background-image:url('${p.image}')"></div>`
        : `<div class="visual">${p.emoji || "🎁"}</div>`;

      return `
        <article class="card">

          ${visual}

          <div class="info">

            <h3>${escapeHtml(p.name)}</h3>

            <p>${escapeHtml(p.desc || "")}</p>

            <span class="price">
              ₹${Number(p.price).toLocaleString("en-IN")}
            </span>

            <button class="add" onclick="add(${p.id})">
              Add +
            </button>

          </div>

        </article>
      `;

    }).join("");

  document.getElementById("cartCount").textContent =
    cart.reduce((a, x) => a + x.qty, 0);
}

function escapeHtml(text) {
  return String(text ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function setFilter(x) {
  filter = x;
  render();
}

function add(id) {

  let x = cart.find(i => i.id === id);

  if (x) {
    x.qty++;
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
  document.getElementById("modal").classList.remove("hidden");
  renderCart();
}

function closeCart() {
  document.getElementById("modal").classList.add("hidden");
}

function renderCart() {

  let total = 0;

  document.getElementById("items").innerHTML =
    cart.length
      ? cart.map(i => {

          let p = products.find(x => x.id === i.id);

          if (!p) return "";

          let s = Number(p.price) * i.qty;

          total += s;

          return `
            <div class="row">

              <span>
                ${escapeHtml(p.name)} × ${i.qty}
              </span>

              <b>₹${s.toLocaleString("en-IN")}</b>

              <button onclick="removeItem(${i.id})">
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

  cart = cart.filter(x => x.id !== id);

  save();
  render();
  renderCart();
}

function orderWhatsApp() {

  if (!cart.length) {
    return alert("Your bag is empty");
  }

  const name =
    document.getElementById("custName").value.trim();

  const phoneCustomer =
    document.getElementById("custPhone").value.trim();

  const address =
    document.getElementById("custAddress").value.trim();

  const city =
    document.getElementById("custCity").value.trim();

  const pincode =
    document.getElementById("custPincode").value.trim();


  if (
    !name ||
    !phoneCustomer ||
    !address ||
    !city ||
    !pincode
  ) {
    return alert("Please fill all delivery details ❤️");
  }


  /*
    IMPORTANT:
    Correct 10-digit Indian mobile validation.
  */

  const cleanPhone =
    phoneCustomer.replace(/\D/g, "");

  if (!/^\d{10}$/.test(cleanPhone)) {
    return alert("Please enter a valid 10-digit mobile number");
  }


  /*
    Correct 6-digit pincode validation.
  */

  if (!/^\d{6}$/.test(pincode)) {
    return alert("Please enter a valid 6-digit pincode");
  }


  /*
    Your WhatsApp business number.
    You can later change this from Admin.
  */

  let phone =
    localStorage.getItem("ul_whatsapp") ||
    "919999999999";


  let total = 0;

  let lines = cart.map(i => {

    let p = products.find(x => x.id === i.id);

    if (!p) return "";

    let s = Number(p.price) * i.qty;

    total += s;

    return `${p.name} x ${i.qty} = ₹${s}`;

  }).filter(Boolean).join("\n");


  const message =
`Hi Unbox Love! ❤️

*New Order*

${lines}

*Customer Details*

Name: ${name}
Mobile: ${cleanPhone}
Address: ${address}
City: ${city}
Pincode: ${pincode}

*Total: ₹${total}*

Please send me the WhatsApp payment QR.`;


  const url =
    `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  window.location.href = url;
}


document.getElementById("cartBtn").onclick = openCart;

render();
