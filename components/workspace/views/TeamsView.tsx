import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Input } from '../../ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Checkbox } from '../../ui/checkbox';
import { ScrollArea } from '../../ui/scroll-area';
import { Separator } from '../../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { toast } from 'sonner@2.0.3';
import { 
  Users, 
  Plus, 
  Search, 
  MessageCircle, 
  Settings,
  Crown,
  Star,
  Hash,
  UserPlus,
  CheckCircle,
  Calendar,
  Target,
  Activity,
  TrendingUp,
  Award,
  Settings2,
  Sliders
} from 'lucide-react';
import { useHonourus, useTeams } from '../../../hooks/useHonourus';
import { teamsService } from '../../../services/teams.service';
import { Team, User, Task } from '../../../types';
import { CreditModifiersModal } from '../CreditModifiersModal';
import { PersonalContributionHeatmap } from '../PersonalContributionHeatmap';

// Team members will be fetched from the backend via team member queries

interface ExtendedTeam extends Team {
  memberCount: number;
  channelCount: number;
  leaderName: string;
  members: Array<{
    id: string;
    name: string;
    role: string;
    avatar: string;
    credits: number;
    email: string;
    tasksCompleted: number;
    department: string;
  }>;
  channels: Array<{
    id: string;
    name: string;
    description: string;
  }>;
  recentActivity: string;
  teamTasks: Task[];
  teamStats: {
    totalCredits: number;
    tasksCompleted: number;
    activeProjects: number;
    performance: number;
  };
}

// Mock users data for development (should be replaced with real user service)
const mockUsers = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex@honourus.com',
    role: 'manager',
    department: 'Engineering',
    credits: 1250
  },
  {
    id: '2',
    name: 'Sarah Chen',
    email: 'sarah@honourus.com',
    role: 'member',
    department: 'Design',
    credits: 980
  },
  {
    id: '3',
    name: 'Mike Rodriguez',
    email: 'mike@honourus.com',
    role: 'member',
    department: 'Engineering',
    credits: 1180
  },
  {
    id: '4',
    name: 'Emma Thompson',
    email: 'emma@honourus.com',
    role: 'admin',
    department: 'Product',
    credits: 1450
  },
  {
    id: '5',
    name: 'David Kim',
    email: 'david@honourus.com',
    role: 'member',
    department: 'Marketing',
    credits: 890
  }
];

