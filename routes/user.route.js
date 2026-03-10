const express = require("express");
const router = express.Router()
const { signUp, userDashboard, landingPage } = require("../controllers/user.controller");
const { allProduct } = require("../controllers/product.controller");

router.get("/", landingPage)
router.get("/sign-up", signUp);
router.get("/dashboard", userDashboard);
router.get("/all-product", allProduct)

module.exports = router