import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  CheckCircle, 
  Clock,
  AlertCircle,
  Target,
  Users,
  Settings,
  BarChart3,
  Award,
  Calendar,
  Lightbulb
} from 'lucide-react';

interface FeatureStatus {
  name: string;
  description: string;
  status: 'completed' | 'in-progress' | 'planned';
  progress: number;
  icon: any;
  components: string[];
  location: string;
}

const implementationFeatures: FeatureStatus[] = [
  {
    name: 'Integration Settings',
    description: 'Connect external project management tools with automated workflows',
    status: 'completed',
    progress: 100,
    icon: Settings,
    components: ['IntegrationSetupModal', 'SettingsView'],
    location: 'Settings → Integrations'
  },
  {
    name: 'Team Insights & Unsung Heroes',
    description: 'Identify high-value contributors who might be overlooked',
    status: 'completed',
    progress: 100,
    icon: Award,
    components: ['TeamInsightsView', 'AnalyticsView'],
    location: 'Analytics → Team Insights'
  },
  {
    name: 'Credit Modifiers System',
    description: 'Configurable rules for fair credit allocation based on task attributes',
    status: 'completed',
    progress: 100,
    icon: Target,
    components: ['CreditModifiersModal', 'TeamsView'],
    location: 'Teams → Settings Tab'
  },
  {
    name: 'Personal Contribution Heatmap',
    description: 'Visual activity tracking with detailed daily breakdowns',
    status: 'completed',
    progress: 100,
    icon: Calendar,
    components: ['PersonalContributionHeatmap', 'TeamsView'],
    location: 'Teams → Members → View Activity'
  },
  {
    name: 'Performance Co-Pilot Dashboard',
    description: 'Central hub for manager insights and quick access to tools',
    status: 'completed',
    progress: 100,
    icon: BarChart3,
    components: ['AnalyticsView', 'DashboardView'],
    location: 'Analytics → Overview & Dashboard'
  },
  {
    name: 'Interactive Demo System',
    description: 'Guided walkthrough of all Manager\'s Co-Pilot features',
    status: 'completed',
    progress: 100,
    icon: Lightbulb,
    components: ['ManagerCoPilotDemo', 'DashboardView'],
    location: 'Dashboard → Interactive Demo'
  },
  {
    name: 'Backend Integration',
    description: 'Supabase integration with robust fallback systems',
    status: 'completed',
    progress: 100,
    icon: Users,
    components: ['ApiService', 'AuthService', 'BackendStatusCard'],
    location: 'Settings → Backend Status'
  }
];

export function ImplementationStatus() {
  const completedFeatures = implementationFeatures.filter(f => f.status === 'completed').length;
  const totalFeatures = implementationFeatures.length;
  const completionPercentage = Math.round((completedFeatures / totalFeatures) * 100);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in-progress': return Clock;
      default: return AlertCircle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'in-progress': return 'text-amber-600';
      default: return 'text-blue-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'in-progress': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Manager's Performance Co-Pilot</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Complete implementation status and feature overview
        </p>
        
        {/* Overall Progress */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold">Implementation Progress</h3>
                <p className="text-muted-foreground">All Manager's Co-Pilot features</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-green-600">{completionPercentage}%</div>
                <div className="text-sm text-muted-foreground">Complete</div>
              </div>
            </div>
            <Progress value={completionPercentage} className="h-3" />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>{completedFeatures} of {totalFeatures} features completed</span>
              <span>Ready for production use</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {implementationFeatures.map((feature, index) => {
          const StatusIcon = getStatusIcon(feature.status);
          const FeatureIcon = feature.icon;
          
          return (
            <Card key={index} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                      <FeatureIcon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{feature.name}</CardTitle>
                      <Badge variant={getStatusBadge(feature.status) as any} className="gap-1 mt-1">
                        <StatusIcon className={`h-3 w-3 ${getStatusColor(feature.status)}`} />
                        {feature.status.charAt(0).toUpperCase() + feature.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{feature.progress}%</div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{feature.description}</p>
                
                <div>
                  <h4 className="font-medium mb-2">Location</h4>
                  <Badge variant="outline">{feature.location}</Badge>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Components</h4>
                  <div className="flex flex-wrap gap-1">
                    {feature.components.map((component, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {component}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Progress value={feature.progress} className="h-2" />
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 border-green-200 dark:border-green-800">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-green-700 dark:text-green-300">
                Implementation Complete!
              </h3>
              <p className="text-green-600 dark:text-green-400 mt-1">
                All Manager's Performance Co-Pilot features have been successfully implemented and are ready for use. 
                The system includes comprehensive fallbacks, performance optimizations, and an interactive demo system.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant="default" className="bg-green-600">Production Ready</Badge>
                <Badge variant="secondary">Demo Available</Badge>
                <Badge variant="secondary">Backend Optional</Badge>
                <Badge variant="secondary">Fully Responsive</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}