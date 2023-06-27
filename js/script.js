let cartItems = sessionStorage.cartProducts
  ? JSON.parse(sessionStorage.cartProducts)
  : [];
// HTML SCRIPTS
$(document).ready(function () {
  $(".zoomable-image")
    .mouseenter(function () {
      $(this).find("img").css("transform", "scale(1.2)");
    })
    .mouseleave(function () {
      $(this).find("img").css("transform", "scale(1)");
    });
});
var prevScrollPos = window.pageYOffset; // Track the previous scroll position
var navbar2 = document.getElementById("navbarScroll");

window.onscroll = function () {
  var currentScrollPos = window.pageYOffset;

  // Show or hide the navbar based on the scroll direction
  if (prevScrollPos > currentScrollPos) {
    navbar2.style.top = "0";
  } else {
    navbar2.style.top = "-150px"; // Adjust the value to match the height of your navbar
  }

  prevScrollPos = currentScrollPos;
};
$(document).ready(function () {
  $(".regular").slick({
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 3,
  });
  $(".center").slick({
    dots: true,
    infinite: true,
    centerMode: true,
    slidesToShow: 5,
    slidesToScroll: 3,
  });
});

// REGISTRATION SCRIPT
$("#registerBtn").on("click", function () {
  const name = $("#username").val();
  const phone = $("#phone").val();
  const email = $("#userEmail").val();
  const password = $("#userPassword").val();
  if (name === "" || phone === "" || email === "" || password === "") {
    return alert("Please fill this form!");
  }
  $.ajax({
    url: "http://159.65.21.42:9000/register",
    type: "POST",
    data: {
      name: name,
      phone: phone,
      email: email,
      password: password,
    },
    error: function (error) {
      console.log(error);
      if (error.status === 409) {
        alert("Registration failed. User exists.");
      } else {
        alert("Registration failed. Please try again later.");
      }
    },
    success: function (response) {
      console.log(response);
      alert("Registration successful!");
      window.location.href = "account.html";
    },
    beforeSend: function () {
      console.log("Sending...");
    },
    complete: function () {
      console.log("Data Sent sucessfully");
    },
  });
});
// LOGIN SCRIPT
$("#loginBtn").on("click", function () {
  const email = $("#email").val();
  const password = $("#password").val();

  if (email === "" || password === "") {
    return alert("Please fill this form!");
  }
  $.ajax({
    url: "http://159.65.21.42:9000/login",
    type: "POST",
    data: {
      email: email,
      password: password,
    },
    success: function (response) {
      var displayUserName = response.name;
      alert("Login successful! Welcome " + displayUserName);
      window.location.href = "index.html";
      $("#displayUserName").text(displayUserName);
    },
    error: function (error) {
      console.log(error);
      alert("Login failed. Email or password does not exist.");
      window.location.href = "account.html";
    },
  });
});
// LOG OUT
function logout() {
  localStorage.clear();

  window.location.href = "index.html";
}
// DISPLAY ALL PRODUCTS
function showProductGallery(product) {
  //Iterate javascript shopping cart array
  var productHTML = "";
  product.forEach(function (item) {
    productHTML +=
      "<div class='product-parent'>" +
      "<div class='product-child'>" +
      '<a href="single-product.html?id=' +
      item._id +
      '">' +
      '<div class="all-product-items">' +
      '<img src="http://159.65.21.42:9000' +
      item.image +
      '">' +
      '<div class="productname">' +
      "<p>" +
      item.name +
      "</p>" +
      "</div>" +
      '<div class="price">£<span>' +
      item.price +
      "</span></div>" +
      "</div>" +
      "</a>" +
      "</div>" +
      "</div>" +
      "<tr>";
  });
  $("#product-item-container").html(productHTML);
}
// USERS DATATABLE
$(document).ready(function () {
  const dataTable = $("#myTable").DataTable();
  responsive: true;
  $.ajax({
    url: "http://159.65.21.42:9000/users",
    type: "GET",
    success: function (response) {
      response.forEach(function (item) {
        const editUrl = "admin_users.html?id=" + item._id;
        dataTable.row
          .add([
            item._id,
            item.name,
            item.email,
            item.phone,
            item.password,
            '<a class="btnDesign" href="' + editUrl + '">Edit</a>',
            '<button class="deleteBtn btnDesign" data-id="' +
              item._id +
              '">Delete</button>',
          ])
          .draw(false);
      });
    },
    error: function (error) {
      console.log(error);
    },
  });
});
// GET ALL PRODUCTS
$.ajax({
  url: "http://159.65.21.42:9000/products",
  type: "GET", // POST GET PUT DELETE
  error: function (err) {
    console.log(err);
  },
  success: function (res) {
    var filteredProducts = res.filter(function (product) {
      var category = product.category;
      return category === "SASSI";
    });
    showProductGallery(filteredProducts);
  },
  beforeSend: function () {
    $("#loading").text("Loading...");
  },
  complete: function () {
    $("#loading").text("");
  },
});
// DISPLAY SINGLE PRODUCT
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");
function fetchProductDetails(productId) {
  $.ajax({
    url: `http://159.65.21.42:9000/product/${productId}`,
    type: "GET",
    error: function (err) {
      console.log(err);
    },
    success: function (res) {
      displayProduct2(res);
    },
    beforeSend: function () {
      $("#loading").text("Loading...");
    },
    complete: function () {
      $("#loading").text("");
    },
  });
}
$(document).ready(function () {
  // Fetch product details using AJAX
  $.ajax({
    url: "http://159.65.21.42:9000/product/" + productId,
    type: "GET",
    success: function (response) {
      displayProduct2(response);
      let imagez = "http://159.65.21.42:9000" + response.image;
      $("#modalBtn").data("image", imagez);
    },
    error: function (error) {
      console.log(error);
    },
  });
});

