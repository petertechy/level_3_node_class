const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary");
const nodemailer = require("nodemailer");
const registrationEmail = require("../emails/registrationEmail");

const allStudents = [];
const PAYSTACK_API_URL = "https://api.paystack.co";

cloudinary.config({
  cloud_name: "dcycdzgln",
  api_key: "116745742688568",
  api_secret: "w44E55BJRcmzoOYmUYrn67Adnj8",
});

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
      // console.log(user)

      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.USER,
          pass: process.env.PASS,
        },
      });

      let mailOptions = {
        from: '"Elon Musk" <petertechy01@gmail.com>',
        to: [req.body.email, "ajibolamoses11@gmail.com"],
        subject: "🎉 Welcome to Elon Musk – Registration Successful!",
        html: registrationEmail(req.body.firstname, req.body.lastname),
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });

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
            let token = jwt.sign({ email: req.body.email }, "secret", {
              expiresIn: "1h",
            });
            console.log(token);
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

const getDashboard = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .send({ status: false, message: "Missing or malformed token" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, "secret", async (err, decoded) => {
    if (err) {
      console.log(err);
      return res
        .status(401)
        .send({ status: false, message: "Token expired or invalid token" });
    }

    const email = decoded?.email;
    if (!email) {
      return res
        .status(401)
        .send({ status: false, message: "Invalid token payload" });
    }

    try {
      const user = await userModel.findOne(
        { email },
        { firstname: 1, lastname: 1, email: 1, age: 1, _id: 1 },
      );

      if (!user) {
        return res
          .status(404)
          .send({ status: false, message: "User not found" });
      }

      return res.send({ status: true, message: "Valid token", user });
    } catch (findErr) {
      console.log(findErr);
      return res
        .status(500)
        .send({ status: false, message: "Error fetching user data" });
    }
  });
};

const uploadFile = (req, res) => {
  console.log(req.body.file);
  let myFile = req.body.file;
  cloudinary.v2.uploader.upload(myFile, (err, result) => {
    if (err) {
      console.log("An error occured during upload");
      console.log(err);
    } else {
      console.log(result);
      let imageUrl = result.secure_url;
      res.send({ status: true, message: "Uploaded Successfully", imageUrl });
    }
  });
};

const paystackRequest = async (path, method, data = null) => {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    throw new Error("Missing PAYSTACK_SECRET_KEY in environment");
  }

  const requestConfig = {
    method,
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
  };

  if (data) {
    requestConfig.body = JSON.stringify(data);
  }

  const response = await fetch(`${PAYSTACK_API_URL}${path}`, requestConfig);
  const payload = await response.json();
  return payload;
};

// Paystack expects amount in Kobo, not Naira.
const toKobo = (nairaAmount) => Math.round(Number(nairaAmount) * 100);

const initializePayment = async (req, res) => {
  const { email, amount, metadata } = req.body;

  if (!email || !amount) {
    return res.status(400).send({
      status: false,
      message: "email and amount are required",
    });
  }

  const numericAmount = Number(amount);
  if (Number.isNaN(numericAmount) || numericAmount <= 0) {
    return res.status(400).send({
      status: false,
      message: "amount must be a valid number greater than 0",
    });
  }

  try {
    const callbackUrl = `${req.protocol}://${req.get("host")}/user/payment/callback`;

    const paystackResponse = await paystackRequest(
      "/transaction/initialize",
      "POST",
      {
        email,
        amount: toKobo(numericAmount),
        callback_url: callbackUrl,
        metadata,
      },
    );

    if (!paystackResponse.status) {
      return res.status(400).send({
        status: false,
        message: paystackResponse.message || "Unable to initialize payment",
      });
    }

    return res.send({
      status: true,
      message: "Payment initialized",
      data: paystackResponse.data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: false,
      message: "Payment initialization failed",
    });
  }
};

const verifyPayment = async (req, res) => {
  const { reference } = req.params;

  if (!reference) {
    return res.status(400).send({
      status: false,
      message: "reference is required",
    });
  }

  try {
    const paystackResponse = await paystackRequest(
      `/transaction/verify/${reference}`,
      "GET",
    );

    if (!paystackResponse.status) {
      return res.status(400).send({
        status: false,
        message: paystackResponse.message || "Unable to verify payment",
      });
    }

    return res.send({
      status: true,
      message: "Payment verification complete",
      data: paystackResponse.data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: false,
      message: "Payment verification failed",
    });
  }
};

const paymentCallback = async (req, res) => {
  const { reference } = req.query;

  if (!reference) {
    return res.status(400).render("paymentStatus", {
      status: false,
      message: "Missing payment reference",
      reference: "N/A",
      amount: "N/A",
    });
  }

  try {
    const paystackResponse = await paystackRequest(
      `/transaction/verify/${reference}`,
      "GET",
    );

    const verified =
      paystackResponse.status && paystackResponse.data?.status === "success";

    return res.render("paymentStatus", {
      status: verified,
      message: verified
        ? "Payment successful"
        : paystackResponse.message || "Payment not successful",
      reference,
      amount: paystackResponse.data?.amount
        ? paystackResponse.data.amount / 100
        : "N/A",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).render("paymentStatus", {
      status: false,
      message: "Error confirming payment",
      reference,
      amount: "N/A",
    });
  }
};

module.exports = {
  registerUser,
  signUp,
  userDashboard,
  landingPage,
  authenticateUser,
  getDashboard,
  uploadFile,
  initializePayment,
  verifyPayment,
  paymentCallback,
};
