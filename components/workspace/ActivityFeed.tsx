import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  CheckCircle, 
  Users, 
  Clock, 
  Star,
  Target,
  Gift,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { useHonourus } from '../../hooks/useHonourus';

interface ActivityItem {
  id: string;
  type: 'task_completed' | 'recognition_given' | 'team_joined' | 'milestone_reached' | 'credit_earned';
  user_name: string;
  user_id: string;
  title: string;
  description: string;
  timestamp: string;
  metadata?: {
    credits?: number;
    task_name?: string;
    team_name?: string;
    milestone?: string;
    recognizer?: string;
  };
}

export function ActivityFeed() {
  const { user, tasks = [], recognitions = [], teams = [] } = useHonourus();
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    if (user && tasks.length > 0) {
      generateRecentActivities();
    }
  }, [user, tasks, recognitions, teams]);

  const generateRecentActivities = () => {
    const recentActivities: ActivityItem[] = [];

    // Recent task completions
    const completedTasks = tasks
      .filter(task => task.status === 'completed')
      .slice(0, 3)
      .map(task => ({
        id: `task-${task.id}`,
        type: 'task_completed' as const,
        user_name: user?.name || 'Someone', // Use current user's name
        user_id: task.assigneeId || '',
        title: 'Task Completed',
        description: `Completed "${task.title}"`,
        timestamp: task.updatedAt.toISOString(),
        metadata: {
          credits: task.credits,
          task_name: task.title,
        },
      }));

    // Recent recognitions
    const recentRecognitions = recognitions
      .slice(0, 2)
      .map(recognition => ({
        id: `recognition-${recognition.id}`,
        type: 'recognition_given' as const,
        user_name: user?.name || 'Someone', // Use current user's name
        user_id: recognition.toUserId,
        title: 'Recognition Received',
        description: `Recognized for excellent work`,
        timestamp: recognition.createdAt.toISOString(),
        metadata: {
          credits: recognition.credits,
          recognizer: user?.name || 'Someone',
        },
      }));

    // Combine and sort by timestamp
    const allActivities = [...completedTasks, ...recentRecognitions]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);

    setActivities(allActivities);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'task_completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'recognition_given':
        return <Trophy className="h-4 w-4 text-yellow-500" />;
      case 'team_joined':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'milestone_reached':
        return <Target className="h-4 w-4 text-purple-500" />;
      case 'credit_earned':
        return <Gift className="h-4 w-4 text-accent" />;
      default:
        return <Zap className="h-4 w-4 text-primary" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-80">
          {activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-center p-6">
              <Clock className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No recent activity</p>
              <p className="text-sm text-muted-foreground">Complete tasks or give recognition to see activity here</p>
            </div>
          ) : (
            <div className="space-y-1">
              <AnimatePresence>
                {activities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      {getActivityIcon(activity.type)}
                    </div>
                    
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {activity.user_name ? 
                          activity.user_name.split(' ').map(n => n[0]).join('').toUpperCase() :
                          'U'
                        }
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {activity.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {activity.description}
                          </p>
                        </div>
                        
                        <div className="flex flex-col items-end gap-1">
                          <p className="text-xs text-muted-foreground">
                            {formatTimestamp(activity.timestamp)}
                          </p>
                          {activity.metadata?.credits && (
                            <Badge variant="secondary" className="text-xs">
                              +{activity.metadata.credits}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}