function displayProduct2(product, index) {
  let data = `
    <section class="singlepdt">
      <div class="single-pdt-content">
        <div class="left-content">
          <div class="innernav">
            <a href="product.html"><i class="fa fa-long-arrow-left"></i> SHOP / ALL</a>
          </div>
          <div class="product-item productitem">
          <div style="display: none;" class ="product-img"><img src="http://159.65.21.42:9000${product.image}" alt=""></div>
          <h1 class="productname">${product.name}</h1>
          <div class="price">£<span> ${product.price}</span></div>
          <p class="desc">${product.description}</p>
          <p><b>Book an appointment</b> to try this item on at our London or Somerset store.</p>
          <p><b>There is currently a 3 – 6 week lead time starting from the date of your purchase.</b></p>
          <p>Click <b>here</b> to find out more about our responsibility ethos.</p> 
          <p class="size"> 36 38 40 42 44 46</p>
          <div class="cart-action">
          <input style="display: none;" type="number" class="product-quantity" name="quantity" value="1" size="2" />
            <input id="modalBtn" class="cart-button add-to-cart" type="submit" value="Add to Cart" onclick="openModal();" data-name="${product.name}" data-price="${product.price}"/>
          </div>
          <div class='inner-mob-links'>
          <a href="">SIZE HELP +</a> <br>
          <a href="">DELIVERIES & RETURNS +</a> <br>
          <a href="">ENQUIRIES +</a><br>
          </div>
          <div id="myModal" class="modal">
            <div class="modal-content">
              <span class="close" onclick="closeModal()">&times;</span>
              <div class="shopping-cart">
                                <h4>BAG ITEMS</h4>
                                <hr>

                                <div class="shopping-cart-content">
                                    <div class="left-cart-content">
                                        <img src="http://159.65.21.42:9000${product.image}" alt="">
                                    </div>
                                    <div class="right-cart-content">
                                        <h4>${product.name}</h4>
                                        <h3>Size: 44</h3>
                                        <p class="price">£ ${product.price}</p><br><br>
                                        <a class='remove-button' href='' onclick='removeProduct2(${index})'>[ Remove ]</a>
                                    </div>
                                </div>
                            </div>
                            <div class="cart-footer">
                            <div class="footer-price">
                                <h3>SUB TOTAL</h3>
                                <p>£${product.price}</p>
                            </div>
                            <div class="checkout">
                                <input class="cart-button btn-margin" type="submit" value="CHECKOUT"
                                    class="add-to-cart" />
                                <a href="cart.html" class="basket-link">GO TO BASKET </a>
                            </div>
                        </div>

            </div>
          </div>
          </div>
          <a class='pinterest-link' href="">SIZE HELP +</a> <br>
          <a class='pinterest-link' href="">DELIVERIES & RETURNS +</a> <br>
          <a class='pinterest-link' href="">ENQUIRIES +</a><br>
          <a class="pinterest-button" href=""><img src="./img/pinterest (2).png" alt=""><span>PIN THIS</span></a>
        </div>
        <div class="right-content" style="display: flex; align-items: center;">
        <i class="fa fa-angle-left" style="font-size:5rem;"></i>
          <img src="http://159.65.21.42:9000${product.image}" alt="">
          <i class="fa fa-angle-right" style="font-size:5rem;"></i>
        </div> 
      </div>
    </section>
  `;
  $("#product_details").html(data);
}

