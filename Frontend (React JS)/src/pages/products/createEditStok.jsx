import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  IoCloseCircleOutline,
  IoCheckmarkCircleOutline,
} from "react-icons/io5";

import Breadcrumb from "@/components/breadcrumb";
import { DatePicker } from "@/components/forms/datePicker";
import { Select } from "@/components/forms/select";
import { Input } from "@/components/forms/input";
import { stokSchema } from "@/utils/api/products/schema";
import {
  createStokHarian,
  updateStokHarian,
  getStokById,
  getSisaStok,
  getLatestStok,
} from "@/utils/api/products/api";
import { calculateAndRound } from "@/utils/calculation/stokCalculation";
import { useToast } from "@/utils/toastify/toastProvider";
import { Loader } from "@/components/loader";

const NominalStok = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [selectedId, setSelectedId] = useState(0);
  const [sisa_stok, setSisaStok] = useState(0);
  const [nominalSisaStokSebelumnya, setNominalSisaStokSebelumnya] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const {
    reset,
    setValue,
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitted },
    clearErrors,
  } = useForm({
    resolver: zodResolver(stokSchema),
    defaultValues: {
      produksi: 0,
      kuantitas: 0,
      hpp_lama: 0,
      hpp_baru: 0,
      sisa_stok: 0,
      nominal_sisa_stok: 0,
    },
  });

  const produksi = watch("produksi");
  const kuantitas = watch("kuantitas");

  useEffect(() => {
    if (!selectedId) {
      const { hppLama, hppBaru, nominalSisaStok } = calculateAndRound(
        produksi || 0,
        kuantitas || 0,
        sisa_stok || 0,
        nominalSisaStokSebelumnya || 0,
        sisa_stok || 0
      );

      setValue("hpp_lama", hppLama, { shouldValidate: true });
      setValue("hpp_baru", hppBaru, { shouldValidate: true });
      setValue("nominal_sisa_stok", nominalSisaStok, { shouldValidate: true });
    }
  }, [
    produksi,
    kuantitas,
    sisa_stok,
    nominalSisaStokSebelumnya,
    setValue,
    selectedId,
  ]);

  useEffect(() => {
    if (id !== undefined) {
      fetchData();
    } else {
      setSelectedId(0);
      fetchLatestStok();
      reset();
      setIsLoading(false);
    }
  }, [id]);

  async function fetchData() {
    try {
      setIsLoading(true);
      const result = await getStokById(id);

      if (result.data) {
        const data = result.data;
        setSelectedId(data.id);
        setSisaStok(data.sisa_stok);
        setNominalSisaStokSebelumnya(data.nominal_sisa_stok);
        setValue("tanggal", data.tanggal);
        setValue("jenis", data.jenis);
        setValue("produksi", data.produksi);
        setValue("kuantitas", data.kuantitas);
        setValue("hpp_lama", data.hpp_lama);
        setValue("hpp_baru", data.hpp_baru);
        setValue("sisa_stok", data.sisa_stok);
        setValue("nominal_sisa_stok", data.nominal_sisa_stok);
      }
    } catch (error) {
      toast.addToast({
        variant: "destructive",
        title: (
          <div className="flex items-center">
            <IoCloseCircleOutline className="size-6" />
            <span className="ml-2">Gagal Mendapatkan Id Stok Harian!</span>
          </div>
        ),
        description: <span className="ml-8">{error.message}</span>,
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchLatestStok() {
    try {
      setIsLoading(true);
      const result = await getLatestStok();
      if (result) {
        const latestData = result.latestData;
        const calculations = result.calculations;

        setNominalSisaStokSebelumnya(latestData.nominal_sisa_stok);
        setValue("hpp_baru", calculations.hppBaru, { shouldValidate: true });
      }
    } catch (error) {
      toast.addToast({
        variant: "destructive",
        title: (
          <div className="flex items-center">
            <IoCloseCircleOutline className="size-6" />
            <span className="ml-2">Gagal Mendapatkan Data Stok Terbaru!</span>
          </div>
        ),
        description: <span className="ml-8">{error.message}</span>,
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function onSubmit(data) {
    try {
      setIsLoading(true);
      const response = selectedId
        ? await updateStokHarian({ ...data, id: selectedId })
        : await createStokHarian(data);

      toast.addToast({
        title: (
          <div className="flex items-center">
            <IoCheckmarkCircleOutline className="size-6" />
            <span className="ml-2">
              {`Berhasil ${
                selectedId ? "Memperbarui" : "Menambahkan"
              } Stok Harian!`}
            </span>
          </div>
        ),
        description: <span className="ml-8">{response.message}</span>,
      });

      reset();
      navigate("/data-stok");
    } catch (error) {
      toast.addToast({
        variant: "destructive",
        title: (
          <div className="flex items-center">
            <IoCloseCircleOutline className="size-6" />
            <span className="ml-2">
              {`Gagal ${
                selectedId ? "Memperbarui" : "Menambahkan"
              } Stok Harian!`}
            </span>
          </div>
        ),
        description: <span className="ml-8">{error.message}</span>,
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleJenisChange(event) {
    try {
      const response = await getSisaStok(event);
      const stokData = response.find((item) => item.name === event);

      if (stokData) {
        setValue("sisa_stok", stokData.total_qty, { shouldValidate: true });
        setSisaStok(stokData.total_qty);
      } else {
        setValue("sisa_stok", 0, { shouldValidate: true });
        setSisaStok(0);
      }
    } catch (error) {
      toast.addToast({
        variant: "destructive",
        title: (
          <div className="flex items-center">
            <IoCloseCircleOutline className="size-6" />
            <span className="ml-2">Gagal Mendapatkan Sisa Stok Harian!</span>
          </div>
        ),
        description: <span className="ml-8">{error.message}</span>,
      });
    }
  }

  function handleCancel() {
    if (selectedId === 0) {
      navigate("/dashboard");
    } else {
      navigate("/data-stok");
    }
  }
  return (
    <>
      {isLoading ? (
        <Loader
          fullScreen={false}
          className="absolute inset-0 flex items-center justify-center z-50"
        />
      ) : (
        <>
          <Breadcrumb
            pageName={selectedId === 0 ? "Input Stok" : "Edit Stok"}
          />

          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="p-10">
                <div className="mb-6 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-black dark:text-white">
                      Masukan Tanggal <span className="text-meta-1">*</span>
                    </label>
                    <DatePicker
                      name="tanggal"
                      value={watch("tanggal")}
                      onDateChange={(date) => setValue("tanggal", date)}
                      register={register}
                      error={errors.tanggal?.message}
                      clearErrors={clearErrors}
                    />
                  </div>

                  <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-black dark:text-white">
                      Jenis Bakso <span className="text-meta-1">*</span>
                    </label>
                    <Select
                      label="Jenis Bakso"
                      placeholder="Pilih jenis bakso"
                      id="jenis"
                      name="jenis"
                      options={["Bakso Polos", "Bakso Daging", "Bakso Urat"]}
                      register={register}
                      error={errors.jenis?.message}
                      onChange={(e) => handleJenisChange(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mb-6 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-black dark:text-white">
                      Jumlah Produksi (gram)
                      <span className="text-meta-1">*</span>
                    </label>
                    <Input
                      id="produksi"
                      name="produksi"
                      type="number"
                      placeholder="Masukan Jumlah Produksi"
                      error={errors.produksi?.message}
                      register={register}
                    />
                  </div>

                  <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-black dark:text-white">
                      Kuantitas Bakso <span className="text-meta-1">*</span>
                    </label>
                    <Input
                      id="kuantitas"
                      name="kuantitas"
                      type="number"
                      placeholder="Masukan Jumlah Kuantitas Bakso"
                      error={errors.kuantitas?.message}
                      register={register}
                    />
                  </div>
                </div>

                <div className="mb-6 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-black dark:text-white">
                      HPP Lama (Rp)<span className="text-meta-1">*</span>
                    </label>
                    <Input
                      id="hpp_lama"
                      name="hpp_lama"
                      type="number"
                      placeholder="HPP Lama dihitung otomatis"
                      error={errors.hpp_lama?.message}
                      register={register}
                      shouldValidateOnSubmit={true}
                      isSubmitted={isSubmitted}
                      value={watch("hpp_lama")}
                      readOnly
                    />
                  </div>

                  <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-black dark:text-white">
                      HPP Baru (Rp)<span className="text-meta-1">*</span>
                    </label>
                    <Input
                      id="hpp_baru"
                      name="hpp_baru"
                      type="number"
                      placeholder="HPP baru dihitung otomatis"
                      error={errors.hpp_baru?.message}
                      register={register}
                      shouldValidateOnSubmit={true}
                      isSubmitted={isSubmitted}
                      value={watch("hpp_baru")}
                      readOnly
                    />
                  </div>
                </div>

                <div className="mb-6 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-black dark:text-white">
                      Sisa Stok <span className="text-meta-1">*</span>
                    </label>
                    <Input
                      id="sisa_stok"
                      name="sisa_stok"
                      type="number"
                      placeholder="Sisa stok dihitung otomatis"
                      error={errors.sisa_stok?.message}
                      register={register}
                      readOnly
                    />
                  </div>

                  <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-black dark:text-white">
                      Nominal Sisa Stok (Rp)
                      <span className="text-meta-1">*</span>
                    </label>

                    <Input
                      id="nominal_sisa_stok"
                      name="nominal_sisa_stok"
                      type="number"
                      placeholder="Nominal sisa stok dihitung otomatis"
                      error={errors.nominal_sisa_stok?.message}
                      register={register}
                      shouldValidateOnSubmit={true}
                      isSubmitted={isSubmitted}
                      value={watch("nominal_sisa_stok")}
                      readOnly
                    />
                  </div>
                </div>

                <div className="flex pt-2 justify-end gap-2">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="rounded bg-gray-500 py-3 px-5 font-medium text-white hover:bg-gray-600"
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    className="flex justify-center rounded bg-primary py-3 px-5 font-medium text-white hover:bg-opacity-90"
                  >
                    {selectedId === 0 ? "Tambahkan" : "Perbarui"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </>
      )}
    </>
  );
};

export default NominalStok;
