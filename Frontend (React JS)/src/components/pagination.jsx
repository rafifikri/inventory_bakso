const Pagination = ({ currentPage, totalPages, onPageChange, hasData }) => {
  const getPageNumbers = () => {
    const pages = [];
    const minPage = Math.max(2, currentPage - 1);
    const maxPage = Math.min(totalPages - 1, currentPage + 1);

    pages.push(1);

    if (minPage > 2) {
      pages.push("...");
    }

    for (let i = minPage; i <= maxPage; i++) {
      pages.push(i);
    }

    if (maxPage < totalPages - 1) {
      pages.push("...");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = hasData ? getPageNumbers() : [];

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || !hasData}
        className="px-4 py-2 border rounded-md text-black dark:border-form-strokedark dark:bg-form-input dark:text-white disabled:opacity-50"
      >
        Sebelumnya
      </button>

      {hasData &&
        pageNumbers.map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === "number" && onPageChange(page)}
            disabled={page === "..."}
            className={`px-4 py-2 mx-1 border rounded-md text-black dark:border-form-strokedark dark:bg-form-input dark:text-white ${
              currentPage === page
                ? "bg-primary dark:bg-primary text-white"
                : ""
            } ${page === "..." ? "cursor-default opacity-50" : ""}`}
          >
            {page}
          </button>
        ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || !hasData}
        className="px-4 py-2 border rounded-md text-black dark:border-form-strokedark dark:bg-form-input dark:text-white disabled:opacity-50"
      >
        Berikutnya
      </button>
    </div>
  );
};

export default Pagination;
