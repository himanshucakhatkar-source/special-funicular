import React from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Users, 
  BarChart3, 
  Search,
  Trophy,
  Coins,
  Settings,
  Sparkles,
  KanbanSquare,
  Palette,
  Zap
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { useHonourus } from '../../hooks/useHonourus';
import { Logo } from '../ui/logo';

interface WorkspaceSidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  onClose?: () => void;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

interface NavItem {
  id: string;
  icon: React.ComponentType<any>;
  label: string;
  badge?: string | number | null;
  description?: string;
  gradient?: string;
}

export function WorkspaceSidebar({ currentView, onViewChange, onClose }: WorkspaceSidebarProps) {
  const { user, tasks, recognitions } = useHonourus();

  const pendingTasks = tasks.filter(task => task.status !== 'completed').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
  const recentRecognitions = recognitions.filter(r => r.toUserId === user?.id).length;

  // Core Features - Main workspace functionality
  const coreFeatures: NavItem[] = [
    { 
      id: 'dashboard', 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      description: 'Overview & insights',
      gradient: 'from-blue-500 to-cyan-500'
    },
    { 
      id: 'tasks', 
      icon: KanbanSquare, 
      label: 'Task Board', 
      badge: pendingTasks > 0 ? pendingTasks : null,
      description: 'Kanban workflow',
      gradient: 'from-purple-500 to-pink-500'
    },
    { 
      id: 'credits', 
      icon: Coins, 
      label: 'Credits & Rewards', 
      description: 'Recognition system',
      gradient: 'from-emerald-500 to-teal-500'
    },
    { 
      id: 'analytics', 
      icon: BarChart3, 
      label: 'Analytics', 
      description: 'Performance insights',
      gradient: 'from-amber-500 to-orange-500'
    },
  ];

  // Team & Collaboration
  const teamFeatures: NavItem[] = [
    { 
      id: 'teams', 
      icon: Users, 
      label: 'Teams', 
      description: 'Manage teams'
    },
    { 
      id: 'recognition', 
      icon: Trophy, 
      label: 'Recognition', 
      badge: recentRecognitions > 0 ? recentRecognitions : null,
      description: 'Peer recognition'
    },
  ];

  // Tools
  const toolFeatures: NavItem[] = [
    { 
      id: 'search', 
      icon: Search, 
      label: 'Search', 
      description: 'Find anything'
    },
    { 
      id: 'showcase', 
      icon: Sparkles, 
      label: 'UI Components', 
      badge: 'NEW',
      description: 'Component library'
    },
  ];

  const navSections: NavSection[] = [
    { title: 'Core Features', items: coreFeatures },
    { title: 'Team & Collaboration', items: teamFeatures },
    { title: 'Tools', items: toolFeatures },
  ];



  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-full shadow-xl lg:shadow-none">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border flex-shrink-0">
        <div className="flex items-center gap-3">
          <Logo size="sm" showText={false} />
          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-sidebar-foreground">Honourus</h1>
            <p className="text-xs text-sidebar-foreground/60 truncate">{user?.department || 'Workspace'}</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 min-h-0">
        <div className="p-3 space-y-6">
          {/* Navigation Sections */}
          {navSections.map((section, sectionIndex) => (
            <div key={section.title}>
              {/* Section Title */}
              <div className="px-3 mb-2">
                <h3 className="text-xs uppercase tracking-wider text-sidebar-foreground/50">
                  {section.title}
                </h3>
              </div>
              
              {/* Section Items */}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = currentView === item.id;
                  const Icon = item.icon;
                  
                  return (
                    <Button
                      key={item.id}
                      variant={isActive ? "default" : "ghost"}
                      className={`w-full justify-start gap-3 h-auto py-2.5 px-3 group relative ${
                        isActive ? 'shadow-md' : ''
                      }`}
                      onClick={() => {
                        onViewChange(item.id);
                        onClose?.();
                      }}
                    >
                      {/* Gradient indicator for core features when active */}
                      {item.gradient && isActive && (
                        <div 
                          className={`absolute left-0 top-0 bottom-0 w-1 rounded-r-full bg-gradient-to-b ${item.gradient}`}
                        />
                      )}
                      
                      {/* Icon with gradient background for core features */}
                      <div className={`flex-shrink-0 ${
                        item.gradient && isActive
                          ? `h-8 w-8 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center`
                          : ''
                      }`}>
                        <Icon className={`h-4 w-4 ${
                          item.gradient && isActive ? 'text-white' : ''
                        }`} />
                      </div>
                      
                      {/* Label and description */}
                      <div className="flex-1 text-left min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="truncate">{item.label}</span>
                          {item.badge && (
                            <Badge 
                              variant={isActive ? "secondary" : "outline"} 
                              className="h-5 text-xs shrink-0"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-xs text-sidebar-foreground/60 truncate mt-0.5">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </Button>
                  );
                })}
              </div>
              
              {/* Separator between sections */}
              {sectionIndex < navSections.length - 1 && (
                <Separator className="mt-4 mb-2" />
              )}
            </div>
          ))}

          {/* Quick Stats Card */}
          <div className="px-3 mt-4">
            <div className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-primary" />
                <h4 className="text-sm text-sidebar-foreground">Quick Stats</h4>
              </div>
              <div className="space-y-1 text-xs text-sidebar-foreground/70">
                <div className="flex justify-between">
                  <span>Active Tasks</span>
                  <span className="text-sidebar-foreground">{pendingTasks}</span>
                </div>
                <div className="flex justify-between">
                  <span>In Progress</span>
                  <span className="text-sidebar-foreground">{inProgressTasks}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Credits</span>
                  <span className="text-sidebar-foreground">{user?.credits || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Settings & User Info */}
      <div className="border-t border-sidebar-border flex-shrink-0">
        <div className="p-4">
          <Button
            variant={currentView === 'settings' ? "default" : "ghost"}
            className="w-full justify-start gap-3"
            onClick={() => {
              onViewChange('settings');
              onClose?.();
            }}
          >
            <Settings className="h-4 w-4" />
            <span className="flex-1 text-left">Settings</span>
          </Button>
        </div>
        
        <div className="px-4 pb-4">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-sidebar-accent">
            <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium flex-shrink-0">
              {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.name}</p>
              <p className="text-xs text-sidebar-foreground/60 truncate">{user?.credits || 0} credits</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}