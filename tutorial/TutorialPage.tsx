import React from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { useHonourus } from '../../hooks/useHonourus';
import { 
  CheckCircle, 
  Users, 
  BarChart3, 
  Trophy, 
  ArrowRight, 
  ArrowLeft,
  Target,
  Lightbulb,
  Rocket
} from 'lucide-react';
import { Logo } from '../ui/logo';

export function TutorialPage() {
  const { tutorialStep, setTutorialStep, setMode, user, refreshData } = useHonourus();

  const handleNext = async () => {
    if (tutorialStep < 4) {
      setTutorialStep(tutorialStep + 1);
    } else {
      // Load initial data when entering workspace
      await refreshData();
      setMode('workspace');
    }
  };

  const handlePrevious = () => {
    if (tutorialStep > 1) {
      setTutorialStep(tutorialStep - 1);
    }
  };

  const handleSkip = () => {
    setMode('workspace');
  };

  const progress = (tutorialStep / 4) * 100;

  const steps = [
    {
      title: 'Welcome to Honourus',
      subtitle: 'Your journey to better workplace culture starts here',
      icon: Rocket,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Logo size="lg" showText={false} />
            </div>
            <h2 className="text-2xl font-bold mb-2">Welcome, {user?.name}!</h2>
            <p className="text-muted-foreground">
              We're excited to help you transform your workplace culture through recognition and productivity.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
              <CardContent className="p-4 text-center">
                <Target className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold">Goal-Oriented</h3>
                <p className="text-sm text-muted-foreground">Track and achieve your team objectives</p>
              </CardContent>
            </Card>
            
            <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-primary/5">
              <CardContent className="p-4 text-center">
                <Lightbulb className="h-8 w-8 text-accent mx-auto mb-2" />
                <h3 className="font-semibold">Innovative</h3>
                <p className="text-sm text-muted-foreground">Modern tools for modern teams</p>
              </CardContent>
            </Card>
          </div>
        </div>
      ),
    },
    {
      title: 'Task Management',
      subtitle: 'Organize work with Kanban boards and credit rewards',
      icon: CheckCircle,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <Card className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">To Do</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="p-2 bg-white dark:bg-gray-800 rounded border">
                  <p className="text-xs font-medium">Update Documentation</p>
                  <Badge variant="secondary" className="text-xs mt-1">25 credits</Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">In Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="p-2 bg-white dark:bg-gray-800 rounded border">
                  <p className="text-xs font-medium">Q4 Performance Review</p>
                  <Badge variant="secondary" className="text-xs mt-1">50 credits</Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Completed</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="p-2 bg-white dark:bg-gray-800 rounded border">
                  <p className="text-xs font-medium">Team Building Workshop</p>
                  <Badge className="text-xs mt-1 bg-green-600">75 credits earned</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-sm">
              <strong>Pro Tip:</strong> Tasks with "Requires Proof" won't award credits until proof is uploaded!
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'Team Collaboration',
      subtitle: 'Connect with your team and celebrate achievements',
      icon: Users,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Engineering Team
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs">
                      A
                    </div>
                    <span className="text-sm">Alex Johnson (You)</span>
                    <Badge variant="outline" className="text-xs">Manager</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                      S
                    </div>
                    <span className="text-sm">Sarah Chen</span>
                    <Badge variant="outline" className="text-xs">Developer</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  Recent Recognition
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="p-2 bg-muted/50 rounded">
                    <p className="text-xs font-medium">Great job on the project!</p>
                    <p className="text-xs text-muted-foreground">+30 credits from John</p>
                  </div>
                  <div className="p-2 bg-muted/50 rounded">
                    <p className="text-xs font-medium">Excellent collaboration</p>
                    <p className="text-xs text-muted-foreground">+25 credits from Sarah</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
            <p className="text-sm">
              <strong>Your Current Credits:</strong> {user?.credits} 🏆
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'Analytics & Insights',
      subtitle: 'Track progress and boost productivity',
      icon: BarChart3,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">85%</div>
                <p className="text-sm text-muted-foreground">Task Completion</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-accent">12</div>
                <p className="text-sm text-muted-foreground">Recognitions</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-500">98%</div>
                <p className="text-sm text-muted-foreground">Team Satisfaction</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-500">{user?.credits}</div>
                <p className="text-sm text-muted-foreground">Credits Earned</p>
              </CardContent>
            </Card>
          </div>
          
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="p-4 text-center">
              <h3 className="font-semibold mb-2">Ready to get started?</h3>
              <p className="text-sm text-muted-foreground">
                You're all set to transform your workplace culture with Honourus!
              </p>
            </CardContent>
          </Card>
        </div>
      ),
    },
  ];

  const currentStep = steps[tutorialStep - 1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Logo size="md" />
          </div>
          
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground">
              Step {tutorialStep} of 4
            </p>
          </div>
        </div>

        {/* Content Card */}
        <motion.div
          key={tutorialStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 w-fit">
                <currentStep.icon className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">{currentStep.title}</CardTitle>
              <p className="text-muted-foreground">{currentStep.subtitle}</p>
            </CardHeader>
            
            <CardContent className="pb-8">
              {currentStep.content}
            </CardContent>
          </Card>
        </motion.div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <div className="flex gap-2">
            {tutorialStep > 1 && (
              <Button variant="outline" onClick={handlePrevious}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
            )}
            <Button variant="ghost" onClick={handleSkip}>
              Skip Tutorial
            </Button>
          </div>
          
          <Button onClick={handleNext}>
            {tutorialStep === 4 ? 'Enter Workspace' : 'Next'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}