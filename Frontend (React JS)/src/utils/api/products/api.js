import axiosWithConfig from "../axiosWithConfig";

export const getLatestStok = async () => {
  try {
    const response = await axiosWithConfig.get(`/stok-harian/latest`);

    return response.data;
  } catch (error) {
    throw Error(error.response.data.message);
  }
};

export const getStokHarian = async (
  page = 1,
  limit = 10,
  search = "",
  jenisBakso = ""
) => {
  try {
    const response = await axiosWithConfig.get(
      `/stok-harian?page=${page}&limit=${limit}&search=${search}&jenis-bakso=${jenisBakso}`
    );
    return response.data;
  } catch (error) {
    throw Error(error.response.data.message);
  }
};

export const getStokById = async (stokId) => {
  try {
    const response = await axiosWithConfig.get(`/stok-harian/${stokId}`);
    return response;
  } catch (error) {
    throw Error(error.response.data.message);
  }
};

export const getSisaStok = async () => {
  try {
    const response = await axiosWithConfig.get(`/stok-harian/sisa-stok`);

    return response.data;
  } catch (error) {
    throw Error(error.response.data.message);
  }
};

export const createStokHarian = async (data) => {
  try {
    const newData = {
      ...data,
    };
    const response = await axiosWithConfig.post(`/stok-harian`, newData);

    return response.data;
  } catch (error) {
    throw Error(error.response.data.message);
  }
};

export const updateStokHarian = async (data) => {
  const { id } = data;
  try {
    const newData = {
      ...data,
    };
    const response = await axiosWithConfig.put(`/stok-harian/${id}`, newData);

    return response.data;
  } catch (error) {
    throw Error(error.response.data.message);
  }
};

export const deleteStokHarian = async (stokId) => {
  try {
    const response = await axiosWithConfig.delete(`/stok-harian/` + stokId);

    return response.data;
  } catch (error) {
    throw Error(error.response.data.message);
  }
};
