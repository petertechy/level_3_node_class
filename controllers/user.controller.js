const express = require("express");
const app = express();
const userModel = require("../models/user.model")

const signUp = (req,res) =>{
    res.render("signup");
}

const landingPage = (req, res) =>{
       // response.send("<h1>Hello Student</h1>");
//   response.send(url)
// console.log(__dirname)

  res.render(`index`);
}

const userDashboard = (req,res)=>{
     res.render("dashboard", { name: "Petertechy", gender: "male", allStudents });
}

const registerUser = (req, res) =>{
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
}

module.exports = {registerUser, signUp, userDashboard, landingPage}