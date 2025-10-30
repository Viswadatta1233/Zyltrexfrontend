import { useDispatch, useSelector } from 'react-redux';
import { setCurrentPage, setPageSize } from '../store/slices/tasksSlice';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = ({ totalItems }) => {
  const dispatch = useDispatch();
  const { darkMode } = useSelector((state) => state.theme);
  const { pagination } = useSelector((state) => state.tasks);

  const totalPages = Math.ceil(totalItems / pagination.pageSize);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      dispatch(setCurrentPage(page));
    }
  };

  const handlePageSizeChange = (size) => {
    dispatch(setPageSize(parseInt(size)));
  };

  if (totalPages <= 1) return null;

  return (
    <div className={`mt-8 p-6 rounded-2xl shadow-md flex flex-col md:flex-row justify-between items-center ${darkMode ? 'bg-gray-800 border border-gray-700 text-gray-300' : 'bg-white border border-gray-200 text-gray-700'}`}>
      <div className="mb-4 md:mb-0 flex items-center space-x-3">
        <label className="text-sm font-semibold">Items per page:</label>
        <select
          value={pagination.pageSize}
          onChange={(e) => handlePageSizeChange(e.target.value)}
          className={`px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium ${
            darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
          }`}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => handlePageChange(pagination.currentPage - 1)}
          disabled={pagination.currentPage === 1}
          className={`p-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all ${
            darkMode
              ? 'hover:bg-gray-700 disabled:hover:bg-transparent'
              : 'hover:bg-gray-100 disabled:hover:bg-transparent'
          }`}
        >
          <FaChevronLeft size={16} />
        </button>

        <span className="px-6 font-semibold">
          Page {pagination.currentPage} of {totalPages}
        </span>

        <button
          onClick={() => handlePageChange(pagination.currentPage + 1)}
          disabled={pagination.currentPage === totalPages}
          className={`p-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all ${
            darkMode
              ? 'hover:bg-gray-700 disabled:hover:bg-transparent'
              : 'hover:bg-gray-100 disabled:hover:bg-transparent'
          }`}
        >
          <FaChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;

