import { BASE_URL } from '@/services/api';
import config from 'src/config';
import { cookies } from 'next/headers';
import Report from '@/types/Report';

// @ts-expect-error Server Component
const reports: React.FC = async () => {
  const t = cookies().get(config.cookies.token);
  const token = t?.value;
  const res = await fetch(`${BASE_URL}/question-reports`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });

  const reports = await res.json();

  return (
    <div className="w-full h-full mt-4 flex flex-col items-center justify-center">
      <h2 className="text-4xl font-black">Reports</h2>
      <div className="flex flex-col w-3/4">
        <table className="table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">d</th>
              <th className="px-4 py-2">Autor</th>
              <th className="px-4 py-2">Descrição</th>
              <th className="px-4 py-2">Question ID</th>
              <th className="px-4 py-2">Criado em</th>
              <th className="px-4 py-2">Solved</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report: Report) => (
              <tr key={report.id}>
                <td className="border px-4 py-2">{report.id}</td>
                <td className="border px-4 py-2">{report.user}</td>
                <td className="border px-4 py-2">{report.reason}</td>
                <td className="border px-4 py-2">{report.question.id}</td>
                <td className="border px-4 py-2">{report.created_at}</td>
                <td className="border px-4 py-2">{report.solved == 1 ? 'Sim' : 'Não'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default reports;
