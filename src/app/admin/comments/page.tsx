import CommentTable from '@/components/comments/CommentTable';

const Comments: React.FC = () => {
  // const [selectedActions, setSelectedActions] = useState<string[]>([]);

  // const [isChecked, setIsChecked] = useState(false);

  // const handleActionCheckboxChange = (actionName: string) => {
  //   if (isChecked) {
  //     setSelectedActions([...selectedActions, actionName]);
  //   } else {
  //     setIsChecked(false);
  //     setSelectedActions(selectedActions.filter((action) => action !== actionName));
  //   }
  // };

  // const handleApply = () => {
  //   if (selectedActions.includes('approved')) {
  //     /*TODO: Perform the action for "Approved" comments*/
  //   }

  //   if (selectedActions.includes('rejected')) {
  //     /*TODO: Perform the action for "Rejected" comments*/
  //   }

  //   if (selectedActions.includes('spam')) {
  //     /*TODO: Perform the action for "Spam" comments*/
  //   }

  //   if (selectedActions.includes('delete')) {
  //     /*TODO: Perform the action for "Delete" comments*/
  //   }

  //   setSelectedActions([]);
  // };

  return (
    <div className="w-full h-full mt-4 flex flex-col items-center justify-center">
      <h2 className="text-4xl font-black">Comments</h2>
      <div className="w-3/4 flex gap-6 my-4 border bg-gray-400 dark:bg-gray-700 items-center justify-center">
        <input type="checkbox" name="approved" id="approved" />
        <label htmlFor="approved" className="text-white">
          Approved
        </label>

        <input
          type="checkbox"
          name="rejected"
          id="rejected"
          // checked={selectedActions.includes('rejected')}
          // onChange={() => handleActionCheckboxChange('rejected')}
        />
        <label htmlFor="rejected" className="text-white">
          Rejected
        </label>

        <input type="checkbox" name="spam" id="spam" />
        <label htmlFor="spam" className="text-white">
          Spam
        </label>

        <input type="checkbox" name="delete" id="delete" />
        <label htmlFor="delete" className="text-white">
          Delete
        </label>

        <input type="checkbox" name="all" id="all" />
        <label htmlFor="all" className="text-white">
          All
        </label>
      </div>

      <div className="flex gap-x-2">
        <button
          className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md shadow-md"
          // onClick={handleApply}
        >
          Apply
        </button>
        <button className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md shadow-md">
          Add New
        </button>
      </div>

      <div className="flex flex-col w-3/4">
        <CommentTable />
      </div>
    </div>
  );
};

export default Comments;
