'use client';

import { Dispatch, SetStateAction } from 'react';

import { PaginationMetadata } from '@/types/Pagination';

interface PaginationProps {
  metadata: PaginationMetadata;
  fetchUrl: string;
  setFetchUrl: Dispatch<SetStateAction<string | null>>;
}

const MAX_LINKS = 7;
const MAX_MOBILE_LINKS = 5;

const Pagination: React.FC<PaginationProps> = ({ metadata, fetchUrl, setFetchUrl }) => {
  const { width } = document.documentElement.getBoundingClientRect();
  const maxLinks = width > 768 ? MAX_LINKS : MAX_MOBILE_LINKS;

  if (metadata.lastPage <= 1) {
    return null;
  }

  const buildPageUrl = (page: number) => {
    const url = new URL(fetchUrl, window.location.origin);
    if (page <= 1) {
      url.searchParams.delete('page');
    } else {
      url.searchParams.set('page', String(page));
    }

    return `${url.pathname}${url.search}`;
  };

  const pageNumbers: number[] = [];

  if (metadata.lastPage <= maxLinks) {
    for (let page = 1; page <= metadata.lastPage; page++) {
      pageNumbers.push(page);
    }
  } else {
    const middleWindowSize = maxLinks - 2;
    let startPage = Math.max(2, metadata.currentPage - Math.floor(middleWindowSize / 2));
    let endPage = startPage + middleWindowSize - 1;

    if (endPage >= metadata.lastPage) {
      endPage = metadata.lastPage - 1;
      startPage = Math.max(2, endPage - middleWindowSize + 1);
    }

    pageNumbers.push(1);
    for (let page = startPage; page <= endPage; page++) {
      pageNumbers.push(page);
    }
    pageNumbers.push(metadata.lastPage);
  }

  return (
    <nav className="w-full">
      <ul className="flex justify-center items-center py-6 gap-x-3">
        <li>
          <button
            disabled={metadata.currentPage === metadata.firstPage}
            className="flex items-center justify-center px-2 py-1 md:px-3 md:py-1.5 rounded-full cursor-pointer border-2 text-center hover:bg-primary hover:text-white disabled:opacity-50 disabled:pointer-events-none"
            onClick={() => setFetchUrl(buildPageUrl(metadata.currentPage - 1))}>
            {'<'}
          </button>
        </li>

        {pageNumbers.map((page) => (
          <li key={page}>
            <button
              className={`flex items-center justify-center w-7 h-7 md:w-9 md:h-9 rounded-full cursor-pointer border-2 text-center ${
                page === metadata.currentPage
                  ? 'bg-primary text-white'
                  : 'hover:bg-primary hover:text-white'
              }`}
              onClick={() => setFetchUrl(buildPageUrl(page))}>
              <span className="text-xs md:text-md">{page}</span>
            </button>
          </li>
        ))}

        <li>
          <button
            disabled={!metadata.nextPageUrl}
            className="flex items-center justify-center px-2 py-1 md:px-3 md:py-1.5 rounded-full cursor-pointer border-2 text-center hover:bg-primary hover:text-white disabled:opacity-50 disabled:pointer-events-none"
            onClick={() => setFetchUrl(buildPageUrl(metadata.currentPage + 1))}>
            {'>'}
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
