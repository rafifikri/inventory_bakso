import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { getStokHarian } from "@/utils/api/products/api";
import { startOfWeek, endOfWeek, subWeeks } from "date-fns";

import { formatNumber } from "@/utils/formatter/formatNumber";

const options = {
  legend: {
    show: false,
    position: "top",
    horizontalAlign: "left",
  },
  colors: ["#3C50E0"],
  chart: {
    fontFamily: "Satoshi, sans-serif",
    height: 335,
    type: "area",
    dropShadow: {
      enabled: true,
      color: "#623CEA14",
      top: 10,
      blur: 4,
      left: 0,
      opacity: 0.1,
    },
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },
  stroke: {
    width: [2],
    curve: "straight",
  },
  grid: {
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 4,
    colors: "#fff",
    strokeColors: ["#3056D3"],
    strokeWidth: 3,
  },
  xaxis: {
    type: "category",
    categories: [
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
      "Minggu",
    ],
  },
  yaxis: {
    title: {
      style: {
        fontSize: "0px",
      },
    },
    min: 0,
  },
  tooltip: {
    shared: true,
    custom: function ({ series, seriesIndex, dataPointIndex, w }) {
      const date = w.config.dates[dataPointIndex];
      const value = series[seriesIndex][dataPointIndex];

      return `
        <div style="padding: 10px;">
          <strong>${date}</strong><br />
          Nominal Sisa Stok: ${formatNumber(value, "id-ID", "IDR")}
        </div>`;
    },
  },
};

const ChartArea = () => {
  const [state, setState] = useState({
    series: [{ name: "Nominal Sisa Stok", data: [0, 0, 0, 0, 0, 0, 0] }],
  });
  const [timeFilter, setTimeFilter] = useState("thisWeek");

  const fetchAllData = async (fetchFunction) => {
    let allData = [];
    let currentPage = 1;
    let totalPages = 1;

    try {
      do {
        const response = await fetchFunction(currentPage);
        const { data, totalPages: total } = response;

        allData = [...allData, ...data];
        totalPages = total;
        currentPage++;
      } while (currentPage <= totalPages);
    } catch (error) {
      console.error("Error fetching all data:", error);
    }

    return allData;
  };

  const fetchData = async (filter) => {
    try {
      const allStokHarian = await fetchAllData(getStokHarian);

      const now = new Date();
      const startDate =
        filter === "thisWeek"
          ? startOfWeek(now, { weekStartsOn: 1 })
          : startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
      const endDate =
        filter === "thisWeek"
          ? endOfWeek(now, { weekStartsOn: 1 })
          : endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });

      // Filter data berdasarkan rentang tanggal
      const filteredData = allStokHarian.filter((item) => {
        const date = new Date(item.tanggal);
        return date >= startDate && date <= endDate;
      });

      // Mengelompokkan data berdasarkan tanggal dan memilih data terbaru
      const groupedData = {};
      filteredData.forEach((item) => {
        const dateKey = item.tanggal;
        if (!groupedData[dateKey] || groupedData[dateKey].id < item.id) {
          groupedData[dateKey] = item; // Simpan data dengan ID terbesar (terbaru)
        }
      });

      // Menyusun data untuk grafik
      const nominalSisaStok = Array(7).fill(0);
      const dates = Array(7).fill("");

      Object.values(groupedData).forEach((item) => {
        const dayIndex = (new Date(item.tanggal).getDay() + 6) % 7; // Sesuaikan indeks hari
        nominalSisaStok[dayIndex] = item.nominal_sisa_stok || 0;
        dates[dayIndex] = new Date(item.tanggal).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      });

      setState({
        series: [{ name: "Nominal Sisa Stok", data: nominalSisaStok }],
      });
      options.dates = dates;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData(timeFilter);
  }, [timeFilter]);

  const handleTimeFilterChange = (filter) => {
    setTimeFilter(filter);
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <div className="flex min-w-47.5">
            <div className="w-full">
              <p className="text-xl font-semibold text-black dark:text-white">
                Grafik Nominal Sisa Stok
              </p>
            </div>
          </div>
        </div>
        <div className="flex w-full max-w-55 justify-end">
          <div className="inline-flex items-center rounded-md bg-whiter p-1.5 dark:bg-meta-4">
            <button
              className={`rounded py-3 px-4 text-xs font-medium ${
                timeFilter === "thisWeek" ? "bg-primary text-white" : ""
              }`}
              onClick={() => handleTimeFilterChange("thisWeek")}
            >
              Minggu Ini
            </button>
            <button
              className={`rounded py-3 px-4 text-xs font-medium ${
                timeFilter === "lastWeek" ? "bg-primary text-white" : ""
              }`}
              onClick={() => handleTimeFilterChange("lastWeek")}
            >
              Minggu Lalu
            </button>
          </div>
        </div>
      </div>

      <div>
        <div id="chartBar" className="-ml-5">
          <ReactApexChart
            options={options}
            series={state.series}
            type="area"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartArea;
