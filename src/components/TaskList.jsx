import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { FaCalendarAlt, FaCheckCircle, FaClock } from 'react-icons/fa';
import { HiOutlineClipboardCheck, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import Pagination from './Pagination';

const TaskList = ({ tasks, onEdit, onDelete }) => {
  const { darkMode } = useSelector((state) => state.theme);
  const { filters, sortBy, sortOrder, pagination } = useSelector((state) => state.tasks);

  const filteredAndSortedTasks = useMemo(() => {
    let filtered = [...tasks];

    if (filters.status !== 'all') {
      filtered = filtered.filter((task) => {
        if (filters.status === 'completed') return task.completed;
        if (filters.status === 'pending') return !task.completed;
        return true;
      });
    }

    if (filters.deadline !== 'all') {
      const now = new Date();
      filtered = filtered.filter((task) => {
        if (!task.deadline) return filters.deadline !== 'overdue';
        const deadline = new Date(task.deadline);
        
        if (filters.deadline === 'today') {
          return deadline.toDateString() === now.toDateString();
        }
        if (filters.deadline === 'thisWeek') {
          const weekFromNow = new Date(now);
          weekFromNow.setDate(weekFromNow.getDate() + 7);
          return deadline <= weekFromNow && deadline >= now;
        }
        if (filters.deadline === 'overdue') {
          return deadline < now && !task.completed;
        }
        return true;
      });
    }

    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (!aVal) return 1;
      if (!bVal) return -1;

      if (aVal instanceof Date || (typeof aVal === 'string' && aVal.includes('T'))) {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  }, [tasks, filters, sortBy, sortOrder]);

  const paginatedTasks = useMemo(() => {
    const start = (pagination.currentPage - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredAndSortedTasks.slice(start, end);
  }, [filteredAndSortedTasks, pagination]);

  const formatDate = (dateString) => {
    if (!dateString) return 'No deadline';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (task) => {
    if (task.completed) {
      return (
        <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-xs font-semibold border border-green-200 dark:border-green-800">
          <FaCheckCircle className="inline mr-1.5" />
          Done
        </span>
      );
    }
    if (task.deadline && new Date(task.deadline) < new Date()) {
      return (
        <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-full text-xs font-semibold border border-red-200 dark:border-red-800">
          <FaClock className="inline mr-1.5" />
          Overdue
        </span>
      );
    }
    return (
      <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 rounded-full text-xs font-semibold border border-orange-200 dark:border-orange-800">
        Pending
      </span>
    );
  };

  if (paginatedTasks.length === 0) {
    return (
      <div className={`text-center py-16 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        <div className={`inline-flex items-center justify-center p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} mb-4`}>
          <HiOutlineClipboardCheck className="text-6xl text-gray-400" />
        </div>
        <p className="text-xl font-semibold mb-2">No tasks found</p>
        <p className="text-sm">Create your first task to get started!</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedTasks.map((task) => (
          <div
            key={task.id}
            className={`p-6 rounded-2xl border shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 ${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} line-clamp-2 flex-1`}>
                {task.title}
              </h3>
              {getStatusBadge(task)}
            </div>

            {task.description && (
              <p className={`mb-4 text-sm leading-relaxed line-clamp-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {task.description}
              </p>
            )}

            <div className={`flex items-center mb-6 p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <FaCalendarAlt className={`mr-2 ${darkMode ? 'text-white' : 'text-primary-600'}`} />
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {formatDate(task.deadline)}
              </span>
            </div>

            <div className={`flex justify-end space-x-2 pt-4 ${darkMode ? 'border-t border-gray-700' : 'border-t border-gray-200'}`}>
              <button
                onClick={() => onEdit(task)}
                className={`p-3 rounded-xl transition-all shadow-sm hover:shadow-md ${darkMode ? 'text-blue-400 hover:bg-blue-900/20 border border-blue-800/30' : 'text-blue-600 hover:bg-blue-50 border border-blue-200'}`}
                title="Edit task"
              >
                <HiOutlinePencil size={20} />
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className={`p-3 rounded-xl transition-all shadow-sm hover:shadow-md ${darkMode ? 'text-red-400 hover:bg-red-900/20 border border-red-800/30' : 'text-red-600 hover:bg-red-50 border border-red-200'}`}
                title="Delete task"
              >
                <HiOutlineTrash size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Pagination totalItems={filteredAndSortedTasks.length} />
    </>
  );
};

export default TaskList;

