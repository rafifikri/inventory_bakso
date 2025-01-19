export const setCookie = (res, token, options = {}) => {
  const defaultOptions = {
    httpOnly: true,
    secure: true, // Ubah ke true jika di lingkungan produksi dengan HTTPS
    sameSite: "strict",
    maxAge: 2 * 60 * 60 * 1000,
  };

  res.cookie("token", token, { ...defaultOptions, ...options });
};
