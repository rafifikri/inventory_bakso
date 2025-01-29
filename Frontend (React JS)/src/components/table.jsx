import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { debounce } from "lodash";
import { useForm } from "react-hook-form";
import { IoSearch } from "react-icons/io5";
import { FaPencil, FaTrashCan } from "react-icons/fa6";
import {
  IoCloseCircleOutline,
  IoCheckmarkCircleOutline,
} from "react-icons/io5";

import { getStokHarian, deleteStokHarian } from "@/utils/api/products/api";
import { Loader } from "@/components/loader";
import Delete from "@/utils/sweetalert/delete";
import { useToast } from "@/utils/toastify/toastProvider";
import { formatNumber } from "@/utils/formatter/formatNumber";
import Pagination from "./Pagination";
import SelectPerPage from "./SelectPerPage";
import { Select } from "./forms/select";

const Table = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [hasil, setHasil] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [jenisBakso, setJenisBakso] = useState("");

  const { register, setValue } = useForm({
    defaultValues: {
      jenisBakso: "",
    },
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || "";
    const jenis = searchParams.get("jenis-bakso") || "";

    setCurrentPage(page);
    setItemsPerPage(limit);
    setSearchTerm(search);
    setJenisBakso(jenis);
    setValue("jenisBakso", jenis);

    setIsLoading(true);
    fetchData(page, limit, search, jenis);
  }, [location.search]);

  async function fetchData(page, limit, search, jenisBakso) {
    try {
      const result = await getStokHarian(page, limit, search, jenisBakso);
      setHasil(result);
    } catch (error) {
      toast.addToast({
        variant: "destructive",
        title: (
          <div className="flex items-center">
            <IoCloseCircleOutline className="size-6" />
            <span className="ml-2">Gagal Mendapatkan Stok Harian!</span>
          </div>
        ),
        description: <span className="ml-8">{error.message}</span>,
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function onClickDelete(stokId) {
    try {
      const result = await Delete({
        title: "Yakin mau hapus data?",
        text: "Data yang sudah dihapus tidak dapat dipulihkan!",
        className: "dark:text-white",
      });

      if (result.isConfirmed) {
        setIsLoading(true);
        const response = await deleteStokHarian(stokId);
        const result = await getStokHarian(
          currentPage,
          itemsPerPage,
          searchTerm
        );
        setHasil(result);

        toast.addToast({
          title: (
            <div className="flex items-center">
              <IoCheckmarkCircleOutline className="size-6" />
              <span className="ml-2">Berhasil Menghapus Stok Harian!</span>
            </div>
          ),
          description: <span className="ml-8">{response.message}</span>,
        });
        if (result.data.length === 0 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
          fetchData(currentPage - 1, itemsPerPage, searchTerm);
        }
      }
    } catch (error) {
      toast.addToast({
        variant: "destructive",
        title: (
          <div className="flex items-center">
            <IoCloseCircleOutline className="size-6" />
            <span className="ml-2">Gagal Menghapus Stok Harian!</span>
          </div>
        ),
        description: <span className="ml-8">{error.message}</span>,
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleJenisBaksoChange = (e) => {
    const value = e.target.value === "Tampilkan Semua" ? "" : e.target.value;
    setJenisBakso(value);
    setValue("jenisBakso", value);
    fetchData(1, itemsPerPage, searchTerm, value);
    updateURL(1, itemsPerPage, searchTerm, value);
  };

  const debouncedSearch = useCallback(
    debounce((value) => {
      fetchData(1, itemsPerPage, value, jenisBakso);
      updateURL(1, itemsPerPage, value, jenisBakso);
    }, 800),
    [itemsPerPage, jenisBakso]
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchData(page, itemsPerPage, searchTerm, jenisBakso);
    updateURL(page, itemsPerPage, searchTerm, jenisBakso);
  };

  const handleItemsPerPageChange = (e) => {
    const limit = Number(e.target.value);
    setItemsPerPage(limit);
    setCurrentPage(1);
    fetchData(1, limit, searchTerm, jenisBakso);
    updateURL(1, limit, searchTerm, jenisBakso);
  };

  const updateURL = (page, limit, search, jenisBakso) => {
    const params = new URLSearchParams();

    if (page) params.set("page", page);
    if (limit) params.set("limit", limit);
    if (search) params.set("search", search);
    if (jenisBakso) params.set("jenis-bakso", jenisBakso);

    navigate(`?${params.toString()}`, { replace: true });
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-5">
      <div className="mb-6">
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative w-full sm:max-w-[250px]">
            <button className="absolute left-0 top-1/2 -translate-y-1/2">
              <IoSearch className="size-5" />
            </button>

            <input
              type="text"
              placeholder="Ketik untuk mencari..."
              className="w-full bg-transparent pl-7 pr-4 text-black focus:outline-none dark:text-white xl:w-125"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <div className="w-full sm:w-auto">
            <Select
              label="Jenis Bakso"
              placeholder="Filter jenis bakso"
              name="jenis"
              options={[
                "Tampilkan Semua",
                "Bakso Polos",
                "Bakso Daging",
                "Bakso Urat",
              ]}
              register={register}
              onChange={handleJenisBaksoChange}
            />
          </div>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        {isLoading ? (
          <Loader fullScreen={false} className="py-5" />
        ) : hasil.data && hasil.data.length === 0 ? (
          <div className="max-w-full bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
            <p className="font-bold">Tidak Ada Data</p>
            <p>Belum ada data yang tersimpan.</p>
          </div>
        ) : (
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[50px] py-4 px-4 font-semibold text-black dark:text-white">
                  No
                </th>
                <th className="min-w-[100px] py-4 px-4 font-semibold text-black dark:text-white">
                  Tanggal
                </th>
                <th className="min-w-[130px] py-4 px-4 font-semibold text-black dark:text-white">
                  Jenis Bakso
                </th>
                <th className="min-w-[160px] py-4 px-4 font-semibold text-black dark:text-white">
                  Jumlah Produksi
                </th>
                <th className="min-w-[150px] py-4 px-4 font-semibold text-black dark:text-white">
                  Kuantitas Bakso
                </th>
                <th className="min-w-[120px] py-4 px-4 font-semibold text-black dark:text-white">
                  HPP Lama
                </th>
                <th className="min-w-[120px] py-4 px-4 font-semibold text-black dark:text-white">
                  HPP Baru
                </th>
                <th className="min-w-[100px] py-4 px-4 font-semibold text-black dark:text-white">
                  Sisa Stok
                </th>
                <th className="min-w-[100px] py-4 px-4 font-semibold text-black dark:text-white">
                  Nominal Sisa Stok
                </th>
                <th className="py-4 px-4 font-semibold text-black dark:text-white">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {hasil.data &&
                hasil.data.map((stok, index) => (
                  <tr key={stok.id}>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="font-medium text-black dark:text-white">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="font-medium text-black dark:text-white">
                        {format(new Date(stok.tanggal), "EEEE, dd MMMM yyyy", {
                          locale: id,
                        })}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">{stok.jenis}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        Rp {formatNumber(stok.produksi)}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {formatNumber(stok.kuantitas)} Pcs
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        Rp {formatNumber(stok.hpp_lama)}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        Rp {formatNumber(stok.hpp_baru)}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {formatNumber(stok.sisa_stok)} Pcs
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        Rp {formatNumber(stok.nominal_sisa_stok)}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => navigate(`/edit-stok/${stok.id}`)}
                          className="hover:text-primary"
                        >
                          <FaPencil />
                        </button>
                        <button
                          onClick={() => onClickDelete(stok.id)}
                          className="hover:text-danger"
                        >
                          <FaTrashCan />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex flex-wrap justify-between items-center space-y-4 sm:space-y-0 mt-4">
        <SelectPerPage
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={handleItemsPerPageChange}
          className="w-full sm:w-auto"
        />
        <Pagination
          currentPage={currentPage}
          totalPages={hasil.totalPages}
          onPageChange={handlePageChange}
          hasData={hasil.data && hasil.data.length > 0}
          className="w-full sm:w-auto"
        />
      </div>
    </div>
  );
};

export default Table;
