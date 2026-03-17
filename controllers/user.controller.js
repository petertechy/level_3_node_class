const express = require("express");
const app = express();
const userModel = require("../models/user.model");

const signUp = (req, res) => {
  res.render("signup");
};

const landingPage = (req, res) => {
  // response.send("<h1>Hello Student</h1>");
  //   response.send(url)
  // console.log(__dirname)

  res.render(`index`);
};

const userDashboard = (req, res) => {
  res.render("dashboard", { name: "Petertechy", gender: "male", allStudents });
};

const registerUser = (req, res) => {
  // allStudents.push(req.body)
  // console.log(req.body);
  let form = new userModel(req.body);
  form
    .save()
    .then((user) => {
      console.log("User saved in db");
      console.log(user)
      res.send({ message: "User registered", status: true, user: user });
    })
    .catch((error) => {
      console.log(error);
      res.send({ message: "Not Successful", status: false });
    });
  // console.log(allStudents)
  // res.send("User successfully Register")
  // res.redirect("dashboard")
};

const authenticateUser = (req, res) => {
  console.log(req.body);
  let { password } = req.body;
  userModel
    .findOne({ email: req.body.email })
    .then((user) => {
      // console.log(user)
      if (user) {
        //email is valid
        user.validatePassword(password, (err, same) => {
          console.log(password);
          if (!same) {
            res.send({ status: false, message: "Invalid Credentials" });
          } else {
            res.send({ status: true, message: "Valid Credentials" });
          }
        });
      } else {
        console.log("Invalid email");
        res.send({ status: false, message: "Invalid Credential" });
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = {
  registerUser,
  signUp,
  userDashboard,
  landingPage,
  authenticateUser,
};
