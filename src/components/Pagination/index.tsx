import React, { Dispatch, SetStateAction } from 'react';
import PreviousExamResponseMetadata from 'src/types/PreviousExamResponseMetadata';

interface PaginationProps {
  metadata: PreviousExamResponseMetadata;
  setFetchUrl: Dispatch<SetStateAction<string | null>>;
}

const Pagination: React.FC<PaginationProps> = ({ metadata, setFetchUrl }) => {
  return (
    <nav>
      <ul className="flex justify-center list-none rounded-md bg-white divide-x divide-gray-200 mt-6 gap-2">
        {metadata.links.map((link) => (
          <button
            disabled={link.url === null}
            key={link.label}
            className={`flex items-center justify-center w-1/3 px-4 py-2 rounded-md cursor-pointer border-2 ${
              link.active ? 'bg-primary text-white' : 'hover:bg-primary hover:text-white'
            }`}
            onClick={() => setFetchUrl(link.url)}>
            <a dangerouslySetInnerHTML={{ __html: link.label }} className="w-full"></a>
          </button>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;
