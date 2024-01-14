import ReportTable from '@/components/ReportTable';
import fetchReports from '@/utils/FetchReports';
import { BASE_URL } from '@/services/api';

// @ts-expect-error Server Component
const reports: React.FC = async () => {

  const reports = await fetchReports(`${BASE_URL}/question-reports`);

  return (
    <div className="w-full h-full mt-4 flex flex-col items-center justify-center">
      <h2 className="text-4xl font-black">Reports</h2>
      <div className="flex gap-x-2">
        <button
          className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md shadow-md"
        // onClick={handleApply}
        >
          Resolver
        </button>
        <button className="bg-red-500 hover:bg-red-500 text-white px-4 py-2 rounded-md shadow-md">
          Apagar
        </button>
      </div>
      <div className="flex flex-col w-3/4">
        <ReportTable reports={reports} />
      </div>
    </div>
  );
};

export default reports;
