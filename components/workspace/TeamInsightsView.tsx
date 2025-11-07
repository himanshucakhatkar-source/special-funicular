import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Award,
  TrendingUp,
  Eye,
  Users,
  Calendar,
  Star,
  MessageSquare,
  Filter,
  Gift,
  Target,
  Activity,
  Bug,
  FileText,
  Code
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface UnsungHero {
  id: string;
  name: string;
  avatar?: string;
  department: string;
  unsungTasksCompleted: number;
  creditsFromUnsungTasks: number;
  taskTypes: Array<{
    type: string;
    count: number;
    icon: any;
  }>;
  trendData: Array<{
    week: string;
    tasks: number;
  }>;
  recentContributions: string[];
}

const mockUnsungHeroes: UnsungHero[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    department: 'Engineering',
    unsungTasksCompleted: 15,
    creditsFromUnsungTasks: 750,
    taskTypes: [
      { type: 'Bug Fixes', count: 8, icon: Bug },
      { type: 'Documentation', count: 4, icon: FileText },
      { type: 'Code Review', count: 3, icon: Code }
    ],
    trendData: [
      { week: 'W1', tasks: 2 },
      { week: 'W2', tasks: 4 },
      { week: 'W3', tasks: 3 },
      { week: 'W4', tasks: 6 }
    ],
    recentContributions: [
      'Fixed critical authentication bug',
      'Updated API documentation',
      'Reviewed 12 pull requests'
    ]
  },
  {
    id: '2',
    name: 'Mike Rodriguez',
    department: 'Engineering',
    unsungTasksCompleted: 12,
    creditsFromUnsungTasks: 600,
    taskTypes: [
      { type: 'Bug Fixes', count: 7, icon: Bug },
      { type: 'Code Review', count: 5, icon: Code }
    ],
    trendData: [
      { week: 'W1', tasks: 3 },
      { week: 'W2', tasks: 2 },
      { week: 'W3', tasks: 4 },
      { week: 'W4', tasks: 3 }
    ],
    recentContributions: [
      'Resolved database performance issues',
      'Improved error handling',
      'Mentored junior developers'
    ]
  },
  {
    id: '3',
    name: 'Emily Davis',
    department: 'QA',
    unsungTasksCompleted: 18,
    creditsFromUnsungTasks: 900,
    taskTypes: [
      { type: 'Bug Fixes', count: 10, icon: Bug },
      { type: 'Documentation', count: 8, icon: FileText }
    ],
    trendData: [
      { week: 'W1', tasks: 4 },
      { week: 'W2', tasks: 5 },
      { week: 'W3', tasks: 4 },
      { week: 'W4', tasks: 5 }
    ],
    recentContributions: [
      'Created comprehensive test documentation',
      'Identified critical edge cases',
      'Improved testing processes'
    ]
  }
];

interface RecognitionModalProps {
  hero: UnsungHero | null;
  isOpen: boolean;
  onClose: () => void;
}

function RecognitionModal({ hero, isOpen, onClose }: RecognitionModalProps) {
  const [message, setMessage] = useState('');

  const handleSendRecognition = () => {
    if (!hero || !message.trim()) return;
    
    toast.success(`Recognition sent to ${hero.name}!`);
    setMessage('');
    onClose();
  };

  if (!hero) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Give Special Recognition
          </DialogTitle>
          <DialogDescription>
            Recognize {hero.name} for their valuable behind-the-scenes contributions
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Avatar>
              <AvatarFallback>
                {hero.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{hero.name}</p>
              <p className="text-sm text-muted-foreground">{hero.department}</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Recognition Message</label>
            <Textarea
              placeholder={`Thank you ${hero.name.split(' ')[0]} for your excellent work on bug fixes and documentation. Your attention to detail makes a real difference to our team's success!`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
          </div>

          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Suggested recognition:</strong> {hero.name} has completed {hero.unsungTasksCompleted} high-value, 
              low-visibility tasks and earned {hero.creditsFromUnsungTasks} credits from behind-the-scenes work.
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSendRecognition} disabled={!message.trim()}>
              Send Recognition
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function TeamInsightsView() {
  const [timeRange, setTimeRange] = useState('30');
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [selectedHero, setSelectedHero] = useState<UnsungHero | null>(null);
  const [isRecognitionModalOpen, setIsRecognitionModalOpen] = useState(false);

  const handleGiveRecognition = (hero: UnsungHero) => {
    setSelectedHero(hero);
    setIsRecognitionModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Team Insights</h1>
        <p className="text-muted-foreground">
          Discover unsung heroes and analyze team performance patterns
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last Quarter</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Teams</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="qa">QA</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Unsung Heroes Report */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Unsung Hero Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          {mockUnsungHeroes.length === 0 ? (
            <div className="text-center py-12">
              <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No unsung heroes identified yet!</h3>
              <p className="text-muted-foreground">
                Keep up the great work. Check back as your team completes more tasks.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {mockUnsungHeroes.map((hero, index) => (
                  <motion.div
                    key={hero.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="relative">
                      <CardContent className="p-6">
                        {/* Hero Badge */}
                        <div className="absolute -top-2 -right-2">
                          <Badge variant="default" className="gap-1 text-xs">
                            <Star className="h-3 w-3" />
                            Hero
                          </Badge>
                        </div>

                        {/* Profile */}
                        <div className="flex items-center gap-3 mb-4">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback>
                              {hero.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{hero.name}</h3>
                            <p className="text-sm text-muted-foreground">{hero.department}</p>
                          </div>
                        </div>

                        {/* Metrics */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <p className="text-lg font-bold">{hero.unsungTasksCompleted}</p>
                            <p className="text-xs text-muted-foreground">Unsung Tasks</p>
                          </div>
                          <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <p className="text-lg font-bold">{hero.creditsFromUnsungTasks}</p>
                            <p className="text-xs text-muted-foreground">Unsung Credits</p>
                          </div>
                        </div>

                        {/* Task Types */}
                        <div className="space-y-2 mb-4">
                          <p className="text-sm font-medium">Task Breakdown:</p>
                          {hero.taskTypes.map((taskType) => (
                            <div key={taskType.type} className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <taskType.icon className="h-3 w-3 text-muted-foreground" />
                                <span>{taskType.type}</span>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {taskType.count}
                              </Badge>
                            </div>
                          ))}
                        </div>

                        {/* Trend Chart */}
                        <div className="mb-4">
                          <p className="text-sm font-medium mb-2">Contribution Trend:</p>
                          <ResponsiveContainer width="100%" height={60}>
                            <LineChart data={hero.trendData}>
                              <Line 
                                type="monotone" 
                                dataKey="tasks" 
                                stroke="#2563eb" 
                                strokeWidth={2}
                                dot={false}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>

                        {/* Action Button */}
                        <Button 
                          onClick={() => handleGiveRecognition(hero)}
                          className="w-full gap-2"
                          size="sm"
                        >
                          <Gift className="h-4 w-4" />
                          Give Special Recognition
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <div className="flex items-start gap-2">
                  <Target className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-amber-700 dark:text-amber-300 mb-1">
                      What makes someone an "Unsung Hero"?
                    </p>
                    <p className="text-xs text-amber-600 dark:text-amber-400">
                      Currently identified by high completion of bug fixes, documentation, and code reviews - 
                      essential work that often goes unnoticed but keeps teams running smoothly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <RecognitionModal 
        hero={selectedHero}
        isOpen={isRecognitionModalOpen}
        onClose={() => setIsRecognitionModalOpen(false)}
      />
    </div>
  );
}