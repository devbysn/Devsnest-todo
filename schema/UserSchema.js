const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      default: "./images/profilePic.png",
    },
    todos: [{ type: Schema.Types.ObjectId, ref: "TodoTask" }],
  },
  { timestamps: true }
);

var User = mongoose.model("User", UserSchema);

module.exports = User;
