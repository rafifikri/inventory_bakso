import {
  getStokHarianService,
  getStokByIdService,
  getSisaStokService,
  getLatestStokService,
  createStokHarianService,
  updateStokHarianService,
  deleteStokHarianService,
} from "../services/stokService.js";

export const getStokHarian = async (req, res) => {
  try {
    const result = await getStokHarianService(req);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error di getStokHarian:", error.message);
    res.status(500).json({
      message: "Gagal mendapatkan data stok harian, coba periksa kembali",
    });
  }
};

export const getStokById = async (req, res) => {
  try {
    const result = await getStokByIdService(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error di getStokById:", error.message);
    res.status(500).json({
      message: "Gagal mendapatkan id data stok harian, coba periksa kembali",
    });
  }
};

export const getSisaStok = async (req, res) => {
  try {
    const result = await getSisaStokService();
    res.status(200).json(result);
  } catch (error) {
    console.error("Error di getSisaStok:", error.message);
    res.status(500).json({
      message: "Gagal mendapatkan data sisa stok, coba periksa kembali",
    });
  }
};

export const getLatestStok = async (req, res) => {
  try {
    const result = await getLatestStokService(req);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error di getLatestStok:", error.message);
    res.status(500).json({
      message: "Gagal mendapatkan data stok terbaru, coba periksa kembali",
    });
  }
};

export const createStokHarian = async (req, res) => {
  try {
    await createStokHarianService(req);
    res
      .status(201)
      .json({ message: "Data stok harian telah berhasil ditambahkan" });
  } catch (error) {
    console.error("Error saat menambahkan data stok harian:", error.message);
    res.status(500).json({
      message: "Data stok harian gagal ditambahkan, coba periksa kembali",
    });
  }
};

export const updateStokHarian = async (req, res) => {
  try {
    await updateStokHarianService(req);
    res
      .status(200)
      .json({ message: "Data stok harian telah berhasil diperbarui" });
  } catch (error) {
    console.error("Error saat memperbarui data stok harian:", error.message);
    res.status(500).json({
      message: "Data stok harian gagal diperbarui, coba periksa kembali",
    });
  }
};

export const deleteStokHarian = async (req, res) => {
  try {
    await deleteStokHarianService(req.params.id, req.user.id);
    res
      .status(200)
      .json({ message: "Data stok harian telah berhasil dihapus" });
  } catch (error) {
    console.error("Error di deleteStokHarian:", error.message);
    res.status(500).json({
      message: "Data stok harian gagal dihapus, coba periksa kembali",
    });
  }
};
