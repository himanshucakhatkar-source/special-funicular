import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { 
  Search, 
  Bell, 
  Settings,
  LogOut,
  User,
  Palette,
  Menu,
  X,
  Command
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useHonourus } from '../../hooks/useHonourus';
import { authService } from '../../services/auth.service';
import { useTheme } from '../../contexts/ThemeContext';
import { NotificationsPanel } from './NotificationsPanel';
import { ThemeSelector } from './ThemeSelector';
import { QuickAccessPanel } from './QuickAccessPanel';
import { notificationsService } from '../../services/notifications.service';

interface WorkspaceHeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onOpenCommandPalette?: () => void;
}

export function WorkspaceHeader({ 
  currentView, 
  onViewChange, 
  sidebarOpen, 
  onToggleSidebar,
  onOpenCommandPalette 
}: WorkspaceHeaderProps) {
  const { user, setMode } = useHonourus();
  const { theme, setTheme, themes } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread count on mount
  useEffect(() => {
    if (user?.id) {
      fetchUnreadCount();
    }
  }, [user?.id]);

  const fetchUnreadCount = async () => {
    if (!user?.id) return;
    try {
      const count = await notificationsService.getUnreadCount(user.id);
      setUnreadCount(count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.signOut();
      setMode('marketing');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const getViewTitle = () => {
    const titles: Record<string, string> = {
      dashboard: 'Dashboard',
      tasks: 'Task Board',
      teams: 'Teams',
      analytics: 'Analytics',
      recognition: 'Recognition',
      search: 'Search',
      credits: 'Credits & Rewards',
      settings: 'Settings',
      showcase: 'UI Components',
    };
    return titles[currentView] || 'Workspace';
  };

  return (
    <header className="h-16 bg-background border-b border-border flex items-center justify-between px-4 sm:px-6">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        {/* Hamburger Menu Button - Always visible */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="p-2"
          aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          {sidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>

        <h1 className="text-base sm:text-lg font-semibold text-foreground">
          {getViewTitle()}
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-1 sm:gap-3">
        {/* Command Palette Trigger */}
        {onOpenCommandPalette && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenCommandPalette}
            className="gap-2 hidden lg:flex"
          >
            <Command className="h-4 w-4" />
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
        )}

        {/* Search Button - Hidden on small mobile */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewChange('search')}
          className="gap-2 hidden xs:flex lg:hidden"
        >
          <Search className="h-4 w-4" />
          <span className="hidden md:inline">Search</span>
        </Button>

        {/* Notifications */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowNotifications(true)}
          className="relative p-2"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full p-0 text-[10px] sm:text-xs flex items-center justify-center"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>

        {/* Quick Access Panel */}
        <QuickAccessPanel onNavigate={onViewChange} />

        {/* Enhanced Theme Selector - Hidden on mobile, shown on tablet+ */}
        <div className="hidden md:block">
          <ThemeSelector />
        </div>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 px-2">
              <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                <AvatarFallback className="text-xs">
                  {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-medium truncate max-w-[120px]">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate max-w-[120px]">{user?.role}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs">
                    {user?.credits || 0} credits
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {user?.role}
                  </Badge>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onViewChange('settings')} className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onViewChange('search')} className="cursor-pointer md:hidden">
              <Search className="mr-2 h-4 w-4" />
              Search
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Notifications Panel */}
      <NotificationsPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </header>
  );
}