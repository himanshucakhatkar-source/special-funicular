import { useAuthStore } from '../stores/auth';
import { useAppStore } from '../stores/app';
import { useAppContext } from '../contexts/AppContext';

// Main hook that combines auth and app state for easy access
export function useHonourus() {
  const context = useAppContext();

  const auth = useAuthStore();
  const app = useAppStore();

  return {
    // Auth state
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    isAuthLoading: auth.isLoading,
    
    // App state
    mode: app.mode,
    setMode: app.setMode,
    currentView: app.currentView,
    setCurrentView: app.setCurrentView,
    tutorialStep: app.tutorialStep,
    setTutorialStep: app.setTutorialStep,
    isLoading: app.isLoading,
    setLoading: app.setLoading,
    
    // Data
    tasks: app.tasks,
    teams: app.teams,
    recognitions: app.recognitions,
    
    // Data actions
    setTasks: app.setTasks,
    setTeams: app.setTeams,
    setRecognitions: app.setRecognitions,
    addTask: app.addTask,
    updateTask: app.updateTask,
    deleteTask: app.deleteTask,
    addTeam: app.addTeam,
    updateTeam: app.updateTeam,
    deleteTeam: app.deleteTeam,
    addRecognition: app.addRecognition,
    
    // Context methods
    refreshData: context.refreshData,
    initializeApp: context.initializeApp,
    
    // Auth actions (from store)
    setUser: auth.setUser,
    setAccessToken: auth.setAccessToken,
    logout: auth.logout,
  };
}

// Convenience hooks for specific features
export function useAuth() {
  return useAuthStore();
}

export function useApp() {
  return useAppStore();
}

export function useTasks() {
  const { tasks, addTask, updateTask, deleteTask } = useAppStore();
  return { tasks, addTask, updateTask, deleteTask };
}

export function useTeams() {
  const { teams, addTeam, updateTeam, deleteTeam } = useAppStore();
  return { teams, addTeam, updateTeam, deleteTeam };
}