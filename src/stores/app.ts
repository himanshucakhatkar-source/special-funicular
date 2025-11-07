import { create } from 'zustand';
import { Task, Team, Recognition } from '../types';

interface AppState {
  // UI State
  currentView: string;
  mode: 'marketing' | 'tutorial' | 'workspace';
  tutorialStep: number;
  isLoading: boolean;

  // Data State
  tasks: Task[];
  teams: Team[];
  recognitions: Recognition[];
  
  // Actions
  setCurrentView: (view: string) => void;
  setMode: (mode: 'marketing' | 'tutorial' | 'workspace') => void;
  setTutorialStep: (step: number) => void;
  setLoading: (loading: boolean) => void;
  setTasks: (tasks: Task[]) => void;
  setTeams: (teams: Team[]) => void;
  setRecognitions: (recognitions: Recognition[]) => void;
  
  // Task actions
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  
  // Team actions
  addTeam: (team: Team) => void;
  updateTeam: (id: string, updates: Partial<Team>) => void;
  deleteTeam: (id: string) => void;
  
  // Recognition actions
  addRecognition: (recognition: Recognition) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // UI State
  currentView: 'dashboard',
  mode: 'marketing',
  tutorialStep: 1,
  isLoading: false,

  // Data State
  tasks: [],
  teams: [],
  recognitions: [],

  // Actions
  setCurrentView: (currentView) => set({ currentView }),
  setMode: (mode) => set({ mode }),
  setTutorialStep: (tutorialStep) => set({ tutorialStep }),
  setLoading: (isLoading) => set({ isLoading }),
  setTasks: (tasks) => set({ tasks }),
  setTeams: (teams) => set({ teams }),
  setRecognitions: (recognitions) => set({ recognitions }),

  // Task actions
  addTask: (task) => set((state) => ({ 
    tasks: [...state.tasks, task] 
  })),
  
  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map(task => 
      task.id === id ? { ...task, ...updates } : task
    )
  })),
  
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter(task => task.id !== id)
  })),

  // Team actions
  addTeam: (team) => set((state) => ({ 
    teams: [...state.teams, team] 
  })),
  
  updateTeam: (id, updates) => set((state) => ({
    teams: state.teams.map(team => 
      team.id === id ? { ...team, ...updates } : team
    )
  })),
  
  deleteTeam: (id) => set((state) => ({
    teams: state.teams.filter(team => team.id !== id)
  })),

  // Recognition actions
  addRecognition: (recognition) => set((state) => ({ 
    recognitions: [...state.recognitions, recognition] 
  })),
}));