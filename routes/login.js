const express = require("express");
const app = express();
const router = express.Router();
const User = require("../schema/UserSchema");
const bcyrpt = require("bcrypt");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// get config vars
dotenv.config();
//Setting up view engine
app.set("view engine", "ejs");
app.set("views", "./views");

//body parser
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

router.get("/", (req, res) => {
  var message = "";
  res.status(200).render("login", { message: message });
});

router.post("/", async (req, res, next) => {
  // var message = "";
  var payLoad = req.body;
  var message = "";
  if (req.body.username && req.body.password) {
    var user = await User.findOne({
      $or: [{ userName: req.body.userName }, { email: req.body.username }],
    }).catch((err) => {
      message = " 🧐 User Doesn;t exists !!";
      res.status(401).render("login", { message: message });
    });

    if (user != null) {
      var result = await bcyrpt.compare(req.body.password, user.password);

      if (result == true) {
        const token = jwt.sign({ id: user.email }, process.env.TOKEN_SECRET, {
          expiresIn: "18000000s",
        });
        req.session.user = user;
        res.status(200).redirect("/todos");
      }
    }

    message = "Login credentials Invalid !";
    return res.status(200).render("login", { message: message });
  }
  message = "Fieds are empty !";
  res.status(200).render("login", { message: message });
});

module.exports = router;
