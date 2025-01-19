import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";

import { getSisaStok } from "@/utils/api/products/api";
import { formatNumber } from "@/utils/formatter/formatNumber";

const options = {
  chart: {
    fontFamily: "Satoshi, sans-serif",
    type: "donut",
  },
  colors: ["#3C50E0", "#6577F3", "#0FADCF"],
  labels: [],
  legend: {
    show: false,
    position: "bottom",
  },

  plotOptions: {
    pie: {
      donut: {
        size: "65%",
        background: "transparent",
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  responsive: [
    {
      breakpoint: 2600,
      options: {
        chart: {
          width: 335,
        },
      },
    },
    {
      breakpoint: 640,
      options: {
        chart: {
          width: 200,
        },
      },
    },
  ],
};

const ChartDonut = () => {
  const [state, setState] = useState({
    series: [],
    labels: [],
  });

  const fetchData = async () => {
    try {
      const response = await getSisaStok();

      const labels = response.map((item) => item.name);
      const series = response.map((item) => item.total_qty);

      setState({ labels, series });
    } catch (error) {
      console.error("Error fetching sisa stok data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="sm:px-7.5 col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          <h5 className="text-xl font-semibold text-black dark:text-white">
            Total Stok Tersedia
          </h5>
        </div>
      </div>

      <div className="mb-2 grid gap-4 xl:grid-cols-2 md:grid-cols-1">
        <div id="chartDonut" className="mx-auto">
          <ReactApexChart
            options={{ ...options, labels: state.labels }}
            series={state.series}
            type="donut"
            width="100%"
          />
        </div>
        <div className="flex flex-col gap-y-3 xl:pl-10">
          <p className="text-black dark:text-white">Keterangan</p>
          {state.labels.map((label, index) => (
            <div className=" w-full" key={index}>
              <div className="flex w-full items-center">
                <span
                  className={`mr-2 block h-3 w-full max-w-3 rounded-full`}
                  style={{ backgroundColor: options.colors[index] }}
                ></span>
                <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
                  <span>{label}</span>
                  <span>{formatNumber(state.series[index])} Pcs</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChartDonut;
