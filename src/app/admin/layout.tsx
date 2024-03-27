import Sidebar from '@/components/Sidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminPage: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="w-full">
      <Sidebar />
      <div className="md:ml-64">
        <div className="px-6 py-8">{children}</div>
      </div>
    </div>
  );
};

export default AdminPage;
