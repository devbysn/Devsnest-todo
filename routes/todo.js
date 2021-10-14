const express = require("express");
const app = express();
const path = require("path");
const router = express.Router();
const session = require("express-session");
const TodoTask = require("../schema/TodoTasks");
const User = require("../schema/UserSchema");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

//env file
const dotenv = require("dotenv");
// get config vars
dotenv.config();
process.env.TOKEN_SECRET;

// access config var
//Setting up view engine
app.set("view engine", "ejs");
app.set("views", "./views");

//body parser
app.use(cookieParser());

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

//loading static resources
app.use(express.static(path.join(__dirname, "public")));

router.get("/", async (req, res) => {
  console.log("SEssion 2 : ", req.session);
  const id = req.session.user._id;
  const tasks = await TodoTask.find({ postedBy: id });
  res.render("todo", { todoTasks: tasks });
});

router.post("/", async (req, res) => {
  const todoTask = new TodoTask({
    content: req.body.content,
    postedBy: req.session.user._id,
  });

  console.log("SEssion : ", req.session);

  if (!todoTask.content) return res.redirect("/todos");

  try {
    await TodoTask.create(todoTask).then(async (newTodo) => {
      newTodo = await User.populate(newTodo, { path: "postedBy" });
    });
    return res.redirect("/todos");
  } catch (error) {
    res.status(501).redirect("/todos");
  }
});

router.get("/edit/:id", (req, res) => {
  const id = req.params.id;
  const userId = req.session.user._id;

  TodoTask.find({ postedBy: userId }, (err, task) => {
    res.render("todoEdit", { todoTasks: task, idTask: id });
  });
});

router.post("/edit/:id", (req, res) => {
  const id = req.params.id;
  TodoTask.findByIdAndUpdate(id, { content: req.body.content }, (err) => {
    if (err) return res.send(500, err);
    res.redirect("/todos");
  });
});

router.get("/remove/:id", (req, res) => {
  const id = req.params.id;

  TodoTask.findByIdAndRemove(id, (err) => {
    if (err) return res.send(500, err);
    res.redirect("/todos");
  });
});

module.exports = router;
