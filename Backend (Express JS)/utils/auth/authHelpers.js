import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

export const generateToken = (payload, secret, expiresIn = "2h") => {
  return jwt.sign(payload, secret, { expiresIn });
};
