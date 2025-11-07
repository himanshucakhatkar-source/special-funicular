import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Label } from '../../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { 
  Trophy, 
  Heart, 
  Star, 
  Zap, 
  Plus,
  Award,
  Users,
  TrendingUp,
  Calendar,
  Send
} from 'lucide-react';
import { useHonourus } from '../../../hooks/useHonourus';
import { recognitionsService } from '../../../services/recognitions.service';
import { toast } from 'sonner@2.0.3';

// Recognition data now comes from the backend via recognitionsService

const recognitionTypes = [
  { id: 'achievement', name: 'Achievement', icon: Trophy, color: 'bg-yellow-500' },
  { id: 'collaboration', name: 'Collaboration', icon: Users, color: 'bg-blue-500' },
  { id: 'innovation', name: 'Innovation', icon: Zap, color: 'bg-purple-500' },
  { id: 'leadership', name: 'Leadership', icon: Star, color: 'bg-green-500' },
];

// Mock team members for demo mode
const mockTeamMembers = [
  { id: 'demo-user-2', name: 'Sarah Chen', avatar: 'SC' },
  { id: 'demo-user-3', name: 'Mike Johnson', avatar: 'MJ' },
  { id: 'demo-user-4', name: 'Emily Davis', avatar: 'ED' },
];

