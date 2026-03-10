const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  product_name: { type: String, required: true },
  product_desc: { type: String, required: true },
  product_price: { type: Number, required: true },
  product_quantity: { type: Number, required: true },
  product_image: { type: String, required: true },
  product_date: { type: String, default: Date.now() },
});

const productModel = mongoose.model("products", productSchema);

module.exports = productModel