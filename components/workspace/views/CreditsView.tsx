import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { 
  Coins,
  TrendingUp,
  CheckCircle,
  Trophy,
  Award,
  Target,
  Activity,
  Clock,
  Calendar,
  Users,
  Search,
  Filter,
  Star,
  Sparkles,
  Zap
} from 'lucide-react';
import { useHonourus } from '../../../hooks/useHonourus';

const mockCreditsData = {
  summary: {
    totalEarned: 1250,
    thisMonth: 425,
    thisWeek: 150,
    averagePerTask: 35,
    totalTasks: 28,
    completionRate: 89
  },
  breakdown: [
    {
      category: 'Tasks Completed',
      amount: 875,
      count: 25,
      percentage: 70,
      color: 'bg-blue-500'
    },
    {
      category: 'Recognition Received',
      amount: 275,
      count: 8,
      percentage: 22,
      color: 'bg-green-500'
    },
    {
      category: 'Peer Reviews',
      amount: 75,
      count: 5,
      percentage: 6,
      color: 'bg-purple-500'
    },
    {
      category: 'Bonus Achievements',
      amount: 25,
      count: 1,
      percentage: 2,
      color: 'bg-yellow-500'
    }
  ],
  history: [
    {
      id: '1',
      type: 'task',
      title: 'API Integration Complete',
      credits: 75,
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: 'completed',
      description: 'Successfully integrated payment gateway API'
    },
    {
      id: '2',
      type: 'recognition',
      title: 'Leadership Excellence',
      credits: 50,
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      status: 'received',
      description: 'Recognition for outstanding team leadership during project sprint'
    },
    {
      id: '3',
      type: 'task',
      title: 'Security Audit',
      credits: 60,
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      status: 'completed',
      description: 'Completed comprehensive security audit of user authentication system'
    },
    {
      id: '4',
      type: 'peer-review',
      title: 'Code Review: Dashboard Redesign',
      credits: 15,
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      status: 'completed',
      description: 'Provided thorough code review and suggestions for dashboard improvements'
    },
    {
      id: '5',
      type: 'task',
      title: 'Database Optimization',
      credits: 45,
      date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      status: 'completed',
      description: 'Optimized database queries resulting in 40% performance improvement'
    },
    {
      id: '6',
      type: 'recognition',
      title: 'Innovation Award',
      credits: 100,
      date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      status: 'received',
      description: 'Monthly innovation award for implementing automated testing framework'
    },
    {
      id: '7',
      type: 'task',
      title: 'Mobile App Launch',
      credits: 120,
      date: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
      status: 'completed',
      description: 'Successfully launched mobile application with all features'
    },
    {
      id: '8',
      type: 'peer-review',
      title: 'Architecture Review',
      credits: 20,
      date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      status: 'completed',
      description: 'Reviewed and provided feedback on microservices architecture proposal'
    }
  ],
  achievements: [
    {
      id: '1',
      title: 'Task Master',
      description: 'Complete 25+ tasks in a month',
      credits: 50,
      achieved: true,
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    },
    {
      id: '2',
      title: 'Team Player',
      description: 'Receive 5+ recognitions from peers',
      credits: 75,
      achieved: true,
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
    },
    {
      id: '3',
      title: 'Quality Contributor',
      description: 'Maintain 90%+ task completion rate',
      credits: 100,
      achieved: false,
      progress: 89
    },
    {
      id: '4',
      title: 'Innovation Leader',
      description: 'Implement 3+ innovative solutions',
      credits: 150,
      achieved: true,
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    },
    {
      id: '5',
      title: 'Mentor',
      description: 'Help 10+ colleagues through reviews',
      credits: 75,
      achieved: false,
      progress: 60
    },
    {
      id: '6',
      title: 'Consistent Performer',
      description: 'Earn credits for 30 consecutive days',
      credits: 200,
      achieved: false,
      progress: 78
    }
  ]
};

