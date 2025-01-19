import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config/envConfig.js";

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ Error: "Access Denied, no token provided" });
  }

  try {
    const verified = jwt.verify(token, SECRET_KEY);
    req.user = {
      id: verified.id,
      email: verified.email,
      role: verified.role,
    };
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ Error: "Token expired" });
    }
    res.status(403).json({ Error: "Invalid Token" });
  }
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ Error: "Email and password are required" });
  }

  next();
};
