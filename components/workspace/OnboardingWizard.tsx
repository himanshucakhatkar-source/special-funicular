import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  Rocket, 
  Link as LinkIcon, 
  Users, 
  Settings, 
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface OnboardingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: OnboardingData) => void;
}

interface OnboardingData {
  companyName: string;
  teamSize: string;
  selectedIntegration: string;
  teamMembers: string[];
  creditSettings: {
    defaultTaskCredits: number;
    enableAI: boolean;
  };
}

export function OnboardingWizard({ isOpen, onClose, onComplete }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<OnboardingData>({
    companyName: '',
    teamSize: '',
    selectedIntegration: '',
    teamMembers: [],
    creditSettings: {
      defaultTaskCredits: 100,
      enableAI: true
    }
  });

  const steps = [
    {
      id: 'welcome',
      title: 'Welcome to Honourus!',
      description: 'Let\'s get your team set up in just a few minutes',
      icon: Rocket
    },
    {
      id: 'integration',
      title: 'Connect Your First Tool',
      description: 'Choose where your team works to start recognizing contributions',
      icon: LinkIcon
    },
    {
      id: 'team',
      title: 'Invite Your Team',
      description: 'Add team members to start building your culture of trust',
      icon: Users
    },
    {
      id: 'settings',
      title: 'Configure Credits',
      description: 'Set up how credits are calculated and distributed',
      icon: Settings
    },
    {
      id: 'complete',
      title: 'You\'re All Set!',
      description: 'Your workspace is ready. Time to start recognizing great work!',
      icon: CheckCircle2
    }
  ];

  const integrations = [
    { id: 'jira', name: 'Jira', icon: '🔷', popular: true },
    { id: 'slack', name: 'Slack', icon: '💬', popular: true },
    { id: 'teams', name: 'Microsoft Teams', icon: '👥', popular: false },
    { id: 'notion', name: 'Notion', icon: '📝', popular: false },
    { id: 'azure', name: 'Azure DevOps', icon: '☁️', popular: false },
  ];

  const teamSizes = [
    { value: '1-10', label: '1-10 people' },
    { value: '11-50', label: '11-50 people' },
    { value: '51-200', label: '51-200 people' },
    { value: '201+', label: '201+ people' },
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;
  const currentStepData = steps[currentStep];
  const StepIcon = currentStepData.icon;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete(formData);
      onClose();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return formData.companyName && formData.teamSize;
      case 1:
        return formData.selectedIntegration;
      case 2:
        return formData.teamMembers.length > 0;
      case 3:
        return formData.creditSettings.defaultTaskCredits > 0;
      default:
        return true;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <DialogHeader>
          <div className="flex items-center gap-4 mb-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <StepIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl">{currentStepData.title}</DialogTitle>
              <DialogDescription className="text-base">
                {currentStepData.description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="py-6"
          >
            {/* Step 0: Welcome */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="companyName">Company or Team Name *</Label>
                    <Input
                      id="companyName"
                      placeholder="e.g., Acme Corp Engineering Team"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label>Team Size *</Label>
                    <div className="grid grid-cols-2 gap-3 mt-1.5">
                      {teamSizes.map((size) => (
                        <button
                          key={size.value}
                          onClick={() => setFormData({ ...formData, teamSize: size.value })}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            formData.teamSize === size.value
                              ? 'border-primary bg-primary/5 font-semibold'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          {size.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Integration */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <p className="text-sm text-blue-900 dark:text-blue-100">
                    <Sparkles className="h-4 w-4 inline mr-1" />
                    Don&apos;t worry! You can connect more integrations later from Settings.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {integrations.map((integration) => (
                    <button
                      key={integration.id}
                      onClick={() => setFormData({ ...formData, selectedIntegration: integration.id })}
                      className={`relative p-6 rounded-xl border-2 transition-all ${
                        formData.selectedIntegration === integration.id
                          ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                          : 'border-border hover:border-primary/50 hover:shadow-md'
                      }`}
                    >
                      {integration.popular && (
                        <Badge className="absolute top-3 right-3 bg-gradient-to-r from-primary to-accent text-white border-0 text-xs">
                          Popular
                        </Badge>
                      )}
                      <div className="text-4xl mb-3">{integration.icon}</div>
                      <div className="font-semibold">{integration.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {formData.selectedIntegration === integration.id ? 'Selected' : 'Click to select'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Team Members */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="teamEmail">Add Team Member Email</Label>
                  <div className="flex gap-2 mt-1.5">
                    <Input
                      id="teamEmail"
                      type="email"
                      placeholder="teammate@company.com"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value) {
                          setFormData({
                            ...formData,
                            teamMembers: [...formData.teamMembers, e.currentTarget.value]
                          });
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                    <Button type="button" onClick={() => {
                      const input = document.getElementById('teamEmail') as HTMLInputElement;
                      if (input.value) {
                        setFormData({
                          ...formData,
                          teamMembers: [...formData.teamMembers, input.value]
                        });
                        input.value = '';
                      }
                    }}>
                      Add
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Press Enter or click Add to include team members
                  </p>
                </div>

                {formData.teamMembers.length > 0 && (
                  <div className="space-y-2">
                    <Label>Team Members ({formData.teamMembers.length})</Label>
                    <div className="space-y-2">
                      {formData.teamMembers.map((email, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                        >
                          <span className="text-sm">{email}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                teamMembers: formData.teamMembers.filter((_, i) => i !== index)
                              });
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Credit Settings */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="defaultCredits">Default Credits per Task</Label>
                  <Input
                    id="defaultCredits"
                    type="number"
                    min="1"
                    value={formData.creditSettings.defaultTaskCredits}
                    onChange={(e) => setFormData({
                      ...formData,
                      creditSettings: {
                        ...formData.creditSettings,
                        defaultTaskCredits: parseInt(e.target.value) || 0
                      }
                    })}
                    className="mt-1.5"
                  />
                  <p className="text-xs text-muted-foreground mt-1.5">
                    You can adjust this for individual tasks later
                  </p>
                </div>

                <div className="p-6 rounded-xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-2">Enable AI-Powered Attribution</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Let AI automatically detect and flag verbal contributions from meetings, Slack, and more
                      </p>
                      <Badge className="bg-emerald-500 text-white">Recommended for Professional & Enterprise</Badge>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Complete */}
            {currentStep === 4 && (
              <div className="text-center py-8">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-500/30">
                  <CheckCircle2 className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">
                  Welcome to Honourus, {formData.companyName}!
                </h3>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Your workspace is ready. We&apos;ve sent invitations to your team members and configured your {formData.selectedIntegration} integration.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-primary">{formData.teamMembers.length}</div>
                    <div className="text-xs text-muted-foreground">Team Members</div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-primary">1</div>
                    <div className="text-xs text-muted-foreground">Integration Connected</div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-primary">{formData.creditSettings.defaultTaskCredits}</div>
                    <div className="text-xs text-muted-foreground">Default Credits</div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-border">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={onClose}
            >
              Skip Setup
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className={currentStep === steps.length - 1 
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white'
                : ''
              }
            >
              {currentStep === steps.length - 1 ? 'Go to Dashboard' : 'Continue'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
