const mongoose = require("mongoose");
require("dotenv").config();
const DB_CONNECT = process.env.DB_CONNECT;

class Database {
  constructor() {
    this.connect();
  }
  connect() {
    mongoose
      .connect(DB_CONNECT)
      .then(() => {
        console.log("Database succesfully connected !!");
      })
      .catch(() => {
        console.log("Error occured while connecting to the DB !!");
      });
  }
}

module.exports = new Database();
