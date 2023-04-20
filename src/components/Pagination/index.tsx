import React, { RefObject } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const handlePrevClick = () => {
    onPageChange(currentPage - 1);
  };

  const handleNextClick = () => {
    onPageChange(currentPage + 1);
  };

  return (
    <nav>
      <ul className="flex justify-center list-none rounded-md bg-white divide-x divide-gray-200 mt-6 gap-2">
        <button
          className={`inline-block px-4 py-2 rounded-md cursor-pointer border-2 ${
            currentPage === 1 ? 'bg-gray-200 text-gray-600' : 'hover:bg-gray-200'
          }`}
          onClick={handlePrevClick}
          disabled={currentPage === 1}>
          <a className="block">Previous</a>
        </button>

        {pageNumbers.map((number) => (
          <button
            key={number}
            className={`inline-block px-4 py-2 rounded-md cursor-pointer border-2 ${
              currentPage === number ? 'bg-primary text-white' : 'hover:bg-primary hover:text-white'
            }`}
            onClick={() => onPageChange(number)}>
            <a className="block">{number}</a>
          </button>
        ))}

        <button
          className={`inline-block px-4 py-2 rounded-md cursor-pointer border-2 ${
            currentPage === totalPages ? 'bg-gray-200 text-gray-600' : 'hover:bg-gray-200'
          }`}
          onClick={handleNextClick}
          disabled={currentPage === totalPages}>
          <a className="block">Next</a>
        </button>
      </ul>
    </nav>
  );
};

export default Pagination;
