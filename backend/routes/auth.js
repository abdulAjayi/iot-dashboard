import express from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../prisma/lib/prismaClient.js";
import { generateToken } from "../utils/generateToken.js";
import { requireAuth } from "../middleware/authmiddleware.js";
import { body, validationResult } from "express-validator";
import {
  pinVerifyLimiter,
  loginLimiter,
  verifyOtpLimiter,
  requestOtpLimiter,
} from "../middleware/authmiddleware.js";
// import { sendEmailOTP, sendSMSOTP } from "../services/notify.js";
import { sendEmailOTP } from "../services/notify.js";
const router = express.Router();
router.post(
  "/register",
  [
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required")
      .isLength({ min: 3, max: 20 })
      .withMessage("Username must be between 3 and 20 characters")
      .escape(),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty())
      return res.status(400).json({ error: error.array()[0].msg });
    try {
      const { username, password } = req.body;
      if (!username || !password)
        return res
          .status(400)
          .json({ error: "Username and password are required" });
      const existing = await prisma.user.findUnique({ where: { username } });
      if (existing)
        return res.status(400).json({ error: "Username already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
          isActive: true,
        },
      });
      const token = generateToken(user);
      console.log(token);
      res.status(201).json({
        message: "Account created successfully",
        username: user.username,
        role: user.role,
        token,
      });
    } catch (error) {
      console.log(req.body);
      res.status(500).json({ error: "Something went wrong" });
      console.log(error);
    }
  },
);

router.post("/login", loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res
        .status(400)
        .json({ error: "Username and password are required" });

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    if (!user.isActive)
      return res
        .status(403)
        .json({ error: "Account has been deactivated. Contact your admin." });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const token = generateToken(user);
    res.json({
      message: "Account logged in successfully",
      token,
      username: user.username,
      role: user.role,
      hasPin: !!user.pin,
    });
  } catch (error) {
    res.status(500).json({ error: "something went wrong, please try again" });
  }
});

// Get current logged in user — useful on page refresh
router.get("/me", requireAuth, (req, res) => {
  res.json({
    username: req.user.username,
    role: req.user.role,
    hasPin: !!req.user.pin,
  });
});

// POST /auth/setup-pin
// Admin sets their 6-digit PIN for the first time
router.post("/setup-pin", requireAuth, async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ error: "Admins only" });
    const { pin, email, phoneNumber } = req.body;
    if (!email && !phoneNumber)
      return res
        .status(400)
        .json({ error: "At least an email or phone number is required" });

    if (!pin || !/^\d{6}$/.test(pin))
      return res.status(400).json({ error: "PIN must be exactly 6 digits" });

    const hashedPin = await bcrypt.hash(pin, 10);

    await prisma.user.update({
      where: { id: req.user.id },
      data: {
        pin: hashedPin,
        email: email ?? undefined,
        phoneNumber: phoneNumber ?? undefined,
      },
    });

    res.json({ message: "PIN set successfully" });
  } catch (error) {
    res.status(500).json({ error: "something went wrong" });
  }
});

// POST /auth/verify-pin
// Verifies admin PIN before allowing shut well command
router.post("/verify-pin", pinVerifyLimiter, requireAuth, async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ error: "Admins only" });

    const { pin } = req.body;
    if (!pin) return res.status(400).json({ error: "PIN is required" });

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user.pin)
      return res
        .status(400)
        .json({ error: "No PIN set. Please set up your PIN first." });

    const valid = await bcrypt.compare(pin, user.pin);
    if (!valid) return res.status(401).json({ error: "Incorrect PIN" });

    res.json({ success: true, message: "PIN verified" });
  } catch (error) {
    res.status(500).json({ error: "something went wrong" });
  }
});

// POST /auth/request-otp
// Generates OTP and sends via email and SMS
router.post(
  "/request-otp",
  requestOtpLimiter,
  requireAuth,
  async (req, res) => {
    try {
      if (req.user.role !== "admin")
        return res.status(403).json({ error: "Admins only" });

      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
      });

      if (!user.email && !user.phoneNumber)
        return res.status(400).json({
          error:
            "No email or phone number on your account. Contact your system administrator.",
        });

      // Generate a random 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // Hash the OTP before storing
      const hashedOtp = await bcrypt.hash(otp, 10);

      // Store hashed OTP with 10 minute expiry
      await prisma.user.update({
        where: { id: req.user.id },
        data: {
          otp: hashedOtp,
          otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
        },
      });

      // Send OTP via email and/or SMS simultaneously
      // const promises = [];
      // if (user.email) promises.push(sendEmailOTP(user.email, otp));
      // if (user.phoneNumber) promises.push(sendSMSOTP(user.phoneNumber, otp));
      // await Promise.all(promises);
      const verify = await sendEmailOTP(user.email, otp);

      res.json({
        message: "OTP sent",
        sentTo: {
          email: user.email ? `${user.email.slice(0, 3)}***` : null,
          // phone: user.phoneNumber ? `***${user.phoneNumber.slice(-4)}` : null,
        },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

// POST /auth/verify-otp
// Verifies the OTP entered by the admin
router.post("/verify-otp", verifyOtpLimiter, requireAuth, async (req, res) => {
  try {
    const { otp } = req.body;
    if (!otp) return res.status(400).json({ error: "OTP is required" });

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user.otp) return res.status(400).json({ error: "No OTP requested" });

    // Check if OTP has expired
    if (new Date() > user.otpExpiresAt)
      return res
        .status(401)
        .json({ error: "OTP has expired. Request a new one." });

    // Verify OTP against stored hash
    const valid = await bcrypt.compare(otp, user.otp);
    if (!valid) return res.status(401).json({ error: "Incorrect OTP" });

    // Clear OTP from database after successful verification
    await prisma.user.update({
      where: { id: req.user.id },
      data: { otp: null, otpExpiresAt: null },
    });

    res.json({
      success: true,
      message: "OTP verified. You can now set a new PIN.",
    });
  } catch (error) {
    res.status(500).json({ error: "something went wrong" });
  }
});

// POST /auth/set-pin
// Sets a new PIN after OTP has been verified
router.post("/set-pin", requireAuth, async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ error: "Admins only" });

    const { pin } = req.body;

    if (!pin || pin.length !== 6 || !/^\d{6}$/.test(pin))
      return res.status(400).json({ error: "PIN must be exactly 6 digits" });

    const hashedPin = await bcrypt.hash(pin, 10);

    await prisma.user.update({
      where: { id: req.user.id },
      data: { pin: hashedPin },
    });
    res.json({ message: "PIN updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "something went wrong" });
  }
});
export default router;
