import jwt from "jsonwebtoken";
export function generateToken(user) {
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "8h" },
  );
  return token;
}
