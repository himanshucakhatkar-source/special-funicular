import React, { useState, useEffect } from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '../ui/command';
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  BarChart3,
  Trophy,
  Search,
  Settings,
  Coins,
  Palette,
  Plus,
  Clock,
  TrendingUp,
  Award,
  Zap,
} from 'lucide-react';
import { useHonourus } from '../../hooks/useHonourus';
import { useTheme, themes } from '../../contexts/ThemeContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const { setCurrentView, tasks, teams, user } = useHonourus();
  const { setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  // Get recent tasks (last 5)
  const recentTasks = tasks
    .filter(task => task.status !== 'completed')
    .slice(0, 5);

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    onClose();
    setSearchQuery('');
  };

  const handleThemeChange = (themeId: string) => {
    setTheme(themeId);
    onClose();
    setSearchQuery('');
  };

  // Close on escape
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [onClose]);

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <CommandInput 
        placeholder="Type a command or search..." 
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {/* Navigation */}
        <CommandGroup heading="Navigate">
          <CommandItem onSelect={() => handleNavigate('dashboard')}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
            <span className="ml-auto text-xs text-muted-foreground">Ctrl+1</span>
          </CommandItem>
          <CommandItem onSelect={() => handleNavigate('tasks')}>
            <CheckSquare className="mr-2 h-4 w-4" />
            <span>Tasks</span>
            <span className="ml-auto text-xs text-muted-foreground">Ctrl+2</span>
          </CommandItem>
          <CommandItem onSelect={() => handleNavigate('teams')}>
            <Users className="mr-2 h-4 w-4" />
            <span>Teams</span>
            <span className="ml-auto text-xs text-muted-foreground">Ctrl+3</span>
          </CommandItem>
          <CommandItem onSelect={() => handleNavigate('analytics')}>
            <BarChart3 className="mr-2 h-4 w-4" />
            <span>Analytics</span>
            <span className="ml-auto text-xs text-muted-foreground">Ctrl+4</span>
          </CommandItem>
          <CommandItem onSelect={() => handleNavigate('recognition')}>
            <Trophy className="mr-2 h-4 w-4" />
            <span>Recognition</span>
            <span className="ml-auto text-xs text-muted-foreground">Ctrl+5</span>
          </CommandItem>
          <CommandItem onSelect={() => handleNavigate('credits')}>
            <Coins className="mr-2 h-4 w-4" />
            <span>Credits</span>
            <span className="ml-auto text-xs text-muted-foreground">Ctrl+6</span>
          </CommandItem>
          <CommandItem onSelect={() => handleNavigate('search')}>
            <Search className="mr-2 h-4 w-4" />
            <span>Search</span>
            <span className="ml-auto text-xs text-muted-foreground">Ctrl+/</span>
          </CommandItem>
          <CommandItem onSelect={() => handleNavigate('settings')}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
            <span className="ml-auto text-xs text-muted-foreground">Ctrl+,</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {/* Quick Actions */}
        <CommandGroup heading="Quick Actions">
          <CommandItem onSelect={() => {
            handleNavigate('tasks');
            // Could trigger a "new task" modal here
          }}>
            <Plus className="mr-2 h-4 w-4" />
            <span>Create New Task</span>
            <span className="ml-auto text-xs text-muted-foreground">Ctrl+N</span>
          </CommandItem>
          <CommandItem onSelect={() => handleNavigate('recognition')}>
            <Award className="mr-2 h-4 w-4" />
            <span>Give Recognition</span>
            <span className="ml-auto text-xs text-muted-foreground">Ctrl+R</span>
          </CommandItem>
        </CommandGroup>

        {/* Recent Tasks */}
        {recentTasks.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Recent Tasks">
              {recentTasks.map((task) => (
                <CommandItem
                  key={task.id}
                  onSelect={() => {
                    handleNavigate('tasks');
                    // Could scroll to or highlight this task
                  }}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  <span className="truncate">{task.title}</span>
                  <span className="ml-auto text-xs text-muted-foreground capitalize">
                    {task.status}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {/* Teams */}
        {teams.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Teams">
              {teams.slice(0, 5).map((team) => (
                <CommandItem
                  key={team.id}
                  onSelect={() => handleNavigate('teams')}
                >
                  <Users className="mr-2 h-4 w-4" />
                  <span>{team.name}</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {team.memberCount} members
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {/* Themes */}
        <CommandSeparator />
        <CommandGroup heading="Themes">
          {themes.map((theme) => (
            <CommandItem
              key={theme.id}
              onSelect={() => handleThemeChange(theme.id)}
            >
              <Palette className="mr-2 h-4 w-4" />
              <span>{theme.name}</span>
              <div className="ml-auto flex gap-1">
                <div 
                  className="w-3 h-3 rounded-full border" 
                  style={{ backgroundColor: theme.primary }}
                />
                <div 
                  className="w-3 h-3 rounded-full border" 
                  style={{ backgroundColor: theme.accent }}
                />
              </div>
            </CommandItem>
          ))}
        </CommandGroup>

        {/* User Info */}
        <CommandSeparator />
        <CommandGroup heading="Account">
          <CommandItem disabled>
            <Zap className="mr-2 h-4 w-4" />
            <span>{user?.name}</span>
            <span className="ml-auto text-xs text-muted-foreground">
              {user?.credits || 0} credits
            </span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
