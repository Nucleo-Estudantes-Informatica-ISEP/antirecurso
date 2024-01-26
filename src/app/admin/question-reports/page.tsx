import fetchReports from '@/utils/FetchReports';
import { BASE_URL } from '@/services/api';
import ReportSection from '@/components/ReportSection/ReportTable';

// @ts-expect-error Server Component
const reports: React.FC = async () => {

  const reports = await fetchReports(`${BASE_URL}/question-reports`);

  return (
    <div className="w-full h-full mt-4 flex flex-col items-center justify-center">
      <h2 className="text-4xl font-black">Reports</h2>
      <ReportSection reports={reports} />
    </div>
  );
};

export default reports;
