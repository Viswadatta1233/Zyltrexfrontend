import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentPage, setPageSize } from '../store/slices/tasksSlice';
import { FaChevronLeft, FaChevronRight, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
import { HiOutlineViewList } from 'react-icons/hi';

const Pagination = ({ totalItems }) => {
  const dispatch = useDispatch();
  const { darkMode } = useSelector((state) => state.theme);
  const { pagination } = useSelector((state) => state.tasks);

  const totalPages = Math.ceil(totalItems / pagination.pageSize);
  const startItem = totalItems === 0 ? 0 : (pagination.currentPage - 1) * pagination.pageSize + 1;
  const endItem = Math.min(pagination.currentPage * pagination.pageSize, totalItems);

  // Generate page numbers to display
  const pageNumbers = useMemo(() => {
    const pages = [];
    const current = pagination.currentPage;
    const total = totalPages;

    if (total <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (current <= 3) {
        // Near the start
        for (let i = 2; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('ellipsis-start');
        pages.push(total);
      } else if (current >= total - 2) {
        // Near the end
        pages.push('ellipsis-end');
        for (let i = total - 3; i <= total; i++) {
          pages.push(i);
        }
      } else {
        // In the middle
        pages.push('ellipsis-start');
        for (let i = current - 1; i <= current + 1; i++) {
          pages.push(i);
        }
        pages.push('ellipsis-end');
        pages.push(total);
      }
    }

    return pages;
  }, [pagination.currentPage, totalPages]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== pagination.currentPage) {
      dispatch(setCurrentPage(page));
      // Scroll to top of task list
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePageSizeChange = (size) => {
    dispatch(setPageSize(parseInt(size)));
  };

  if (totalPages <= 1 && totalItems > 0) {
    // Show pagination info even if only one page (for items per page selector)
    return (
      <div className={`mt-8 p-4 sm:p-6 rounded-2xl shadow-xl border-2 ${
        darkMode 
          ? 'bg-gray-800/90 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-3">
            <HiOutlineViewList className={`text-xl ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Showing <span className="font-bold">{startItem}-{endItem}</span> of <span className="font-bold">{totalItems}</span> tasks
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <label className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Per page:
            </label>
            <select
              value={pagination.pageSize}
              onChange={(e) => handlePageSizeChange(e.target.value)}
              className={`px-4 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-semibold ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white focus:ring-purple-400' 
                  : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-purple-600'
              }`}
            >
              <option value={6}>6</option>
              <option value={9}>9</option>
              <option value={12}>12</option>
              <option value={18}>18</option>
              <option value={24}>24</option>
            </select>
          </div>
        </div>
      </div>
    );
  }

  if (totalPages <= 1) return null;

  return (
    <div className={`mt-8 p-4 sm:p-6 rounded-2xl shadow-xl border-2 ${
      darkMode 
        ? 'bg-gray-800/90 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      {/* Top Section: Info and Page Size Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4 pb-4 border-b border-gray-300 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <HiOutlineViewList className={`text-xl ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
          <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Showing <span className="font-bold text-purple-600 dark:text-purple-400">{startItem}-{endItem}</span> of <span className="font-bold">{totalItems}</span> tasks
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <label className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Per page:
          </label>
          <select
            value={pagination.pageSize}
            onChange={(e) => handlePageSizeChange(e.target.value)}
            className={`px-4 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-semibold ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white focus:ring-purple-400' 
                : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-purple-600'
            }`}
          >
            <option value={6}>6</option>
            <option value={9}>9</option>
            <option value={12}>12</option>
            <option value={18}>18</option>
            <option value={24}>24</option>
          </select>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Page Info */}
        <div className={`text-sm font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Page <span className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{pagination.currentPage}</span> of <span className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{totalPages}</span>
        </div>

        {/* Page Navigation */}
        <div className="flex items-center space-x-2">
          {/* First Page Button */}
          <button
            onClick={() => handlePageChange(1)}
            disabled={pagination.currentPage === 1}
            className={`p-2.5 rounded-xl transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed ${
              darkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-white disabled:hover:bg-gray-700'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:hover:bg-gray-100'
            }`}
            title="First page"
          >
            <FaAngleDoubleLeft size={14} />
          </button>

          {/* Previous Button */}
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className={`p-2.5 rounded-xl transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed ${
              darkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-white disabled:hover:bg-gray-700'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:hover:bg-gray-100'
            }`}
            title="Previous page"
          >
            <FaChevronLeft size={14} />
          </button>

          {/* Page Numbers */}
          <div className="flex items-center space-x-1">
            {pageNumbers.map((page, index) => {
              if (page === 'ellipsis-start' || page === 'ellipsis-end') {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className={`px-3 py-2 font-bold ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}
                  >
                    ...
                  </span>
                );
              }

              const isActive = page === pagination.currentPage;

              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`min-w-[40px] px-3 py-2 rounded-xl font-bold text-sm transition-all shadow-md ${
                    isActive
                      ? darkMode
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg scale-105'
                        : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg scale-105'
                      : darkMode
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === totalPages}
            className={`p-2.5 rounded-xl transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed ${
              darkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-white disabled:hover:bg-gray-700'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:hover:bg-gray-100'
            }`}
            title="Next page"
          >
            <FaChevronRight size={14} />
          </button>

          {/* Last Page Button */}
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={pagination.currentPage === totalPages}
            className={`p-2.5 rounded-xl transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed ${
              darkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-white disabled:hover:bg-gray-700'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:hover:bg-gray-100'
            }`}
            title="Last page"
          >
            <FaAngleDoubleRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;

