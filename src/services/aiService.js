import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

export const generateTaskInsights = async (tasks) => {
  try {
    // Analyze tasks data
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const pendingTasks = tasks.filter(t => !t.completed).length;
    const overdueTasks = tasks.filter(t => {
      if (!t.deadline || t.completed) return false;
      return new Date(t.deadline) < new Date();
    }).length;
    
    const upcomingDeadlines = tasks
      .filter(t => t.deadline && !t.completed)
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
      .slice(0, 3)
      .map(t => ({
        title: t.title,
        deadline: t.deadline,
        daysLeft: Math.ceil((new Date(t.deadline) - new Date()) / (1000 * 60 * 60 * 24))
      }));

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

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    return {
      success: true,
      insights: text,
      stats: {
        totalTasks,
        completedTasks,
        pendingTasks,
        overdueTasks,
        completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
      }
    };
  } catch (error) {
    console.error('Error generating AI insights:', error);
    return {
      success: false,
      error: error.message || 'Failed to generate insights'
    };
  }
};

