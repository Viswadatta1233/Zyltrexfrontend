/**
 * AI Service - Google Gemini Integration
 * 
 * Provides AI-powered task insights using Google's Gemini AI model.
 * Analyzes user task data and generates personalized productivity recommendations.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

// Get Gemini API key from environment variables (Vite requires VITE_ prefix)
// Falls back to undefined if not set (will cause API error, handled in catch block)
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Initialize Google Generative AI client
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Get the Gemini 2.0 Flash Experimental model instance
// This model is optimized for fast, cost-effective text generation
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

/**
 * Generates AI-powered productivity insights based on user's task data
 * 
 * This function:
 * 1. Analyzes task statistics (total, completed, pending, overdue)
 * 2. Identifies upcoming deadlines
 * 3. Constructs a prompt with task data
 * 4. Sends prompt to Gemini AI model
 * 5. Returns formatted insights and statistics
 * 
 * @param {Array} tasks - Array of task objects from the frontend
 * @returns {Object} - Object containing:
 *   - success: boolean indicating if request succeeded
 *   - insights: string containing AI-generated productivity tips (if success)
 *   - stats: object with task statistics (totalTasks, completedTasks, etc.)
 *   - error: string error message (if success is false)
 */
export const generateTaskInsights = async (tasks) => {
  try {
    // Calculate task statistics
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const pendingTasks = tasks.filter(t => !t.completed).length;
    
    // Count overdue tasks (past deadline and not completed)
    const overdueTasks = tasks.filter(t => {
      if (!t.deadline || t.completed) return false;
      return new Date(t.deadline) < new Date();
    }).length;
    
    // Get top 3 upcoming deadlines (sorted by date, only incomplete tasks)
    const upcomingDeadlines = tasks
      .filter(t => t.deadline && !t.completed)
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
      .slice(0, 3)
      .map(t => ({
        title: t.title,
        deadline: t.deadline,
        // Calculate days remaining until deadline
        daysLeft: Math.ceil((new Date(t.deadline) - new Date()) / (1000 * 60 * 60 * 24))
      }));

    // Construct prompt for Gemini AI
    // The prompt instructs the AI to act as a productivity coach and provide actionable insights
    const prompt = `You are a productivity coach providing task management insights. Based on the following user's task data, provide 3-4 specific, actionable insights to help them improve productivity:

Task Statistics:
- Total Tasks: ${totalTasks}
- Completed: ${completedTasks}
- Pending: ${pendingTasks}
- Overdue: ${overdueTasks}

${upcomingDeadlines.length > 0 ? `Upcoming Deadlines:\n${upcomingDeadlines.map(t => `- "${t.title}" in ${t.daysLeft} day(s)`).join('\n')}` : 'No upcoming deadlines'}

Tasks List:
${tasks.map((t, i) => `${i + 1}. ${t.title} - ${t.completed ? 'Completed' : 'Pending'} ${t.deadline ? `(Due: ${new Date(t.deadline).toLocaleDateString()})` : ''}`).join('\n')}

Please provide:
1. Specific productivity suggestions based on their current task load
2. Tips to handle overdue tasks if any
3. Deadlines management recommendations
4. General task organization advice

Keep the response concise, friendly, and actionable. Format each insight as a bullet point.`;

    // Generate content using Gemini AI model
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text(); // Extract text from AI response
    
    // Return success response with insights and statistics
    return {
      success: true,
      insights: text, // AI-generated productivity recommendations
      stats: {
        totalTasks,
        completedTasks,
        pendingTasks,
        overdueTasks,
        // Calculate completion percentage
        completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
      }
    };
  } catch (error) {
    // Handle errors (API key missing, network issues, rate limits, etc.)
    console.error('Error generating AI insights:', error);
    return {
      success: false,
      error: error.message || 'Failed to generate insights'
    };
  }
};

