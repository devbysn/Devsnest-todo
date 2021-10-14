const { Schema } = require("mongoose");

const mongoose = require("mongoose");

const todoTaskSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  postedBy: { type: Schema.Types.ObjectId, ref: "User" },
  date: {
    type: Date,
    default: Date.now,
  },
});

// The first argument is the singular name of the collection that will be created for your
//  model (Mongoose will create the database collection for the above model SomeModel above),
//   and the second argument is the schema you want to use in creating the model.
module.exports = mongoose.model("TodoTask", todoTaskSchema);
