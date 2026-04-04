const express = require("express");
const app = express();
const ejs = require("ejs");
require("dotenv").config({ override: true });
const PORT = process.env.PORT;
const mongoose = require("mongoose");
const adminRoute = require("./routes/admin.route");
const userRoute = require("./routes/user.route");
const URI = process.env.MONGODB_URI;
const cors = require("cors");

app.use(cors());
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));
app.use("/admin", adminRoute);
app.use("/user", userRoute);

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

let connections = app.listen(PORT, (err) => {
  if (err) {
    console.log("There is an error" + err);
  } else {
    console.log(`Server is running on Port ${PORT}`);
  }
});

let socketClient = require("socket.io")
let io = socketClient(connections, {
  cors: {origin: "*"}
})
io.on("connection", (socket)=>{
  console.log("A user connected successfully")
  console.log(socket.id)
  socket.on("sendMsg", (message)=>{
    console.log(message)
    io.emit("broadcastMsg", message)
  })
  socket.on("disconnect user", ()=>{
    console.log("someone disconnected")
  })
})
