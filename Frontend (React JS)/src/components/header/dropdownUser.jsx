import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowDown } from "react-icons/io";
import { CiLogout } from "react-icons/ci";
import Swal from "sweetalert2";

import ClickOutside from "@/utils/context/clickOutside";
import UserOne from "@/assets/images/user/user-01.png";
import { useToken } from "@/utils/context/tokenContext";
import { getUserProfile } from "@/utils/api/auth/api";

const DropdownUser = () => {
  const navigate = useNavigate();
  const { clearTokens } = useToken();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userProfile, setUserProfile] = useState("Admin");

  async function fetchData() {
    const result = await getUserProfile();
    setUserProfile(result.name);
  }

  useEffect(() => {
    fetchData();
  }, []);

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
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <Link
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        to="#"
      >
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-black dark:text-white">
            Hello, {userProfile}
          </span>
          <span className="block text-xs">Sistem Inventory</span>
        </span>

        <span className="h-12 w-12 rounded-full">
          <img src={UserOne} alt="User" />
        </span>
        <IoIosArrowDown className="size-5" />
      </Link>

      {dropdownOpen && (
        <div
          className={`absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark`}
        >
          <ul className="flex flex-col border-b border-stroke dark:border-strokedark">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3.5 p-6 text-sm font-medium duration-300 ease-in-out lg:text-base hover:bg-[#F3F4F6] dark:hover:bg-meta-4"
            >
              <CiLogout className="size-6" />
              Keluar
            </button>
          </ul>
        </div>
      )}
    </ClickOutside>
  );
};

export default DropdownUser;
