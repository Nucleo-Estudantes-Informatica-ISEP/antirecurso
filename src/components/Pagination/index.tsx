import React, { Dispatch, SetStateAction } from 'react';
import PreviousExamResponseMetadata from 'src/types/PreviousExamResponseMetadata';

interface PaginationProps {
  metadata: PreviousExamResponseMetadata;
  setFetchUrl: Dispatch<SetStateAction<string | null>>;
}

const Pagination: React.FC<PaginationProps> = ({ metadata, setFetchUrl }) => {
  return (
    <nav>
      <ul className="flex justify-center rounded-md bg-white divide-x divide-gray-200 mt-6">
        {metadata.links.map((link) => (
          <li key={link.label} className="md:mx-1">
            <button
              disabled={link.url === null}
              className={`flex items-center justify-center px-4 py-2 rounded-md cursor-pointer border-2 ${
                link.active
                  ? 'bg-primary text-white'
                  : link.url !== null
                  ? 'hover:bg-primary hover:text-white'
                  : 'opacity-50 pointer-events-none'
              }
              `}
              onClick={() => setFetchUrl(link.url)}>
              <a dangerouslySetInnerHTML={{ __html: link.label }} className="text-md"></a>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;
