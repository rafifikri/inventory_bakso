// Fungsi pembulatan
const roundToTwo = (num) => Math.round(num * 100) / 100;

// Fungsi untuk menghitung HPP Lama
export const calculateHppLama = (produksi, kuantitas) => {
  return produksi > 0 && kuantitas > 0 ? produksi / kuantitas : 0;
};

// Fungsi untuk menghitung HPP Baru
export const calculateHppBaru = (
  produksi,
  kuantitas,
  sisaStokSebelumnya,
  nominalSisaStokSebelumnya
) => {
  if (
    produksi > 0 &&
    kuantitas > 0 &&
    sisaStokSebelumnya >= 0 &&
    nominalSisaStokSebelumnya >= 0
  ) {
    return (
      (produksi + nominalSisaStokSebelumnya) / (sisaStokSebelumnya + kuantitas)
    );
  }
  return 0;
};

// Fungsi untuk menghitung Nominal Sisa Stok
export const calculateNominalSisaStok = (hppBaru, sisaStok) => {
  return hppBaru > 0 && sisaStok >= 0 ? hppBaru * sisaStok : 0;
};

// Fungsi untuk menghitung dan membulatkan hasil akhir
export const calculateAndRound = (
  produksi,
  kuantitas,
  sisaStokSebelumnya,
  nominalSisaStokSebelumnya,
  sisaStok
) => {
  const hppLama = calculateHppLama(produksi, kuantitas);
  const hppBaru = calculateHppBaru(
    produksi,
    kuantitas,
    sisaStokSebelumnya,
    nominalSisaStokSebelumnya
  );
  const nominalSisaStok = calculateNominalSisaStok(hppBaru, sisaStok);

  return {
    hppLama: roundToTwo(hppLama),
    hppBaru: roundToTwo(hppBaru),
    nominalSisaStok: roundToTwo(nominalSisaStok),
  };
};
