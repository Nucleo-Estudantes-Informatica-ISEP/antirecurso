import React, { Dispatch, SetStateAction } from 'react';
import PreviousExamResponseMetadata from 'src/types/PreviousExamResponseMetadata';

interface PaginationProps {
  metadata: PreviousExamResponseMetadata;
  setFetchUrl: Dispatch<SetStateAction<string | null>>;
}

const Pagination: React.FC<PaginationProps> = ({ metadata, setFetchUrl }) => {
  return (
    <nav className="w-full">
      <ul className="flex justify-center py-6 gap-x-2">
        {metadata.links.map((link) => (
          <li key={link.label}>
            <button
              disabled={link.url === null}
              className={`flex items-center justify-center px-2 py-1 md:px-4 md:py-2 rounded-full cursor-pointer border-2 ${
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
