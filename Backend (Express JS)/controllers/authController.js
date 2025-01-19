import {
  getUserProfileService,
  loginService,
  logoutService,
} from "../services/authService.js";

export const getUserProfile = async (req, res) => {
  try {
    const result = await getUserProfileService(req);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error di getUserProfile:", error.message);
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
    });
  }
};

export const login = async (req, res) => {
  try {
    const result = await loginService(req, res);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error di login:", error.message);

    if (error.status) {
      res.status(error.status).json({ message: error.message });
    } else {
      res.status(500).json({
        message: "Terjadi kesalahan pada server",
      });
    }
  }
};

export const logout = (req, res) => {
  try {
    logoutService(res);
    res.status(200).json({ message: "Logout berhasil" });
  } catch (error) {
    console.error("Error di logout:", error.message);
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
    });
  }
};
