import { RouterProvider, createBrowserRouter, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import ProtectedRoute from "./ProtectedRoute";

import PageTitle from "@/components/pageTitle";
import DefaultLayout from "@/components/layout";

import Login from "@/pages/auth/login";
import Dashboard from "@/pages/dashboard";
import CreateEditStok from "@/pages/products/createEditStok";
import DataStok from "@/pages/products/dataStok";
import { Loader } from "@/components/loader";

function AppRoutes() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loader fullScreen={true} />;
  }

  return (
    <DefaultLayout>
      <Outlet />
    </DefaultLayout>
  );
}

export default function Router() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <PageTitle title="Login" />
          <Login />
        </>
      ),
    },
    {
      element: <ProtectedRoute />,
      children: [
        {
          element: <AppRoutes />,
          children: [
            {
              path: "/dashboard",
              element: (
                <>
                  <PageTitle title="Dashboard" />
                  <Dashboard />
                </>
              ),
            },
            {
              path: "/nominal-stok",
              element: (
                <>
                  <PageTitle title="Nominal Stok Harian" />
                  <CreateEditStok />
                </>
              ),
            },
            {
              path: "/edit-stok/:id",
              element: (
                <>
                  <PageTitle title="Edit Stok" />
                  <CreateEditStok />
                </>
              ),
            },
            {
              path: "/data-stok",
              element: (
                <>
                  <PageTitle title="Data Stok Harian" />
                  <DataStok />
                </>
              ),
            },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}
