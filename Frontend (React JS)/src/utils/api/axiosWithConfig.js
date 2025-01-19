import axios from "axios";

let baseUrl = "http://localhost:1010/";

const axiosWithConfig = axios.create();

axiosWithConfig.interceptors.request.use((axiosConfig) => {
  const token =
    sessionStorage.getItem("accessToken") ||
    localStorage.getItem("accessToken");

  axiosConfig.baseURL = baseUrl;
  if (token) {
    axiosConfig.headers.Authorization = `Bearer ${token}`;
  }

  return axiosConfig;
});

axiosWithConfig.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const token =
        sessionStorage.getItem("accessToken") ||
        localStorage.getItem("accessToken");

      if (token) {
        sessionStorage.removeItem("accessToken");
        localStorage.removeItem("accessToken");
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export const setAxiosConfig = (backendUrl) => {
  baseUrl = backendUrl;
};

export default axiosWithConfig;
