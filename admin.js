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
  let products =
    JSON.parse(localStorage.getItem(KEY));

  if (!products) {
    products = defaults;
    save(products);
  }

  return products;
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
   ADMIN LOGIN
========================= */

function login() {

  const username =
    document.querySelector("#user").value.trim();

  const password =
    document.querySelector("#pass").value.trim();

  if (
    username === "admin" &&
    password === "unboxlove"
  ) {
    sessionStorage.admin = "1";
    show();
  } else {
    document.querySelector("#loginMsg").textContent =
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
   ESCAPE HTML
========================= */

function esc(text) {

  return String(text ?? "")
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

  document.querySelector("#adminGrid").innerHTML =
    products.map((product, index) => {

      const image = product.image
        ? `
          <div
            class="pic"
            style="
              background-image:url('${product.image}');
            "
          ></div>
        `
        : `
          <div class="pic">
            🎁
          </div>
        `;


      return `
        <div class="admin-card">

          ${image}

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
      `;

    }).join("");
}


/* =========================
   IMAGE PREVIEW
========================= */

const imageFile =
  document.querySelector("#pimageFile");

const imagePreview =
  document.querySelector("#imagePreview");

const previewImg =
  document.querySelector("#previewImg");


if (imageFile) {

  imageFile.addEventListener(
    "change",
    function () {

      const file = this.files[0];

      if (!file) {
        imagePreview.style.display = "none";
        previewImg.src = "";
        return;
      }


      if (!file.type.startsWith("image/")) {

        alert("Please select an image file.");

        this.value = "";
        imagePreview.style.display = "none";

        return;
      }


      const reader =
        new FileReader();


      reader.onload = function (event) {

        previewImg.src =
          event.target.result;

        imagePreview.style.display =
          "flex";
      };


      reader.readAsDataURL(file);

    }
  );

}


/* =========================
   ADD / EDIT PRODUCT
========================= */

document
  .querySelector("#productForm")
  .addEventListener(
    "submit",
    function (event) {

      event.preventDefault();


      const products = get();


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


      const cat =
        document
          .querySelector("#pcat")
          .value;


      const desc =
        document
          .querySelector("#pdesc")
          .value
          .trim();


      const file =
        document
          .querySelector("#pimageFile")
          .files[0];


      if (!name || !price) {

        alert(
          "Please enter product name and price."
        );

        return;
      }


      /*
       * If a new image is selected,
       * convert it to Base64 and save it.
       */

      if (file) {

        const reader =
          new FileReader();


        reader.onload = function (event) {

          const imageData =
            event.target.result;


          saveProduct(
            products,
            name,
            price,
            cat,
            desc,
            imageData
          );

        };


        reader.readAsDataURL(file);

      } else {

        /*
         * When editing without selecting
         * a new image, keep old image.
         */

        let oldImage = "";

        if (editing >= 0) {
          oldImage =
            products[editing].image || "";
        }


        saveProduct(
          products,
          name,
          price,
          cat,
          desc,
          oldImage
        );

      }

    }
  );


/* =========================
   SAVE PRODUCT
========================= */

function saveProduct(
  products,
  name,
  price,
  cat,
  desc,
  image
) {

  const item = {

    id:
      editing >= 0
        ? products[editing].id
        : Date.now(),

    name: name,

    price: price,

    cat: cat,

    desc: desc,

    image: image || ""

  };


  if (editing < 0) {

    products.push(item);

  } else {

    products[editing] = item;

  }


  save(products);

  resetForm();

  render();

  alert(
    editing < 0
      ? "Product added successfully ❤️"
      : "Product updated successfully ❤️"
  );
}


/* =========================
   EDIT PRODUCT
========================= */

function edit(index) {

  const products = get();

  const product =
    products[index];

  editing = index;


  document.querySelector("#pname").value =
    product.name;


  document.querySelector("#pprice").value =
    product.price;


  document.querySelector("#pcat").value =
    product.cat;


  document.querySelector("#pdesc").value =
    product.desc || "";


  /*
   * File input cannot be filled
   * automatically for security reasons.
   */

  document.querySelector("#pimageFile").value =
    "";


  /*
   * Show existing image preview.
   */

  if (
    product.image &&
    imagePreview &&
    previewImg
  ) {

    previewImg.src =
      product.image;

    imagePreview.style.display =
      "flex";

  } else if (imagePreview) {

    imagePreview.style.display =
      "none";

  }


  document.querySelector("#formTitle").textContent =
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

  if (
    !confirm(
      "Delete this product?"
    )
  ) {
    return;
  }


  const products = get();

  products.splice(index, 1);

  save(products);

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


  if (imagePreview) {
    imagePreview.style.display =
      "none";
  }


  if (previewImg) {
    previewImg.src = "";
  }

}


/* =========================
   AUTO LOGIN
========================= */

if (
  sessionStorage.admin === "1"
) {
  show();
}
