const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  firstname: { type: String, required: true},
  lastname: { type: String, required: true},
  gender: { type: String, required: true},
  email: { type: String, required: true},
  password: { type: String, required: true },
});

 
module.exports = mongoose.model("User", UserSchema);
