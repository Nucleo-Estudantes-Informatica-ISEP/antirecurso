const TableHeading: React.FC = () => {
  return (
    <thead className="text-xs text-white uppercase bg-primary">
      <tr>
        <th scope="col" className="text-xs px-2 py-3 md:p-4">
          Disciplina
        </th>
        <th scope="col" className="text-xs px-2 py-3 md:p-4">
          Pontuação
        </th>
        <th scope="col" className="text-xs px-2 py-3 md:p-4">
          Data
        </th>
        <th scope="col" className="text-xs px-2 py-3 md:p-4">
          Tempo (m)
        </th>
        <th scope="col" className="text-xs px-2 py-3 md:p-4">
          Modo
        </th>
      </tr>
    </thead>
  );
};

export default TableHeading;
