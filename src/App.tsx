import React from 'react';
import { AppProvider } from './contexts/AppContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { MarketingPage } from './components/marketing/MarketingPage';
import { TutorialPage } from './components/tutorial/TutorialPage';
import { WorkspacePage } from './components/workspace/WorkspacePage';
import { useHonourus } from './hooks/useHonourus';
import { Toaster } from './components/ui/sonner';
import { ErrorBoundary } from './components/ui/error-boundary';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ThemeDecorations } from './components/ui/theme-decorations';

function AppContent() {
  const { mode } = useHonourus();

  const renderCurrentMode = () => {
    try {
      switch (mode) {
        case 'marketing':
          return <MarketingPage />;
        case 'tutorial':
          return (
            <ProtectedRoute>
              <TutorialPage />
            </ProtectedRoute>
          );
        case 'workspace':
          return (
            <ProtectedRoute>
              <WorkspacePage />
            </ProtectedRoute>
          );
        default:
          return <MarketingPage />;
      }
    } catch (error) {
      console.error('Error rendering page:', error);
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
            <p className="text-muted-foreground mb-4">Please refresh the page to try again.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-foreground relative">
      {/* Theme Decorations Layer - Always behind content */}
      <ThemeDecorations />
      
      <React.Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading Honourus...</p>
          </div>
        </div>
      }>
        {renderCurrentMode()}
      </React.Suspense>
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}