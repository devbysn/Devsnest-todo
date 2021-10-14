const express = require("express");
const app = express();
const router = express.Router();
const User = require("../schema/UserSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

app.set("view engine", "pug");
app.set("views", "../views");

//env file
const dotenv = require("dotenv");
// get config vars
dotenv.config();

//body parser

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

//GET req

router.get("/", (req, res, next) => {
  console.log("HELLO 1");
  var message = "";
  console.log("Register");
  res.status(200).render("register", { message: message });
});

router.post("/", async (req, res) => {
  console.log("HELLO 2");

  const saltRounds = 10;
  var message = "";

  var name = req.body.name.trim();
  var userName = req.body.userName.trim();
  var email = req.body.email.trim();
  var password = req.body.password;

  var payLoad = req.body;

  if (name && userName && email && password) {
    console.log("HELLO 3");

    var user = await User.findOne({
      $or: [{ userName: userName }, { email: email }],
    }).catch((err) => {
      message = " 🧐 somthing went wrong !!";
      res.status(200).render("register", { message: message });
    });

    if (user == null) {
      console.log("HELLO 4");

      //No user found
      var data = req.body;
      //hash the password
      data.password = await bcrypt.hash(password, saltRounds);
      User.create(data).then((user) => {
        return res.status(200).redirect("/todos");
        const token = jwt.sign({ id: user }, process.env.TOKEN_SECRET, {
          expiresIn: "1800000s",
        });
      });
    } else {
      //User found
      console.log("HELLO 5");
      message = " 🧐 use another email id it's already registered !";
      res.status(200).render("register", { message: message });
    }
  } else {
    message = " 🧐 Make sure each field has a value in it.";
    res.status(200).render("register", { message: message });
  }
});
module.exports = router;
