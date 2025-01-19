import axiosWithConfig from "../axiosWithConfig";

export const getUserProfile = async () => {
  try {
    const response = await axiosWithConfig.get(`/user`);

    return response.data;
  } catch (error) {
    throw Error(error.response.data.message);
  }
};

export const login = async (email, password) => {
  try {
    const response = await axiosWithConfig.post(`/login`, {
      email,
      password,
    });

    return response.data;
  } catch (error) {
    throw Error(error.response.data.message);
  }
};

export const logout = async (email, password) => {
  try {
    const response = await axiosWithConfig.post(`/logout`, {
      email,
      password,
    });

    return response.data;
  } catch (error) {
    throw Error(error.response.data.message);
  }
};
