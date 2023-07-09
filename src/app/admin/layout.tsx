import Link from 'next/link';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const admin: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="flex w-full h-full">
        <aside className="w-[15vw] bg-gray-100 dark:bg-secondary-dark py-4">
          <h2 className="text-2xl font-bold text-center">Options</h2>
          <ul className="flex flex-col gap-y-4 ml-2 mt-4">
            <li className="text-lg">
              <Link className="hover:text-primary" href="/admin">
                🏠 Home
              </Link>
            </li>
            <li className="text-lg">
              <Link className="hover:text-primary" href="/admin/question-reports">
                🚩 Reports
              </Link>
            </li>
            <li className="text-lg">
              <Link className="hover:text-primary" href="/admin/comments">
                📝 Comments
              </Link>
            </li>
            <li className="text-lg">
              <Link className="hover:text-primary" href="/admin/users">
                👤 Users
              </Link>
            </li>
            <li className="text-lg">
              <Link className="hover:text-primary" href="/admin/charts">
                📊 Charts
              </Link>
            </li>
          </ul>
        </aside>
        <main className="w-full h-full flex">{children}</main>
      </div>
    </div>
  );
};

export default admin;
