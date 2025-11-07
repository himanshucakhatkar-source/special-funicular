import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  LayoutDashboard, 
  KanbanSquare, 
  Palette, 
  Trophy,
  ArrowRight,
  Sparkles,
  X
} from 'lucide-react';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  gradient: string;
  view: string;
  badge?: string;
}

interface FeaturesNavigationBannerProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onDismiss?: () => void;
  compact?: boolean;
}

export function FeaturesNavigationBanner({ 
  currentView, 
  onNavigate, 
  onDismiss,
  compact = false 
}: FeaturesNavigationBannerProps) {
  const features: Feature[] = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      description: 'Real-time insights',
      icon: LayoutDashboard,
      gradient: 'from-blue-500 to-cyan-500',
      view: 'dashboard',
    },
    {
      id: 'tasks',
      title: 'Task Board',
      description: 'Kanban workflow',
      icon: KanbanSquare,
      gradient: 'from-purple-500 to-pink-500',
      view: 'tasks',
      badge: 'Jira-like',
    },
    {
      id: 'credits',
      title: 'Credits',
      description: 'Recognition system',
      icon: Trophy,
      gradient: 'from-emerald-500 to-teal-500',
      view: 'credits',
    },
    {
      id: 'settings',
      title: 'Themes',
      description: '12+ color schemes',
      icon: Palette,
      gradient: 'from-amber-500 to-orange-500',
      view: 'settings',
    },
  ];

  // Filter out current view
  const otherFeatures = features.filter(f => f.view !== currentView);

  if (compact) {
    return (
      <Card className="p-4 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border-primary/20">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm">Explore more features</p>
              <p className="text-xs text-muted-foreground">Quick navigation to key areas</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {otherFeatures.slice(0, 3).map((feature) => {
              const Icon = feature.icon;
              return (
                <Button
                  key={feature.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigate(feature.view)}
                  className="gap-2"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden lg:inline">{feature.title}</span>
                </Button>
              );
            })}
            
            {onDismiss && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onDismiss}
                className="ml-2"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5" />
      
      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="flex items-center gap-2">
                Quick Feature Navigation
                <Badge variant="secondary" className="text-xs">Platform Tour</Badge>
              </h3>
              <p className="text-sm text-muted-foreground">
                Jump to key areas of Honourus
              </p>
            </div>
          </div>
          
          {onDismiss && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            const isActive = feature.view === currentView;
            
            return (
              <button
                key={feature.id}
                onClick={() => !isActive && onNavigate(feature.view)}
                disabled={isActive}
                className={`group relative p-4 rounded-lg border-2 transition-all text-left ${
                  isActive
                    ? 'border-primary bg-primary/5 cursor-default'
                    : 'border-border hover:border-primary/50 hover:shadow-md cursor-pointer'
                }`}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="text-xs">Active</Badge>
                  </div>
                )}
                
                {/* Badge for special features */}
                {!isActive && feature.badge && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="outline" className="text-xs">{feature.badge}</Badge>
                  </div>
                )}

                {/* Icon */}
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-3 ${
                  isActive ? '' : 'group-hover:scale-110'
                } transition-transform duration-300`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>

                {/* Content */}
                <div className="space-y-1 mb-3">
                  <h4 className="font-medium">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground">
                    {feature.description}
                  </p>
                </div>

                {/* Action */}
                {!isActive && (
                  <div className="flex items-center text-xs text-primary">
                    <span>Explore</span>
                    <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
