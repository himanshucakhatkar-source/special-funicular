import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Checkbox } from '../ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { 
  CheckCircle, 
  ExternalLink, 
  ArrowRight, 
  ArrowLeft, 
  Settings2,
  Target,
  AlertCircle 
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface IntegrationSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  integrationType: 'jira' | 'clickup';
}

const mockJiraProjects = [
  { id: 'PROJ-1', name: 'Web Application', key: 'WEB' },
  { id: 'PROJ-2', name: 'Mobile App', key: 'MOB' },
  { id: 'PROJ-3', name: 'API Development', key: 'API' },
  { id: 'PROJ-4', name: 'Design System', key: 'DS' },
];

const mockJiraStatuses = [
  { id: 'done', name: 'Done', description: 'Task is completed and reviewed' },
  { id: 'closed', name: 'Closed', description: 'Task is closed and resolved' },
  { id: 'resolved', name: 'Resolved', description: 'Task is resolved but not closed' },
  { id: 'in-review', name: 'In Review', description: 'Task is under review' },
  { id: 'testing', name: 'Testing', description: 'Task is being tested' },
];

const mockClickUpSpaces = [
  { id: 'SPACE-1', name: 'Product Development', color: '#7b68ee' },
  { id: 'SPACE-2', name: 'Marketing Campaigns', color: '#ff6b6b' },
  { id: 'SPACE-3', name: 'Customer Support', color: '#4ecdc4' },
  { id: 'SPACE-4', name: 'HR & Operations', color: '#45b7d1' },
];

const mockClickUpStatuses = [
  { id: 'complete', name: 'Complete', description: 'Task is fully completed' },
  { id: 'closed', name: 'Closed', description: 'Task is closed' },
  { id: 'done', name: 'Done', description: 'Task is done' },
  { id: 'ready', name: 'Ready for Review', description: 'Task is ready for review' },
  { id: 'approved', name: 'Approved', description: 'Task is approved' },
];

