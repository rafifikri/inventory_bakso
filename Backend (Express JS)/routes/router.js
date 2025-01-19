import express from "express";
import {
  getLatestStok,
  getSisaStok,
  getStokHarian,
  getStokById,
  createStokHarian,
  updateStokHarian,
  deleteStokHarian,
} from "../controllers/stokController.js";
import {
  login,
  logout,
  getUserProfile,
} from "../controllers/authController.js";
import { verifyToken, validateLogin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/user", verifyToken, getUserProfile);
router.post("/login", validateLogin, login);
router.post("/logout", logout);

router.get("/stok-harian/latest", verifyToken, getLatestStok);
router.get("/stok-harian/sisa-stok", verifyToken, getSisaStok);
router.get("/stok-harian", verifyToken, getStokHarian);
router.get("/stok-harian/:id", verifyToken, getStokById);
router.post("/stok-harian", verifyToken, createStokHarian);
router.put("/stok-harian/:id", verifyToken, updateStokHarian);
router.delete("/stok-harian/:id", verifyToken, deleteStokHarian);

export default router;
