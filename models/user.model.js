const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

//User Schema
const userSchema = mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  password: { type: String, required: true },
});

let saltRound = 10;

userSchema.pre("save", function () {
  if (!this.isModified("password")) return;

  return bcrypt.hash(this.password, saltRound)
    .then((hashedPassword) => {
      this.password = hashedPassword;
    })
    .catch((err) => {
      console.log(err, "password could not be hashed");
      throw err; // ❗ important
    });
});

userSchema.methods.validatePassword = function (password, callback) {
  console.log(password, this.password);

  bcrypt.compare(password, this.password, (err, same) => {
    console.log(same);
    callback(err, same);
  });
};

//User Model
const userModel = mongoose.model("users", userSchema);

module.exports = userModel;