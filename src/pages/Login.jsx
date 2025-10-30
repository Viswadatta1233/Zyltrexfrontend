import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginSuccess, setLoading, setError, loginFailure } from '../store/slices/authSlice';
import { authAPI } from '../services/api';
import { FaEnvelope, FaLock, FaSignInAlt, FaCheck, FaRocket, FaUsers, FaEye, FaEyeSlash } from 'react-icons/fa';
import { HiOutlineLockClosed, HiOutlineMail, HiOutlineViewGrid, HiOutlineSparkles } from 'react-icons/hi';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.theme);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const authData = await authAPI.login(formData);
      localStorage.setItem('token', authData.token);
      const user = await authAPI.getCurrentUser();
      dispatch(loginSuccess({ token: authData.token, user }));
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Invalid credentials';
      dispatch(loginFailure(errorMessage));
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'}`}>
      <div className={`w-full max-w-full grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20`}>
        {/* Left Side - App Features */}
        <div className={`hidden lg:flex flex-col justify-center px-8`}>
          <div className="mb-8">
            <div className="inline-flex items-center space-x-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                <HiOutlineViewGrid className="text-white text-3xl" />
              </div>
              <h1 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                TaskFlow
              </h1>
            </div>
            <p className={`text-xl mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Manage your tasks efficiently with our powerful, intuitive platform
            </p>
          </div>

          <div className="space-y-4">
            <div className={`flex items-start space-x-4 p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-blue-50'}`}>
              <div className={`p-2 rounded-lg ${darkMode ? 'bg-blue-600' : 'bg-blue-100'}`}>
                <FaCheck className={`text-lg ${darkMode ? 'text-white' : 'text-blue-600'}`} />
              </div>
              <div>
                <h3 className={`font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Complete Task Management
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Create, organize, and track tasks with ease. Set deadlines, add descriptions, and mark progress.
                </p>
              </div>
            </div>

            <div className={`flex items-start space-x-4 p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-purple-50'}`}>
              <div className={`p-2 rounded-lg ${darkMode ? 'bg-purple-600' : 'bg-purple-100'}`}>
                <HiOutlineSparkles className={`text-lg ${darkMode ? 'text-white' : 'text-purple-600'}`} />
              </div>
              <div>
                <h3 className={`font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Smart Filters & Sorting
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Filter by status and deadline. Sort by date for better organization.
                </p>
              </div>
            </div>

            <div className={`flex items-start space-x-4 p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-green-50'}`}>
              <div className={`p-2 rounded-lg ${darkMode ? 'bg-green-600' : 'bg-green-100'}`}>
                <FaRocket className={`text-lg ${darkMode ? 'text-white' : 'text-green-600'}`} />
              </div>
              <div>
                <h3 className={`font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Powerful Dashboard
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Visual analytics and statistics. Monitor progress and stay on top of deadlines.
                </p>
              </div>
            </div>

            <div className={`flex items-start space-x-4 p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-orange-50'}`}>
              <div className={`p-2 rounded-lg ${darkMode ? 'bg-orange-600' : 'bg-orange-100'}`}>
                <FaUsers className={`text-lg ${darkMode ? 'text-white' : 'text-orange-600'}`} />
              </div>
              <div>
                <h3 className={`font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Secure & Reliable
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Your data is protected with enterprise-grade security. Access your tasks anywhere, anytime.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex items-center justify-center">
          <div className={`w-full max-w-md`}>
            {/* Mobile Logo Section */}
            <div className="lg:hidden text-center mb-8">
              <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg mb-4">
                <HiOutlineViewGrid className="text-white text-4xl" />
              </div>
              <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Welcome Back
              </h1>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Sign in to access your TaskFlow account
              </p>
            </div>

            {/* Form Card */}
            <div className={`p-10 rounded-2xl shadow-2xl ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
              <div className="hidden lg:block mb-6">
                <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Welcome Back
                </h2>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Sign in to continue to TaskFlow
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl flex items-center space-x-2">
                  <FaLock className="text-red-500" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <HiOutlineMail className={`text-lg ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                        darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <HiOutlineLockClosed className={`text-lg ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                        darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    >
                      {showPassword ? (
                        <FaEyeSlash className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      ) : (
                        <FaEye className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-2 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-base"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Logging in...</span>
                    </>
                  ) : (
                    <>
                      <FaSignInAlt />
                      <span>Sign In</span>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors">
                    Sign up now
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

