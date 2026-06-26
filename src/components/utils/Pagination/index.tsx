'use client';

import { Button } from '@/components/ui/button';
import { PaginationMetadata } from '@/types/Pagination';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';

interface PaginationProps {
  metadata: PaginationMetadata;
  fetchUrl: string;
  setFetchUrl: Dispatch<SetStateAction<string | null>>;
}

const MAX_LINKS = 7;
const MAX_MOBILE_LINKS = 5;

const Pagination: React.FC<PaginationProps> = ({ metadata, fetchUrl, setFetchUrl }) => {
  const { width } =
    typeof document !== 'undefined'
      ? document.documentElement.getBoundingClientRect()
      : { width: 1280 };
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
      <ul className="flex justify-center items-center py-6 gap-1.5">
        <li>
          <Button
            size="icon"
            variant="outline"
            disabled={metadata.currentPage === metadata.firstPage}
            onClick={() => setFetchUrl(buildPageUrl(metadata.currentPage - 1))}
            className="size-9 rounded-full"
            aria-label="Página anterior"
          >
            <ChevronLeft className="size-4" />
          </Button>
        </li>

        {pageNumbers.map((page) => (
          <li key={page}>
            <Button
              size="icon"
              variant={page === metadata.currentPage ? 'default' : 'outline'}
              onClick={() => setFetchUrl(buildPageUrl(page))}
              className="size-9 rounded-full text-sm"
            >
              {page}
            </Button>
          </li>
        ))}

        <li>
          <Button
            size="icon"
            variant="outline"
            disabled={!metadata.nextPageUrl}
            onClick={() => setFetchUrl(buildPageUrl(metadata.currentPage + 1))}
            className="size-9 rounded-full"
            aria-label="Próxima página"
          >
            <ChevronRight className="size-4" />
          </Button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
