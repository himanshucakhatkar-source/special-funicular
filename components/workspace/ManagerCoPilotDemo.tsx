import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  Play, 
  Pause, 
  SkipForward, 
  RotateCcw, 
  CheckCircle,
  Eye,
  Settings2,
  Award,
  Calendar,
  Users,
  TrendingUp,
  Target,
  Lightbulb,
  X
} from 'lucide-react';

interface DemoStep {
  id: string;
  title: string;
  description: string;
  component: string;
  location: string;
  features: string[];
  icon: any;
  duration: number;
}

const demoSteps: DemoStep[] = [
  {
    id: 'integration-settings',
    title: 'Integration Settings',
    description: 'Connect external project management tools like Jira and ClickUp with automated credit allocation.',
    component: 'Settings → Integrations',
    location: 'Settings page, Integrations section',
    features: [
      'OAuth integration with Jira & ClickUp',
      'Project/Space selection interface',
      'Status mapping configuration',
      'Automated credit allocation rules',
      'Webhook setup and management'
    ],
    icon: Settings2,
    duration: 3000
  },
  {
    id: 'team-insights',
    title: 'Team Insights & Unsung Heroes',
    description: 'Discover team members who contribute valuable work that might go unnoticed.',
    component: 'Analytics → Team Insights',
    location: 'Analytics page, Team Insights tab',
    features: [
      'Unsung Hero identification algorithm',
      'High-value, low-visibility task tracking',
      'Special recognition workflow',
      'Time range and team filtering',
      'Contribution trend analysis',
      'Pre-filled recognition templates'
    ],
    icon: Eye,
    duration: 4000
  },
  {
    id: 'credit-modifiers',
    title: 'Team Credit Modifiers',
    description: 'Configure custom credit rules based on task attributes for fair recognition.',
    component: 'Teams → [Team] → Settings',
    location: 'Teams page, Settings tab',
    features: [
      'Attribute-based rule builder',
      'Priority, type, and complexity modifiers',
      'Multiply or add credit options',
      'Rule activation/deactivation',
      'Conflict prevention system',
      'Real-time rule preview'
    ],
    icon: Target,
    duration: 3500
  },
  {
    id: 'contribution-heatmap',
    title: 'Personal Contribution Heatmap',
    description: 'Visualize individual activity patterns and contribution history over time.',
    component: 'Teams → Members → View Activity',
    location: 'Teams page, member activity modal',
    features: [
      '90-day activity calendar visualization',
      'Color-coded task completion intensity',
      'Daily task detail modals',
      'Time range selection options',
      'Top task type analytics',
      'Activity rate statistics'
    ],
    icon: Calendar,
    duration: 3000
  },
  {
    id: 'performance-insights',
    title: 'Performance Co-Pilot Dashboard',
    description: 'Central hub for manager insights with quick access to all performance tools.',
    component: 'Analytics → Overview',
    location: 'Analytics page, Manager\'s Co-Pilot section',
    features: [
      'Prominent Unsung Heroes card',
      'Team performance summary',
      'Hidden contributor identification',
      'One-click navigation to insights',
      'Performance trend indicators',
      'Actionable recommendations'
    ],
    icon: TrendingUp,
    duration: 2500
  }
];

interface ManagerCoPilotDemoProps {
  onClose: () => void;
}

export function ManagerCoPilotDemo({ onClose }: ManagerCoPilotDemoProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const currentDemoStep = demoSteps[currentStep];

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (100 / (currentDemoStep.duration / 100));
          if (newProgress >= 100) {
            handleNext();
            return 0;
          }
          return newProgress;
        });
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentStep, currentDemoStep.duration]);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleNext = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
      setProgress(0);
    } else {
      setIsPlaying(false);
      setProgress(0);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setProgress(0);
      setIsPlaying(false);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setProgress(0);
    setIsPlaying(false);
  };

  const StepIcon = currentDemoStep.icon;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-4xl"
      >
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <Lightbulb className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle>Manager's Performance Co-Pilot Demo</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Interactive walkthrough of advanced performance management features
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Step {currentStep + 1} of {demoSteps.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Current Step */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center flex-shrink-0">
                    <StepIcon className="h-6 w-6 text-white" />
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="text-xl font-semibold">{currentDemoStep.title}</h3>
                      <p className="text-muted-foreground">{currentDemoStep.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Location</h4>
                        <Badge variant="outline" className="gap-1">
                          <Users className="h-3 w-3" />
                          {currentDemoStep.location}
                        </Badge>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Component</h4>
                        <Badge variant="secondary">
                          {currentDemoStep.component}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Key Features</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {currentDemoStep.features.map((feature, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center gap-2 text-sm"
                          >
                            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                            <span>{feature}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Controls */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                >
                  Previous
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={isPlaying ? handlePause : handlePlay}
                  disabled={currentStep === demoSteps.length - 1 && progress === 0}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="h-4 w-4 mr-1" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-1" />
                      Play
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNext}
                  disabled={currentStep === demoSteps.length - 1}
                >
                  <SkipForward className="h-4 w-4 mr-1" />
                  Next
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Reset
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {currentStep + 1}/{demoSteps.length}
                </Badge>
                
                {currentStep === demoSteps.length - 1 && (
                  <Button onClick={onClose} className="gap-2">
                    <Award className="h-4 w-4" />
                    Start Exploring
                  </Button>
                )}
              </div>
            </div>

            {/* Step Indicators */}
            <div className="flex justify-center gap-2">
              {demoSteps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentStep(index);
                    setProgress(0);
                    setIsPlaying(false);
                  }}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep 
                      ? 'bg-primary' 
                      : index < currentStep 
                        ? 'bg-primary/50' 
                        : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}