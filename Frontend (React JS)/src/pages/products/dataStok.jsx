import Breadcrumb from "@/components/breadcrumb";
import Table from "@/components/table";

const TableStok = () => {
  return (
    <>
      <Breadcrumb pageName="Data Stok Harian" />

      <div className="flex flex-col gap-10">
        <Table />
      </div>
    </>
  );
};

export default TableStok;
