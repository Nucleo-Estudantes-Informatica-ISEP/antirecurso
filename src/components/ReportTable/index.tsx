import Report from '@/types/Report';
import fetchReports from '@/utils/FetchReports';
import { BASE_URL } from '@/services/api';

// @ts-expect-error Server Component
const ReportTable: React.FC = async () => {
    const reports = await fetchReports(`${BASE_URL}/question-reports`);
    console.log(reports);
    return (
        <table className="table-auto">
            {reports.length === 0 ? (
                <thead>
                    <tr>
                        <th className="px-4 py-2">Nenhum comentário encontrado</th>
                    </tr>
                </thead>
            ) : (
                <>
                    <thead>
                        <tr>
                            <th className="px-4 py-2">ID</th>
                            <th className="px-4 py-2">Autor</th>
                            <th className="px-4 py-2">Descrição</th>
                            <th className="px-4 py-2">Question ID</th>
                            <th className="px-4 py-2">Criado em</th>
                            <th className="px-4 py-2">Solved</th>
                            <th className="px-4 py-2">Selecionar</th>
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
                                <td className="border px-4 py-2">
                                    <input
                                        type="checkbox"
                                        name={`checkbox-${report.id}`}
                                        id={`checkbox-${report.id}`}
                                    />
                                    <label htmlFor={`checkbox-${report.id}`}></label>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </>
            )}
        </table>
    );
};

export default ReportTable;
