import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { tasksAPI } from '../services/api';
import { addTask, updateTask } from '../store/slices/tasksSlice';
import { FaTimes, FaCalendarAlt, FaCheckCircle } from 'react-icons/fa';
import { HiOutlineDocumentText, HiOutlineClock } from 'react-icons/hi';

const TaskModal = ({ task, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    completed: false,
  });
  const [loading, setLocalLoading] = useState(false);
  const { darkMode } = useSelector((state) => state.theme);
  const iconClass = darkMode ? 'text-white' : 'text-gray-700';

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        deadline: task.deadline ? new Date(task.deadline).toISOString().slice(0, 16) : '',
        completed: task.completed || false,
      });
    } else {
      // Reset form when creating a new task
      setFormData({
        title: '',
        description: '',
        deadline: '',
        completed: false,
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalLoading(true);
    try {
      // Convert completed boolean to status for backend
      // Convert datetime-local format to ISO format
      const taskData = {
        title: formData.title,
        description: formData.description || '',
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
        status: formData.completed ? 'Done' : 'Pending'
      };
      
      if (task) {
        const updated = await tasksAPI.updateTask(task.id, taskData);
        dispatch(updateTask(updated));
      } else {
        const newTask = await tasksAPI.createTask(taskData);
        dispatch(addTask(newTask));
      }
      onClose();
    } catch (error) {
      console.error('Failed to save task:', error);
      alert('Failed to save task. Please try again.');
    } finally {
      setLocalLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 p-4 animate-fade-in ${darkMode ? 'bg-black/60 backdrop-blur-sm' : 'bg-black/50 backdrop-blur-sm'}`}>
      <div className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-gray-800 border-2 border-gray-600' : 'bg-white border-2 border-gray-200'} rounded-2xl shadow-2xl animate-slide-up`}>
        <div className="p-6 sticky top-0 bg-inherit border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-xl ${darkMode ? 'bg-primary-600' : 'bg-primary-100'}`}>
              <HiOutlineDocumentText className={`text-xl ${darkMode ? 'text-white' : 'text-primary-600'}`} />
            </div>
            <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {task ? 'Edit Task' : 'Create New Task'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-all ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}
          >
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Task Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
              placeholder="Enter task title"
            />
          </div>

          <div>
            <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-none ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
              placeholder="Add task description (optional)"
            />
          </div>

          <div>
            <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <FaCalendarAlt className={`inline mr-2 ${iconClass}`} />
              Deadline
            </label>
            <input
              type="datetime-local"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
              }`}
            />
          </div>

          <div className={`flex items-center space-x-3 p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <input
              type="checkbox"
              name="completed"
              checked={formData.completed}
              onChange={handleChange}
              className="w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-500 cursor-pointer"
            />
            <label className={`flex items-center space-x-2 text-sm font-medium cursor-pointer ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              <FaCheckCircle className="text-green-500" />
              <span>Mark as completed</span>
            </label>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`px-6 py-3 border-2 rounded-xl font-semibold transition-all ${
                darkMode ? 'border-gray-600 text-gray-200 hover:bg-gray-700 hover:border-gray-500' : 'border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                darkMode
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
              }`}
            >
              {loading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;

