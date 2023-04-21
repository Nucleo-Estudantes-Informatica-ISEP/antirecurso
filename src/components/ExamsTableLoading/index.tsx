import Skeleton from 'react-loading-skeleton';
import TableHeading from '../TableHeading';

const N_ITEMS_PER_PAGE = 10;

const N_COLUMNS = 3;

const ExamTableLoading = () => {
  return (
    <table className="w-1/2 text-sm text-center">
      <TableHeading />
      <tbody>
        <tr>
          {[...Array(N_COLUMNS)].map((_, index) => (
            <td key={index} className="px-6 py-4">
              <Skeleton className="h-10 my-2" count={N_ITEMS_PER_PAGE} />
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
};

export default ExamTableLoading;
