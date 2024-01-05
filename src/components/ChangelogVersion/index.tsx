interface ChangelogVersion {
  title: string;
  date: Date;
  updates: React.ReactNode[];
  children?: React.ReactNode;
}

const ChangelogVersion: React.FC<ChangelogVersion> = ({ title, date, updates, children }) => {
  return (
    <article className="my-6 w-full">
      <h3 className="font-bold text-primary w-full leading-10 text-2xl mb-0.5">{title}</h3>
      <p className="text-sm text-gray-500">{date.toLocaleDateString('pt-PT')}</p>
      {children && (
        <span className="inline-block mt-2 mb-2 leading-5 text-lg align-middle">{children}</span>
      )}
      <h3 className="font-bold text-xl my-2">Novidades:</h3>
      <ul className="list-inside flex flex-col gap-y-1.5 ml-1 text-base font-light md:text-lg">
        {updates.map((update) => (
          <li className="align-middle" key={update?.toString()}>
            ♦️ {update}
          </li>
        ))}
      </ul>
    </article>
  );
};

export default ChangelogVersion;