export const IntegrationSetupModal = React.memo(function IntegrationSetupModal({ isOpen, onClose, integrationType }: IntegrationSetupModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [statusMappings, setStatusMappings] = useState<Record<string, { enabled: boolean; credits: number }>>({});
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  const integrationConfig = {
    jira: {
      name: 'Jira',
      icon: 'J',
      color: 'bg-blue-600',
      projects: mockJiraProjects,
      statuses: mockJiraStatuses,
      projectLabel: 'Projects',
      spaceLabel: 'Projects'
    },
    clickup: {
      name: 'ClickUp',
      icon: 'C',
      color: 'bg-purple-600',
      projects: mockClickUpSpaces,
      statuses: mockClickUpStatuses,
      projectLabel: 'Spaces',
      spaceLabel: 'Spaces'
    }
  };

  const config = integrationConfig[integrationType];

  const handleProjectToggle = (projectId: string) => {
    setSelectedProjects(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const handleStatusToggle = (statusId: string) => {
    setStatusMappings(prev => ({
      ...prev,
      [statusId]: {
        enabled: !prev[statusId]?.enabled,
        credits: prev[statusId]?.credits || 50
      }
    }));
  };

  const handleCreditsChange = (statusId: string, credits: number) => {
    setStatusMappings(prev => ({
      ...prev,
      [statusId]: {
        ...prev[statusId],
        credits
      }
    }));
  };

  const handleAuthorization = async () => {
    setIsAuthorizing(true);
    
    // Simulate OAuth process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsAuthorizing(false);
    setCurrentStep(2);
    toast.success(`Successfully connected to ${config.name}!`);
  };

  const handleComplete = () => {
    const enabledMappings = Object.entries(statusMappings).filter(([_, mapping]) => mapping.enabled);
    
    if (enabledMappings.length === 0) {
      toast.error('Please select at least one status to map');
      return;
    }

    if (selectedProjects.length === 0) {
      toast.error(`Please select at least one ${config.spaceLabel.toLowerCase()}`);
      return;
    }

    toast.success(`${config.name} integration configured successfully!`);
    onClose();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center py-8">
              <div className={`w-16 h-16 ${config.color} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                <span className="text-white font-bold text-2xl">{config.icon}</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Connect to {config.name}</h3>
              <p className="text-muted-foreground mb-6">
                Authorize Honourus to access your {config.name} workspace
              </p>
              
              {isAuthorizing ? (
                <div className="space-y-4">
                  <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
                  <p className="text-sm text-muted-foreground">
                    Redirecting to {config.name} for authorization...
                  </p>
                </div>
              ) : (
                <Button onClick={handleAuthorization} className="gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Authorize with {config.name}
                </Button>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Select {config.projectLabel}</h3>
              <p className="text-muted-foreground mb-4">
                Choose which {config.spaceLabel.toLowerCase()} you want Honourus to monitor
              </p>
            </div>

            <ScrollArea className="h-64">
              <div className="space-y-3">
                {config.projects.map((project) => (
                  <Card 
                    key={project.id}
                    className={`cursor-pointer transition-colors ${
                      selectedProjects.includes(project.id) 
                        ? 'border-primary bg-primary/5' 
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => handleProjectToggle(project.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Checkbox 
                          checked={selectedProjects.includes(project.id)}
                          readOnly
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{project.name}</h4>
                            {'key' in project && (
                              <Badge variant="outline" className="text-xs">
                                {project.key}
                              </Badge>
                            )}
                            {'color' in project && (
                              <div 
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: project.color }}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(1)} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button 
                onClick={() => setCurrentStep(3)} 
                disabled={selectedProjects.length === 0}
                className="gap-2"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Status Mapping</h3>
              <p className="text-muted-foreground mb-4">
                Map your {config.name} statuses to Honourus completion and configure credit rewards
              </p>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
              <div className="flex gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Only enabled statuses will trigger credit allocation in Honourus
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-4 gap-4 pb-2 border-b text-sm font-medium text-muted-foreground">
                <span>{config.name} Status</span>
                <span>Map to Honourus?</span>
                <span>Credits per Completion</span>
                <span></span>
              </div>

              {config.statuses.map((status) => (
                <div key={status.id} className="grid grid-cols-4 gap-4 items-center py-3 border-b">
                  <div>
                    <p className="font-medium">{status.name}</p>
                    <p className="text-xs text-muted-foreground">{status.description}</p>
                  </div>
                  
                  <div>
                    <Switch
                      checked={statusMappings[status.id]?.enabled || false}
                      onCheckedChange={() => handleStatusToggle(status.id)}
                    />
                  </div>
                  
                  <div>
                    <Input
                      type="number"
                      placeholder="50"
                      value={statusMappings[status.id]?.credits || ''}
                      onChange={(e) => handleCreditsChange(status.id, parseInt(e.target.value) || 0)}
                      disabled={!statusMappings[status.id]?.enabled}
                      className="w-24"
                    />
                  </div>
                  
                  <div>
                    {statusMappings[status.id]?.enabled && (
                      <Badge variant="default" className="gap-1">
                        <Target className="h-3 w-3" />
                        Active
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(2)} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button onClick={() => setCurrentStep(4)} className="gap-2">
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Ready to Activate</h3>
              <p className="text-muted-foreground mb-6">
                Review your configuration and activate the integration
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Configuration Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Connected {config.spaceLabel}</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedProjects.length} {config.spaceLabel.toLowerCase()} selected
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <Label className="text-sm font-medium">Status Mappings</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {Object.values(statusMappings).filter(m => m.enabled).length} statuses mapped for credit allocation
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <Label className="text-sm font-medium">Total Credits Available</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {Object.values(statusMappings)
                      .filter(m => m.enabled)
                      .reduce((sum, m) => sum + m.credits, 0)} credits per completion cycle
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(3)} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button onClick={handleComplete} className="gap-2">
                <Settings2 className="h-4 w-4" />
                Activate Integration
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Setup {config.name} Integration</DialogTitle>
          <DialogDescription>
            Connect your {config.name} workspace to automatically track tasks and award credits
          </DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center gap-2 my-4">
          {[1, 2, 3, 4].map((step) => (
            <React.Fragment key={step}>
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {step < currentStep ? <CheckCircle className="h-4 w-4" /> : step}
              </div>
              {step < 4 && (
                <div 
                  className={`flex-1 h-0.5 ${
                    step < currentStep ? 'bg-primary' : 'bg-muted'
                  }`} 
                />
              )}
            </React.Fragment>
          ))}
        </div>

        <ScrollArea className="max-h-[60vh]">
          {renderStepContent()}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
});