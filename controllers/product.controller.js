const express = require("express");
const app = express();

const productModel = require("../models/product.model")
const addProduct = (req,res) =>{
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
}

const allProduct  = (req, res) =>{
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
}

const deleteProduct = (req, res) =>{
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
}

const editProduct = (req, res) =>{
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
}

const updateProduct = (req, res) =>{
    const productId = req.params.id
    
      productModel.findByIdAndUpdate(productId, req.body)
      .then(()=>{
        console.log("Product Updated")
        res.redirect("/all-product")
      })
      .catch((error)=>{
        console.log(error)
      })
}

module.exports = {addProduct, allProduct, deleteProduct, editProduct, updateProduct}