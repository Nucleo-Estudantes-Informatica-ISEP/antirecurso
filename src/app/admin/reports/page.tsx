import { BASE_URL } from '@/services/api';
import config from 'src/config';
import { cookies } from 'next/headers';

// @ts-expect-error Server Component
const reports: React.FC = async () => {
  const t = cookies().get(config.cookies.token);
  const token = t?.value;
  const res = await fetch(`${BASE_URL}/reports`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });

  const reports = await res.json();

  return (
    <div className="h-full flex items-center">
      <p className="text-4xl font-black">Reports</p>
    </div>
  );
};

export default reports;
