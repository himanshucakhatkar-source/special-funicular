import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Card } from '../../ui/card';
import { EnhancedContributionCard } from '../EnhancedContributionCard';
import { AIAttributionWidget } from '../AIAttributionWidget';
import { CollectiveTaskWeightingModal } from '../CollectiveTaskWeightingModal';
import { IntegrationHealthDashboard } from '../IntegrationHealthDashboard';
import { OnboardingWizard } from '../OnboardingWizard';
import { Badge } from '../../ui/badge';
import { 
  Sparkles, 
  Rocket, 
  LayoutDashboard, 
  KanbanSquare, 
  Palette, 
  Trophy,
  ArrowRight,
  Zap
} from 'lucide-react';

export function ShowcaseView() {
  const [weightingModalOpen, setWeightingModalOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);

  // Mock data for demonstrations
  const mockContributionData = {
    userName: 'Alex Johnson',
    totalCredits: 1850,
    recentActivity: 'Completed "API Integration Refactor" task',
    timestamp: '2 hours ago',
    isVerified: true,
    verificationSource: 'trust-ledger' as const,
    creditTrend: [
      { value: 100, date: '2025-09-08' },
      { value: 150, date: '2025-09-15' },
      { value: 120, date: '2025-09-22' },
      { value: 180, date: '2025-09-29' },
      { value: 200, date: '2025-10-06' },
    ],
    percentageChange: 15,
    reputationScore: 92
  };

  const mockAIAttributions = [
    {
      id: '1',
      contributor: 'Sarah Chen',
      contribution: 'Suggested implementing the new caching strategy that reduced API calls by 40%',
      source: 'slack' as const,
      timestamp: '1 hour ago',
      confidence: 95,
      context: 'During the architecture discussion in #engineering channel, Sarah proposed a Redis-based caching layer.',
      suggestedCredits: 150,
      status: 'pending' as const
    },
    {
      id: '2',
      contributor: 'Mike Torres',
      contribution: 'Identified the root cause of the memory leak in the production environment',
      source: 'teams' as const,
      timestamp: '3 hours ago',
      confidence: 88,
      suggestedCredits: 200,
      status: 'approved' as const
    },
    {
      id: '3',
      contributor: 'Emma Wilson',
      contribution: 'Proposed the user flow improvements that increased conversion by 12%',
      source: 'meet' as const,
      timestamp: 'Yesterday',
      confidence: 92,
      context: 'During the product planning meeting, Emma presented wireframes and user research.',
      suggestedCredits: 180,
      status: 'pending' as const
    }
  ];

  const mockTeamMembers = [
    { id: '1', name: 'Alex Johnson', role: 'Tech Lead', defaultWeight: 35 },
    { id: '2', name: 'Sarah Chen', role: 'Senior Engineer', defaultWeight: 30 },
    { id: '3', name: 'Mike Torres', role: 'Engineer', defaultWeight: 20 },
    { id: '4', name: 'Emma Wilson', role: 'Designer', defaultWeight: 15 }
  ];

  const mockWebhookEvents = [
    {
      id: '1',
      source: 'jira' as const,
      timestamp: '2025-10-08 14:32:15',
      eventType: 'issue.updated',
      parseStatus: 'success' as const,
      payload: {
        issue: {
          key: 'PROJ-123',
          fields: {
            summary: 'API Integration Task',
            status: 'Done',
            assignee: 'alex.johnson'
          }
        }
      },
      processingTime: 45
    },
    {
      id: '2',
      source: 'slack' as const,
      timestamp: '2025-10-08 14:15:22',
      eventType: 'message.channels',
      parseStatus: 'success' as const,
      payload: {
        channel: 'engineering',
        user: 'sarah.chen',
        text: 'Great work on the caching implementation!',
        ts: '1696776922.000100'
      },
      processingTime: 32
    },
    {
      id: '3',
      source: 'teams' as const,
      timestamp: '2025-10-08 13:45:10',
      eventType: 'message.posted',
      parseStatus: 'failed' as const,
      payload: {
        error: 'Invalid webhook signature'
      },
      processingTime: 12
    }
  ];

  const mockSyncLogs = [
    {
      id: '1',
      targetPlatform: 'jira' as const,
      action: 'Added recognition comment to PROJ-123',
      status: 'success' as const,
      timestamp: '2025-10-08 14:35:00'
    },
    {
      id: '2',
      targetPlatform: 'slack' as const,
      action: 'Posted credit notification to #team-updates',
      status: 'success' as const,
      timestamp: '2025-10-08 14:30:15'
    },
    {
      id: '3',
      targetPlatform: 'notion' as const,
      action: 'Updated team member credit balance',
      status: 'failed' as const,
      timestamp: '2025-10-08 14:25:30',
      errorMessage: 'API rate limit exceeded. Retrying in 60 seconds.'
    }
  ];

  // Feature highlights for quick navigation
  const platformFeatures = [
    {
      id: 'dashboard-demo',
      title: 'Dashboard Overview',
      description: 'Real-time insights and analytics',
      icon: LayoutDashboard,
      gradient: 'from-blue-500 to-cyan-500',
      accentColor: 'text-blue-500',
    },
    {
      id: 'kanban-demo',
      title: 'Kanban Task Board',
      description: 'Drag-and-drop workflow management',
      icon: KanbanSquare,
      gradient: 'from-purple-500 to-pink-500',
      accentColor: 'text-purple-500',
    },
    {
      id: 'theme-demo',
      title: 'Theme Customization',
      description: '12+ themes with dark/light modes',
      icon: Palette,
      gradient: 'from-amber-500 to-orange-500',
      accentColor: 'text-amber-500',
    },
    {
      id: 'credits-demo',
      title: 'Credits & Recognition',
      description: 'Gamified reward system',
      icon: Trophy,
      gradient: 'from-emerald-500 to-teal-500',
      accentColor: 'text-emerald-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            UI Component Library
          </h1>
          <p className="text-muted-foreground mt-1">
            Explore Honourus platform components and features
          </p>
        </div>
        <Button onClick={() => setOnboardingOpen(true)} className="gap-2">
          <Rocket className="h-4 w-4" />
          Launch Onboarding
        </Button>
      </div>

      {/* Platform Features Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {platformFeatures.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card key={feature.id} className="group relative overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer">
              <div className="p-6 space-y-3">
                {/* Icon */}
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                
                {/* Title & Description */}
                <div>
                  <h3 className="mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>

                {/* Quick Action */}
                <div className="flex items-center gap-2 text-sm text-primary">
                  <Zap className="h-3 w-3" />
                  <span>View Components</span>
                  <ArrowRight className="h-3 w-3 ml-auto group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
              
              {/* Gradient accent line */}
              <div className={`h-1 w-full bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
            </Card>
          );
        })}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="cards" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="cards">Contribution Cards</TabsTrigger>
          <TabsTrigger value="ai">AI Attribution</TabsTrigger>
          <TabsTrigger value="weighting">Task Weighting</TabsTrigger>
          <TabsTrigger value="admin">Admin Dashboard</TabsTrigger>
        </TabsList>

        {/* Enhanced Contribution Cards */}
        <TabsContent value="cards" className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Enhanced Contribution Cards</h2>
              <Badge>Dashboard Component</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <EnhancedContributionCard {...mockContributionData} />
              <EnhancedContributionCard
                {...mockContributionData}
                userName="Sarah Chen"
                totalCredits={2150}
                recentActivity="Led team meeting and code review"
                timestamp="1 hour ago"
                verificationSource="blockchain"
                percentageChange={22}
                reputationScore={96}
              />
            </div>
          </div>

          <div className="p-6 bg-muted/30 rounded-lg border border-border">
            <h3 className="font-semibold mb-2">Features:</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Prominent verification badges (Trust Ledger, Blockchain, AI)</li>
              <li>• Credit trend sparkline visualization</li>
              <li>• Reputation score display</li>
              <li>• Gradient effects and smooth animations</li>
              <li>• Responsive hover states</li>
            </ul>
          </div>
        </TabsContent>

        {/* AI Attribution Widget */}
        <TabsContent value="ai" className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">AI Attribution Widget</h2>
              <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0">
                AI-Powered
              </Badge>
            </div>
            <AIAttributionWidget
              attributions={mockAIAttributions}
              onReview={(id, approved) => {
                console.log(`Attribution ${id} ${approved ? 'approved' : 'rejected'}`);
              }}
              onViewDetails={(id) => {
                console.log(`View details for ${id}`);
              }}
            />
          </div>

          <div className="p-6 bg-muted/30 rounded-lg border border-border">
            <h3 className="font-semibold mb-2">Features:</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Real-time AI-detected contributions feed</li>
              <li>• Confidence score visualization</li>
              <li>• Source platform badges (Slack, Teams, Meet, Email)</li>
              <li>• Expandable context and payload</li>
              <li>• One-click approve/reject workflow</li>
              <li>• Suggested credit amounts</li>
            </ul>
          </div>
        </TabsContent>

        {/* Collective Task Weighting */}
        <TabsContent value="weighting" className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Collective Task Weighting</h2>
              <Badge>Collaboration Tool</Badge>
            </div>
            <div className="p-12 bg-muted/30 rounded-lg border-2 border-dashed border-border text-center">
              <Button
                size="lg"
                onClick={() => setWeightingModalOpen(true)}
                className="gap-2"
              >
                Open Task Weighting Modal
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                Demonstrates the collaborative credit distribution interface
              </p>
            </div>
          </div>

          <div className="p-6 bg-muted/30 rounded-lg border border-border">
            <h3 className="font-semibold mb-2">Features:</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Intuitive percentage sliders</li>
              <li>• Auto-balance to 100%</li>
              <li>• Real-time credit calculation</li>
              <li>• Trust & transparency indicators</li>
              <li>• Manager-only edit controls</li>
              <li>• Visual validation states</li>
            </ul>
          </div>
        </TabsContent>

        {/* Admin Dashboard */}
        <TabsContent value="admin" className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Integration Health Dashboard</h2>
              <Badge variant="destructive">Admin Only</Badge>
            </div>
            <IntegrationHealthDashboard
              webhookEvents={mockWebhookEvents}
              syncLogs={mockSyncLogs}
            />
          </div>

          <div className="p-6 bg-muted/30 rounded-lg border border-border">
            <h3 className="font-semibold mb-2">Features:</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Webhook payload viewer with syntax highlighting</li>
              <li>• Platform-specific logos and colors</li>
              <li>• Success/failure tracking</li>
              <li>• Two-way sync operation logs</li>
              <li>• Filterable event list</li>
              <li>• Export functionality</li>
            </ul>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <CollectiveTaskWeightingModal
        isOpen={weightingModalOpen}
        onClose={() => setWeightingModalOpen(false)}
        taskTitle="Q4 Product Launch Campaign"
        taskCredits={500}
        teamMembers={mockTeamMembers}
        onConfirm={(weights) => {
          console.log('Credit weights confirmed:', weights);
          setWeightingModalOpen(false);
        }}
        isManager={true}
      />

      <OnboardingWizard
        isOpen={onboardingOpen}
        onClose={() => setOnboardingOpen(false)}
        onComplete={(data) => {
          console.log('Onboarding completed:', data);
        }}
      />
    </div>
  );
}
