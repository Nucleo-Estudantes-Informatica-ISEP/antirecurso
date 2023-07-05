import Link from 'next/link';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const admin: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="h-full w-full">
      <aside className="w-[15vw] h-full bg-gray-100 dark:bg-secondary-dark py-4">
        <h2 className="text-2xl font-bold text-center">Admin Page</h2>
        <ul className="flex flex-col gap-y-1 ml-2 mt-2">
          <li className="hover:text-primary text-lg">
            <Link href="/admin/reports">Reports</Link>
          </li>
          <li className="hover:text-primary text-lg">
            <Link href="/admin/comments">Comments</Link>
          </li>
        </ul>
      </aside>
      <main className="w-[85vw] h-full flex items-center justify-center text-4xl font-black">
        {children}
      </main>
    </div>
  );
};

export default admin;
