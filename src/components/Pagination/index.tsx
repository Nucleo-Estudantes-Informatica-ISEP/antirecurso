import React, { Dispatch, SetStateAction } from 'react';
import PreviousExamResponseMetadata from 'src/types/PreviousExamResponseMetadata';

interface PaginationProps {
  metadata: PreviousExamResponseMetadata;
  setFetchUrl: Dispatch<SetStateAction<string | null>>;
}

const MAX_LINKS = 6;

const Pagination: React.FC<PaginationProps> = ({ metadata, setFetchUrl }) => {
  return (
    <nav className="w-full">
      <ul className="flex justify-center items-center py-6 gap-x-3">
        {metadata.links.map((link) => (
          <li key={link.label}>
            <button
              disabled={link.url === null}
              className={`flex items-center justify-center ${
                parseInt(link.label) <= MAX_LINKS ? 'w-9 h-9' : 'px-3 py-1.5'
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
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;
