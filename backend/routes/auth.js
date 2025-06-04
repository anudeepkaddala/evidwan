const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

const EMAIL = process.env.EMAIL;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

console.log("JWT_SECRET:", JWT_SECRET);
console.log("EMAIL:", EMAIL);
console.log("EMAIL_PASSWORD:", EMAIL_PASSWORD);

// Helper function to validate email format
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Helper function to send emails
const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL,
      pass: EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: EMAIL,
    to,
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);
    return true;
  } catch (error) {
    console.error("Error during email sending:", error);
    return false;
  }
};

// Signup Route
router.post("/send-otp", async (req, res) => {
    const { email } = req.body;
  
    try {
      const otpGenerated = Math.floor(100000 + Math.random() * 900000);
  
      const newUser = new User({
        email,
        signupOtp: otpGenerated,
        otpExpires: Date.now() + 15 * 60 * 1000, // OTP expires in 15 minutes
      });
  
      await newUser.save();
  
      // Debugging logs
      console.log("Saved Signup OTP:", newUser.signupOtp);
      console.log("Saved OTP Expiry Time:", newUser.otpExpires);
  
      const emailSent = await sendEmail(
        email,
        "Signup OTP Verification",
        `Your signup OTP is: ${otpGenerated}. It is valid for 15 minutes.`
      );
  
      if (emailSent) {
        res.status(200).json({ message: "OTP sent to your email for verification." });
      } else {
        res.status(500).json({ error: "Failed to send OTP. Please try again later." });
      }
    } catch (error) {
      console.error("Error during OTP sending:", error);
      res.status(500).json({ error: "Server error." });
    }
  });

// Send OTP Route (Signup)
router.post("/send-otp", async (req, res) => {
    const { email } = req.body;
  
    try {
      const otpGenerated = Math.floor(100000 + Math.random() * 900000);
  
      const newUser = new User({
        email,
        signupOtp: otpGenerated,
        otpExpires: Date.now() + 15 * 60 * 1000, // OTP expires in 15 minutes
      });
  
      await newUser.save();
  
      // Debugging logs
      console.log("Saved Signup OTP:", newUser.signupOtp);
      console.log("Saved OTP Expiry Time:", newUser.otpExpires);
  
      const emailSent = await sendEmail(
        email,
        "Signup OTP Verification",
        `Your signup OTP is: ${otpGenerated}. It is valid for 15 minutes.`
      );
  
      if (emailSent) {
        res.status(200).json({ message: "OTP sent to your email for verification." });
      } else {
        res.status(500).json({ error: "Failed to send OTP. Please try again later." });
      }
    } catch (error) {
      console.error("Error during OTP sending:", error);
      res.status(500).json({ error: "Server error." });
    }
  });

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Fetch user from the database
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found for email:", email);
      return res.status(404).json({ error: "Invalid email or password." });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("Password comparison result:", isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Generate JWT token for authentication
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });

    // Respond with user data and token
    res.status(200).json({
      message: "Login successful.",
      user: {
        email: user.email,
        username: user.username,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Server error." });
  }
});

// Forgot Password - Send OTP
router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ error: "User not found." });
  
      const otpGenerated = Math.floor(100000 + Math.random() * 900000);
  
      user.resetOtp = otpGenerated;
      user.otpExpires = Date.now() + 15 * 60 * 1000; // OTP expires in 15 minutes
      await user.save();
  
      // Debugging logs
      console.log("Saved Reset OTP:", user.resetOtp);
      console.log("Saved OTP Expiry Time:", user.otpExpires);
  
      const emailSent = await sendEmail(
        email,
        "Password Reset OTP",
        `Your password reset OTP is: ${otpGenerated}. It is valid for 15 minutes.`
      );
  
      if (emailSent) {
        res.status(200).json({ message: "OTP sent to your email." });
      } else {
        res.status(500).json({ error: "Failed to send OTP. Please try again later." });
      }
    } catch (error) {
      console.error("Error during forgot password:", error);
      res.status(500).json({ error: "Server error." });
    }
  });

// Forgot Password - Reset Password
// Forgot Password - Reset Password
router.post("/reset-password", async (req, res) => {
    const { email, otp, newPassword, confirmPassword } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      // Debugging logs
      console.log("Retrieved User:", user);
      console.log("Provided OTP:", otp);
      console.log("Stored Reset OTP:", user.resetOtp);
      console.log("Reset OTP Expiry Time:", user.otpExpires);
      console.log("Current Time:", Date.now());
  
      if (!user) return res.status(404).json({ error: "User not found." });
  
      // Verify OTP
      if (Number(user.resetOtp) !== Number(otp) || user.otpExpires < Date.now()) {
        return res.status(400).json({ error: "Invalid or expired OTP." });
      }
  
      // Validate password
      if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters long." });
      }
  
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ error: "Passwords do not match." });
      }
  
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Update password and clear OTP fields
      user.password = hashedPassword;
      user.resetOtp = undefined;
      user.otpExpires = undefined;
      await user.save();
  
      res.status(200).json({ message: "Password reset successful." });
    } catch (error) {
      console.error("Error during reset password:", error);
      res.status(500).json({ error: "Server error." });
    }
  });

module.exports = router;