export function CreditsView() {
  const { user } = useHonourus();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined 
    });
  };

  const filterHistory = (history: any[], query: string) => {
    if (!query.trim()) return history;
    
    return history.filter(item => {
      const searchText = query.toLowerCase();
      return (
        item.title?.toLowerCase().includes(searchText) ||
        item.description?.toLowerCase().includes(searchText) ||
        item.type?.toLowerCase().includes(searchText)
      );
    });
  };

  const filteredHistory = filterHistory(mockCreditsData.history, searchQuery);

  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
      <div className="p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Credits</h1>
            <p className="text-muted-foreground">
              Track your work, credits earned, and achievements
            </p>
          </div>
        
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Credits Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Coins className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Credits</p>
                    <p className="text-2xl font-bold">{mockCreditsData.summary.totalEarned}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">This Month</p>
                    <p className="text-2xl font-bold">{mockCreditsData.summary.thisMonth}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tasks Completed</p>
                    <p className="text-2xl font-bold">{mockCreditsData.summary.totalTasks}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Target className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Completion Rate</p>
                    <p className="text-2xl font-bold">{mockCreditsData.summary.completionRate}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Credits Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Credits Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockCreditsData.breakdown.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{item.category}</span>
                    <div className="text-right">
                      <span className="font-bold">{item.amount} credits</span>
                      <span className="text-sm text-muted-foreground ml-2">({item.count} items)</span>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${item.color}`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockCreditsData.history.slice(0, 5).map((credit, index) => (
                <motion.div
                  key={credit.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  {credit.type === 'task' ? (
                    <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                  ) : credit.type === 'recognition' ? (
                    <Trophy className="h-5 w-5 text-primary mt-0.5" />
                  ) : credit.type === 'peer-review' ? (
                    <Users className="h-5 w-5 text-purple-500 mt-0.5" />
                  ) : (
                    <Award className="h-5 w-5 text-yellow-500 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{credit.title}</h4>
                      <Badge className="bg-accent hover:bg-accent/90 text-xs">
                        +{credit.credits} credits
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{credit.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs capitalize">
                        {credit.type.replace('-', ' ')}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(credit.date)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search credit history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 text-base h-12"
            />
          </div>

          {/* Results Count */}
          {searchQuery && (
            <div className="text-sm text-muted-foreground">
              {filteredHistory.length} results for "{searchQuery}"
            </div>
          )}

          {/* Credit History */}
          <div className="space-y-3">
            {filteredHistory.map((credit, index) => (
              <motion.div
                key={credit.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {credit.type === 'task' ? (
                        <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                      ) : credit.type === 'recognition' ? (
                        <Trophy className="h-5 w-5 text-primary mt-0.5" />
                      ) : credit.type === 'peer-review' ? (
                        <Users className="h-5 w-5 text-purple-500 mt-0.5" />
                      ) : (
                        <Award className="h-5 w-5 text-yellow-500 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{credit.title}</h4>
                          <Badge className="bg-accent hover:bg-accent/90 text-xs">
                            +{credit.credits} credits
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{credit.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs capitalize">
                            {credit.type.replace('-', ' ')}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(credit.date)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* No Results */}
          {filteredHistory.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">No results found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search query
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          {/* Achievements */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockCreditsData.achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className={`${
                  achievement.achieved 
                    ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800' 
                    : 'bg-muted/50 border-muted'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        achievement.achieved 
                          ? 'bg-green-500/10 text-green-500' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        <Award className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{achievement.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {achievement.credits} credits
                          </Badge>
                          {achievement.achieved ? (
                            <Badge className="bg-green-500 hover:bg-green-600 text-xs">
                              Achieved
                            </Badge>
                          ) : achievement.progress ? (
                            <Badge variant="outline" className="text-xs">
                              {achievement.progress}% progress
                            </Badge>
                          ) : null}
                        </div>
                        {achievement.achieved && achievement.date && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Achieved on {formatDate(achievement.date)}
                          </p>
                        )}
                        {!achievement.achieved && achievement.progress && (
                          <div className="mt-3">
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className="h-2 rounded-full bg-primary"
                                style={{ width: `${achievement.progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}