export function RecognitionView() {
  const { user, recognitions, teams } = useHonourus();
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [message, setMessage] = useState('');
  const [credits, setCredits] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSendRecognition = async () => {
    if (!selectedRecipient || !selectedType || !message || !credits) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await recognitionsService.createRecognition({
        toUserId: selectedRecipient,
        message,
        credits: parseInt(credits),
        type: selectedType as 'achievement' | 'collaboration' | 'innovation' | 'leadership',
      });

      toast.success('Recognition sent successfully! 🎉');
      setDialogOpen(false);
      setSelectedRecipient('');
      setSelectedType('');
      setMessage('');
      setCredits('');
    } catch (error) {
      console.error('Error sending recognition:', error);
      toast.error('Failed to send recognition. Please try again.');
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const myRecognitions = recognitions.filter(r => r.toUserId === user?.id);
  const givenRecognitions = recognitions.filter(r => r.fromUserId === user?.id);
  
  // Get all team members for the recipient dropdown
  const teamMembers = teams.flatMap(team => 
    team.memberIds?.filter(id => id !== user?.id) || []
  ).filter((id, index, arr) => arr.indexOf(id) === index); // Remove duplicates

  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
      <div className="p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Recognition</h1>
            <p className="text-muted-foreground">
              Celebrate achievements and build team culture
            </p>
          </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Give Recognition
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Give Recognition</DialogTitle>
              <DialogDescription>
                Recognize a team member's contribution and award them credits.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="recipient">Recipient</Label>
                <Select value={selectedRecipient} onValueChange={setSelectedRecipient}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team member" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockTeamMembers.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">{member.avatar}</AvatarFallback>
                          </Avatar>
                          <span>{member.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="type">Recognition Type</Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {recognitionTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        <div className="flex items-center gap-2">
                          <type.icon className="h-4 w-4" />
                          <span>{type.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Share why this person deserves recognition..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="credits">Credits to Award</Label>
                <Input
                  id="credits"
                  type="number"
                  placeholder="25"
                  value={credits}
                  onChange={(e) => setCredits(e.target.value)}
                  min="1"
                  max="100"
                />
              </div>

              <Button onClick={handleSendRecognition} className="w-full gap-2">
                <Send className="h-4 w-4" />
                Send Recognition
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Trophy className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{myRecognitions.length}</div>
            <p className="text-sm text-muted-foreground">Received</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{givenRecognitions.length}</div>
            <p className="text-sm text-muted-foreground">Given</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Award className="h-8 w-8 text-accent mx-auto mb-2" />
            <div className="text-2xl font-bold">{user?.credits || 0}</div>
            <p className="text-sm text-muted-foreground">Total Credits</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">+25%</div>
            <p className="text-sm text-muted-foreground">This Month</p>
          </CardContent>
        </Card>
      </div>

      {/* Recognition Feed */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Recognition</TabsTrigger>
          <TabsTrigger value="received">Received</TabsTrigger>
          <TabsTrigger value="given">Given</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {recognitions.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Recognition Yet</h3>
                <p className="text-muted-foreground mb-4">Start building team culture by giving recognition to your teammates.</p>
                <Button onClick={() => setDialogOpen(true)}>
                  Give First Recognition
                </Button>
              </CardContent>
            </Card>
          ) : (
            recognitions.map((recognition, index) => (
              <motion.div
                key={recognition.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarFallback>
                          {recognition.fromUserId === user?.id ? user?.name?.[0] : 'U'}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium">
                            {recognition.fromUserId === user?.id ? user?.name : 'Team Member'}
                          </span>
                          <span className="text-muted-foreground">recognized</span>
                          <span className="font-medium">
                            {recognition.toUserId === user?.id ? 'You' : 'Team Member'}
                          </span>
                          
                          {(() => {
                            const type = recognitionTypes.find(t => t.id === recognition.type);
                            return type ? (
                              <Badge variant="secondary" className="flex items-center gap-1">
                                <type.icon className="h-3 w-3" />
                                {type.name}
                              </Badge>
                            ) : null;
                          })()}
                          
                          <Badge className="bg-primary hover:bg-primary/90">
                            +{recognition.credits} credits
                          </Badge>
                        </div>
                        
                        <p className="text-sm leading-relaxed">{recognition.message}</p>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatTimeAgo(recognition.createdAt)}
                          </span>
                          <Badge variant="outline" className="text-xs">Public</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </TabsContent>

        <TabsContent value="received" className="space-y-4">
          {myRecognitions.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Recognition Received</h3>
                <p className="text-muted-foreground">Recognition from teammates will appear here.</p>
              </CardContent>
            </Card>
          ) : (
            myRecognitions.map((recognition, index) => (
              <motion.div
                key={recognition.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow border-primary/20 bg-primary/5">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarFallback>T</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium">Team Member</span>
                          <span className="text-muted-foreground">recognized you for</span>
                          
                          {(() => {
                            const type = recognitionTypes.find(t => t.id === recognition.type);
                            return type ? (
                              <Badge variant="secondary" className="flex items-center gap-1">
                                <type.icon className="h-3 w-3" />
                                {type.name}
                              </Badge>
                            ) : null;
                          })()}
                          
                          <Badge className="bg-primary hover:bg-primary/90">
                            +{recognition.credits} credits
                          </Badge>
                        </div>
                        
                        <p className="text-sm leading-relaxed">{recognition.message}</p>
                        
                        <p className="text-xs text-muted-foreground">
                          {formatTimeAgo(recognition.createdAt)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </TabsContent>

        <TabsContent value="given" className="space-y-4">
          {givenRecognitions.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Recognition Given</h3>
                <p className="text-muted-foreground mb-4">Start recognizing your teammates' great work!</p>
                <Button onClick={() => setDialogOpen(true)}>
                  Give Recognition
                </Button>
              </CardContent>
            </Card>
          ) : (
            givenRecognitions.map((recognition, index) => (
              <motion.div
                key={recognition.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarFallback>T</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-muted-foreground">You recognized</span>
                          <span className="font-medium">Team Member</span>
                          <span className="text-muted-foreground">for</span>
                          
                          {(() => {
                            const type = recognitionTypes.find(t => t.id === recognition.type);
                            return type ? (
                              <Badge variant="secondary" className="flex items-center gap-1">
                                <type.icon className="h-3 w-3" />
                                {type.name}
                              </Badge>
                            ) : null;
                          })()}
                          
                          <Badge className="bg-accent hover:bg-accent/90">
                            {recognition.credits} credits given
                          </Badge>
                        </div>
                        
                        <p className="text-sm leading-relaxed">{recognition.message}</p>
                        
                        <p className="text-xs text-muted-foreground">
                          {formatTimeAgo(recognition.createdAt)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}