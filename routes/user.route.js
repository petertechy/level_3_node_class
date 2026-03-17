const express = require("express");
const router = express.Router()
const { signUp, userDashboard, landingPage, registerUser, authenticateUser } = require("../controllers/user.controller");
const { allProduct } = require("../controllers/product.controller");

router.get("/", landingPage)
router.get("/sign-up", signUp);
router.get("/dashboard", userDashboard);
router.get("/all-product", allProduct)
router.post("/register", registerUser);
router.post("/signin", authenticateUser)

module.exports = router