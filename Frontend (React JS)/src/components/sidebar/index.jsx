import React, { useEffect, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { MdOutlineInput } from "react-icons/md";
import { CiViewTable, CiLogout } from "react-icons/ci";
import Swal from "sweetalert2";

import { useToken } from "@/utils/context/tokenContext";
import Logo from "@/assets/images/logo/Logo.png";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const { pathname } = location;
  const { clearTokens } = useToken();
  const navigate = useNavigate();

  const trigger = useRef(null);
  const sidebar = useRef(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  const handleLogout = async () => {
    try {
      clearTokens();
      sessionStorage.removeItem("accessToken");

      navigate("/");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Tidak berhasil keluar",
        text: error.message,
      });
    }
  };

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <NavLink to="/dashboard">
          <div className="flex flex-row justify-between items-center">
            <img src={Logo} alt="Logo" className="size-21" />
            <p className="ml-3 text-2xl font-satoshi font-extrabold text-bodydark1">
              Sistem Inventory
            </p>
          </div>
        </NavLink>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        ></button>
      </div>

      <div className="flex flex-col flex-1 overflow-y-auto duration-300 ease-linear">
        <nav className="mt-5 px-4 lg:mt-5 lg:px-6 flex-1">
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              MENU
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              <li>
                <NavLink
                  to="/dashboard"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes("dashboard") &&
                    "bg-graydark dark:bg-meta-4"
                  }`}
                >
                  <RxDashboard className="size-6" />
                  Dashboard
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/nominal-stok"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes("nominal-stok") ||
                    pathname.includes("edit-stok")
                      ? "bg-graydark dark:bg-meta-4"
                      : ""
                  }`}
                >
                  <MdOutlineInput className="size-6" />
                  Nominal Stok
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/data-stok"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes("data-stok") &&
                    "bg-graydark dark:bg-meta-4"
                  }`}
                >
                  <CiViewTable className="size-6" />
                  Data Stok
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>

        <div className="py-4 px-4 lg:mb-5 lg:px-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 rounded-sm py-2 px-4 text-white font-medium hover:bg-graydark dark:hover:bg-meta-4"
          >
            <CiLogout className="size-6" />
            Keluar
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
