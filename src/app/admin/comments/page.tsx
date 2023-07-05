import config from '@/config';
import { BASE_URL } from '@/services/api';
import Comment from '@/types/Comment';
import { cookies } from 'next/headers';

// @ts-expect-error Server Component
const comments: React.FC = async () => {
  const t = cookies().get(config.cookies.token);
  const token = t?.value;
  const res = await fetch(`${BASE_URL}/comments`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });

  const comments = await res.json();

  return (
    <div className="h-full flex items-center">
      <p className="text-4xl font-black">Comments</p>

      <div className="flex flex-col gap-y-2 ml-2">
        <input type="checkbox" name="comments" id="comments" />
        <label htmlFor="comments">Comments</label>

        <input type="checkbox" name="pending" id="pending" />
        <label htmlFor="pending">Pending</label>

        <input type="checkbox" name="approved" id="approved" />
        <label htmlFor="approved">Approved</label>

        <input type="checkbox" name="rejected" id="rejected" />
        <label htmlFor="rejected">Rejected</label>

        <input type="checkbox" name="spam" id="spam" />
        <label htmlFor="spam">Spam</label>

        <input type="checkbox" name="trash" id="trash" />
        <label htmlFor="trash">Trash</label>

        <input type="checkbox" name="all" id="all" />
        <label htmlFor="all">All</label>

        <button className="bg-primary text-white px-4 py-2 rounded-md">Apply</button>
        <button className="bg-primary text-white px-4 py-2 rounded-md">Add New</button>
      </div>

      <div>
        <table className="table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">Author</th>
              <th className="px-4 py-2">Comment</th>
            </tr>
          </thead>
          <tbody>
            {comments.map((comment: Comment) => (
              <tr key={comment.id}>
                <td className="border px-4 py-2">{comment.user}</td>
                <td className="border px-4 py-2">{comment.comment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default comments;
