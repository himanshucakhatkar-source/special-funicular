import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Avatar, AvatarFallback } from '../../ui/avatar';
import { Input } from '../../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { 
  Search, 
  Filter,
  Clock,
  Users,
  CheckCircle,
  Trophy,
  Hash,
  User,
  FileText,
  Calendar,
  Star
} from 'lucide-react';
import { useHonourus } from '../../../hooks/useHonourus';

const mockSearchResults = {
  tasks: [
    {
      id: '1',
      title: 'Complete Q4 Performance Review',
      description: 'Finalize performance evaluations for team members',
      priority: 'high',
      status: 'in-progress',
      credits: 50,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      assignee: 'Alex Johnson',
      tags: ['HR', 'Management'],
    },
    {
      id: '2',
      title: 'Update Project Documentation',
      description: 'Ensure all project docs are current and comprehensive',
      priority: 'medium',
      status: 'todo',
      credits: 25,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      assignee: 'Sarah Chen',
      tags: ['Documentation', 'Project'],
    },
  ],
  people: [
    {
      id: '1',
      name: 'Alex Johnson',
      role: 'Engineering Manager',
      department: 'Engineering',
      credits: 1250,
      avatar: 'AJ',
    },
    {
      id: '2',
      name: 'Sarah Chen',
      role: 'Senior Developer',
      department: 'Engineering',
      credits: 980,
      avatar: 'SC',
    },
    {
      id: '3',
      name: 'Mike Rodriguez',
      role: 'Full Stack Developer',
      department: 'Engineering',
      credits: 745,
      avatar: 'MR',
    },
  ],
  teams: [
    {
      id: '1',
      name: 'Engineering',
      description: 'Core development team building amazing products',
      memberCount: 12,
      channelCount: 5,
    },
    {
      id: '2',
      name: 'Design',
      description: 'Creating beautiful and intuitive user experiences',
      memberCount: 6,
      channelCount: 3,
    },
  ],
  channels: [
    {
      id: '1',
      name: 'general',
      team: 'Engineering',
      description: 'General team discussions',
      memberCount: 12,
    },
    {
      id: '2',
      name: 'code-reviews',
      team: 'Engineering',
      description: 'Code review discussions',
      memberCount: 8,
    },
  ],
  recognition: [
    {
      id: '1',
      from: 'Sarah Chen',
      to: 'Alex Johnson',
      type: 'leadership',
      message: 'Outstanding leadership during the Q4 project!',
      credits: 50,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: '2',
      from: 'Alex Johnson',
      to: 'Mike Rodriguez',
      type: 'innovation',
      message: 'Incredible problem-solving skills on the authentication system.',
      credits: 75,
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
  ],
};

export function SearchView() {
  const { tasks } = useHonourus();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined 
    });
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-50 dark:bg-red-950/20';
      case 'medium': return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-950/20';
      case 'low': return 'text-green-500 bg-green-50 dark:bg-green-950/20';
      default: return 'text-gray-500 bg-gray-50 dark:bg-gray-950/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-500 bg-green-50 dark:bg-green-950/20';
      case 'in-progress': return 'text-blue-500 bg-blue-50 dark:bg-blue-950/20';
      case 'todo': return 'text-gray-500 bg-gray-50 dark:bg-gray-950/20';
      default: return 'text-gray-500 bg-gray-50 dark:bg-gray-950/20';
    }
  };

  const filterResults = (results: any[], query: string) => {
    if (!query.trim()) return results;
    
    return results.filter(item => {
      const searchText = query.toLowerCase();
      return (
        item.title?.toLowerCase().includes(searchText) ||
        item.name?.toLowerCase().includes(searchText) ||
        item.description?.toLowerCase().includes(searchText) ||
        item.message?.toLowerCase().includes(searchText) ||
        item.tags?.some((tag: string) => tag.toLowerCase().includes(searchText))
      );
    });
  };

  const filteredTasks = filterResults(mockSearchResults.tasks, searchQuery);
  const filteredPeople = filterResults(mockSearchResults.people, searchQuery);
  const filteredTeams = filterResults(mockSearchResults.teams, searchQuery);
  const filteredChannels = filterResults(mockSearchResults.channels, searchQuery);
  const filteredRecognition = filterResults(mockSearchResults.recognition, searchQuery);

  const totalResults = filteredTasks.length + filteredPeople.length + 
                      filteredTeams.length + filteredChannels.length + 
                      filteredRecognition.length;

  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
      <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Search</h1>
          <p className="text-muted-foreground">
            Find tasks, people, teams, and more
          </p>
        </div>
        
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search everything..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 text-base h-12"
        />
      </div>

      {/* Results Count */}
      {searchQuery && (
        <div className="text-sm text-muted-foreground">
          {totalResults} results for "{searchQuery}"
        </div>
      )}

      {/* Results */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">
            All ({totalResults})
          </TabsTrigger>
          <TabsTrigger value="tasks">
            Tasks ({filteredTasks.length})
          </TabsTrigger>
          <TabsTrigger value="people">
            People ({filteredPeople.length})
          </TabsTrigger>
          <TabsTrigger value="teams">
            Teams ({filteredTeams.length})
          </TabsTrigger>
          <TabsTrigger value="channels">
            Channels ({filteredChannels.length})
          </TabsTrigger>
          <TabsTrigger value="recognition">
            Recognition ({filteredRecognition.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {/* Tasks */}
          {filteredTasks.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                Tasks
              </h3>
              {filteredTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-medium">{task.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </Badge>
                            <Badge className={`text-xs ${getStatusColor(task.status)}`}>
                              {task.status.replace('-', ' ')}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {task.credits} credits
                            </Badge>
                            {task.dueDate && (
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(task.dueDate)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* People */}
          {filteredPeople.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                People
              </h3>
              {filteredPeople.map((person, index) => (
                <motion.div
                  key={person.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{person.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-medium">{person.name}</h4>
                          <p className="text-sm text-muted-foreground">{person.role}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="text-xs">
                            {person.credits} credits
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">{person.department}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* Teams */}
          {filteredTeams.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                Teams
              </h3>
              {filteredTeams.map((team, index) => (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-medium">{team.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{team.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>{team.memberCount} members</span>
                            <span>{team.channelCount} channels</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* Recognition */}
          {filteredRecognition.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                Recognition
              </h3>
              {filteredRecognition.map((recognition, index) => (
                <motion.div
                  key={recognition.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Trophy className="h-5 w-5 text-primary mt-0.5" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{recognition.from}</span>
                            <span className="text-muted-foreground">recognized</span>
                            <span className="font-medium">{recognition.to}</span>
                            <Badge className="bg-primary hover:bg-primary/90 text-xs">
                              +{recognition.credits} credits
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{recognition.message}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {formatTimeAgo(recognition.createdAt)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}



          {/* No Results */}
          {totalResults === 0 && searchQuery && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">No results found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search query or filters
              </p>
            </div>
          )}

          {/* Empty State */}
          {!searchQuery && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">Start searching</h3>
              <p className="text-muted-foreground">
                Search for tasks, people, teams, channels, and recognition
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          {filteredTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium">{task.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </Badge>
                        <Badge className={`text-xs ${getStatusColor(task.status)}`}>
                          {task.status.replace('-', ' ')}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {task.credits} credits
                        </Badge>
                        {task.dueDate && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(task.dueDate)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        <TabsContent value="people" className="space-y-4">
          {filteredPeople.map((person, index) => (
            <motion.div
              key={person.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{person.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-medium">{person.name}</h4>
                      <p className="text-sm text-muted-foreground">{person.role}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="text-xs">
                        {person.credits} credits
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">{person.department}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        <TabsContent value="teams" className="space-y-4">
          {filteredTeams.map((team, index) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium">{team.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{team.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>{team.memberCount} members</span>
                        <span>{team.channelCount} channels</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        <TabsContent value="channels" className="space-y-4">
          {filteredChannels.map((channel, index) => (
            <motion.div
              key={channel.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Hash className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium">#{channel.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{channel.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>Team: {channel.team}</span>
                        <span>{channel.memberCount} members</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        <TabsContent value="recognition" className="space-y-4">
          {filteredRecognition.map((recognition, index) => (
            <motion.div
              key={recognition.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Trophy className="h-5 w-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{recognition.from}</span>
                        <span className="text-muted-foreground">recognized</span>
                        <span className="font-medium">{recognition.to}</span>
                        <Badge className="bg-primary hover:bg-primary/90 text-xs">
                          +{recognition.credits} credits
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{recognition.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {formatTimeAgo(recognition.createdAt)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}