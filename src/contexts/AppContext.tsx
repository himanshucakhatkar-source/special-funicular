import React, { createContext, useContext, useEffect } from 'react';
import { AppMode } from '../types';
import { useAuthStore } from '../stores/auth';
import { useAppStore } from '../stores/app';
import { authService } from '../services/auth.service';
import { tasksService } from '../services/tasks.service';
import { teamsService } from '../services/teams.service';
import { recognitionsService } from '../services/recognitions.service';

interface AppContextType {
  refreshData: () => Promise<void>;
  initializeApp: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, setLoading: setAuthLoading } = useAuthStore();
  const { mode, setMode, isLoading, setLoading } = useAppStore();

  // Initialize app
  const initializeApp = async () => {
    try {
      setAuthLoading(true);
      
      // Setup auth listener
      authService.setupAuthListener();
      
      // Create a timeout for the entire initialization process
      const initWithTimeout = Promise.race([
        authService.getCurrentUser(),
        new Promise<null>((_, reject) => {
          setTimeout(() => reject(new Error('Initialization timeout')), 8000);
        })
      ]);
      
      try {
        // Try to get current user with timeout
        const currentUser = await initWithTimeout;
        
        if (currentUser) {
          setMode('workspace');
          // Load initial data in the background, don't block UI
          refreshData().catch(error => {
            console.warn('Background data refresh failed:', error);
          });
        } else {
          setMode('marketing');
        }
      } catch (timeoutError) {
        console.warn('Auth initialization timed out, proceeding to marketing:', timeoutError);
        setMode('marketing');
      }
    } catch (error) {
      console.error('Error initializing app:', error);
      setMode('marketing');
    } finally {
      setAuthLoading(false);
    }
  };

  // Initialize on mount
  useEffect(() => {
    initializeApp();
  }, []);

  // Refresh all data from the backend
  const refreshData = async () => {
    if (isLoading) return; // Prevent multiple simultaneous calls
    if (!isAuthenticated) return;
    
    setLoading(true);
    
    try {
      // Create timeout wrapper for data fetching
      const withTimeout = <T,>(promise: Promise<T>, ms: number = 5000): Promise<T> => {
        return Promise.race([
          promise,
          new Promise<T>((_, reject) => {
            setTimeout(() => reject(new Error(`Data fetch timed out after ${ms}ms`)), ms);
          })
        ]);
      };

      // Fetch all data in parallel with timeouts
      const results = await Promise.allSettled([
        withTimeout(tasksService.fetchTasks(), 5000).catch(e => {
          console.warn('Tasks fetch failed:', e);
          return null;
        }),
        withTimeout(teamsService.fetchTeams(), 5000).catch(e => {
          console.warn('Teams fetch failed:', e);
          return null;
        }),
        withTimeout(recognitionsService.fetchRecognitions(), 5000).catch(e => {
          console.warn('Recognitions fetch failed:', e);
          return null;
        }),
      ]);

      // Log any failures for debugging
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          const serviceName = ['tasks', 'teams', 'recognitions'][index];
          console.warn(`${serviceName} service failed:`, result.reason);
        }
      });
    } catch (error) {
      console.error('Error refreshing data:', error);
      // Don't throw - let the UI handle the empty state
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        refreshData,
        initializeApp,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}