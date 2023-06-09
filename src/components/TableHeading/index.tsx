const TableHeading: React.FC = () => {
  return (
    <thead className="text-xs text-white uppercase bg-primary">
      <tr>
        <th scope="col" className="px-6 py-3">
          Disciplina
        </th>
        <th scope="col" className="px-6 py-3">
          Pontuação para ranking
        </th>
        <th scope="col" className="px-6 py-3">
          Data
        </th>
      </tr>
    </thead>
  );
};

export default TableHeading;
