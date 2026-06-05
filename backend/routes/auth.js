import express from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../prisma/lib/prismaClient.js";
import { generateToken } from "../utils/generateToken.js";

const router = express.Router();
router.post("/register", async (req, res) => {
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
    res
      .status(500)
      .json({ error: "Something went wrong", error: error.message });
  }
});

router.post("/login", async (req, res) => {
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
    });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Get current logged in user — useful on page refresh
// router.get("/me", requireAuth, (req, res) => {
//   res.json({ username: req.user.username, role: req.user.role });
// });
export default router;