//check local storage
function checkStorage() {
  if (sessionStorage.getItem("cart") != null) {
    cartItems = JSON.parse(sessionStorage.getItem("cartProduct"));
  }
}
fetchProductDetails(productId);

function removeProduct2(index) {
  cartItems.splice(index, -1);
  sessionStorage.setItem("cartProducts", JSON.stringify(cartItems));
  checkStorage();
  location.reload();
}

// PRODUCT MODAL
function openModal() {
  // Get the modal
  var modal = document.getElementById("myModal");

  // Display the modal
  modal.style.display = "block";
  setTimeout(function () {
    modal.querySelector(".modal-content").style.transform = "translateX(0)"; // Slide in from the right
  }, 25); // Small delay before applying animation to ensure it triggers correctly
}
function closeModal() {
  // Get the modal
  var modal = document.getElementById("myModal");

  // Slide out to the right
  modal.querySelector(".modal-content").style.transform = "translateX(100%)";

  // Wait for the animation to finish before hiding the modal
  setTimeout(function () {
    // Hide the modal
    modal.style.display = "none";
  }, 900);
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  var modal = document.getElementById("myModal");
  if (event.target != modal) {
    closeModal();
  }
};

$("body").on("click", ".add-to-cart", function () {
  let name = $(this).data("name");
  let price = $(this).data("price");
  let image = $(this).data("image");
  let cart_quantity = 1;
  let unit_price = price;
  let cartProduct = {
    name: name,
    price: price,
    image: image,
    cart_quantity: cart_quantity,
    unit_price: unit_price,
  };
  cartItems.push(cartProduct);
  sessionStorage.setItem("cartProducts", JSON.stringify(cartItems));
});
function showCartTable() {
  // Get the table body element
  const tableBody = document.getElementById("cartTableBody");

  // Clear the existing table rows
  tableBody.innerHTML = "";
  let totalPrice = 0;
  // Iterate over the cart items and create table rows
  for (let i = 0; i < cartItems.length; i++) {
    const item = cartItems[i];

    // Create a new table row
    const row = document.createElement("tr");
    // Create table data for product image
    const imageData = document.createElement("td");
    const image = document.createElement("img");
    image.src = item.image;
    image.alt = item.name;
    imageData.appendChild(image);
    row.appendChild(imageData);

    // Create table data for product name
    const nameData = document.createElement("td");
    nameData.textContent = item.name;
    nameData.classList.add("table-pdt-name");
    row.appendChild(nameData);

    // Create table data for line break

    const lineBreak = document.createElement("br");
    nameData.appendChild(lineBreak);
    const lineBreak2 = document.createElement("br");
    nameData.appendChild(lineBreak2);

    // Create table data for remove button

    const removeButton = document.createElement("a");
    removeButton.textContent = "[Remove]";
    removeButton.href = "#";
    removeButton.style.textTransform = "uppercase";
    removeButton.style.fontWeight = "700";
    removeButton.addEventListener("click", () => {
      removeProduct(i);
      showCartTable();
    });
    nameData.appendChild(removeButton);

    // Create table data for the select input
    const selectData = document.createElement("td");
    const selectInput = document.createElement("select");
    selectInput.classList.add("quantity-select");
    selectInput.dataset.index = i; // Use dataset.index to store the index
    selectInput.dataset.price = item.price; // Use dataset.price to store the price

    // Create and append option elements to the select input
    const option0 = document.createElement("option");
    option0.value = "";
    option0.textContent = "Select Quantity";
    selectInput.appendChild(option0);

    for (let quantity = 1; quantity <= 5; quantity++) {
      const option = document.createElement("option");
      option.value = quantity;
      option.textContent = quantity;
      selectInput.appendChild(option);
    }

    // Append the select input to the table data
    selectData.appendChild(selectInput);
    row.appendChild(selectData);

    // Create table data for product price
    const priceData = document.createElement("td");
    priceData.textContent = item.price;
    priceData.classList.add("table-price");
    console.log(priceData.textContent);
    row.appendChild(priceData);

    // Add the row to the table body
    tableBody.appendChild(row);
    totalPrice += item.price;
  }
  // Update total amount in HTML
  const totalAmountElement = document.getElementById("totalAmount");
  totalAmountElement.textContent = totalPrice.toFixed(2);
  const totalItemsElement = document.getElementById("totalItems");
  totalItemsElement.textContent = cartItems.length;
}
showCartTable();

