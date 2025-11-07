import React from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Shield, Sparkles, Scale, Zap, Lock, BarChart3, Users, Globe } from 'lucide-react';
import { motion } from 'motion/react';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  gradient: string;
  benefits: string[];
  badge?: string;
}

export function FeaturesShowcase() {
  const features: Feature[] = [
    {
      id: 'immutable-records',
      title: 'Immutable Trust Ledger',
      description: 'Every credit allocation is permanently recorded on our blockchain-inspired trust ledger, ensuring complete transparency and accountability.',
      icon: Shield,
      gradient: 'from-emerald-500 to-emerald-700',
      benefits: [
        'Cannot be altered or deleted',
        'Full audit trail for compliance',
        'Cryptographically verified',
        'Team-wide visibility'
      ],
      badge: 'Core Feature'
    },
    {
      id: 'ai-attribution',
      title: 'AI-Powered Attribution',
      description: 'Our AI monitors your communications across Slack, Teams, and meetings to automatically flag verbal contributions that deserve recognition.',
      icon: Sparkles,
      gradient: 'from-purple-500 to-purple-700',
      benefits: [
        'Catches contributions others miss',
        '95%+ accuracy rate',
        'Multi-platform monitoring',
        'Suggestion-based workflow'
      ],
      badge: 'Professional+'
    },
    {
      id: 'precision-credit',
      title: 'Precision Credit Distribution',
      description: 'Collaborative tools for teams to fairly divide credit on joint projects with intuitive sliders and automatic validation.',
      icon: Scale,
      gradient: 'from-blue-500 to-blue-700',
      benefits: [
        'Transparent allocation process',
        'Team consensus tools',
        'Customizable weighting',
        'Dispute prevention'
      ]
    },
    {
      id: 'real-time-sync',
      title: 'Real-Time Integration',
      description: 'Seamlessly sync with Jira, Notion, Azure DevOps, Slack, and Microsoft Teams. Two-way sync ensures data flows everywhere.',
      icon: Zap,
      gradient: 'from-amber-500 to-amber-700',
      benefits: [
        'Works where your team works',
        'No workflow disruption',
        'Automatic task tracking',
        'Bi-directional updates'
      ]
    },
    {
      id: 'security',
      title: 'Enterprise Security',
      description: 'SOC 2 Type II certified with bank-level encryption, SSO support, and comprehensive access controls.',
      icon: Lock,
      gradient: 'from-red-500 to-red-700',
      benefits: [
        'SOC 2 Type II certified',
        'GDPR & CCPA compliant',
        'SSO & 2FA support',
        '256-bit encryption'
      ],
      badge: 'Enterprise'
    },
    {
      id: 'analytics',
      title: 'Advanced Analytics',
      description: 'Comprehensive dashboards and reports to identify top performers, team dynamics, and recognition patterns.',
      icon: BarChart3,
      gradient: 'from-cyan-500 to-cyan-700',
      benefits: [
        'Contribution heatmaps',
        'Unsung hero detection',
        'Team health metrics',
        'Custom reporting'
      ],
      badge: 'Professional+'
    },
    {
      id: 'team-culture',
      title: 'Culture of Trust',
      description: 'Build psychological safety and transparency through fair recognition and open credit allocation.',
      icon: Users,
      gradient: 'from-pink-500 to-pink-700',
      benefits: [
        'Increases retention',
        'Boosts team morale',
        'Reduces disputes',
        'Improves collaboration'
      ]
    },
    {
      id: 'scalable',
      title: 'Globally Scalable',
      description: 'From 5-person startups to 10,000+ employee enterprises, Honourus scales with your organization.',
      icon: Globe,
      gradient: 'from-indigo-500 to-indigo-700',
      benefits: [
        'Multi-team support',
        'Department hierarchies',
        'Cross-org collaboration',
        '99.9% uptime SLA'
      ]
    }
  ];

  return (
    <div className="py-20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-primary to-accent text-white border-0">
            Precision & Trust
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to Build Trust
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Honourus combines cutting-edge AI, blockchain-inspired security, and intuitive design to create the ultimate employee recognition platform
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="relative overflow-hidden h-full hover:shadow-2xl transition-all duration-300 group border-2 border-transparent hover:border-primary/20">
                  {/* Gradient Background on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                  <div className="p-6 relative">
                    {/* Icon */}
                    <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>

                    {/* Badge */}
                    {feature.badge && (
                      <Badge
                        variant="outline"
                        className="absolute top-4 right-4 text-xs"
                      >
                        {feature.badge}
                      </Badge>
                    )}

                    {/* Title */}
                    <h3 className="text-lg font-semibold mb-2">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-4">
                      {feature.description}
                    </p>

                    {/* Benefits List */}
                    <div className="space-y-2">
                      {feature.benefits.map((benefit, benefitIndex) => (
                        <div
                          key={benefitIndex}
                          className="flex items-start gap-2"
                        >
                          <div className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${feature.gradient} mt-1.5 flex-shrink-0`} />
                          <span className="text-xs text-muted-foreground">
                            {benefit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Gradient Line */}
                  <div className={`h-1 w-full bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-full border border-primary/20">
            <Shield className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">
              Trusted by 10,000+ teams worldwide
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}