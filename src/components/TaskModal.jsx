/**
 * TaskModal Component
 * 
 * Modal dialog for creating and editing tasks.
 * Handles both create and edit modes based on whether a task prop is provided.
 * 
 * Features:
 * - Create new tasks or edit existing ones
 * - Form validation
 * - Dark mode support
 * - Date/time picker for deadlines
 * - Completion status toggle
 * - Automatic Redux state updates
 */

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { tasksAPI } from '../services/api';
import { addTask, updateTask } from '../store/slices/tasksSlice';
import { FaTimes, FaCalendarAlt, FaCheckCircle } from 'react-icons/fa';
import { HiOutlineDocumentText, HiOutlineClock } from 'react-icons/hi';

/**
 * TaskModal - Create/Edit Task Modal Component
 * 
 * @param {Object} props
 * @param {Object|null} props.task - Task object to edit (null for create mode)
 * @param {boolean} props.isOpen - Controls modal visibility
 * @param {Function} props.onClose - Callback function called when modal is closed
 */
const TaskModal = ({ task, isOpen, onClose }) => {
  const dispatch = useDispatch();
  
  // Form state - stores task data being edited/created
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    completed: false,
  });
  
  const [loading, setLocalLoading] = useState(false); // Loading state for async operations
  const { darkMode } = useSelector((state) => state.theme); // Get theme from Redux
  const iconClass = darkMode ? 'text-white' : 'text-gray-700'; // Theme-aware icon color

  /**
   * Effect: Initialize form data when task prop changes
   * 
   * When editing (task exists):
   * - Pre-fills form with existing task data
   * - Converts ISO date string to datetime-local format for the input
   * 
   * When creating (task is null):
   * - Resets form to empty state
   */
  useEffect(() => {
    if (task) {
      // Edit mode - populate form with existing task data
      setFormData({
        title: task.title || '',
        description: task.description || '',
        // Convert ISO date to datetime-local format (YYYY-MM-DDTHH:mm)
        deadline: task.deadline ? new Date(task.deadline).toISOString().slice(0, 16) : '',
        completed: task.completed || false,
      });
    } else {
      // Create mode - reset form to empty state
      setFormData({
        title: '',
        description: '',
        deadline: '',
        completed: false,
      });
    }
  }, [task]);

  /**
   * Handles input field changes
   * Supports both text inputs and checkboxes
   * 
   * @param {Event} e - Input change event
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      // Checkboxes use 'checked', other inputs use 'value'
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  /**
   * Handles form submission
   * 
   * Process:
   * 1. Prevents default form submission
   * 2. Converts frontend data format to backend format:
   *    - completed (boolean) → status ('Done' | 'Pending')
   *    - datetime-local string → ISO 8601 string
   * 3. Calls appropriate API (create or update)
   * 4. Updates Redux store with the result
   * 5. Closes modal on success
   * 
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalLoading(true);
    try {
      // Transform form data to match backend API format
      const taskData = {
        title: formData.title,
        description: formData.description || '',
        // Convert datetime-local to ISO 8601 format, or null if empty
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
        // Convert boolean completed to status string for backend
        status: formData.completed ? 'Done' : 'Pending'
      };
      
      if (task) {
        // Edit mode - update existing task
        const updated = await tasksAPI.updateTask(task.id, taskData);
        dispatch(updateTask(updated)); // Update Redux store
      } else {
        // Create mode - create new task
        const newTask = await tasksAPI.createTask(taskData);
        dispatch(addTask(newTask)); // Add to Redux store
      }
      onClose(); // Close modal on success
    } catch (error) {
      console.error('Failed to save task:', error);
      alert('Failed to save task. Please try again.');
    } finally {
      setLocalLoading(false); // Always reset loading state
    }
  };

  // Don't render modal if it's not open
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

