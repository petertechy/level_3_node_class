const express = require("express");
const app = express();
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken")
const cloudinary = require("cloudinary")

cloudinary.config({
  cloud_name: "dcycdzgln",
  api_key: "116745742688568",
  api_secret: "w44E55BJRcmzoOYmUYrn67Adnj8"
})

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
           let token =  jwt.sign({email:req.body.email}, "secret", {expiresIn: "1h"})
           console.log(token)
            res.send({ status: true, message: "Valid Credentials", token });
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

const getDashboard = (req, res) =>{
  console.log(req.headers.authorization)
  let token = req.headers.authorization.split(" ")[1]
  jwt.verify(token, "secret", (err, result)=>{
    if(err){
      console.log(err)
      res.send({status: false, message: "Token expired or Invalid token"})
    }else{
      console.log(result)
      let email = result.email
      userModel.findOne({email:email},{firstname, lastname, age})
      .then((user)=>{
        res.send({status: true, message: "Valid Token", user})
      })
    }
  })
  // console.log("I am here")
}

const uploadFile = (req, res) =>{
  console.log(req.body.file)
  let myFile = req.body.file
  cloudinary.v2.uploader.upload(myFile,(err, result)=>{
    if(err){
      console.log("An error occured during upload")
      console.log(err)
    }else{
      console.log(result)
      let imageUrl = result.secure_url
      res.send({status: true, message: "Uploaded Successfully", imageUrl})
    }
  })
}

module.exports = {
  registerUser,
  signUp,
  userDashboard,
  landingPage,
  authenticateUser,
  getDashboard,
  uploadFile
};
