import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../ui/breadcrumb';
import { Home, ChevronRight } from 'lucide-react';

interface NavigationBreadcrumbsProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export function NavigationBreadcrumbs({ currentView, onNavigate }: NavigationBreadcrumbsProps) {
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

  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink 
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors"
          >
            <Home className="h-3 w-3" />
            <span>Workspace</span>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {currentView !== 'dashboard' && (
          <>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="font-medium">
                {viewNames[currentView] || 'Unknown'}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
