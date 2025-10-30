import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { generateTaskInsights } from '../services/aiService';
import { FaRobot, FaBrain, FaLightbulb, FaChartLine, FaCheckCircle } from 'react-icons/fa';
import { HiOutlineSparkles } from 'react-icons/hi';

const AIInsights = () => {
  const { tasks } = useSelector((state) => state.tasks);
  const { darkMode } = useSelector((state) => state.theme);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Parse AI response into structured format
  const parsedInsights = useMemo(() => {
    if (!insights?.insights) return null;
    
    const text = insights.insights;
    const insightsArray = [];
    
    // Split by bullet points (lines starting with *)
    const bulletPoints = text.split(/\n(?=\*)/).filter(line => line.trim());
    
    bulletPoints.forEach(point => {
      const trimmed = point.trim();
      
      // Skip empty lines and intro text
      if (!trimmed || trimmed.startsWith('Okay') || trimmed.toLowerCase().includes('here are some insights')) {
        return;
      }
      
      // Extract title and content from patterns like "* **Title:** content" or "* **Title** content"
      const match = trimmed.match(/\*\s*\*\*(.*?)\*\*\s*:?\s*(.*)/);
      
      if (match) {
        const title = match[1].trim().replace(/^\d+\.\s*/, ''); // Remove leading numbers if any
        const content = match[2].trim();
        
        // Clean content - remove extra asterisks
        const cleanContent = content
          .replace(/\*\*/g, '') // Remove all bold markers
          .replace(/\*/g, '') // Remove bullet markers
          .trim();
        
        if (title && cleanContent) {
          insightsArray.push({ title, content: [cleanContent] });
        }
      }
    });
    
    return insightsArray;
  }, [insights]);

  const handleGetInsights = async () => {
    if (tasks.length === 0) {
      setError('Please add some tasks first to get AI insights.');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const result = await generateTaskInsights(tasks);
      if (result.success) {
        setInsights(result);
      } else {
        setError(result.error || 'Failed to generate insights');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`p-4 sm:p-6 rounded-2xl shadow-xl mb-6 border-2 ${darkMode ? 'bg-gray-800 border-purple-500/30' : 'bg-white border-purple-200'}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg`}>
            <FaBrain className="text-white text-xl sm:text-2xl" />
          </div>
          <div>
            <h3 className={`text-lg sm:text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              AI Insights
            </h3>
            <p className={`text-xs sm:text-sm hidden sm:block ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Get personalized productivity recommendations
            </p>
          </div>
        </div>
        <button
          onClick={handleGetInsights}
          disabled={loading || tasks.length === 0}
          className={`w-full sm:w-auto flex items-center justify-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
            darkMode
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
          }`}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              <span className="text-sm sm:text-base">Analyzing...</span>
            </>
          ) : (
            <>
              <HiOutlineSparkles className="text-lg sm:text-xl" />
              <span className="text-sm sm:text-base">Get Insights</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className={`mt-4 p-4 rounded-xl ${darkMode ? 'bg-red-900/20 border border-red-800' : 'bg-red-50 border border-red-200'}`}>
          <p className={`text-sm ${darkMode ? 'text-red-300' : 'text-red-700'}`}>{error}</p>
        </div>
      )}

      {insights && (
        <div className={`mt-4 p-4 sm:p-6 rounded-xl ${darkMode ? 'bg-gray-700/50 border border-gray-600' : 'bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200'}`}>
          {/* Stats Summary */}
          {insights.stats && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 mb-6">
              <div className={`text-center p-2 sm:p-3 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total</p>
                <p className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{insights.stats.totalTasks}</p>
              </div>
              <div className={`text-center p-2 sm:p-3 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Completed</p>
                <p className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>{insights.stats.completedTasks}</p>
              </div>
              <div className={`text-center p-2 sm:p-3 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Pending</p>
                <p className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>{insights.stats.pendingTasks}</p>
              </div>
              <div className={`text-center p-2 sm:p-3 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Overdue</p>
                <p className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-red-400' : 'text-red-600'}`}>{insights.stats.overdueTasks}</p>
              </div>
              <div className={`text-center p-2 sm:p-3 rounded-xl col-span-2 sm:col-span-1 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Rate</p>
                <p className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{insights.stats.completionRate}%</p>
              </div>
            </div>
          )}

          {/* AI Insights */}
          <div className={`p-3 sm:p-4 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-white'}`}>
            <div className="flex items-center space-x-2 sm:space-x-3 mb-4">
              <div className={`p-1.5 sm:p-2 rounded-lg ${darkMode ? 'bg-purple-600' : 'bg-purple-100'}`}>
                <FaLightbulb className={`text-base sm:text-lg ${darkMode ? 'text-white' : 'text-purple-600'}`} />
              </div>
              <h4 className={`text-base sm:text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                <FaRobot className="hidden sm:inline mr-2" />
                <span className="sm:hidden">AI Tips</span>
                <span className="hidden sm:inline">Personalized Recommendations</span>
              </h4>
            </div>
            
            {parsedInsights && parsedInsights.length > 0 && (
              <div className="space-y-2 sm:space-y-3">
                {parsedInsights.map((insight, index) => {
                  const colors = [
                    { bg: 'from-blue-500 to-blue-600', icon: 'bg-blue-600', lightIcon: 'bg-blue-100', text: 'text-blue-600' },
                    { bg: 'from-purple-500 to-purple-600', icon: 'bg-purple-600', lightIcon: 'bg-purple-100', text: 'text-purple-600' },
                    { bg: 'from-pink-500 to-pink-600', icon: 'bg-pink-600', lightIcon: 'bg-pink-100', text: 'text-pink-600' },
                    { bg: 'from-green-500 to-green-600', icon: 'bg-green-600', lightIcon: 'bg-green-100', text: 'text-green-600' },
                    { bg: 'from-orange-500 to-orange-600', icon: 'bg-orange-600', lightIcon: 'bg-orange-100', text: 'text-orange-600' },
                  ];
                  const colorScheme = colors[index % colors.length];
                  
                  return (
                    <div
                      key={index}
                      className={`relative p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl border-l-4 transition-all shadow-md sm:shadow-lg hover:shadow-lg sm:hover:shadow-xl ${
                        darkMode
                          ? `bg-gradient-to-r from-gray-800/50 to-gray-800/30 border-${colorScheme.icon.split('-')[1]}-600`
                          : 'bg-white'
                      }`}
                      style={{
                        borderLeftColor: darkMode 
                          ? undefined 
                          : colorScheme.text === 'text-blue-600' ? '#2563eb' :
                            colorScheme.text === 'text-purple-600' ? '#9333ea' :
                            colorScheme.text === 'text-pink-600' ? '#db2777' :
                            colorScheme.text === 'text-green-600' ? '#16a34a' :
                            '#ea580c'
                      }}
                    >
                      <div className="flex items-start space-x-2 sm:space-x-3 md:space-x-4">
                        <div className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-gradient-to-br ${colorScheme.bg} flex-shrink-0 shadow-sm sm:shadow-md`}>
                          <FaCheckCircle className="text-white text-xs sm:text-sm" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className={`font-bold text-sm sm:text-base mb-1 sm:mb-2 break-words ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            {insight.title}
                          </h5>
                          <div className="space-y-1 sm:space-y-2">
                            {insight.content.map((line, lineIndex) => (
                              <p
                                key={lineIndex}
                                className={`text-xs sm:text-sm leading-relaxed break-words ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
                              >
                                {line}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInsights;

