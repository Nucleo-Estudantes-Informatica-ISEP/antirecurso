import ReportTable from '@/components/ReportTable';

// @ts-expect-error Server Component
const reports: React.FC = async () => {


  return (
    <div className="w-full h-full mt-4 flex flex-col items-center justify-center">
      <h2 className="text-4xl font-black">Reports</h2>
      <div className="flex flex-col w-3/4">
        <ReportTable />
      </div>
    </div>
  );
};

export default reports;
