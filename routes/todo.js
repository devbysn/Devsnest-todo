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
  //   let user = {
  //     userLogged: req.session.user,
  //   };
  //   console.log(req.session);
  //   console.log(user);
  //   if (!req.session.email) {
  //     res.redirect("/todos");
  //   }
  // const tasks = await TodoTask.find({ email_: req.session.email });

  // const tasks = TodoTask.find({ postedBy: req.session.user._id });
  // const user = await Us er.findOne({ email: req.session.user.email });
  // verify
  // jwt.verify(req.headers.auth, process.env.TOKEN_SECRET, (err, decoded) => {
  //   if (err)
  //     return res.status(401).json({
  //       title: "not authorized",
  //     });
  //   console.log(decoded);
  console.log(req.session.user);

  // console.log("NICEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE", req.header("auth"));
  const tasks = await TodoTask.find({});
  res.render("todo", { todoTasks: tasks });
  // const tasks = await TodoTask.findById(req.session.user._id);
  // if (tasks) return res.render("todo", { todoTasks: tasks });
  // else return res.render("todo", { todoTasks: null });
  // });
});

router.post("/", async (req, res) => {
  console.log("NICe2");

  const todoTask = new TodoTask({
    content: req.body.content,
    postedBy: req.session.user._id,
  });

  // console.log(todoTask.content);

  if (!todoTask.content) return res.redirect("/todos");

  try {
    await TodoTask.create(todoTask).then(async (newTodo) => {
      newTodo = await User.populate(newTodo, { path: "postedBy" });
      console.log(newTodo);
    });
    return res.redirect("/todos");

    // User.findOne({ id })
    //   .populate(TodoTask)
    //   .exec(function (err, user) {
    //     // User with populated todos
    //   });
    // return res.redirect("/todos");
  } catch (error) {
    res.status(501).redirect("/todos");
  }
});

// //Edit
// app
//   .route("/edit/:id")
//   .get((req, res) => {
//     const id = req.params.id;
//     TodoTask.find({}, (err, task) => {
//       res.render("todoEdit", { todoTasks: task, idTask: id });
//     });
//   })
//   .post((req, res) => {
//     const id = req.params.id;
//     TodoTask.findByIdAndUpdate(id, { content: req.body.content }, (err) => {
//       if (err) return res.send(500, err);
//       res.redirect("/todos");
//     });
//   });

router.get("/edit/:id", (req, res) => {
  console.log("NICe3");
  const id = req.params.id;
  TodoTask.find({}, (err, task) => {
    res.render("todoEdit", { todoTasks: task, idTask: id });
  });
});

router.post("/edit/:id", (req, res) => {
  console.log("NIce4");
  const id = req.params.id;
  TodoTask.findByIdAndUpdate(id, { content: req.body.content }, (err) => {
    if (err) return res.send(500, err);
    res.redirect("/todos");
  });
});

//Delete
// app.route("/remove/:id").get((req, res) => {
//   const id = req.params.id;

//   TodoTask.findByIdAndRemove(id, (err) => {
//     if (err) return res.send(500, err);
//     res.redirect("/todos");
//   });
// });

router.get("/remove/:id", (req, res) => {
  console.log("NICe4");

  const id = req.params.id;

  TodoTask.findByIdAndRemove(id, (err) => {
    if (err) return res.send(500, err);
    res.redirect("/todos");
  });
});

module.exports = router;
