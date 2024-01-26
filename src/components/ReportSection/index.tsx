"use client";

import { useState } from 'react';
import Report from '@/types/Report';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

type TableProps = {
    reports: Report[];
    selectedReports: number[];
    setSelectedReports: React.Dispatch<React.SetStateAction<number[]>>;
};


const ReportTable: React.FC<TableProps> = ({ reports, selectedReports, setSelectedReports }) => {

    const collumns = ['ID', 'Autor', 'Descrição', 'ID Questão', 'Criado em', 'Resolvido'];
    const [sortConfig, setSortConfig] = useState({ key: 'Criado em', direction: 'descending' });

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
    const handleSort = (collumn: string) => {
        let direction = 'ascending';
        if (sortConfig.key === collumn && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key: collumn, direction });
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
                            {collumns.map((collumn: string) => (
                                <th
                                    className="px-4 py-2 cursor-pointer"
                                    onClick={() => handleSort(collumn)}
                                    key={collumn}
                                >
                                    {collumn}
                                    {sortConfig.key === collumn &&
                                        (sortConfig.direction === 'ascending' ? (
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
