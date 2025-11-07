import React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../ui/popover';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Clock, FileText, Users as UsersIcon, Eye } from 'lucide-react';
import { useRecentItems } from '../../hooks/useRecentItems';
import { Badge } from '../ui/badge';

interface QuickAccessPanelProps {
  onNavigate: (view: string) => void;
}

export function QuickAccessPanel({ onNavigate }: QuickAccessPanelProps) {
  const { recentItems, getRecentByType } = useRecentItems();

  const recentViews = getRecentByType('view').slice(0, 5);
  const recentTasks = getRecentByType('task').slice(0, 3);

  const getIconForType = (type: string) => {
    switch (type) {
      case 'view':
        return Eye;
      case 'task':
        return FileText;
      case 'team':
        return UsersIcon;
      default:
        return Clock;
    }
  };

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  if (recentItems.length === 0) {
    return null;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 hidden xl:flex">
          <Clock className="h-4 w-4" />
          <span className="text-xs">Recent</span>
          <Badge variant="secondary" className="h-5 text-xs">
            {recentItems.length}
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <ScrollArea className="h-[400px]">
          <div className="p-4 space-y-4">
            {/* Recent Views */}
            {recentViews.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-3 text-muted-foreground">
                  Recent Views
                </h4>
                <div className="space-y-1">
                  {recentViews.map((item) => {
                    const Icon = getIconForType(item.type);
                    return (
                      <button
                        key={`${item.type}-${item.id}`}
                        onClick={() => {
                          onNavigate(item.id);
                        }}
                        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors text-left"
                      >
                        <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatTime(item.timestamp)}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Recent Tasks */}
            {recentTasks.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-3 text-muted-foreground">
                  Recent Tasks
                </h4>
                <div className="space-y-1">
                  {recentTasks.map((item) => {
                    const Icon = getIconForType(item.type);
                    return (
                      <button
                        key={`${item.type}-${item.id}`}
                        onClick={() => {
                          onNavigate('tasks');
                        }}
                        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors text-left"
                      >
                        <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatTime(item.timestamp)}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {recentItems.length === 0 && (
              <div className="text-center py-8">
                <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  No recent activity yet
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
