require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("./db");
const PORT = 3000 || process.env.PORT;
const todos = require("./routes/todo");
const login = require("./routes/login");
const register = require("./routes/register");
const middleware = require("./middleware");
const session = require("express-session");
const favicon = require("serve-favicon");

//DB connection

//Setting up view engine
app.set("view engine", "ejs");
app.set("views", "./views");

//Favicon
// app.use(favicon(path.join(__dirname, "public/favicon_io", "favicon.ico")));

//body parser
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use(
  session({
    secret: "thisisasecretdonttellanyone",
    resave: true,
    saveUninitialized: false,
  })
);

//loading static resources
app.use(express.static(path.join(__dirname, "public")));

// app.get("/todos", middleware.requiredLogin, (req, res) => {
//   res.status(200).redirect("/todos");
// });

//All routes
app.use("/todos", todos);

app.use("/login", login);

app.use("/register", register);

app.get("/", middleware.requiredLogin, (req, res) => {
  res.status(200).redirect("/todos");
});

app.get("*", middleware.requiredLogin, (req, res) => {
  res.redirect("/todos");
});

app.listen(3000, () =>
  console.log("Server Up and running at Port : http://localhost:3000")
);
