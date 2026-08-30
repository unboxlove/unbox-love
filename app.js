```javascript
const KEY = "unboxlove_products";

let editing = -1;


/* =========================
   DEFAULT PRODUCTS
   ========================= */

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

  let saved = localStorage.getItem(KEY);

  if (saved) {

    try {

      const products = JSON.parse(saved);

      if (Array.isArray(products)) {
        return products;
      }

    } catch (error) {

      console.log("Product data error:", error);

    }

  }

  save(defaults);

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

    sessionStorage.setItem(
      "admin",
      "1"
    );

    show();

  } else {

    document.querySelector(
      "#loginMsg"
    ).textContent =
      "Wrong username or password.";

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
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


/* =========================
   RENDER PRODUCTS
   ========================= */

function render() {

  const products = get();

  const grid =
    document.querySelector("#adminGrid");

  if (!grid) return;


  if (products.length === 0) {

    grid.innerHTML = `
      <div class="empty">
        No products added yet.
      </div>
    `;

    return;

  }


  grid.innerHTML = products.map(
    (product, index) => `

      <div class="admin-card">

        <div
          class="pic"
          ${
            product.image
              ? `style="background-image:url('${String(
                  product.image
                ).replaceAll("'", "%27")}')"`
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

}


/* =========================
   ADD / UPDATE PRODUCT
   ========================= */

document
  .querySelector("#productForm")
  ?.addEventListener(
    "submit",
    function (event) {

      event.preventDefault();


      const name =
        document
          .querySelector("#pname")
          .value
          .trim();


      const price =
        Number(
          document
            .querySelector("#pprice")
            .value
        );


      const category =
        document
          .querySelector("#pcat")
          .value;


      const description =
        document
          .querySelector("#pdesc")
          .value
          .trim();


      const image =
        document
          .querySelector("#pimage")
          .value
          .trim();


      if (!name || price < 0) {

        alert(
          "Please enter product name and price."
        );

        return;

      }


      const product = {

        name: name,

        price: price,

        cat: category,

        desc: description,

        image: image

      };


      const products = get();


      /* ADD NEW PRODUCT */

      if (editing === -1) {

        products.push(product);

        alert(
          "Product added successfully ❤️"
        );

      }


      /* UPDATE PRODUCT */

      else {

        products[editing] = product;

        alert(
          "Product updated successfully ❤️"
        );

      }


      save(products);

      resetForm();

      render();

    }
  );


/* =========================
   EDIT PRODUCT
   ========================= */

function edit(index) {

  const products = get();

  const product = products[index];

  if (!product) return;


  editing = index;


  document.querySelector(
    "#pname"
  ).value =
    product.name;


  document.querySelector(
    "#pprice"
  ).value =
    product.price;


  document.querySelector(
    "#pcat"
  ).value =
    product.cat;


  document.querySelector(
    "#pdesc"
  ).value =
    product.desc || "";


  document.querySelector(
    "#pimage"
  ).value =
    product.image || "";


  document.querySelector(
    "#formTitle"
  ).textContent =
    "Edit Product";


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


/* =========================
   DELETE PRODUCT
   ========================= */

function del(index) {

  const products = get();

  const product = products[index];

  if (!product) return;


  const confirmDelete =
    confirm(
      `Delete "${product.name}"?`
    );


  if (!confirmDelete) {
    return;
  }


  products.splice(index, 1);

  save(products);

  render();


  alert(
    "Product deleted."
  );

}


/* =========================
   CLEAR FORM
   ========================= */

function resetForm() {

  editing = -1;


  document
    .querySelector("#productForm")
    ?.reset();


  const title =
    document.querySelector("#formTitle");


  if (title) {

    title.textContent =
      "Add Product";

  }

}


/* =========================
   ENTER KEY LOGIN
   ========================= */

document
  .querySelector("#pass")
  ?.addEventListener(
    "keydown",
    function (event) {

      if (event.key === "Enter") {
        login();
      }

    }
  );


/* =========================
   CHECK ADMIN LOGIN
   ========================= */

if (
  sessionStorage.getItem("admin") === "1"
) {

  show();

}
```
