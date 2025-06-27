const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Use a valid ObjectId for mocks
const TEST_OBJECT_ID = new mongoose.Types.ObjectId();

process.env.JWT_SECRET = "e-vidwan";

// Mock User model
jest.mock("../models/userModel", () => {
  const mockUser = jest.fn();
  mockUser.findOne = jest.fn();
  mockUser.create = jest.fn();
  mockUser.prototype.save = jest.fn();
  return mockUser;
});
const User = require("../models/userModel");

// Mock Otp model
jest.mock("../models/Otp", () => {
  return {
    findOne: jest.fn().mockResolvedValue({
      otp: "123456",
      otpExpires: Date.now() + 15 * 60 * 1000 // 15 minutes from now
    }),
    deleteOne: jest.fn().mockResolvedValue(true),
  };
});
const Otp = require("../models/Otp");

// Mock notificationModel to avoid validation errors
jest.mock("../models/notificationModel", () => {
  return function (data) {
    return {
      ...data,
      save: jest.fn().mockResolvedValue(true),
    };
  };
});

// Mock StudentCourseAnalytics to avoid analytics errors
jest.mock("../models/analyticsModel", () => {
  return function (data) {
    return {
      ...data,
      save: jest.fn().mockResolvedValue(true),
    };
  };
});

jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("User Controller", () => {
  afterAll(async () => {
    await mongoose.connection.close(); // Close MongoDB connection
  });

  describe("POST /api/auth/signup", () => {
    it("should return 400 if email is invalid", async () => {
      const response = await request(app)
        .post("/api/auth/signup")
        .send({ email: "invalidemail", password: "Password123", confirmPassword: "Password123", role: "Student", otp: "123456" });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Invalid or missing email address.");
    });

    it("should return 400 if passwords do not match", async () => {
      const response = await request(app)
        .post("/api/auth/signup")
        .send({ email: "test@example.com", password: "Password123", confirmPassword: "Password456", role: "Student", otp: "123456" });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Passwords do not match.");
    });

    it("should return 201 if signup is successful", async () => {
      const mockUserInstance = {
        _id: TEST_OBJECT_ID,
        save: jest.fn().mockResolvedValue(true),
      };
      User.mockImplementation(() => mockUserInstance);

      const response = await request(app)
        .post("/api/auth/signup")
        .send({ email: "test@example.com", password: "Password123", confirmPassword: "Password123", role: "Student", otp: "123456" });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Signup successful!");
    });
  });

  describe("POST /api/auth/login", () => {
    it("should return 404 if user is not found", async () => {
      User.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: "nonexistent@example.com", password: "Password123" });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Invalid email or password.");
    });

    it("should return 401 if password is invalid", async () => {
      User.findOne.mockResolvedValue({
        _id: TEST_OBJECT_ID,
        email: "ksheermanu@gmail.com",
        password: "$2b$10$hCCBCMtssDT2ILb7iHDnAuZ0Rc8XxtUkSj.7uNk60gKIbf.7XGUiu"
      });
      bcrypt.compare.mockResolvedValue(false);

      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: "test@example.com", password: "WrongPassword123" });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Invalid email or password.");
    });

    it("should return 200 if login is successful", async () => {
      User.findOne.mockResolvedValue({
        _id: TEST_OBJECT_ID,
        email: "test@example.com",
        username: "TestUser",
        role: "Student",
        password: "hashedpassword"
      });
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("testtoken");

      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: "test@example.com", password: "Password123" });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Login successful.");
      expect(response.body.token).toBe("testtoken");
    });
  });
});