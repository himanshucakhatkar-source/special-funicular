import React, { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WorkspaceSidebar } from './WorkspaceSidebar';
import { WorkspaceHeader } from './WorkspaceHeader';
import { CommandPalette } from './CommandPalette';
import { NavigationBreadcrumbs } from './NavigationBreadcrumbs';
import { KeyboardShortcutsHelper } from './KeyboardShortcutsHelper';
import { DashboardView } from './views/DashboardView';
import { Loading } from '../ui/loading';
import { LoadingBar } from '../ui/loading-bar';
import { 
  DashboardSkeleton, 
  TasksSkeleton, 
  TeamsSkeleton, 
  AnalyticsSkeleton, 
  SettingsSkeleton,
  ContentSkeleton 
} from '../ui/skeleton-loader';
import { useHonourus } from '../../hooks/useHonourus';
import { useRecentItems } from '../../hooks/useRecentItems';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { DemoModeIndicator } from './DemoModeIndicator';
import { DemoModeNotice } from './DemoModeNotice';
import { PerformanceMonitor } from './PerformanceMonitor';
import { OfflineIndicator } from './OfflineIndicator';
import { TasksErrorBoundary } from './TasksErrorBoundary';

// Lazy load heavy views for better performance
const TasksView = lazy(() => import('./views/TasksView').then(m => ({ default: m.TasksView })));
const TeamsView = lazy(() => import('./views/TeamsView').then(m => ({ default: m.TeamsView })));
const AnalyticsView = lazy(() => import('./views/AnalyticsView').then(m => ({ default: m.AnalyticsView })));
const RecognitionView = lazy(() => import('./views/RecognitionView').then(m => ({ default: m.RecognitionView })));
const SearchView = lazy(() => import('./views/SearchView').then(m => ({ default: m.SearchView })));
const CreditsView = lazy(() => import('./views/CreditsView').then(m => ({ default: m.CreditsView })));
const SettingsView = lazy(() => import('./views/SettingsView').then(m => ({ default: m.SettingsView })));
const ShowcaseView = lazy(() => import('./views/ShowcaseView').then(m => ({ default: m.ShowcaseView })));

export function WorkspacePage() {
  const { currentView, setCurrentView, isLoading } = useHonourus();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const { addRecentItem } = useRecentItems();

  // Close sidebar on mobile when view changes
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [currentView]);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true); // Always show on desktop
      } else {
        setSidebarOpen(false); // Collapsed on mobile by default
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen && window.innerWidth < 1024) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  // Track recent views
  useEffect(() => {
    const viewNames: Record<string, string> = {
      dashboard: 'Dashboard',
      tasks: 'Tasks',
      teams: 'Teams',
      analytics: 'Analytics',
      recognition: 'Recognition',
      search: 'Search',
      credits: 'Credits',
      settings: 'Settings',
    };

    if (viewNames[currentView]) {
      addRecentItem({
        id: currentView,
        type: 'view',
        name: viewNames[currentView],
      });
    }
  }, [currentView, addRecentItem]);

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 'k',
      meta: true,
      description: 'Open command palette',
      action: () => setCommandPaletteOpen(true),
    },
    {
      key: 'k',
      ctrl: true,
      description: 'Open command palette',
      action: () => setCommandPaletteOpen(true),
    },
    {
      key: '/',
      ctrl: true,
      description: 'Search',
      action: () => setCurrentView('search'),
    },
    {
      key: ',',
      ctrl: true,
      description: 'Settings',
      action: () => setCurrentView('settings'),
    },
    {
      key: '1',
      ctrl: true,
      description: 'Dashboard',
      action: () => setCurrentView('dashboard'),
    },
    {
      key: '2',
      ctrl: true,
      description: 'Tasks',
      action: () => setCurrentView('tasks'),
    },
    {
      key: '3',
      ctrl: true,
      description: 'Teams',
      action: () => setCurrentView('teams'),
    },
    {
      key: '4',
      ctrl: true,
      description: 'Analytics',
      action: () => setCurrentView('analytics'),
    },
    {
      key: '5',
      ctrl: true,
      description: 'Recognition',
      action: () => setCurrentView('recognition'),
    },
    {
      key: '6',
      ctrl: true,
      description: 'Credits',
      action: () => setCurrentView('credits'),
    },
    {
      key: 'b',
      ctrl: true,
      description: 'Toggle sidebar',
      action: () => setSidebarOpen(!sidebarOpen),
    },
    {
      key: '?',
      description: 'Show keyboard shortcuts',
      action: () => setShortcutsOpen(true),
    },
  ]);

  const renderView = () => {
    const viewMap: Record<string, { component: JSX.Element; skeleton: JSX.Element }> = {
      dashboard: {
        component: <DashboardView onViewChange={setCurrentView} />,
        skeleton: <DashboardSkeleton />,
      },
      tasks: {
        component: (
          <TasksErrorBoundary>
            <TasksView />
          </TasksErrorBoundary>
        ),
        skeleton: <TasksSkeleton />,
      },
      teams: {
        component: <TeamsView />,
        skeleton: <TeamsSkeleton />,
      },
      analytics: {
        component: <AnalyticsView />,
        skeleton: <AnalyticsSkeleton />,
      },
      recognition: {
        component: <RecognitionView />,
        skeleton: <ContentSkeleton />,
      },
      search: {
        component: <SearchView />,
        skeleton: <ContentSkeleton />,
      },
      credits: {
        component: <CreditsView />,
        skeleton: <ContentSkeleton />,
      },
      settings: {
        component: <SettingsView />,
        skeleton: <SettingsSkeleton />,
      },
      showcase: {
        component: <ShowcaseView />,
        skeleton: <ContentSkeleton />,
      },
    };

    const view = viewMap[currentView];

    if (view) {
      return (
        <Suspense fallback={view.skeleton}>
          {view.component}
        </Suspense>
      );
    }

    // Handle custom views
    if (currentView.startsWith('channel-')) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">
              #{currentView.replace('channel-', '')} Channel
            </h2>
            <p className="text-muted-foreground">
              Channel communication feature coming soon!
            </p>
          </div>
        </div>
      );
    }

    // Default to dashboard
    return <DashboardView onViewChange={setCurrentView} />;
  };

  return (
    <div className="h-screen flex bg-background relative">
      {/* Demo Mode Indicator */}
      <DemoModeIndicator />
      
      {/* Backdrop Overlay - only on mobile when sidebar is open */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Collapsible on mobile, always visible on desktop */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed lg:relative z-50 h-full"
          >
            <WorkspaceSidebar 
              currentView={currentView} 
              onViewChange={setCurrentView}
              onClose={() => setSidebarOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <WorkspaceHeader 
          currentView={currentView} 
          onViewChange={setCurrentView}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        />
        
        {/* Breadcrumbs */}
        <div className="px-4 sm:px-6 py-3 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex-shrink-0">
          <NavigationBreadcrumbs 
            currentView={currentView}
            onNavigate={setCurrentView}
          />
        </div>
        
        <main className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto custom-scrollbar">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loading message="Loading workspace data..." />
              </div>
            ) : (
              <div className="h-full">
                {renderView()}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Command Palette */}
      <CommandPalette 
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />

      {/* Keyboard Shortcuts Helper */}
      <KeyboardShortcutsHelper 
        isOpen={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
      />

      {/* Performance Monitor */}
      <PerformanceMonitor />

      {/* Offline Indicator */}
      <OfflineIndicator />

      {/* Demo Mode Notice */}
      <DemoModeNotice />
    </div>
  );
}