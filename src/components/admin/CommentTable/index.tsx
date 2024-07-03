import { BASE_URL } from '@/services/api';
import Comment from '@/types/Comment';
import fetchComments from '@/utils/FetchComments';

const CommentTable: React.FC = async () => {
  const comments = await fetchComments(`${BASE_URL}/comments`);

  return (
    <table className="table-auto">
      {comments.length === 0 ? (
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
            {comments.map((comment: Comment) => (
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
  );
};

export default CommentTable;
