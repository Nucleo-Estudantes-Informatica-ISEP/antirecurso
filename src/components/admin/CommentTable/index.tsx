'use client';

import LoadingSpinner from '@/components/utils/LoadingSpinner';
import Pagination from '@/components/utils/Pagination';
import useSession from '@/hooks/useSession';
import { BASE_URL } from '@/services/api';
import Comment from '@/types/Comment';
import { Paginate } from '@/types/Paginate';
import { fetcher } from '@/utils/SWRFetcher';
import { useState } from 'react';
import useSWR from 'swr';

const CommentTable: React.FC = () => {
  const session = useSession();
  const [fetchUrl, setFetchUrl] = useState<string | null>(`${BASE_URL}/comments`);

  // conditional data fetching https://swr.vercel.app/docs/conditional-fetching
  const { data: comments } = useSWR<Paginate<Comment>>(
    session.token && fetchUrl ? [fetchUrl, session.token] : null,
    ([url, token]) => fetcher(url, token as string),
    { revalidateOnFocus: false }
  );

  return !comments ? (
    <div className="flex items-center justify-center mt-16">
      <LoadingSpinner className="text-6xl" />
    </div>
  ) : (
    <>
      <table className="table-auto">
        {comments.data.length === 0 ? (
          <thead>
            <tr>
              <th className="px-4 py-2">Nenhum comentário encontrado</th>
            </tr>
          </thead>
        ) : (
          <>
            <thead>
              <tr>
                <th className="px-4 py-2">Autor</th>
                <th className="px-4 py-2">Comentário</th>
                <th className="px-4 py-2">Question ID</th>
                <th className="px-4 py-2">Criado em</th>
                <th className="px-4 py-2">Selecionar</th>
              </tr>
            </thead>
            <tbody>
              {comments.data.map((comment: Comment) => (
                <tr key={comment.id}>
                  <td className="border px-4 py-2">{comment.user}</td>
                  <td className="border px-4 py-2">{comment.comment}</td>
                  <td className="border px-4 py-2">{comment.question_id}</td>
                  <td className="border px-4 py-2">{comment.created_at}</td>
                  <td className="border px-4 py-2">
                    <input
                      type="checkbox"
                      name={`checkbox-${comment.id}`}
                      id={`checkbox-${comment.id}`}
                    />
                    <label htmlFor={`checkbox-${comment.id}`}></label>
                  </td>
                </tr>
              ))}
            </tbody>
          </>
        )}
      </table>
      <Pagination metadata={comments.meta} setFetchUrl={setFetchUrl} />
    </>
  );
};

export default CommentTable;
