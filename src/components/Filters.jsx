import { useDispatch, useSelector } from 'react-redux';
import { setFilter, setSortBy, setSortOrder } from '../store/slices/tasksSlice';
import { FaSort, FaSortUp, FaSortDown, FaFilter } from 'react-icons/fa';
import { HiOutlineCalendar, HiOutlineSortAscending } from 'react-icons/hi';

const Filters = () => {
  const dispatch = useDispatch();
  const { filters, sortBy, sortOrder } = useSelector((state) => state.tasks);
  const { darkMode } = useSelector((state) => state.theme);
  const iconClass = darkMode ? 'text-white' : 'text-primary-600';

  const handleFilterChange = (type, value) => {
    dispatch(setFilter({ [type]: value }));
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      dispatch(setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'));
    } else {
      dispatch(setSortBy(field));
      dispatch(setSortOrder('asc'));
    }
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return <FaSort className={`ml-1 ${iconClass}`} />;
    return sortOrder === 'asc'
      ? <FaSortUp className={`ml-1 ${iconClass}`} />
      : <FaSortDown className={`ml-1 ${iconClass}`} />;
  };

  return (
    <div className={`p-6 rounded-2xl shadow-md mb-6 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
      <div className="flex items-center space-x-2 mb-4">
        <FaFilter className={iconClass} />
        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Filters & Sort</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${
              darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
            }`}
          >
            <option value="all">All Tasks</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <div>
          <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <HiOutlineCalendar className={`inline mr-1 ${iconClass}`} />
            Deadline
          </label>
          <select
            value={filters.deadline}
            onChange={(e) => handleFilterChange('deadline', e.target.value)}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${
              darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
            }`}
          >
            <option value="all">All Tasks</option>
            <option value="today">Today</option>
            <option value="thisWeek">This Week</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>

        <div>
          <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <HiOutlineSortAscending className={`inline mr-1 ${iconClass}`} />
            Sort By
          </label>
          <div className="flex space-x-2">
            <button
              onClick={() => handleSort('createdAt')}
              className={`flex-1 px-4 py-3 border rounded-xl flex items-center justify-center transition-all font-medium ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Date {getSortIcon('createdAt')}
            </button>
            <button
              onClick={() => handleSort('deadline')}
              className={`flex-1 px-4 py-3 border rounded-xl flex items-center justify-center transition-all font-medium ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Deadline {getSortIcon('deadline')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;

