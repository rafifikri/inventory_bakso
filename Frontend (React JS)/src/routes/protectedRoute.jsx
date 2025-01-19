import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useToken } from "@/utils/context/tokenContext";

const ProtectedRoute = () => {
  const { pathname } = useLocation();
  const { tokenLocal, tokenSession } = useToken();

  const protectedByToken = [
    "/dashboard",
    "/nominal-stok",
    "/edit-stok/:id",
    "/data-stok",
  ];

  const isProtectedRoute = protectedByToken.some((route) => {
    const regex = new RegExp(`^${route.replace(":id", "[^/]+")}$`);
    return regex.test(pathname);
  });

  const isTokenAvailable = tokenLocal || tokenSession;

  if (isTokenAvailable && pathname === "/") {
    return <Navigate to="/dashboard" />;
  }

  if (!isTokenAvailable && isProtectedRoute) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
