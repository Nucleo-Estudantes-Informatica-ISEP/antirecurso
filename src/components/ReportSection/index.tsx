"use client";

import Report from '@/types/Report';

type TableProps = {
    reports: Report[];
    selectedReports: number[];
    setSelectedReports: React.Dispatch<React.SetStateAction<number[]>>;
};


const ReportTable: React.FC<TableProps> = ({ reports, selectedReports, setSelectedReports}) => {

    const toggleRow = (id: number) => {
        setSelectedReports((prevselectedReports) =>
            prevselectedReports.includes(id)
                ? prevselectedReports.filter((rowId) => rowId !== id)
                : [...prevselectedReports, id]
        );
    };

    const handleSelectAll = () => {
        const allRowIds = reports.map((row) => row.id);
        setSelectedReports((prevselectedReports) =>
            prevselectedReports.length === allRowIds.length ? [] : allRowIds
        );
    };


    return (
        <table className="min-w-full border border-gray-300">
            {reports.length === 0 ? (
                <thead>
                    <tr>
                        <th className="px-4 py-2">Nenhum report encontrado</th>
                    </tr>
                </thead>
            ) : (
                <>
                    <thead>
                        <tr>
                            <th className="px-4 py-2">
                                <input
                                    type="checkbox"
                                    checked={selectedReports.length === reports.length}
                                    onChange={handleSelectAll}
                                />
                            </th>
                            <th className="px-4 py-2">ID</th>
                            <th className="px-4 py-2">Autor</th>
                            <th className="px-4 py-2">Descrição</th>
                            <th className="px-4 py-2">ID Questão</th>
                            <th className="px-4 py-2">Criado em</th>
                            <th className="px-4 py-2">Resolvido</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map((report: Report) => (
                            <tr
                                key={report.id}
                                className={selectedReports.includes(report.id) ? 'bg-blue-200' : ''}
                            >
                                <td className="border px-4 py-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedReports.includes(report.id)}
                                        onChange={() => toggleRow(report.id)}
                                    />
                                </td>
                                <td className="border px-4 py-2">{report.id}</td>
                                <td className="border px-4 py-2">{report.user}</td>
                                <td className="border px-4 py-2">{report.reason}</td>
                                <td className="border px-4 py-2">{report.question.id}</td>
                                <td className="border px-4 py-2">{report.created_at}</td>
                                <td className="border px-4 py-2">{report.solved == 1 ? 'Sim' : 'Não'}</td>

                            </tr>
                        ))}
                    </tbody>
                </>
            )}

        </table>
    );
};

export default ReportTable;
