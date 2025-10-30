# Zylentrix TaskFlow - Enterprise Task Manager

A professional, enterprise-grade task management application built with React, Redux Toolkit, and Tailwind CSS, featuring a beautiful modern UI and seamless integration with the Zylentrix backend API.

## Features

- 🔐 **Secure Authentication**: JWT-based login/signup with protected routes
- 📋 **Complete Task Management**: Full CRUD operations with real-time updates
- 🤖 **AI-Powered Insights**: Get personalized productivity recommendations using Google Gemini
- 🎨 **Dark Mode Toggle**: Seamless light/dark theme switching
- 📊 **Dashboard Analytics**: Task statistics with visual cards
- 🔍 **Advanced Filtering**: Filter by status (completed/pending) and deadline
- 📈 **Smart Sorting**: Sort by creation date or deadline
- 📄 **Pagination**: Efficient task navigation with customizable page sizes
- 💾 **Persistent Storage**: Auto-save authentication and preferences
- 📱 **Fully Responsive**: Mobile-first design that works on all devices
- ⚡ **Performance Optimized**: Redux Toolkit for efficient state management
- 🎯 **Enterprise UI**: Modern design with icons, animations, and professional aesthetics

## Tech Stack

- **React 19** - UI framework
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **React Icons** - Icon set
- **Google Gemini AI** - AI insights generation
- **Vite** - Build tool and dev server

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Filters.jsx     # Task filtering component
│   ├── Pagination.jsx  # Pagination controls
│   ├── ProtectedRoute.jsx  # Route protection
│   ├── TaskList.jsx    # Task display component
│   └── TaskModal.jsx   # Task create/edit modal
├── pages/              # Page components
│   ├── Dashboard.jsx   # Main dashboard
│   ├── Login.jsx       # Login page
│   └── Signup.jsx      # Signup page
├── services/           # API service layer
│   └── api.js         # Axios configuration and API calls
├── store/             # Redux store
│   ├── slices/        # Redux slices
│   │   ├── authSlice.js   # Authentication state
│   │   ├── tasksSlice.js  # Tasks state
│   │   └── themeSlice.js  # Theme state
│   └── store.js       # Store configuration
├── App.jsx            # Main app component
├── main.jsx           # Entry point
└── index.css          # Global styles
```

## Backend API

The frontend connects to the Zylentrix backend API:
- Base URL: `https://zylentrix-backend.onrender.com`
- Authentication: JWT Bearer token
- Endpoints: Login, Signup, Tasks CRUD

## Usage

1. **Sign Up**: Create a new account
2. **Login**: Access your dashboard
3. **Create Tasks**: Click "Add Task" to create new tasks
4. **Edit Tasks**: Click the edit icon on any task card
5. **Delete Tasks**: Click the delete icon on any task card
6. **Filter**: Use the filter dropdowns to find specific tasks
7. **Sort**: Click on sort buttons to organize tasks
8. **Toggle Dark Mode**: Click the moon/sun icon in the navbar
9. **Logout**: Click the logout icon to sign out

## Build for Production

```bash
npm run build
```

The optimized files will be in the `dist` directory.

## Deployment to Vercel

This project is configured for deployment to Vercel.

### Prerequisites
- A Vercel account
- Git repository (GitHub, GitLab, or Bitbucket)

### Deployment Steps

1. **Push to Git**: Ensure your code is committed and pushed to your Git repository

2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your Git repository

3. **Configure Environment Variables** (optional):
   - Go to Project Settings → Environment Variables
   - Add: `VITE_GEMINI_API_KEY` = `your_gemini_api_key`
   - This is optional as the API key has a fallback in the code

4. **Deploy**:
   - Vercel will auto-detect Vite configuration
   - Click "Deploy"
   - Wait for the build to complete

5. **Access Your App**:
   - Your app will be live at `https://your-project.vercel.app`

### Alternative: Command Line Deployment

```bash
# Install Vercel CLI globally
npm i -g vercel

# Navigate to project directory
cd zylentrex

# Deploy
vercel

# Follow the prompts to complete deployment
```

### Build Configuration

The project includes `vercel.json` with the following settings:
- Build Command: `npm run build`
- Output Directory: `dist`
- Framework: Vite
- SPA Routing: All routes redirect to `/index.html`

## Environment Variables

Create a `.env` file in the root directory (optional):

```
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

**Note**: The Gemini API key is already set with a fallback value in the code. Only add this environment variable if you want to use a different API key.
