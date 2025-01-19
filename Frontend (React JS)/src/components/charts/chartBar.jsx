import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { IoIosArrowDown } from "react-icons/io";
import { getStokHarian } from "@/utils/api/products/api";
import { startOfWeek, endOfWeek, subWeeks } from "date-fns";

import { formatNumber } from "@/utils/formatter/formatNumber";

const options = {
  colors: ["#3C50E0", "#80CAEE"],
  chart: {
    fontFamily: "Satoshi, sans-serif",
    type: "bar",
    height: 335,
    stacked: true,
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },
  responsive: [
    {
      breakpoint: 1536,
      options: {
        plotOptions: {
          bar: {
            borderRadius: 0,
            columnWidth: "35%",
          },
        },
      },
    },
  ],
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 0,
      columnWidth: "35%",
      borderRadiusApplication: "end",
      borderRadiusWhenStacked: "last",
    },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
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
  legend: {
    position: "top",
    horizontalAlign: "left",
    fontFamily: "Satoshi",
    fontWeight: 500,
    fontSize: "14px",
    markers: {
      radius: 99,
    },
  },
  fill: {
    opacity: 1,
  },
  tooltip: {
    custom: function ({ series, seriesIndex, dataPointIndex, w }) {
      const date = w.config.dates[dataPointIndex];
      const value = series[seriesIndex][dataPointIndex];
      const seriesName = w.config.series[seriesIndex].name;
      const unit = seriesName === "Produk Masuk" ? "g" : "";

      return `
         <div style="padding: 10px;">
          <strong>${date}</strong><br />
          ${seriesName}: ${formatNumber(value, "id-ID")} ${unit}
        </div>`;
    },
  },
};

const ChartBar = () => {
  const [state, setState] = useState({
    series: [
      { name: "Produk Masuk", data: [0, 0, 0, 0, 0, 0, 0] },
      { name: "Produk Keluar", data: [0, 0, 0, 0, 0, 0, 0] },
    ],
  });
  const [currentWeek, setCurrentWeek] = useState("thisWeek");

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

  const fetchData = async (week) => {
    try {
      const allStokHarian = await fetchAllData(getStokHarian);

      const startDate =
        week === "thisWeek"
          ? startOfWeek(new Date(), { weekStartsOn: 1 })
          : startOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 });
      const endDate =
        week === "thisWeek"
          ? endOfWeek(new Date(), { weekStartsOn: 1 })
          : endOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 });

      const filteredData = allStokHarian.filter((item) => {
        const date = new Date(item.tanggal);
        return date >= startDate && date <= endDate;
      });

      const produkMasuk = Array(7).fill(0);
      const produkKeluar = Array(7).fill(0);
      const dates = Array(7).fill("");

      filteredData.forEach((item) => {
        const dayIndex = (new Date(item.tanggal).getDay() + 6) % 7;
        produkMasuk[dayIndex] += item.produksi || 0;
        produkKeluar[dayIndex] += item.kuantitas || 0;
        dates[dayIndex] = new Date(item.tanggal).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      });

      setState({
        series: [
          { name: "Produk Masuk", data: produkMasuk },
          { name: "Produk Keluar", data: produkKeluar },
        ],
      });
      options.dates = dates;
    } catch (error) {
      console.error("Error fetching weekly data:", error);
    }
  };

  useEffect(() => {
    fetchData(currentWeek);
  }, [currentWeek]);

  const handleWeekChange = (event) => {
    setCurrentWeek(event.target.value);
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4 pb-15">
      <div className="mb-4 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Produk Masuk & Keluar Mingguan
          </h4>
        </div>
        <div>
          <div className="relative z-20 inline-block">
            <select
              name="weekSelector"
              id="weekSelector"
              value={currentWeek}
              onChange={handleWeekChange}
              className="relative z-20 inline-flex appearance-none bg-transparent py-1 pl-3 pr-8 text-sm font-medium outline-none cursor-pointer"
            >
              <option value="thisWeek" className="dark:bg-boxdark">
                Minggu Ini
              </option>
              <option value="lastWeek" className="dark:bg-boxdark">
                Minggu Lalu
              </option>
            </select>
            <IoIosArrowDown className="absolute right-2 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>
      </div>

      <div>
        <div id="chartBar" className="-ml-5 -mb-9">
          <ReactApexChart
            options={options}
            series={state.series}
            type="bar"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartBar;
