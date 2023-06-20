const TableHeading: React.FC = () => {
  return (
    <thead className="w-full items-center justify-center text-white uppercase bg-primary">
      <tr>
        <th scope="col" className="text-xs px-4 py-3">
          Disciplina
        </th>
        <th scope="col" className="text-xs px-4 py-3">
          Pontuação para ranking
        </th>
        <th scope="col" className="text-xs px-4 py-3">
          Data
        </th>
      </tr>
    </thead>
  );
};

export default TableHeading;
