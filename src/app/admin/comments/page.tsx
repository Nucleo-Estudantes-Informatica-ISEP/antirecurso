import CommentTable from '@/components/admin/CommentTable';

const Comments: React.FC = () => {
  return (
    <div className="w-full h-full mt-4 flex flex-col items-center justify-center">
      <h2 className="text-4xl font-black">Comments</h2>

      <div className="flex flex-col w-3/4">
        <CommentTable />
      </div>
    </div>
  );
};

export default Comments;
