import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { analyticsService, ContributionHeatmapData } from '../../services/analytics.service';
import { toast } from 'sonner@2.0.3';
import {
  Calendar,
  TrendingUp,
  Target,
  Activity,
  CheckCircle,
  Star,
  Award,
  Clock
} from 'lucide-react';

interface DayData {
  date: string;
  tasks_completed: number;
  credits_earned: number;
  intensity: number;
}

interface HeatmapProps {
  userId: string;
  userName: string;
}

const getIntensityColor = (intensity: number): string => {
  switch (intensity) {
    case 0: return 'bg-muted/30';
    case 1: return 'bg-primary/20';
    case 2: return 'bg-primary/40';
    case 3: return 'bg-primary/60';
    case 4: return 'bg-primary/80';
    default: return 'bg-primary';
  }
};

const getIntensityLabel = (intensity: number): string => {
  switch (intensity) {
    case 0: return 'No activity';
    case 1: return 'Light activity';
    case 2: return 'Moderate activity';
    case 3: return 'High activity';
    case 4: return 'Very high activity';
    default: return 'Unknown';
  }
};

export const PersonalContributionHeatmap = React.memo(function PersonalContributionHeatmap({ userId, userName }: HeatmapProps) {
  const [timeRange, setTimeRange] = useState('90');
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);
  const [isDayModalOpen, setIsDayModalOpen] = useState(false);
  const [heatmapData, setHeatmapData] = useState<ContributionHeatmapData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load heatmap data
  useEffect(() => {
    loadHeatmapData();
  }, [userId, timeRange]);

  const loadHeatmapData = async () => {
    try {
      setIsLoading(true);
      const currentYear = new Date().getFullYear();
      const data = await analyticsService.getContributionHeatmap(userId, currentYear);
      
      // Filter data based on time range
      const days = parseInt(timeRange);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      const filteredData = data.filter(item => 
        new Date(item.date) >= cutoffDate
      );
      
      setHeatmapData(filteredData);
    } catch (error) {
      console.error('Error loading heatmap data:', error);
      toast.error('Failed to load contribution heatmap');
      // Fallback to empty data
      setHeatmapData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDayClick = (dayData: ContributionHeatmapData) => {
    if (dayData.tasks_completed > 0) {
      setSelectedDay(dayData as DayData);
      setIsDayModalOpen(true);
    }
  };

  const totalCredits = React.useMemo(() => 
    heatmapData.reduce((sum, day) => sum + day.credits_earned, 0), [heatmapData]
  );
  const totalTasks = React.useMemo(() => 
    heatmapData.reduce((sum, day) => sum + day.tasks_completed, 0), [heatmapData]
  );
  const activeDays = React.useMemo(() => 
    heatmapData.filter(day => day.tasks_completed > 0).length, [heatmapData]
  );
  
  const maxDaysInRange = parseInt(timeRange);
  const activityRate = maxDaysInRange > 0 ? Math.round((activeDays / maxDaysInRange) * 100) : 0;

  // Group data by weeks for better visualization
  const weeks = React.useMemo(() => {
    const weekGroups: DayData[][] = [];
    for (let i = 0; i < heatmapData.length; i += 7) {
      weekGroups.push(heatmapData.slice(i, i + 7));
    }
    return weekGroups;
  }, [heatmapData]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Personal Contribution Heatmap</h2>
          <p className="text-muted-foreground">Track {userName}'s daily activity and contributions</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30">Last Month</SelectItem>
            <SelectItem value="90">Last Quarter</SelectItem>
            <SelectItem value="365">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <div>
                <p className="text-2xl font-bold">{totalCredits}</p>
                <p className="text-sm text-muted-foreground">Total Credits</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{totalTasks}</p>
                <p className="text-sm text-muted-foreground">Tasks Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-accent" />
              <div>
                <p className="text-2xl font-bold">{activeDays}</p>
                <p className="text-sm text-muted-foreground">Active Days</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{activityRate}%</p>
                <p className="text-sm text-muted-foreground">Activity Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Activity Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {/* Day labels */}
            <div className="grid grid-cols-7 gap-1 text-xs text-muted-foreground text-center mb-2">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
            
            {/* Heatmap grid */}
            <div className="space-y-1">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="grid grid-cols-7 gap-1">
                  {week.map((day, dayIndex) => (
                    <motion.div
                      key={day.date}
                      className={`
                        w-4 h-4 rounded-sm cursor-pointer border
                        ${getIntensityColor(day.intensity)}
                        ${day.tasks_completed > 0 ? 'hover:ring-2 hover:ring-primary/50' : ''}
                      `}
                      whileHover={{ scale: 1.2 }}
                      onClick={() => handleDayClick(day)}
                      title={`${day.date}: ${day.tasks_completed} tasks, ${day.credits_earned} credits`}
                    />
                  ))}
                </div>
              ))}
            </div>
            
            {/* Legend */}
            <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
              <span>Less</span>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-sm bg-muted/30" />
                <div className="w-3 h-3 rounded-sm bg-primary/20" />
                <div className="w-3 h-3 rounded-sm bg-primary/40" />
                <div className="w-3 h-3 rounded-sm bg-primary/60" />
                <div className="w-3 h-3 rounded-sm bg-primary/80" />
                <div className="w-3 h-3 rounded-sm bg-primary" />
              </div>
              <span>More</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading state indicator */}
      {isLoading && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mr-3" />
              <span className="text-muted-foreground">Loading contribution data...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Task Types */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Top Task Types
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topTaskTypes.map(([type, count], index) => (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="w-6 h-6 rounded-full p-0 flex items-center justify-center">
                    {index + 1}
                  </Badge>
                  <span>{type}</span>
                </div>
                <Badge variant="secondary">{count} tasks</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Day Detail Modal */}
      <Dialog open={isDayModalOpen} onOpenChange={setIsDayModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {selectedDay && new Date(selectedDay.date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </DialogTitle>
            <DialogDescription>
              Activity details for this day
            </DialogDescription>
          </DialogHeader>
          
          {selectedDay && (
            <div className="space-y-4">
              {/* Day Summary */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-lg font-bold">{selectedDay.tasks_completed}</p>
                  <p className="text-sm text-muted-foreground">Tasks Completed</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-lg font-bold">{selectedDay.credits_earned}</p>
                  <p className="text-sm text-muted-foreground">Credits Earned</p>
                </div>
              </div>

              <Separator />

              {/* Task List */}
              <div>
                <h4 className="font-medium mb-3">Tasks Completed</h4>
                <ScrollArea className="max-h-64">
                  <div className="space-y-3">
                    {selectedDay.tasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div>
                          <p className="font-medium">{task.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">{task.type}</Badge>
                            <span className="text-xs text-muted-foreground">
                              <Clock className="h-3 w-3 inline mr-1" />
                              {task.completedAt}
                            </span>
                          </div>
                        </div>
                        <Badge variant="default" className="gap-1">
                          <Award className="h-3 w-3" />
                          {task.credits}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
});