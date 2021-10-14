const express = require("express");
const app = express();
const router = express.Router();
const User = require("../schema/UserSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

app.set("view engine", "pug");
app.set("views", "../views");

//body parser

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

//GET req

router.get("/", (req, res, next) => {
  console.log("Register");
  res.status(200).render("register");
});

router.post("/", async (req, res) => {
  //env file
  const dotenv = require("dotenv");
  // get config vars
  dotenv.config();

  const saltRounds = 10;

  var name = req.body.name.trim();
  var userName = req.body.userName.trim();
  var email = req.body.email.trim();
  var password = req.body.password;

  var payLoad = req.body;

  if (name && userName && email && password) {
    var user = await User.findOne({
      $or: [{ userName: userName }, { email: email }],
    }).catch((err) => {
      payLoad.errorMessage = " 🧐 somthing went wrong !!";
      res.status(200).render("register", payLoad);
    });

    if (user == null) {
      //No user found
      var data = req.body;
      //hash the password
      data.password = await bcrypt.hash(password, saltRounds);
      User.create(data).then((user) => {
        req.session.user = user;
        return res.redirect("/todos");
        const token = jwt.sign({ id: user }, process.env.TOKEN_SECRET, {
          expiresIn: "1800000s",
        });
      });
    } else {
      //User found
      if (email == user.email) {
        payLoad.errorMessage =
          " 🧐 use another email id it's already registered !";
        res.status(200).render("register", payLoad);
      } else {
        payLoad.errorMessage = " 🧐 use another username, it's taken !";
        res.status(200).render("register", payLoad);
      }
    }
  } else {
    payLoad.errorMessage = " 🧐 Make sure each field has a value in it.";
    res.status(200).render("register", payLoad);
  }
});
module.exports = router;