$(".quantity-select").on("change", function () {
  let index = $(this).attr("data-index");
  let newQuantity = parseInt($(this).val());
  cartItems[index]["cart_quantity"] = newQuantity;
  cartItems[index]["price"] = cartItems[index]["unit_price"] * newQuantity;
  sessionStorage.setItem("cartProducts", JSON.stringify(cartItems));
  checkStorage();
  // location.reload();
});

const reloadButton = document.getElementById("reloadButton");
reloadButton.addEventListener("click", function () {
  // Reload the page
  location.reload();
});

function removeProduct(index) {
  cartItems.splice(index, 1);
  sessionStorage.setItem("cartProducts", JSON.stringify(cartItems));
  checkStorage();
  location.reload();
}

// PRODUCT DATATABLE
$(document).ready(function () {
  const dataTable = $("#pdtTable").DataTable();
  responsive: true;
  $.ajax({
    url: "http://159.65.21.42:9000/products",
    type: "GET",
    success: function (response) {
      var filteredProducts = response.filter(function (product) {
        var category = product.category;
        return category === "SASSI";
      });

      filteredProducts.forEach(function (item) {
        const editPdtUrl = "edit_pdt.html?id=" + item._id;
        dataTable.row
          .add([
            item._id,
            item.name,
            item.category,
            item.price,
            item.quantity,
            '<a class="btnDesign" href="' + editPdtUrl + '">Edit</a>',
            '<button class="deleteBtn2 btnDesign" data-id="' +
              item._id +
              '">Delete</button>',
          ])
          .draw(false);
      });
    },
    error: function (error) {
      console.log(error);
    },
  });
});
// PRODUCT DATATABLE 2
$(document).ready(function () {
  const dataTable = $("#pdtTable2").DataTable();
  responsive: true;
  $.ajax({
    url: "http://159.65.21.42:9000/products",
    type: "GET",
    success: function (response) {
      var filteredProducts = response.filter(function (product) {
        var category = product.category;
        return category === "SASSI";
      });
      filteredProducts.forEach(function (item) {
        dataTable.row
          .add([item._id, item.name, item.category, item.price, item.quantity])
          .draw(false);
      });
      const totalItems = dataTable.rows().count();
      $("#totalItems").text(`${totalItems}`);
    },
    error: function (error) {
      console.log(error);
    },
  });
});
// DISPLAY TOTAL DATA
fetch("http://159.65.21.42:9000/users")
  .then((response) => response.json())
  .then((data) => {
    const itemCount = data.length;
    document.getElementById("totalUsers").textContent = `${itemCount}`;
  })
  .catch((error) => {
    console.log("Error fetching JSON:", error);
  });
