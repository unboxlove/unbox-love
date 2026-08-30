const KEY = "unboxlove_products";
const CART_KEY = "unboxlove_cart";

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

function getProducts() {
let p = JSON.parse(localStorage.getItem(KEY));

if (!p) {
p = defaults;
localStorage.setItem(KEY, JSON.stringify(p));
}

return p;
}

function getCart() {
return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart) {
localStorage.setItem(CART_KEY, JSON.stringify(cart));
updateCartCount();
}

function money(n) {
return "₹" + Number(n).toLocaleString("en-IN");
}

/* =========================
PRODUCTS
========================= */

function render(cat = "All") {

let products = getProducts().filter(
x => cat === "All" || x.cat === cat
);

let grid = document.querySelector("#productGrid");

grid.innerHTML = products.length
? products.map((x, index) => {

```
    const realIndex = getProducts().indexOf(x);

    return `
      <article class="card">

        <div
          class="pic"
          ${x.image
            ? `style="background-image:url('${x.image.replaceAll("'", "%27")}')"`
            : ""}
        >
          ${x.image ? "" : "🎁"}
        </div>

        <div class="card-body">

          <small>${x.cat}</small>

          <h3>${x.name}</h3>

          <p class="desc">
            ${x.desc || ""}
          </p>

          <div class="price">
            ${money(x.price)}
          </div>

          <div class="product-actions">

            <button
              class="details-btn"
              onclick="showProduct(${realIndex})"
            >
              View Details
            </button>

            <button
              class="cart-btn"
              onclick="addToCart(${realIndex})"
            >
              🛒 Add to Cart
            </button>

          </div>

        </div>

      </article>
    `;

  }).join("")
: `<div class="empty">No products in this category yet.</div>`;
```

}

/* =========================
FILTERS
========================= */

function filters() {

let cats = [
"All",
...new Set(getProducts().map(x => x.cat))
];

document.querySelector("#filters").innerHTML =
cats.map(c => `       <button
        class="${c === "All" ? "active" : ""}"
        onclick="setCat('${c.replaceAll("'", "\\'")}',this)"       >
        ${c}       </button>
    `).join("");
}

function setCat(c, b) {

document
.querySelectorAll(".filters button")
.forEach(x => x.classList.remove("active"));

b.classList.add("active");

render(c);
}

/* =========================
ADD TO CART
========================= */

function addToCart(index) {

const products = getProducts();
const product = products[index];

let cart = getCart();

const existing = cart.find(
item => item.name === product.name
);

if (existing) {

```
existing.qty += 1;
```

} else {

```
cart.push({
  name: product.name,
  price: Number(product.price),
  image: product.image || "",
  qty: 1
});
```

}

saveCart(cart);

openCart();

}

/* =========================
CART COUNT
========================= */

function updateCartCount() {

const cart = getCart();

const count = cart.reduce(
(total, item) => total + item.qty,
0
);

const countElement =
document.querySelector("#cartCount");

if (countElement) {
countElement.textContent = count;
}
}

/* =========================
CART UI
========================= */

function openCart() {

document
.querySelector("#cartDrawer")
.classList.add("open");

renderCart();
}

function closeCart() {

document
.querySelector("#cartDrawer")
.classList.remove("open");
}

function renderCart() {

const cart = getCart();

const container =
document.querySelector("#cartItems");

const totalElement =
document.querySelector("#cartTotal");

if (!cart.length) {

```
container.innerHTML = `
  <div class="empty-cart">
    🛒
    <h3>Your cart is empty</h3>
    <p>Add something lovely to your cart.</p>
  </div>
`;

totalElement.textContent = money(0);

return;
```

}

container.innerHTML = cart.map((item, index) => `

```
<div class="cart-item">

  <div class="cart-image">

    ${
      item.image
        ? `<img src="${item.image}" alt="${item.name}">`
        : "🎁"
    }

  </div>

  <div class="cart-info">

    <h4>${item.name}</h4>

    <p>${money(item.price)}</p>

    <div class="quantity">

      <button onclick="changeQty(${index},-1)">
        −
      </button>

      <span>${item.qty}</span>

      <button onclick="changeQty(${index},1)">
        +
      </button>

    </div>

  </div>

  <button
    class="remove-btn"
    onclick="removeCartItem(${index})"
  >
    ×
  </button>

</div>
```

`).join("");

const total = cart.reduce(
(sum, item) =>
sum + item.price * item.qty,
0
);

totalElement.textContent = money(total);
}

/* =========================
QUANTITY
========================= */

function changeQty(index, change) {

let cart = getCart();

cart[index].qty += change;

if (cart[index].qty <= 0) {
cart.splice(index, 1);
}

saveCart(cart);

renderCart();
}

/* =========================
REMOVE
========================= */

function removeCartItem(index) {

let cart = getCart();

cart.splice(index, 1);

saveCart(cart);

renderCart();
}

/* =========================
PRODUCT DETAILS
========================= */

function showProduct(index) {

const product = getProducts()[index];

document.querySelector("#detailsContent").innerHTML = `

```
<div class="details-image">

  ${
    product.image
      ? `<img src="${product.image}" alt="${product.name}">`
      : "🎁"
  }

</div>

<div class="details-info">

  <small>${product.cat}</small>

  <h2>${product.name}</h2>

  <div class="details-price">
    ${money(product.price)}
  </div>

  <p>
    ${product.desc || "Beautiful handmade product from Unbox Love."}
  </p>

  <button
    class="cart-btn big"
    onclick="addToCart(${index}); closeDetails();"
  >
    🛒 Add to Cart
  </button>

</div>
```

`;

document
.querySelector("#detailsModal")
.classList.add("open");
}

function closeDetails() {

document
.querySelector("#detailsModal")
.classList.remove("open");
}

/* =========================
CHECKOUT
========================= */

function openCheckout() {

const cart = getCart();

if (!cart.length) {

```
alert("Your cart is empty!");

return;
```

}

document
.querySelector("#checkoutModal")
.classList.add("open");
}

function closeCheckout() {

document
.querySelector("#checkoutModal")
.classList.remove("open");
}

/* =========================
WHATSAPP ORDER
========================= */

function placeOrder() {

const name =
document.querySelector("#customerName").value.trim();

const phone =
document.querySelector("#customerPhone").value.trim();

const address =
document.querySelector("#customerAddress").value.trim();

const pincode =
document.querySelector("#customerPincode").value.trim();

if (!name || !phone || !address || !pincode) {

```
alert("Please fill all customer details.");

return;
```

}

const cart = getCart();

let message =
"💝 *UNBOX LOVE - NEW ORDER*%0A%0A";

message +=
"*Customer Details*%0A";

message +=
"Name: " + encodeURIComponent(name) + "%0A";

message +=
"Phone: " + encodeURIComponent(phone) + "%0A";

message +=
"Address: " + encodeURIComponent(address) + "%0A";

message +=
"Pincode: " + encodeURIComponent(pincode) + "%0A%0A";

message += "*Order Details*%0A";

let total = 0;

cart.forEach(item => {

```
const itemTotal =
  item.price * item.qty;

total += itemTotal;

message +=
  "• " +
  encodeURIComponent(item.name) +
  " x " +
  item.qty +
  " = " +
  encodeURIComponent(money(itemTotal)) +
  "%0A";
```

});

message +=
"%0A*Total: " +
encodeURIComponent(money(total)) +
"*";

/*
IMPORTANT:
Replace this number with your WhatsApp business number.
India example:
919876543210
*/

const whatsappNumber = "919043094724";

const url =
"https://wa.me/" +
whatsappNumber +
"?text=" +
message;

window.open(url, "_blank");

localStorage.removeItem(CART_KEY);

updateCartCount();

closeCheckout();

closeCart();
}

/* =========================
INITIALIZE
========================= */

function init() {

filters();

render();

updateCartCount();

}

init();
