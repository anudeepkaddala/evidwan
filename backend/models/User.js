const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  username: { type: String },
  role: { type: String },
  resetOtp: { type: Number }, // Add this field
  otpExpires: { type: Date }, // Add this field
  signupOtp: { type: Number }, // Add this field
});

module.exports = mongoose.model("User", userSchema);