const express = require("express");
const app = express();
const ejs = require("ejs");
require("dotenv").config();
const PORT = process.env.PORT;
const mongoose = require("mongoose");
const adminRoute = require("./routes/admin.route")
const userRoute = require("./routes/user.route")

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use("/admin", adminRoute)
app.use("/user", userRoute)

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

const allStudents = [];

app.listen(PORT, (err) => {
  if (err) {
    console.log("There is an error" + err);
  } else {
    console.log(`Server is running on Port ${PORT}`);
  }
});
