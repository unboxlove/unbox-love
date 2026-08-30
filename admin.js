const KEY = "unboxlove_products";

let editing = -1;

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
GET PRODUCTS
========================= */

function get() {

let saved =
localStorage.getItem(KEY);

if (saved) {

```
try {

  const products =
    JSON.parse(saved);

  if (
    Array.isArray(products) &&
    products.length > 0
  ) {
    return products;
  }

} catch (error) {

  console.log(
    "Product data error:",
    error
  );

}
```

}

localStorage.setItem(
KEY,
JSON.stringify(defaults)
);

return defaults;
}

/* =========================
SAVE PRODUCTS
========================= */

function save(products) {

localStorage.setItem(
KEY,
JSON.stringify(products)
);

}

/* =========================
LOGIN
========================= */

function login() {

const username =
document.querySelector("#user").value.trim();

const password =
document.querySelector("#pass").value;

if (
username === "admin" &&
password === "unboxlove"
) {

```
sessionStorage.admin = "1";

show();
```

} else {

```
document.querySelector(
  "#loginMsg"
).textContent =
  "Wrong username or password.";
```

}

}

/* =========================
LOGOUT
========================= */

function logout() {

sessionStorage.removeItem("admin");

location.reload();

}

/* =========================
SHOW DASHBOARD
========================= */

function show() {

document
.querySelector("#loginBox")
.classList.add("hidden");

document
.querySelector("#dashboard")
.classList.remove("hidden");

render();

}

/* =========================
ESCAPE TEXT
========================= */

function esc(value) {

return String(value ?? "")
.replaceAll("&", "&")
.replaceAll("<", "<")
.replaceAll(">", ">")
.replaceAll('"', """);

}

/* =========================
RENDER PRODUCTS
========================= */

function render() {

const products = get();

const grid =
document.querySelector("#adminGrid");

if (!grid) return;

grid.innerHTML =
products.map(
(product, index) => `

```
    <div class="admin-card">

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

      <h3>
        ${esc(product.name)}
      </h3>

      <small>
        ${esc(product.cat)}
        ·
        ₹${Number(product.price).toLocaleString("en-IN")}
      </small>

      <p>
        ${esc(product.desc)}
      </p>

      <div class="actions">

        <button
          class="edit"
          onclick="edit(${index})"
        >
          Edit
        </button>

        <button
          class="delete"
          onclick="del(${index})"
        >
          Delete
        </button>

      </div>

    </div>

  `
).join("");
```

}

/* =========================
ADD / EDIT PRODUCT
========================= */

document
.querySelector("#productForm")
?.addEventListener(
"submit",
function(event) {

```
  event.preventDefault();

  const products = get();

  const item = {

    name:
      document
        .querySelector("#pname")
        .value
        .trim(),

    price:
      Number(
        document
          .querySelector("#pprice")
          .value
      ),

    cat:
      document
        .querySelector("#pcat")
        .value,

    desc:
      document
        .querySelector("#pdesc")
        .value
        .trim(),

    image:
      document
        .querySelector("#pimage")
        .value
        .trim()

  };


  if (!item.name) {
    alert("Please enter product name.");
    return;
  }

  if (editing < 0) {

    products.push(item);

  } else {

    products[editing] = item;

  }


  save(products);

  resetForm();

  render();

}
```

);

/* =========================
EDIT
========================= */

function edit(index) {

const products = get();

const product = products[index];

if (!product) return;

editing = index;

document.querySelector("#pname").value =
product.name;

document.querySelector("#pprice").value =
product.price;

document.querySelector("#pcat").value =
product.cat;

document.querySelector("#pdesc").value =
product.desc || "";

document.querySelector("#pimage").value =
product.image || "";

document.querySelector("#formTitle").textContent =
"Edit Product";

window.scrollTo({
top: 0,
behavior: "smooth"
});

}

/* =========================
DELETE
========================= */

function del(index) {

if (
!confirm("Delete this product?")
) {
return;
}

const products = get();

products.splice(index, 1);

/*
If every product is deleted,
restore the original 4 products.
*/

if (products.length === 0) {

```
save(defaults);
```

} else {

```
save(products);
```

}

render();

}

/* =========================
RESET FORM
========================= */

function resetForm() {

editing = -1;

document
.querySelector("#productForm")
.reset();

document
.querySelector("#formTitle")
.textContent =
"Add Product";

}

/* =========================
AUTO LOGIN
========================= */

if (
sessionStorage.admin === "1"
) {

show();

}
