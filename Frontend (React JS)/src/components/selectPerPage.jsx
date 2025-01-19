import React from "react";

const SelectPerPage = ({ itemsPerPage, onItemsPerPageChange }) => {
  return (
    <div className="flex space-x-4">
      <label
        htmlFor="items-per-page"
        className="text-sm font-medium text-black dark:text-white"
      >
        Show per page:
      </label>
      <select
        id="items-per-page"
        onChange={(e) => onItemsPerPageChange(e)}
        value={itemsPerPage}
        className="border px-2 py-1 rounded-md dark:border-form-strokedark dark:bg-form-input"
      >
        <option value={10}>10</option>
        <option value={25}>25</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
      </select>
    </div>
  );
};

export default SelectPerPage;
