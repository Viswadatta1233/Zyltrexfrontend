import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { tasksAPI } from '../services/api';
import { setTasks, setLoading, deleteTask as removeTask } from '../store/slices/tasksSlice';
import { logout } from '../store/slices/authSlice';
import { toggleDarkMode } from '../store/slices/themeSlice';
import { useNavigate } from 'react-router-dom';
import { 
  FaMoon, FaSun, FaPlus, FaCheckCircle, 
  FaUserCircle, FaBars, FaTimes, FaList
} from 'react-icons/fa';
import { HiOutlineViewGrid, HiOutlineClipboardCheck, HiOutlineSparkles, HiOutlinePencil, HiOutlineTrash, HiLogout, HiOutlineDocumentText } from 'react-icons/hi';
import TaskModal from '../components/TaskModal';
import TaskList from '../components/TaskList';
import Filters from '../components/Filters';
import AIInsights from '../components/AIInsights';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tasks, loading } = useSelector((state) => state.tasks);
  const user = useSelector((state) => state.auth.user);
  const darkMode = useSelector((state) => state.theme.darkMode);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const completedCount = tasks.filter(task => task.completed).length;
  const pendingCount = tasks.filter(task => !task.completed).length;

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadTasks = async () => {
    dispatch(setLoading(true));
    try {
      const data = await tasksAPI.getTasks();
      dispatch(setTasks(Array.isArray(data) ? data : []));
    } catch (error) {
      console.error('Failed to load tasks:', error);
      dispatch(setTasks([]));
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await tasksAPI.deleteTask(id);
        dispatch(removeTask(id));
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    loadTasks();
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'}`}>
      {/* Enhanced Navbar */}
      <nav className={`${darkMode ? 'bg-gray-800/80 backdrop-blur-md border-gray-700' : 'bg-white/80 backdrop-blur-md'} sticky top-0 z-40 shadow-lg border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
        <div className="max-w-full mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-xl ${darkMode ? 'bg-gradient-to-br from-blue-600 to-purple-600' : 'bg-gradient-to-br from-blue-500 to-blue-600'} shadow-lg`}>
                <HiOutlineViewGrid className="text-white text-xl" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  TaskFlow
                </h1>
                <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-500'} hidden sm:block`}>
                  Manage your tasks efficiently
                </p>
              </div>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-4">
              <div className={`flex items-center space-x-3 px-4 py-2 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-100'}`}>
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold shadow-lg">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="flex flex-col">
                  <span className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                    {user?.name || 'User'}
                  </span>
                  <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    Dashboard
                  </span>
                </div>
              </div>
              <button
                onClick={() => dispatch(toggleDarkMode())}
                className={`p-3 rounded-xl transition-all shadow-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' : 'bg-gradient-to-br from-gray-100 to-gray-50 hover:from-gray-200 hover:to-gray-100 text-gray-700'}`}
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {darkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
              </button>
              <button
                onClick={handleLogout}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl transition-all shadow-lg ${darkMode ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white' : 'bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 text-red-600'}`}
                title="Logout from TaskFlow"
              >
                <HiLogout className="text-lg" />
                <span className="font-semibold">Logout</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg ${darkMode ? 'text-white hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className={`md:hidden py-4 space-y-3 animate-slide-up`}>
              <div className={`flex items-center space-x-3 px-4 py-3 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-100'}`}>
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold shadow-lg">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="flex flex-col">
                  <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                    {user?.name || 'User'}
                  </span>
                  <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    Dashboard
                  </span>
                </div>
              </div>
              <button
                onClick={() => dispatch(toggleDarkMode())}
                className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl transition-all shadow-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' : 'bg-gradient-to-br from-gray-100 to-gray-50 hover:from-gray-200 hover:to-gray-100 text-gray-700'}`}
              >
                {darkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
                <span className="font-medium">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
              <button
                onClick={handleLogout}
                className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl transition-all shadow-lg ${darkMode ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white' : 'bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 text-red-600'}`}
              >
                <HiLogout size={18} />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          )}
        </div>
      </nav>

      <div className="max-w-full mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-8 animate-fade-in">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className={`p-6 rounded-2xl shadow-xl border-2 ${darkMode ? 'bg-gray-800 border-blue-500/30' : 'bg-white border-blue-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-semibold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>Total Tasks</p>
                <p className={`text-4xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{tasks.length}</p>
              </div>
              <div className={`p-4 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30`}>
                <HiOutlineClipboardCheck className="text-blue-600 dark:text-blue-400 text-3xl" />
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-2xl shadow-xl border-2 ${darkMode ? 'bg-gray-800 border-green-500/30' : 'bg-white border-green-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-semibold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>Completed</p>
                <p className={`text-4xl font-bold mt-2 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>{completedCount}</p>
              </div>
              <div className={`p-4 rounded-xl bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30`}>
                <FaCheckCircle className="text-green-600 dark:text-green-400 text-3xl" />
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-2xl shadow-xl border-2 ${darkMode ? 'bg-gray-800 border-orange-500/30' : 'bg-white border-orange-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-semibold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>Pending</p>
                <p className={`text-4xl font-bold mt-2 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>{pendingCount}</p>
              </div>
              <div className={`p-4 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30`}>
                <FaList className="text-orange-600 dark:text-orange-400 text-3xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg`}>
              <HiOutlineSparkles className="text-white text-2xl" />
            </div>
            <div>
              <h2 className={`text-3xl font-bold bg-gradient-to-r ${darkMode ? 'from-white to-gray-300' : 'from-gray-800 to-gray-600'} bg-clip-text text-transparent`}>
                My Tasks
              </h2>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                Manage and track your tasks efficiently
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-purple-700 text-white rounded-xl hover:from-blue-700 hover:via-purple-700 hover:to-purple-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
          >
            <FaPlus />
            <span>Add Task</span>
          </button>
        </div>

        <Filters />

        <AIInsights />

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
          </div>
        ) : (
          <TaskList tasks={tasks} onEdit={handleEdit} onDelete={handleDelete} />
        )}
      </div>

      {isModalOpen && (
        <TaskModal
          task={editingTask}
          isOpen={isModalOpen}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default Dashboard;

