const express = require("express")
const router = express.Router()

const { addProduct, allProduct, deleteProduct, editProduct, updateProduct } = require("../controllers/product.controller")
const { registerUser, landingPage } = require("../controllers/user.controller")

const url = [
  {
    firstname: "David",
    lastname: "SQI",
    age: 20,
  },
  {
    firstname: "Moses",
    lastname: "SQI",
    age: 22,
  },
  {
    firstname: "Michael",
    lastname: "SQI",
    age: 25,
  },
];

router.get("/", landingPage);

router.get("/user", (req, res) => {
  res.send(url);
});

router.get("/about", (req, res) => {
  // res.send("About Page")
  // C:\Users\peter\Desktop\All Coding Classes\Level 3 December Class\backend-project\index.html
  console.log(__dirname);
  // res.sendFile(__dirname + "/index.html")
  res.sendFile(`${__dirname}/about.html`);
});

router.get("/first", (req, res) => {
  res.render("index");
});

router.get("/services", (req, res) => {
  res.render("services");
});

router.post("/register", registerUser);

router.get("/add-product", (req, res) => {
  res.render("product");
});

router.post("/product", addProduct);

router.get("/all-product", allProduct);

router.post("/delete/:id", deleteProduct);

router.get("/edit-product/:id", editProduct);

router.post("/update-product/:id", updateProduct)

module.exports = router