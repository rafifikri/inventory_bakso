import { useState, useEffect } from "react";
import { AiOutlineStock } from "react-icons/ai";
import { PiMoneyWavy } from "react-icons/pi";
import { MdOutlineInventory2, MdOutlineInventory } from "react-icons/md";
import { IoCloseCircleOutline } from "react-icons/io5";
import { format } from "date-fns";

import CardDataStats from "@/components/cardDataStats";
import ChartDonut from "@/components/charts/chartDonut";
import ChartBar from "@/components/charts/chartBar";
import ChartArea from "@/components/charts/chartArea";
import { getSisaStok, getStokHarian } from "@/utils/api/products/api";
import { Loader } from "@/components/loader";
import { useToast } from "@/utils/toastify/toastProvider";
import { formatNumber } from "@/utils/formatter/formatNumber";

const Dashboard = () => {
  const toast = useToast();
  const [totalStok, setTotalStok] = useState(0);
  const [produksi, setProduksi] = useState(0);
  const [kuantitas, setKuantitas] = useState(0);
  const [nominalSisaStok, setNominalSisaStok] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchAllData(fetchFunction) {
    let allData = [];
    let currentPage = 1;
    let totalPages = 1;

    do {
      const response = await fetchFunction(currentPage);
      allData = [...allData, ...response.data];
      totalPages = response.totalPages;
      currentPage++;
    } while (currentPage <= totalPages);

    return allData;
  }

  async function fetchData() {
    try {
      const stokTersedia = await getSisaStok();
      const allStokHarian = await fetchAllData(getStokHarian);

      const total = stokTersedia.reduce((sum, item) => sum + item.total_qty, 0);
      setTotalStok(total);
      const today = format(new Date(), "yyyy-MM-dd");

      const stokHariIni = allStokHarian.filter(
        (item) => item.tanggal === today
      );
      const totalProduksi = stokHariIni.reduce(
        (sum, item) => sum + (item.produksi || 0),
        0
      );
      const totalKuantitas = stokHariIni.reduce(
        (sum, item) => sum + (item.kuantitas || 0),
        0
      );

      const nominal =
        allStokHarian[allStokHarian.length - 1]?.nominal_sisa_stok || 0;

      setProduksi(totalProduksi);
      setKuantitas(totalKuantitas);
      setNominalSisaStok(nominal);
    } catch (error) {
      toast.addToast({
        variant: "destructive",
        title: (
          <div className="flex items-center">
            <IoCloseCircleOutline className="size-6" />
            <span className="ml-2">Gagal Mendapatkan Seluruh Data!</span>
          </div>
        ),
        description: <span className="ml-8">{error.message}</span>,
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {isLoading ? (
        <Loader
          fullScreen={false}
          className="absolute inset-0 flex items-center justify-center z-50"
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
            <CardDataStats
              title="Produk masuk hari ini"
              jumlah={`Rp ${formatNumber(produksi)}`}
            >
              <MdOutlineInventory2 className="size-7 fill-primary dark:fill-white" />
            </CardDataStats>
            <CardDataStats
              title="Produk keluar hari ini"
              jumlah={`${formatNumber(kuantitas)} Pcs`}
            >
              <MdOutlineInventory className="size-7 fill-primary dark:fill-white" />
            </CardDataStats>
            <CardDataStats
              title="Total Stok Tersedia"
              jumlah={`${formatNumber(totalStok)} Pcs`}
            >
              <AiOutlineStock className="size-7 fill-primary dark:fill-white" />
            </CardDataStats>
            <CardDataStats
              title="Nominal Sisa Stok"
              jumlah={`Rp ${formatNumber(nominalSisaStok)}`}
            >
              <PiMoneyWavy className="size-7 fill-primary dark:fill-white" />
            </CardDataStats>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 2xl:gap-7.5 mt-4">
            <div className="col-span-1 xl:col-span-2">
              <ChartDonut />
            </div>
            <div className="col-span-1 xl:col-span-2">
              <ChartBar />
            </div>
            <div className="col-span-1 md:col-span-2 lg:col-span-4 xl:col-span-4">
              <ChartArea />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Dashboard;
