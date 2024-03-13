'use client';

import Report from '@/types/Report';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

type TableProps = {
  reports: Report[];
  selectedReports: number[];
  setSelectedReports: React.Dispatch<React.SetStateAction<number[]>>;
  sortBy: { key: string; desc: boolean };
  setSortBy: React.Dispatch<
    React.SetStateAction<{
      key: string;
      desc: boolean;
    }>
  >;
  handleOpenModal: (report: Report) => void;
};

type Collumn = {
  name: string;
  key: string;
  w: string;
};

const ReportTable: React.FC<TableProps> = ({
  reports,
  selectedReports,
  setSelectedReports,
  sortBy,
  setSortBy,
  handleOpenModal
}) => {
  const collumns = [
    {
      name: 'ID',
      key: 'id',
      w: 'w-1'
    },
    {
      name: 'Autor',
      key: 'user_id',
      w: 'w-12'
    },
    {
      name: 'Razão',
      key: 'reason',
      w: 'w-32'
    },
    {
      name: 'ID Questão',
      key: 'question_id',
      w: 'w-1'
    },
    {
      name: 'Criado em',
      key: 'created_at',
      w: 'w-12'
    },
    {
      name: 'Resolvido',
      key: 'solved',
      w: 'w-12'
    }
  ];

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
    <div className="relative overflow-x-auto shadow-md pt-4">
      <table className="table-fixed w-full text-left rtl:text-right text-gray-800 dark:text-gray-300">
        {reports.length === 0 ? (
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-4 py-3">Nenhum report encontrado</th>
            </tr>
          </thead>
        ) : (
          <>
            <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-4 py-4 w-1">
                  <input
                    type="checkbox"
                    checked={selectedReports.length === reports.length}
                    onChange={handleSelectAll}
                  />
                </th>
                {collumns.map((collumn: Collumn) => (
                  <th
                    className={`cursor-pointer px-6 py-4 ${collumn.w}`}
                    onClick={() => handleSort(collumn)}
                    key={collumn.key}>
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
                  className={
                    selectedReports.includes(report.id)
                      ? 'cursor-pointer dark:bg-gray-600 bg-blue-200 border-b dark:border-gray-700'
                      : 'cursor-pointer bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }>
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedReports.includes(report.id)}
                      onChange={() => toggleRow(report.id)}
                    />
                  </td>
                  <td className="px-6 py-3" onClick={() => handleOpenModal(report)}>
                    {report.id}
                  </td>
                  <td className="px-6 py-3" onClick={() => handleOpenModal(report)}>
                    {report.user}
                  </td>
                  <td className="px-6 py-3 truncate" onClick={() => handleOpenModal(report)}>
                    {report.reason}
                  </td>
                  <td className="px-6 py-3" onClick={() => handleOpenModal(report)}>
                    {report.question.id}
                  </td>
                  <td className="px-6 py-3" onClick={() => handleOpenModal(report)}>
                    {report.created_at}
                  </td>
                  <td className="px-6 py-3" onClick={() => handleOpenModal(report)}>
                    {report.solved == 1 ? 'Sim' : 'Não'}
                  </td>
                </tr>
              ))}
            </tbody>
          </>
        )}
      </table>
      <div className="relative overflow-hidden bg-white shadow-md dark:bg-gray-800">
        <nav
          className="flex flex-row items-center justify-between p-4"
          aria-label="Table navigation">
          <p className="text-sm">
            <span className="font-normal text-gray-500 dark:text-gray-400">Selecionados:</span>
            <span className="font-semibold text-gray-900 dark:text-white pl-1">
              {selectedReports.length}
            </span>
          </p>
          <p className="text-sm">
            <span className="font-normal text-gray-500 dark:text-gray-400">Total:</span>
            <span className="font-semibold text-gray-900 dark:text-white pl-1">
              {reports.length}
            </span>
          </p>
        </nav>
      </div>
    </div>
  );
};

export default ReportTable;
