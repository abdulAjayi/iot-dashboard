import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(401).json({ error: "Unauthorized" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
}

export const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5,
  message: { error: "Too many failed attempts. Try again in 15 minutes." },
});

export const pinVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: { error: "Too many failed attempts. Try again in 15 minutes." },
});

export const requestOtpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 3,
  message: { error: "Too many OTP requests. Try again in 15 minutes." },
});

export const verifyOtpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: { error: "Too many OTP attempts. Request a new one." },
});

// export function requireAdmin(req, res, next) {
//   requireAuth(req, res, () => {
//     if (req.user.role !== "admin")
//       return res.status(403).json({ error: "Admins only" });
//     next();
//   });
// }
