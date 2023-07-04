'use client';

import React, { Dispatch, SetStateAction } from 'react';
import PreviousExamResponseMetadata from 'src/types/PreviousExamResponseMetadata';

interface PaginationProps {
  metadata: PreviousExamResponseMetadata;
  setFetchUrl: Dispatch<SetStateAction<string | null>>;
}

const MAX_LINKS = 7;
const MAX_MOBILE_LINKS = 5;

const Pagination: React.FC<PaginationProps> = ({ metadata, setFetchUrl }) => {
  const { width } = document.documentElement.getBoundingClientRect();
  const maxLinks = width > 768 ? MAX_LINKS : MAX_MOBILE_LINKS;

  const links = [];

  if (metadata.last_page <= maxLinks) {
    links.push(...metadata.links);
  } else {
    const threshold = maxLinks - 3;
    const { current_page, last_page } = metadata;

    const lowerBound =
      current_page <= threshold // current page is close to the first page
        ? 2
        : current_page > last_page - threshold // current page is close to the last page
        ? last_page - threshold - 1
        : current_page - Math.floor(threshold / 2);

    const upperBound =
      current_page > last_page - threshold // current page is close to the last page
        ? last_page - 1
        : current_page <= threshold // current page is close to the first page
        ? threshold + 2
        : current_page + Math.floor(threshold / 2);

    links.push(metadata.links[0]); // prev btn
    links.push(metadata.links[1]); // first page
    for (let i = lowerBound; i <= upperBound; i++) links.push(metadata.links[i]);
    links.push(metadata.links[last_page]); // last page
    links.push(metadata.links[last_page + 1]); // next btn
  }

  return (
    <nav className="w-full">
      <ul className="flex justify-center items-center py-6 gap-x-3">
        {links.map((link) => {
          return (
            <li key={link.label}>
              <button
                disabled={link.url === null}
                className={`flex items-center justify-center ${
                  parseInt(link.label) ? 'w-7 h-7 md:w-9 md:h-9' : 'px-2 py-1 md:px-3 md:py-1.5'
                } rounded-full cursor-pointer border-2 text-center ${
                  link.active
                    ? 'bg-primary text-white'
                    : link.url !== null
                    ? 'hover:bg-primary hover:text-white'
                    : 'opacity-50 pointer-events-none'
                }
              `}
                onClick={() => setFetchUrl(link.url)}>
                <a
                  dangerouslySetInnerHTML={{ __html: link.label }}
                  className="text-xs md:text-md"></a>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Pagination;