// EDIT AND DELETE USERS
$(document).ready(function () {
  const urlParams2 = new URLSearchParams(window.location.search);
  const userEditId = urlParams2.get("id");
  $.ajax({
    url: "http://159.65.21.42:9000/user/" + userEditId,
    type: "GET",
    success: function (user) {
      // Populate the form fields with the retrieved user details
      // $("#oldId").html(user._id);
      $("#newName").val(user.name);
      $("#newEmail").val(user.email);
      $("#newPhone").val(user.phone);
      $("#newPassword").val(user.password);
    },
    error: function (error) {
      console.log(error);
    },
  });
  $("#form-data").on("submit", function (e) {
    e.preventDefault();

    const updatedUser = {
      name: $("#newName").val(),
      email: $("#newEmail").val(),
      phone: $("#newPhone").val(),
      password: $("#newPassword").val(),
    };

    if (
      updatedUser.name === "" ||
      updatedUser.email === "" ||
      updatedUser.phone === "" ||
      updatedUser.password === ""
    ) {
      return alert("Please fill this form!");
    }
    $.ajax({
      url: `http://159.65.21.42:9000/user/${userEditId}`,
      type: "PUT",
      data: updatedUser,
      error: function (err) {
        console.log(err);
      },
      success: function (res) {
        console.log(res);
      },
      beforeSend: function () {
        console.log("Sending...");
      },
      complete: function () {
        alert("User Edited successfully!");
        window.location.href = "dashboard.html";
      },
    });
  });
  $(document).on("click", ".deleteBtn", function (e) {
    e.preventDefault();
    const userId = $(this).data("id");
    $.ajax({
      url: "http://159.65.21.42:9000/user/" + userId,
      type: "DELETE",
      error: function (err) {
        console.log(err);
      },
      success: function (res) {
        console.log(res);
      },
      beforeSend: function () {
        console.log("Deleting...");
      },
      complete: function () {
        alert("User Deleted successful!");
        window.location.href = "dashboard.html";
      },
    });
  });
});
// EDIT AND DELETE PRODUCTS
$(document).ready(function () {
  const urlParam = new URLSearchParams(window.location.search);
  const pdtEditId = urlParam.get("id");
  $.ajax({
    url: `http://159.65.21.42:9000/product/${pdtEditId}`,
    type: "GET",
    success: function (product) {
      $("#newName").val(product.name);
      $("#newCategory").val(product.category);
      $("#newPrice").val(product.price);
      $("#newQuantity").val(product.quantity);
      $("#newDescription").val(product.description);
    },
    error: function (error) {
      console.log(error);
    },
  });
  $("#form-action").on("submit", function (e) {
    e.preventDefault();
    let updatedProduct = new FormData();
    updatedProduct.append("_id", pdtEditId);
    updatedProduct.append("name", $("#newName").val());
    updatedProduct.append("category", $("#newCategory").val());
    updatedProduct.append("price", $("#newPrice").val());
    updatedProduct.append("quantity", $("#newQuantity").val());
    updatedProduct.append("image", $("#newImage")[0].files[0]);
    updatedProduct.append("description", $("#newDescription").val());

    if (
      updatedProduct.get("name") === "" ||
      updatedProduct.get("category") === "" ||
      updatedProduct.get("price") === "" ||
      updatedProduct.get("quantity") === "" ||
      updatedProduct.get("image") === undefined ||
      updatedProduct.get("description") === ""
    ) {
      return alert("Please fill this form!");
    }
    $.ajax({
      url: `http://159.65.21.42:9000/update/product/${pdtEditId}`,
      type: "PUT",
      data: updatedProduct,
      processData: false,
      contentType: false,
      error: function (err) {
        console.log(err);
      },
      success: function (res) {
        console.log(res);
      },
      beforeSend: function () {
        console.log("Sending...");
      },
      complete: function () {
        console.log("Data sent successfully!");
      },
    });
  });
  $(document).on("click", ".deleteBtn2", function (e) {
    e.preventDefault();
    const pdtId = $(this).data("id");
    $.ajax({
      url: "http://159.65.21.42:9000/product/" + pdtId,
      type: "DELETE",
      error: function (err) {
        console.log(err);
      },
      success: function (res) {
        console.log(res);
      },
      beforeSend: function () {
        console.log("Deleting...");
      },
      complete: function () {
        alert("Delete successful!");
        window.location.href = "dashboard.html";
      },
    });
  });
});
// CREATE PRODUCTS
$("#pdt-form-action").on("submit", function (e) {
  e.preventDefault();

  let newPdt = new FormData();
  newPdt.append("name", $("#pdtName").val());
  newPdt.append("category", $("#pdtCategory").val());
  newPdt.append("price", $("#pdtPrice").val());
  newPdt.append("quantity", $("#pdtQuantity").val());
  newPdt.append("image", $("#pdtImage")[0].files[0]);
  newPdt.append("description", $("#pdtDescription").val());

  if (
    newPdt.get("name") === "" ||
    newPdt.get("category") === "" ||
    newPdt.get("price") === "" ||
    newPdt.get("quantity") === "" ||
    newPdt.get("image") === undefined ||
    newPdt.get("description") === ""
  ) {
    return alert("Please fill this form!");
  }

  $.ajax({
    url: "http://159.65.21.42:9000/create/product",
    type: "POST",
    data: newPdt,
    processData: false,
    contentType: false,
    error: function (err) {
      console.log(err);
    },
    success: function (res) {
      console.log(res);
    },
    beforeSend: function () {
      console.log("Sending...");
    },
    complete: function () {
      alert("Product Created successfully!");
      window.location.href = "admin_products.html";
    },
  });
});
// CREATE USERS
$("#user-form-action").on("submit", function (e) {
  e.preventDefault();

  const name = $("#newUserName").val();
  const phone = $("#newUserPhone").val();
  const email = $("#newUserEmail").val();
  const password = $("#newUserPassword").val();
  if (name === "" || phone === "" || email === "" || password === "") {
    return alert("Please fill this form!");
  }
  $.ajax({
    url: "http://159.65.21.42:9000/register",
    type: "POST",
    data: {
      name: name,
      phone: phone,
      email: email,
      password: password,
    },
    error: function (error) {
      console.log(error);
      if (error.status === 409) {
        alert("Creation failed. User exists.");
      } else {
        alert("Creation failed. Please try again later.");
      }
    },
    success: function (response) {
      console.log(response);
      alert("User Created Successfully!");
      window.location.href = "dashboard.html";
    },
    beforeSend: function () {
      console.log("Sending...");
    },
    complete: function () {
      console.log("Data Sent sucessfully");
    },
  });
});
