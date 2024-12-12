'use client';

import BarChart from '@/components/charts/BarChart';
import useSession from '@/hooks/useSession';
import { AdminChartStats } from '@/types/AdminChartStats';
import { fetchSubjects } from '@/services/fetchSubjects';
import { useState, useEffect } from 'react';
import { BASE_URL } from 'src/services/api';

const Charts: React.FC = () => {
  const session = useSession();

  // Get Subjects
  const [subjects, setSubjects] = useState<{ name: string; value: string }[]>([
    { name: 'Todos', value: '' },
  ]);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState<boolean>(true);

  useEffect(() => {
    const getSubjects = async () => {
      try {
        const subjectsData = await fetchSubjects();
        const formattedSubjects = subjectsData.map((subject) => ({
          name: subject.name,
          value: subject.id.toString(),
        }));

        setSubjects([{ name: 'Todos', value: '' }, ...formattedSubjects]);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      } finally {
        setIsLoadingSubjects(false);
      }
    };
    getSubjects();
  }, []);

  const filters = [
    {
      name: 'Exames',
      value: 'exams-charts'
    },
    {
      name: 'Users Criados',
      value: 'users-created'
    },
    {
      name: 'Comments',
      value: 'comments'
    },
    {
      name: 'Reports',
      value: 'reports'
    }
  ];

  const [selectedFilter, setSelectedFilter] = useState<string>('exams-charts');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [data, setData] = useState<AdminChartStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (filter: string, subject: string) => {
    setIsLoading(true);
    setError(null);

    const url = new URL(`${BASE_URL}/admin/${filter}/stats`);

    if (filter === 'exams-charts' && subject) {
      url.searchParams.append('subject_id',subject);
    }

    try {
      const res = await fetch(url.toString(), {
        method: 'GET',
        headers: { Authorization: `Bearer ${session.token}` },
      });

      if (!res.ok) throw new Error('Failed to fetch data');

      const result = (await res.json()) as AdminChartStats;
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session && session.token) {
      fetchData(selectedFilter, selectedSubject);
    }  
  }, [selectedFilter, selectedSubject]);

  const handleChangeFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFilter(e.target.value);
  };

  const handleChangeSubject = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubject(e.target.value);
  };
  
  const filterToComponentMap = new Map([
    [
      'exams-charts',
      (data: AdminChartStats) => (
        <BarChart
          title="Nº de exames por Mês"
          labels={data.exams_per_subject_individual?.map((item) => item.month)}
          data={data.exams_per_subject_individual?.map((item) => item.count)}
        />
      ),
    ],
    [
      'users-created',
      (data: AdminChartStats) => (
        <BarChart
          title="Nº de contas criadas por Mês"
          labels={data.users_per_month?.map((item) => item.month)}
          data={data.users_per_month?.map((item) => item.count)}
        />
      ),
    ],
    [
      'comments',
      (data: AdminChartStats) => (
        <BarChart
          title="Nº de comments por Mês"
          labels={data.comments_per_month?.map((item) => item.month)}
          data={data.comments_per_month?.map((item) => item.count)}
        />
      ),
    ],
    [
      'reports',
      (data: AdminChartStats) => (
        <BarChart
          title="Nº de reports por Mês"
          labels={data.reports_per_month?.map((item) => item.month)}
          data={data.reports_per_month?.map((item) => item.count)}
        />
      ),
    ],
  ]);


  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <h2 className="text-3xl font-semibold text-center">Gráficos</h2>

      <div className="w-3/4 py-2 flex gap-6 my-4 bg-gray-100 dark:bg-gray-700 items-center justify-center">
        <select
          id="filters"
          className="w-44 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          onChange={handleChangeFilter}
          value={selectedFilter}>
          {filters.map((f) => (
            <option key={f.value} value={f.value}>
              {f.name}
            </option>
          ))}
        </select>
        {selectedFilter === 'exams-charts' && !isLoadingSubjects &&(
          <select
          id="subjects"
          className="w-44 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          onChange={handleChangeSubject}
          value={selectedSubject}>
          {subjects.map((f) => (
            <option key={f.value} value={f.value}>
              {f.name}
            </option>
          ))}
        </select>
        )
        }
      </div>

      <div className="flex flex-col items-center justify-center w-full">
        {isLoading ? (
          <p className="text-yellow-300">Loading...</p>
        ) : error ? (
          <p className="text-red-500"><strong>{error}</strong></p>
        ) : (
          <div className="py-4 px-1 md:p-2 bg-gray-100 dark:bg-secondary-dark rounded-md size-3/4">
            {filterToComponentMap.get(selectedFilter)?.(data!)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Charts;