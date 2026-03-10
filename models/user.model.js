const mongoose = require("mongoose");

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

module.exports =  userModel