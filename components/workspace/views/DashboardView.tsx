import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Avatar, AvatarFallback } from '../../ui/avatar';
import { 
  CheckCircle, 
  Clock, 
  Users, 
  Trophy, 
  ArrowRight,
  Plus,
  Lightbulb,
  Play
} from 'lucide-react';
import { useHonourus } from '../../../hooks/useHonourus';
import { ManagerCoPilotDemo } from '../ManagerCoPilotDemo';
import { ActivityFeed } from '../ActivityFeed';
import { FeaturesNavigationBanner } from '../FeaturesNavigationBanner';

interface DashboardViewProps {
  onViewChange: (view: string) => void;
}

export function DashboardView({ onViewChange }: DashboardViewProps) {
  const { user, tasks, isLoading } = useHonourus();
  const [showDemo, setShowDemo] = useState(false);
  const [showNavigationBanner, setShowNavigationBanner] = useState(true);

  // Safety check for data
  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
  const pendingTasks = tasks.filter(task => task.status === 'todo').length;

  const stats = [
    {
      title: 'Total Credits',
      value: user?.credits || 0,
      icon: Trophy,
      color: 'text-primary',
    },
    {
      title: 'Active Tasks',
      value: inProgressTasks,
      icon: Clock,
      color: 'text-accent',
    },
    {
      title: 'Completed',
      value: completedTasks,
      icon: CheckCircle,
      color: 'text-green-600',
    },
    {
      title: 'Team Members',
      value: 12,
      icon: Users,
      color: 'text-blue-600',
    },
  ];

  const recentTasks = tasks.slice(0, 5);

  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
      <div className="p-4 sm:p-6 space-y-6">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0]}</h1>
            <p className="text-muted-foreground">Here's what's happening in your workspace today.</p>
          </div>
          <Button onClick={() => onViewChange('tasks')} className="gap-2">
            <Plus className="h-4 w-4" />
            New Task
          </Button>
        </div>

        {/* Features Navigation Banner */}
        {showNavigationBanner && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <FeaturesNavigationBanner
              currentView="dashboard"
              onNavigate={onViewChange}
              onDismiss={() => setShowNavigationBanner(false)}
            />
          </motion.div>
        )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Dashboard Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tasks */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Tasks</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => onViewChange('tasks')}>
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className={`h-2 w-2 rounded-full ${
                      task.status === 'completed' ? 'bg-green-500' :
                      task.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-400'
                    }`} />
                    <div className="flex-1">
                      <h4 className="font-medium">{task.title}</h4>
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {task.credits} credits
                      </Badge>
                      <Badge variant={
                        task.priority === 'high' ? 'destructive' :
                        task.priority === 'medium' ? 'default' : 'secondary'
                      } className="text-xs">
                        {task.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Feed */}
        <div className="lg:col-span-1">
          <ActivityFeed />
        </div>
      </div>

      {/* Manager's Co-Pilot Feature Highlight */}
      {user?.role === 'manager' && (
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-dashed border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <Lightbulb className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Manager's Performance Co-Pilot</h3>
                  <p className="text-muted-foreground">
                    Discover unsung heroes, configure credit modifiers, and gain powerful team insights
                  </p>
                </div>
              </div>
              <Button onClick={() => setShowDemo(true)} className="gap-2">
                <Play className="h-4 w-4" />
                Interactive Demo
              </Button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="secondary" className="gap-1">
                <Users className="h-3 w-3" />
                Team Insights
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <Trophy className="h-3 w-3" />
                Unsung Heroes
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <Clock className="h-3 w-3" />
                Activity Heatmaps
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <Plus className="h-3 w-3" />
                Credit Modifiers
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onViewChange('tasks')}>
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="font-semibold mb-1">Manage Tasks</h3>
            <p className="text-sm text-muted-foreground">Create and track your team's tasks</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onViewChange('recognition')}>
          <CardContent className="p-6 text-center">
            <Trophy className="h-8 w-8 text-accent mx-auto mb-2" />
            <h3 className="font-semibold mb-1">Give Recognition</h3>
            <p className="text-sm text-muted-foreground">Celebrate team achievements</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onViewChange('analytics')}>
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold mb-1">View Analytics</h3>
            <p className="text-sm text-muted-foreground">Track team performance</p>
          </CardContent>
        </Card>
      </div>

      {/* Manager's Co-Pilot Demo Modal */}
      {showDemo && (
        <ManagerCoPilotDemo onClose={() => setShowDemo(false)} />
      )}
    </div>
    </div>
  );
}