const express = require("express");
const app = express();
const ejs = require("ejs");
require("dotenv").config();
const mongoose = require("mongoose");
const PORT = process.env.PORT;
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

const URI = process.env.MONGODB_URI;

mongoose
  .connect(URI)
  .then(() => {
    console.log("Database yaf connect");
  })
  .catch((error) => {
    console.log("Database yaf refuse to connect");
    console.log(error);
  });

//User Schema
const userSchema = mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  password: { type: String, required: true },
});

//User Model
const userModel = mongoose.model("users", userSchema);

const productSchema = mongoose.Schema({
  product_name: { type: String, required: true },
  product_desc: { type: String, required: true },
  product_price: { type: Number, required: true },
  product_quantity: { type: Number, required: true },
  product_image: { type: String, required: true },
  product_date: { type: String, default: Date.now() },
});

const productModel = mongoose.model("products", productSchema);

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

const allStudents = [];

app.get("/", (request, response) => {
  //   response.send("<h1>Hello Student</h1>");
  // response.send(url)
  response.sendFile(`${__dirname}/index.html`);
});

app.get("/user", (req, res) => {
  res.send(url);
});

app.get("/about", (req, res) => {
  // res.send("About Page")
  // C:\Users\peter\Desktop\All Coding Classes\Level 3 December Class\backend-project\index.html
  console.log(__dirname);
  // res.sendFile(__dirname + "/index.html")
  res.sendFile(`${__dirname}/about.html`);
});

app.get("/first", (req, res) => {
  res.render("index");
});

app.get("/services", (req, res) => {
  res.render("services");
});

app.get("/dashboard", (req, res) => {
  res.render("dashboard", { name: "Petertechy", gender: "male", allStudents });
});

app.get("/sign-up", (req, res) => {
  res.render("signup");
});

app.post("/register", (req, res) => {
  // allStudents.push(req.body)
  console.log(req.body);
  let form = new userModel(req.body);
  form
    .save()
    .then(() => {
      console.log("User saved in db");
    })
    .catch((error) => {
      console.log(error);
    });
  // console.log(allStudents)
  // res.send("User successfully Register")
  // res.redirect("dashboard")
});

app.get("/add-product", (req, res) => {
  res.render("product");
});

app.post("/product", (req, res) => {
  let form = new productModel(req.body);
  form
    .save()
    .then(() => {
      console.log("Product saved");
      // res.send("Product added successfully");
      res.redirect("/all-product")
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get("/all-product", (req, res) => {
  productModel
    .find()
    .then((products) => {
      console.log(products);
      // res.send("I receive it")
      res.render("allProducts", { allProducts: products });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error fetching products");
    });
});

app.post("/delete/:id", (req, res) => {
  console.log(req.params.id);
  const productId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).send("Invalid product id");
  }

  productModel
    .findByIdAndDelete(productId)
    .then(() => {
      console.log("Product deleted");
      res.redirect("/all-product");
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error deleting product");
    });
});

app.get("/edit-product/:id", (req, res) => {
  const productId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).send("Invalid product id");
  }

  productModel
    .findById(productId)
    .then((product) => {
      res.render("editProduct", { product });
      console.log(product);
    })
    .catch((error) => {
      console.log("There is an error");
      console.log(error);
      res.status(500).send("Error loading product");
    });
});

app.post("/update-product/:id", (req,res)=>{
  const productId = req.params.id

  productModel.findByIdAndUpdate(productId, req.body)
  .then(()=>{
    console.log("Product Updated")
    res.redirect("/all-product")
  })
  .catch((error)=>{
    console.log(error)
  })
})

app.listen(PORT, (err) => {
  if (err) {
    console.log("There is an error" + err);
  } else {
    console.log(`Server is running on Port ${PORT}`);
  }
});
