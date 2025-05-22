const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: String,
  password: String,
  phone: String,
  altPhone: String,
});

const adminModel =  mongoose.model("admin", userSchema);

module.exports = {adminModel};