export function TeamsView() {
  const { user, tasks, isLoading, refreshData } = useHonourus();
  const { teams, addTeam, updateTeam } = useTeams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [extendedTeams, setExtendedTeams] = useState<ExtendedTeam[]>([]);
  const [teamMembers, setTeamMembers] = useState<Record<string, User[]>>({});
  const [isCreating, setIsCreating] = useState(false);
  const [isCreditModifiersOpen, setIsCreditModifiersOpen] = useState(false);
  const [selectedMemberForHeatmap, setSelectedMemberForHeatmap] = useState<{ id: string; name: string } | null>(null);
  const [teamDetailTab, setTeamDetailTab] = useState('overview');
  
  // Create team form state
  const [newTeam, setNewTeam] = useState({
    name: '',
    description: '',
    selectedMembers: [] as string[],
    channels: [{ name: 'general', description: 'General team discussions' }]
  });

  // Auto-select current user when dialog opens
  useEffect(() => {
    if (isCreateDialogOpen && user?.id && !newTeam.selectedMembers.includes(user.id)) {
      setNewTeam(prev => ({
        ...prev,
        selectedMembers: [user.id]
      }));
    }
  }, [isCreateDialogOpen, user?.id]);

  // Load and process teams data
  useEffect(() => {
    const processTeams = () => {
      const processed = teams.map(team => {
        const teamMembers = mockUsers.filter(u => team.memberIds.includes(u.id));
        const leader = mockUsers.find(u => u.id === team.leaderId);
        const teamTasks = tasks.filter(task => teamMembers.some(member => member.id === task.assigneeId));
        
        const totalCredits = teamTasks.reduce((sum, task) => sum + (task.status === 'completed' ? task.credits : 0), 0);
        const completedTasks = teamTasks.filter(task => task.status === 'completed').length;
        const activeTasks = teamTasks.filter(task => task.status !== 'completed').length;
        
        return {
          ...team,
          memberCount: teamMembers.length,
          channelCount: team.channelIds.length,
          leaderName: leader?.name || 'Unknown',
          members: teamMembers.map(member => ({
            id: member.id,
            name: member.name,
            role: member.id === team.leaderId ? 'Team Lead' : member.role === 'manager' ? 'Manager' : 'Member',
            avatar: member.name.split(' ').map(n => n[0]).join(''),
            credits: member.credits,
            email: member.email,
            tasksCompleted: tasks.filter(t => t.assigneeId === member.id && t.status === 'completed').length,
            department: member.department || 'General'
          })),
          channels: [
            { id: '1', name: 'general', description: 'General team discussions' },
            { id: '2', name: 'projects', description: 'Project coordination' }
          ],
          recentActivity: `${completedTasks} tasks completed this week`,
          teamTasks,
          teamStats: {
            totalCredits,
            tasksCompleted: completedTasks,
            activeProjects: activeTasks,
            performance: teamMembers.length > 0 ? Math.round((completedTasks / Math.max(teamTasks.length, 1)) * 100) : 0
          }
        } as ExtendedTeam;
      });
      
      setExtendedTeams(processed);
    };

    processTeams();
  }, [teams, tasks]);

  const filteredTeams = extendedTeams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedTeamData = selectedTeam ? extendedTeams.find(t => t.id === selectedTeam) : null;

  const handleCreateTeam = async () => {
    if (!newTeam.name.trim()) {
      toast.error('Team name is required');
      return;
    }

    if (newTeam.selectedMembers.length === 0) {
      toast.error('Please select at least one team member');
      return;
    }

    setIsCreating(true);
    try {
      // Include current user as team lead if not already selected
      const allMemberIds = [...new Set([user?.id || '1', ...newTeam.selectedMembers])];
      
      // Create team via service
      const createdTeam = await teamsService.createTeam({
        name: newTeam.name,
        description: newTeam.description || undefined,
        memberIds: allMemberIds,
      });

      // Reset form
      setNewTeam({
        name: '',
        description: '',
        selectedMembers: [],
        channels: [{ name: 'general', description: 'General team discussions' }]
      });
      
      setIsCreateDialogOpen(false);
      toast.success(`Team "${createdTeam.name}" created successfully!`);
      
      // Refresh data from backend (will fall back to local if API unavailable)
      await refreshData();
      
    } catch (error) {
      console.error('Error creating team:', error);
      toast.error('Failed to create team. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleMemberSelection = (userId: string, checked: boolean) => {
    if (checked) {
      setNewTeam(prev => ({
        ...prev,
        selectedMembers: [...prev.selectedMembers, userId]
      }));
    } else {
      setNewTeam(prev => ({
        ...prev,
        selectedMembers: prev.selectedMembers.filter(id => id !== userId)
      }));
    }
  };

  const addChannel = () => {
    setNewTeam(prev => ({
      ...prev,
      channels: [...prev.channels, { name: '', description: '' }]
    }));
  };

  const updateChannel = (index: number, field: 'name' | 'description', value: string) => {
    setNewTeam(prev => ({
      ...prev,
      channels: prev.channels.map((channel, i) => 
        i === index ? { ...channel, [field]: value } : channel
      )
    }));
  };

  const removeChannel = (index: number) => {
    setNewTeam(prev => ({
      ...prev,
      channels: prev.channels.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
      <div className="p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Teams</h1>
            <p className="text-muted-foreground">
              Collaborate with your team members and manage channels
            </p>
          </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Team
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Create New Team</DialogTitle>
              <DialogDescription>
                Create a new team to organize members and collaborate on projects. You'll automatically be added as the team lead.
              </DialogDescription>
            </DialogHeader>
            
            <ScrollArea className="max-h-[70vh] pr-4">
              <div className="space-y-6">
                {/* Basic Team Info */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="teamName">Team Name *</Label>
                    <Input 
                      id="teamName" 
                      placeholder="Enter team name"
                      value={newTeam.name}
                      onChange={(e) => setNewTeam(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="teamDescription">Description</Label>
                    <Textarea 
                      id="teamDescription" 
                      placeholder="Describe your team's purpose and goals"
                      value={newTeam.description}
                      onChange={(e) => setNewTeam(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                </div>

                <Separator />

                {/* Team Members Selection */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base">Team Members *</Label>
                    <Badge variant="secondary">
                      {newTeam.selectedMembers.length} selected
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto border rounded-lg p-3">
                    {mockUsers.map((usr) => {
                      const isCurrentUser = usr.id === user?.id;
                      const isSelected = newTeam.selectedMembers.includes(usr.id);
                      
                      return (
                        <div key={usr.id} className={`flex items-center space-x-3 p-2 rounded hover:bg-muted/50 ${
                          isCurrentUser ? 'bg-primary/5 border border-primary/20' : ''
                        }`}>
                          <Checkbox 
                            checked={isSelected}
                            onCheckedChange={(checked) => handleMemberSelection(usr.id, checked as boolean)}
                            disabled={isCurrentUser} // Current user is always included
                          />
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {usr.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-sm">{usr.name}</p>
                              {isCurrentUser && (
                                <Badge variant="secondary" className="text-xs">You</Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">{usr.email} • {usr.department}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className="text-xs">
                              {usr.credits} credits
                            </Badge>
                            <p className="text-xs text-muted-foreground capitalize">{usr.role}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <Separator />

                {/* Team Channels */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base">Team Channels</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addChannel}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Channel
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {newTeam.channels.map((channel, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                        <Hash className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1 space-y-2">
                          <Input
                            placeholder="Channel name"
                            value={channel.name}
                            onChange={(e) => updateChannel(index, 'name', e.target.value)}
                            disabled={index === 0} // General channel is required
                          />
                          <Input
                            placeholder="Channel description"
                            value={channel.description}
                            onChange={(e) => updateChannel(index, 'description', e.target.value)}
                          />
                        </div>
                        {index > 0 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeChannel(index)}
                            className="h-8 w-8 p-0"
                          >
                            ×
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTeam} disabled={isCreating || !newTeam.name.trim()}>
                {isCreating ? 'Creating...' : 'Create Team'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search teams..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Teams List */}
        <div className="lg:col-span-2 space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading teams...</p>
              </div>
            </div>
          ) : filteredTeams.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">No teams found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm ? `No teams match "${searchTerm}"` : 'Create your first team to get started'}
                </p>
                {!searchTerm && (
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Team
                  </Button>
                )}
              </div>
            </div>
          ) : (
            filteredTeams.map((team, index) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card 
                className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                  selectedTeam === team.id ? 'border-primary bg-primary/5' : ''
                }`}
                onClick={() => setSelectedTeam(team.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {team.name}
                          {user?.id === team.leaderId && (
                            <Crown className="h-4 w-4 text-yellow-500" />
                          )}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">{team.description}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {team.memberCount} members
                      </span>
                      <span className="flex items-center gap-1">
                        <Hash className="h-4 w-4" />
                        {team.channelCount} channels
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="h-4 w-4" />
                        {team.teamStats.activeProjects} active
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {team.members.slice(0, 4).map((member) => (
                            <Avatar key={member.id} className="h-6 w-6 border-2 border-background">
                              <AvatarFallback className="text-xs">{member.avatar}</AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                        {team.memberCount > 4 && (
                          <span className="text-xs text-muted-foreground">
                            +{team.memberCount - 4} more
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="font-medium text-sm">{team.teamStats.totalCredits}</p>
                          <p className="text-xs text-muted-foreground">credits</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-sm">{team.teamStats.performance}%</p>
                          <p className="text-xs text-muted-foreground">performance</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{team.recentActivity}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {team.teamStats.tasksCompleted} completed
                        </Badge>
                        {user?.id === team.leaderId && (
                          <Badge variant="outline" className="text-xs">
                            Leader
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            ))
          )}
        </div>

        {/* Team Details Sidebar */}
        {selectedTeamData && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Team Header */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {selectedTeamData.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {selectedTeamData.description}
                </p>
              </CardHeader>
            </Card>

            {/* Team Detail Tabs */}
            <Tabs value={teamDetailTab} onValueChange={setTeamDetailTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="members">Members</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                {/* Basic Info */}
                <Card>
                  <CardContent className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <Badge variant="secondary" className="justify-center">
                        {selectedTeamData.memberCount} members
                      </Badge>
                      <Badge variant="secondary" className="justify-center">
                        {selectedTeamData.channelCount} channels
                      </Badge>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Team Lead</h4>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {selectedTeamData.leaderName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{selectedTeamData.leaderName}</span>
                        <Crown className="h-3 w-3 text-yellow-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Team Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Team Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <p className="text-lg font-bold text-primary">{selectedTeamData.teamStats.totalCredits}</p>
                        <p className="text-xs text-muted-foreground">Total Credits</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-green-500">{selectedTeamData.teamStats.tasksCompleted}</p>
                        <p className="text-xs text-muted-foreground">Tasks Done</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Performance Rate</span>
                        <span>{selectedTeamData.teamStats.performance}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${selectedTeamData.teamStats.performance}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="members" className="space-y-4">
                {/* Team Members */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Members ({selectedTeamData.members.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <ScrollArea className="max-h-80">
                      {selectedTeamData.members.map((member) => (
                        <div key={member.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="text-sm">{member.avatar}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-1">
                                <p className="font-medium">{member.name}</p>
                                {member.id === selectedTeamData.leaderId && (
                                  <Crown className="h-3 w-3 text-yellow-500" />
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{member.role} • {member.department}</p>
                            </div>
                          </div>
                          <div className="text-right space-y-1">
                            <Badge variant="outline" className="text-xs">
                              {member.credits} credits
                            </Badge>
                            <p className="text-xs text-muted-foreground">
                              {member.tasksCompleted} tasks done
                            </p>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-xs h-6"
                              onClick={() => setSelectedMemberForHeatmap({ id: member.id, name: member.name })}
                            >
                              View Activity
                            </Button>
                          </div>
                        </div>
                      ))}
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* Team Channels */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      Channels ({selectedTeamData.channels.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {selectedTeamData.channels.map((channel) => (
                      <div
                        key={channel.id}
                        className="flex items-center gap-2 p-2 rounded hover:bg-muted/50 cursor-pointer transition-colors"
                      >
                        <Hash className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">#{channel.name}</p>
                          <p className="text-xs text-muted-foreground">{channel.description}</p>
                        </div>
                        <MessageCircle className="h-4 w-4 text-muted-foreground" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tasks" className="space-y-4">
                {/* Team Tasks */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Recent Tasks ({selectedTeamData.teamTasks.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="max-h-80">
                      {selectedTeamData.teamTasks.map((task) => {
                        const assignee = selectedTeamData.members.find(m => m.id === task.assigneeId);
                        return (
                          <div key={task.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                            <div className="flex-1">
                              <p className="font-medium truncate">{task.title}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge 
                                  variant={task.status === 'completed' ? 'default' : 'secondary'}
                                  className="text-xs"
                                >
                                  {task.status}
                                </Badge>
                                {assignee && (
                                  <span className="text-sm text-muted-foreground">
                                    {assignee.name}
                                  </span>
                                )}
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {task.credits} credits
                            </Badge>
                          </div>
                        );
                      })}
                      {selectedTeamData.teamTasks.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-8">
                          No tasks assigned to this team yet
                        </p>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                {/* Credit Modifiers Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Sliders className="h-4 w-4" />
                      Credit Modifiers
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">Configurable Credit Rules</p>
                        <p className="text-sm text-muted-foreground">
                          Set custom credit multipliers and bonuses based on task attributes
                        </p>
                      </div>
                      <Button 
                        onClick={() => setIsCreditModifiersOpen(true)}
                        className="gap-2"
                        size="sm"
                      >
                        <Settings2 className="h-4 w-4" />
                        Configure Rules
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Active Rules:</p>
                      <div className="space-y-1">
                        <Badge variant="default" className="gap-1">
                          <Target className="h-3 w-3" />
                          High Priority: 1.5x
                        </Badge>
                        <Badge variant="default" className="gap-1">
                          <Target className="h-3 w-3" />
                          Bug Fix: +25 credits
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Team Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Team Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Auto-assign new members</Label>
                          <p className="text-xs text-muted-foreground">Automatically add new team members to general channel</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Enabled
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Credit notifications</Label>
                          <p className="text-xs text-muted-foreground">Notify team when credits are earned</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Enabled
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </div>

      {/* Modals */}
      <CreditModifiersModal
        isOpen={isCreditModifiersOpen}
        onClose={() => setIsCreditModifiersOpen(false)}
        teamName={selectedTeamData?.name || ''}
        teamId={selectedTeam || ''}
      />

      {selectedMemberForHeatmap && (
        <Dialog open={!!selectedMemberForHeatmap} onOpenChange={() => setSelectedMemberForHeatmap(null)}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>Personal Contribution Heatmap</DialogTitle>
              <DialogDescription>
                Detailed activity tracking for {selectedMemberForHeatmap.name}
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[70vh]">
              <PersonalContributionHeatmap 
                userId={selectedMemberForHeatmap.id}
                userName={selectedMemberForHeatmap.name}
              />
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
      </div>
    </div>
  );
}