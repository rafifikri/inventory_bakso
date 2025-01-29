import axios from "axios";
import { Op } from "sequelize";
import dataStok from "../models/stokModel.js";
import { calculateAndRound } from "../utils/product/calculation.js";
import { STOK_KEY } from "../config/envConfig.js";

export const getStokHarianService = async (req) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";
  const jenisBakso = req.query["jenis-bakso"] || "";
  const offset = (page - 1) * limit;

  const whereCondition = { user_id: req.user.id };

  if (search) {
    const parsedDate = new Date(search);
    const isValidDate = !isNaN(parsedDate);

    whereCondition[Op.or] = [
      ...(isValidDate ? [{ tanggal: { [Op.eq]: parsedDate } }] : []),
      { jenis: { [Op.like]: `%${search}%` } },
      { produksi: { [Op.like]: `%${search}%` } },
      { kuantitas: { [Op.like]: `%${search}%` } },
      { sisa_stok: { [Op.like]: `%${search}%` } },
    ];
  }

  if (jenisBakso) {
    whereCondition.jenis = { [Op.like]: `%${jenisBakso}%` };
  }

  const totalData = await dataStok.count({ where: whereCondition });

  const response = await dataStok.findAll({
    where: whereCondition,
    limit: limit,
    offset: offset,
  });

  return {
    data: response,
    totalCount: totalData,
    totalPages: Math.ceil(totalData / limit),
    currentPage: page,
  };
};

export const getStokByIdService = async (stokId) => {
  const stok = await dataStok.findByPk(stokId);
  if (!stok) throw new Error("Data stok tidak ditemukan");
  return stok;
};

export const getSisaStokService = async () => {
  const response = await axios.get(
    "https://bakso.garudaarung.com/api/sisa-stok",
    {
      headers: { Authorization: `Bearer ${STOK_KEY}` },
    }
  );
  return response.data;
};

export const getLatestStokService = async (req) => {
  const lastStokForUser = await dataStok.findOne({
    where: { user_id: req.user.id },
    order: [["created_at", "DESC"]],
    limit: 1,
  });

  if (!lastStokForUser) {
    const defaultValues = { produksi: 0, kuantitas: 0, sisa_stok: 0 };
    const { hppLama, hppBaru, nominalSisaStok } = calculateAndRound(
      defaultValues.produksi,
      defaultValues.kuantitas,
      0,
      0,
      defaultValues.sisa_stok
    );

    return {
      latestData: defaultValues,
      calculations: { hppLama, hppBaru, nominalSisaStok },
    };
  }

  const secondLastStokForUser = await dataStok.findOne({
    where: { user_id: req.user.id, id: { [Op.lt]: lastStokForUser.id } },
    order: [["created_at", "DESC"]],
    limit: 1,
  });

  const sisaStokSebelumnya = secondLastStokForUser
    ? secondLastStokForUser.sisa_stok
    : 0;
  const nominalSisaStokSebelumnya = secondLastStokForUser
    ? secondLastStokForUser.nominal_sisa_stok
    : 0;

  const { hppLama, hppBaru, nominalSisaStok } = calculateAndRound(
    lastStokForUser.produksi,
    lastStokForUser.kuantitas,
    sisaStokSebelumnya,
    nominalSisaStokSebelumnya,
    lastStokForUser.sisa_stok
  );

  return {
    latestData: lastStokForUser,
    calculations: { hppLama, hppBaru, nominalSisaStok },
  };
};

export const createStokHarianService = async (req) => {
  const newData = req.body;
  const lastStokForUser = await dataStok.findOne({
    where: { user_id: req.user.id },
    order: [["user_specific_id", "DESC"]],
    limit: 1,
  });

  const userSpecificId = lastStokForUser
    ? lastStokForUser.user_specific_id + 1
    : 1;

  const sisaStokSebelumnya = lastStokForUser ? lastStokForUser.sisa_stok : 0;
  const nominalSisaStokSebelumnya = lastStokForUser
    ? lastStokForUser.nominal_sisa_stok
    : 0;

  const { hppLama, hppBaru, nominalSisaStok } = calculateAndRound(
    newData.produksi,
    newData.kuantitas,
    sisaStokSebelumnya,
    nominalSisaStokSebelumnya,
    newData.sisa_stok
  );

  await dataStok.create({
    ...newData,
    user_id: req.user.id,
    user_specific_id: userSpecificId,
    hpp_lama: hppLama,
    hpp_baru: hppBaru,
    nominal_sisa_stok: nominalSisaStok,
  });
};

export const updateStokHarianService = async (req) => {
  const stokId = req.params.id;
  const updatedStok = req.body;
  const stok = await dataStok.findByPk(stokId);

  if (!stok) {
    return res
      .status(404)
      .json({ message: "Data stok harian tidak ditemukan" });
  }

  if (stok.user_id !== req.user.id) {
    return res
      .status(403)
      .json({ message: "Anda tidak berhak mengakses data ini" });
  }

  const lastStokBeforeUpdate = await dataStok.findOne({
    where: { user_id: req.user.id, id: { [Op.lt]: stokId } },
    order: [["created_at", "DESC"]],
    limit: 1,
  });

  const sisaStokSebelumnya = lastStokBeforeUpdate
    ? lastStokBeforeUpdate.sisa_stok
    : 0;
  const nominalSisaStokSebelumnya = lastStokBeforeUpdate
    ? lastStokBeforeUpdate.nominal_sisa_stok
    : 0;

  const { hppLama, hppBaru, nominalSisaStok } = calculateAndRound(
    updatedStok.produksi,
    updatedStok.kuantitas,
    sisaStokSebelumnya,
    nominalSisaStokSebelumnya,
    updatedStok.sisa_stok
  );

  await stok.update({
    ...updatedStok,
    user_id: req.user.id,
    hpp_lama: hppLama,
    hpp_baru: hppBaru,
    nominal_sisa_stok: nominalSisaStok,
  });

  const nextStokEntries = await dataStok.findAll({
    where: { user_id: req.user.id, id: { [Op.gt]: stokId } },
    order: [["created_at", "ASC"]],
  });

  let previousNominalSisaStok = nominalSisaStok;

  for (const nextStok of nextStokEntries) {
    const { nominal_sisa_stok: updatedNominalSisaStok } = calculateAndRound(
      nextStok.produksi,
      nextStok.kuantitas,
      nextStok.sisa_stok,
      previousNominalSisaStok,
      nextStok.sisa_stok
    );

    await nextStok.update({ nominal_sisa_stok: updatedNominalSisaStok });
    previousNominalSisaStok = updatedNominalSisaStok;
  }
};

export const deleteStokHarianService = async (stokId, userId) => {
  const stok = await dataStok.findByPk(stokId);
  if (!stok) throw new Error("Data stok harian tidak ditemukan");
  if (stok.user_id !== userId)
    throw new Error("Anda tidak berhak mengakses data ini");
  await stok.destroy();
};
