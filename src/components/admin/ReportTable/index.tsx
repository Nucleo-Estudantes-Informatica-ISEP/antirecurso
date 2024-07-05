'use client';

import { Report } from '@/types/Report';
import { TableColumn } from '@/types/TableColumn';
import { TableProps } from '@/types/TableProps';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';

const ReportTable: React.FC<TableProps<Report>> = ({
  data,
  selected,
  setSelected,
  sortBy,
  setSortBy,
  handleOpenModal
}) => {
  const columns: TableColumn<Report>[] = [
    {
      name: 'ID',
      key: 'id',
      w: 'w-1'
    },
    {
      name: 'Autor',
      key: 'user',
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
    setSelected((prevSelectedReports) =>
      prevSelectedReports.includes(id)
        ? prevSelectedReports.filter((rowId) => rowId !== id)
        : [...prevSelectedReports, id]
    );
  };

  // select all rows
  const handleSelectAll = () => {
    const allRowIds = data.map((row) => row.id);
    setSelected((prevSelectedReports) =>
      prevSelectedReports.length === allRowIds.length ? [] : allRowIds
    );
  };

  // sort table
  const handleSort = (column: TableColumn<Report>) => {
    let desc = true;
    if (sortBy.key === column.key && sortBy.desc) {
      desc = false;
    }
    setSortBy({ key: column.key, desc });
  };

  return (
    <div className="relative overflow-x-auto shadow-md pt-4">
      <table className="table-fixed w-full text-left rtl:text-right text-gray-800 dark:text-gray-300">
        {data.length === 0 ? (
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-4 py-3">Nenhum comentário encontrado</th>
            </tr>
          </thead>
        ) : (
          <>
            <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-4 py-4 w-1">
                  <input
                    type="checkbox"
                    checked={selected.length === data.length}
                    onChange={handleSelectAll}
                  />
                </th>
                {columns.map((column) => (
                  <th
                    className={`cursor-pointer px-6 py-4 ${column.w}`}
                    onClick={() => handleSort(column)}
                    key={column.key}>
                    {column.name}
                    {sortBy.key === column.key &&
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
              {data.map((report: Report) => (
                <tr
                  key={report.id}
                  className={
                    selected.includes(report.id)
                      ? 'cursor-pointer dark:bg-gray-600 bg-blue-200 border-b dark:border-gray-700'
                      : 'cursor-pointer bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }>
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(report.id)}
                      onChange={() => toggleRow(report.id)}
                    />
                  </td>
                  {columns.map((column) => (
                    <td
                      className={`px-6 py-3 truncate`}
                      onClick={() => handleOpenModal && handleOpenModal(report)}
                      key={column.key}>
                      {report[column.key] as string}
                    </td>
                  ))}
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
              {selected.length}
            </span>
          </p>
          <p className="text-sm">
            <span className="font-normal text-gray-500 dark:text-gray-400">Total:</span>
            <span className="font-semibold text-gray-900 dark:text-white pl-1">{data.length}</span>
          </p>
        </nav>
      </div>
    </div>
  );
};

export default ReportTable;
