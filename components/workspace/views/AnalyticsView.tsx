import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Progress } from '../../ui/progress';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  TrendingUp,
  Trophy,
  Users,
  Clock,
  Target,
  Eye,
  Award,
  ArrowRight
} from 'lucide-react';
import { useHonourus } from '../../../hooks/useHonourus';
import { TeamInsightsView } from '../TeamInsightsView';

export function AnalyticsView() {
  const { user, tasks, recognitions } = useHonourus();

  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats = [
    {
      title: 'Tasks Completed',
      value: completedTasks,
      total: totalTasks,
      icon: Trophy,
      color: 'text-primary',
      trend: '+12%',
    },
    {
      title: 'Credits Earned',
      value: user?.credits || 0,
      icon: Target,
      color: 'text-accent',
      trend: '+8%',
    },
    {
      title: 'Team Members',
      value: 12,
      icon: Users,
      color: 'text-blue-600',
      trend: '+2',
    },
    {
      title: 'Avg. Completion Time',
      value: '2.5 days',
      icon: Clock,
      color: 'text-green-600',
      trend: '-15%',
    },
  ];

  const chartData = [
    { name: 'Mon', tasks: 4, credits: 120 },
    { name: 'Tue', tasks: 3, credits: 95 },
    { name: 'Wed', tasks: 6, credits: 180 },
    { name: 'Thu', tasks: 8, credits: 240 },
    { name: 'Fri', tasks: 5, credits: 150 },
    { name: 'Sat', tasks: 2, credits: 60 },
    { name: 'Sun', tasks: 1, credits: 30 },
  ];

  const pieData = [
    { name: 'Completed', value: completedTasks, color: '#2563eb' },
    { name: 'In Progress', value: tasks.filter(t => t.status === 'in-progress').length, color: '#f59e0b' },
    { name: 'Todo', value: tasks.filter(t => t.status === 'todo').length, color: '#6b7280' },
  ];

  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
      <div className="p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">
            Track your productivity and team performance
          </p>
        </div>

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
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    {stat.trend && (
                      <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3" />
                        {stat.trend}
                      </p>
                    )}
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                {stat.total && (
                  <div className="mt-4">
                    <Progress value={(stat.value / stat.total) * 100} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Manager's Co-Pilot Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Manager's Performance Co-Pilot
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Unsung Heroes Card */}
            <motion.div
              className="group cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                // This would typically navigate to Team Insights
                // For now we'll switch to the insights tab
                const tabsList = document.querySelector('[role="tablist"]');
                const insightsTab = tabsList?.querySelector('[value="insights"]');
                if (insightsTab) {
                  (insightsTab as HTMLElement).click();
                }
              }}
            >
              <Card className="border-2 border-dashed border-muted hover:border-primary transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent/70 rounded-lg flex items-center justify-center">
                      <Award className="h-6 w-6 text-accent-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">Discover Your Unsung Heroes</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Identify high-value contributors who might be overlooked
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      3 potential heroes identified
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="h-4 w-4" />
                      Last 30 days
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Team Performance Insights */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Team Performance Insights</h3>
                    <p className="text-sm text-muted-foreground">Latest performance metrics</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">High-Value Task Completion</span>
                    <Badge variant="default">+15%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Recognition Distribution</span>
                    <Badge variant="secondary">Balanced</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Hidden Contributors</span>
                    <Badge variant="outline">3 Identified</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <Tabs defaultValue="activity" className="space-y-4">
        <TabsList>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="insights">Team Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tasks Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Tasks Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="tasks" stroke="#2563eb" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Credits Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Credits Earned</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="credits" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Task Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Task Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({name, value}) => `${name}: ${value}`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Performance Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Task Completion Rate</span>
                    <Badge variant="secondary">{completionRate}%</Badge>
                  </div>
                  <Progress value={completionRate} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Team Collaboration</span>
                    <Badge variant="secondary">85%</Badge>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Recognition Given</span>
                    <Badge variant="secondary">92%</Badge>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Your productivity has increased by <span className="text-green-600 font-medium">12%</span> this week.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <TeamInsightsView />
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}