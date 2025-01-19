import axios from "axios";
import { comparePassword, generateToken } from "../utils/auth/authHelpers.js";
import { setCookie } from "../utils/auth/cookieHelpers.js";
import { SECRET_KEY, USER_KEY } from "../config/envConfig.js";

export const getUserProfileService = async (req) => {
  const response = await axios.get(
    "https://bakso.garudaarung.com/api/get-users",
    {
      headers: { Authorization: `Bearer ${USER_KEY}` },
    }
  );

  const users = response.data;
  const user = users.find((user) => user.id === req.user.id);

  if (!user || !user.name) {
    throw new Error("Nama pengguna tidak ditemukan");
  }

  return { name: user.name };
};

export const loginService = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const error = new Error("Email dan password harus diisi");
    error.status = 400;
    throw error;
  }

  try {
    const response = await axios.get(
      "https://bakso.garudaarung.com/api/get-users",
      {
        headers: { Authorization: `Bearer ${USER_KEY}` },
      }
    );

    const users = response.data;
    const user = users.find((user) => user.email === email);

    if (!user) {
      const error = new Error("Email tidak ditemukan");
      error.status = 404;
      throw error;
    }

    const isPasswordMatch = await comparePassword(password, user.password);
    if (!isPasswordMatch) {
      const error = new Error("Password salah");
      error.status = 401;
      throw error;
    }

    if (!user.role || user.role.id !== 6) {
      const error = new Error("Akses ditolak, role tidak sesuai");
      error.status = 403;
      throw error;
    }

    const token = generateToken(
      { id: user.id, email: user.email, role: user.role.name },
      SECRET_KEY
    );

    setCookie(res, token);

    return {
      message: "Login berhasil",
      token,
      role: user.role.name,
    };
  } catch (error) {
    console.error("Error di loginService:", error.message);

    if (error.response) {
      const axiosError = new Error("Gagal mengambil data user");
      axiosError.status = error.response.status;
      throw axiosError;
    }

    throw error;
  }
};

export const logoutService = (res) => {
  res.clearCookie("token");
};
