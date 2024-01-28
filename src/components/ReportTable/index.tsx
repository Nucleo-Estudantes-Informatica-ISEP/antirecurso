"use client";

import Report from '@/types/Report';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

type TableProps = {
    reports: Report[];
    selectedReports: number[];
    setSelectedReports: React.Dispatch<React.SetStateAction<number[]>>;
    sortBy: { key: string; desc: boolean };
    setSortBy: React.Dispatch<React.SetStateAction<{
        key: string;
        desc: boolean;
    }>>;
    handleOpenModal: (report: Report) => void;

};

type Collumn = {
    name: string;
    key: string;
};

const ReportTable: React.FC<TableProps> = ({ reports, selectedReports, setSelectedReports, sortBy, setSortBy, handleOpenModal }) => {

    const collumns = [{
        name: 'ID',
        key: 'id'
    }, {
        name: 'Autor',
        key: 'user_id'
    }, {
        name: 'Descrição',
        key: 'reason'
    }, {
        name: 'ID Questão',
        key: 'question_id'
    }, {
        name: 'Criado em',
        key: 'created_at'
    }, {
        name: 'Resolvido',
        key: 'solved'
    }];

    // select a single row
    const toggleRow = (id: number) => {
        setSelectedReports((prevselectedReports) =>
            prevselectedReports.includes(id)
                ? prevselectedReports.filter((rowId) => rowId !== id)
                : [...prevselectedReports, id]
        );
    };

    // select all rows
    const handleSelectAll = () => {
        const allRowIds = reports.map((row) => row.id);
        setSelectedReports((prevselectedReports) =>
            prevselectedReports.length === allRowIds.length ? [] : allRowIds
        );
    };

    // sort table
    const handleSort = (collumn: Collumn) => {
        let desc = true;
        if (sortBy.key === collumn.key && sortBy.desc) {
            desc = false;
        }
        setSortBy({ key: collumn.key, desc });
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
                            {collumns.map((collumn: Collumn) => (
                                <th
                                    className="px-4 py-2 cursor-pointer"
                                    onClick={() => handleSort(collumn)}
                                    key={collumn.key}
                                >
                                    {collumn.name}
                                    {sortBy.key === collumn.key &&
                                        (!sortBy.desc ? (
                                            <FaArrowUp className="inline ml-1" />
                                        ) : (
                                            <FaArrowDown className="inline ml-1" />
                                        ))}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map((report: Report) => (
                            <tr
                                key={report.id}
                                className={selectedReports.includes(report.id) ? 'bg-blue-200 cursor-pointer' : 'cursor-pointer'}
                            >
                                <td className="border px-4 py-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedReports.includes(report.id)}
                                        onChange={() => toggleRow(report.id)}
                                    />
                                </td>
                                <td className="border px-4 py-2" onClick={() => handleOpenModal(report)}>{report.id}</td>
                                <td className="border px-4 py-2" onClick={() => handleOpenModal(report)}>{report.user}</td>
                                <td className="border px-4 py-2" onClick={() => handleOpenModal(report)}>{report.reason}</td>
                                <td className="border px-4 py-2" onClick={() => handleOpenModal(report)}>
                                    {report.question.id}
                                </td>
                                <td className="border px-4 py-2" onClick={() => handleOpenModal(report)}>{report.created_at}</td>
                                <td className="border px-4 py-2" onClick={() => handleOpenModal(report)}>{report.solved == 1 ? 'Sim' : 'Não'}</td>
                            </tr>
                        ))}
                    </tbody>
                </>
            )}

        </table>
    );
};

export default ReportTable;
