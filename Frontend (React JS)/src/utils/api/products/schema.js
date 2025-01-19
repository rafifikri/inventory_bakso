import * as z from "zod";

export const stokSchema = z.object({
  tanggal: z.preprocess(
    (value) => {
      if (typeof value === "string") {
        const parsedDate = new Date(value);
        if (!isNaN(parsedDate.getTime())) {
          return value;
        }
      }
      return "";
    },
    z
      .string()
      .min(1, { message: "Tanggal harus diisi" })
      .refine(
        (val) => {
          const parsedDate = new Date(val);
          return !isNaN(parsedDate.getTime());
        },
        { message: "Tanggal tidak valid" }
      )
  ),
  jenis: z.string().min(1, { message: "Jenis bakso harus diisi" }),
  produksi: z.number().min(1, { message: "Jumlah produksi harus diisi" }),
  kuantitas: z.number().min(1, { message: "Kuantitas bakso harus diisi" }),
  hpp_lama: z.number().min(1, { message: "HPP lama harus diisi" }),
  hpp_baru: z
    .number()
    .nonnegative({ message: "HPP baru tidak boleh kurang dari 0" }),
  sisa_stok: z.number().min(1, { message: "Sisa stok harus diisi" }),
  nominal_sisa_stok: z
    .number()
    .min(1, { message: "Nominal sisa stok harus diisi" }),
});
