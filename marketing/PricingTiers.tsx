import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Check, Sparkles, Zap, Crown, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface PricingFeature {
  name: string;
  included: boolean;
  highlight?: boolean;
}

interface PricingTier {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
  };
  icon: 'starter' | 'professional' | 'enterprise';
  popular?: boolean;
  features: PricingFeature[];
  cta: string;
  ctaVariant?: 'default' | 'outline';
}

const pricingTiers: PricingTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for small teams getting started with recognition',
    price: {
      monthly: 29,
      yearly: 290
    },
    icon: 'starter',
    features: [
      { name: 'Up to 25 team members', included: true },
      { name: 'Basic task tracking', included: true },
      { name: 'Peer-to-peer recognition', included: true },
      { name: '1 integration (Jira or Slack)', included: true },
      { name: 'Monthly reports', included: true },
      { name: 'Email support', included: true },
      { name: 'AI-Powered Attribution', included: false },
      { name: 'Custom reporting', included: false },
      { name: 'Immutable Trust Ledger', included: false },
      { name: 'Advanced analytics', included: false },
    ],
    cta: 'Start Free Trial',
    ctaVariant: 'outline'
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'For growing teams ready to scale their recognition culture',
    price: {
      monthly: 99,
      yearly: 990
    },
    icon: 'professional',
    popular: true,
    features: [
      { name: 'Up to 100 team members', included: true },
      { name: 'Advanced task management', included: true },
      { name: 'Peer-to-peer recognition', included: true },
      { name: 'Unlimited integrations', included: true },
      { name: 'AI-Powered Attribution', included: true, highlight: true },
      { name: 'Immutable Trust Ledger', included: true, highlight: true },
      { name: 'Weekly detailed reports', included: true },
      { name: 'Custom reporting', included: true },
      { name: 'Priority support', included: true },
      { name: 'Advanced analytics', included: false },
      { name: 'Dedicated account manager', included: false },
    ],
    cta: 'Start Free Trial',
    ctaVariant: 'default'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large organizations with custom needs and compliance requirements',
    price: {
      monthly: 0, // Custom pricing
      yearly: 0
    },
    icon: 'enterprise',
    features: [
      { name: 'Unlimited team members', included: true },
      { name: 'Everything in Professional', included: true },
      { name: 'Advanced AI Analytics', included: true, highlight: true },
      { name: 'Custom reporting & dashboards', included: true, highlight: true },
      { name: 'Two-way sync with all platforms', included: true },
      { name: 'White-label options', included: true },
      { name: 'SSO & advanced security', included: true },
      { name: 'Dedicated account manager', included: true },
      { name: '24/7 premium support', included: true },
      { name: 'Custom SLA', included: true },
      { name: 'On-premise deployment option', included: true },
    ],
    cta: 'Contact Sales',
    ctaVariant: 'default'
  }
];

export function PricingTiers() {
  const [isYearly, setIsYearly] = useState(false);

  const getIcon = (icon: PricingTier['icon']) => {
    switch (icon) {
      case 'starter':
        return <Zap className="h-6 w-6 text-blue-500" />;
      case 'professional':
        return <Sparkles className="h-6 w-6 text-purple-500" />;
      case 'enterprise':
        return <Crown className="h-6 w-6 text-amber-500" />;
    }
  };

  const getGradient = (icon: PricingTier['icon']) => {
    switch (icon) {
      case 'starter':
        return 'from-blue-500 to-cyan-500';
      case 'professional':
        return 'from-purple-500 to-pink-500';
      case 'enterprise':
        return 'from-amber-500 to-orange-500';
    }
  };

  return (
    <div className="py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-gradient-to-r from-primary to-accent text-white border-0">
            Simple, Transparent Pricing
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Choose Your Plan
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Start with a 14-day free trial. No credit card required.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-3">
            <span className={`text-sm ${!isYearly ? 'font-semibold' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
            />
            <span className={`text-sm ${isYearly ? 'font-semibold' : 'text-muted-foreground'}`}>
              Yearly
            </span>
            <Badge className="bg-emerald-500 text-white">Save 17%</Badge>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={tier.popular ? 'md:-mt-4 md:mb-4' : ''}
            >
              <Card className={`relative overflow-hidden h-full flex flex-col ${
                tier.popular 
                  ? 'border-2 border-primary shadow-2xl shadow-primary/20' 
                  : 'border border-border'
              }`}>
                {/* Popular Badge */}
                {tier.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-primary to-accent text-white px-4 py-1 text-xs font-semibold rounded-bl-lg">
                    MOST POPULAR
                  </div>
                )}

                <div className="p-8 flex-1 flex flex-col">
                  {/* Icon & Name */}
                  <div className="mb-6">
                    <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${getGradient(tier.icon)} flex items-center justify-center mb-4`}>
                      {getIcon(tier.icon)}
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                    <p className="text-sm text-muted-foreground">{tier.description}</p>
                  </div>

                  {/* Pricing */}
                  <div className="mb-8">
                    {tier.price.monthly === 0 ? (
                      <div>
                        <div className="text-3xl font-bold">Custom</div>
                        <p className="text-sm text-muted-foreground mt-1">Contact us for pricing</p>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-bold">
                            ${isYearly ? Math.floor(tier.price.yearly / 12) : tier.price.monthly}
                          </span>
                          <span className="text-muted-foreground">/month</span>
                        </div>
                        {isYearly && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Billed annually (${tier.price.yearly}/year)
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* CTA Button */}
                  <Button
                    className={`w-full mb-8 ${
                      tier.popular 
                        ? 'bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white border-0' 
                        : ''
                    }`}
                    variant={tier.ctaVariant}
                    size="lg"
                  >
                    {tier.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>

                  {/* Features List */}
                  <div className="space-y-3 flex-1">
                    <p className="text-sm font-semibold text-muted-foreground mb-4">
                      What's included:
                    </p>
                    {tier.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className={`flex items-start gap-3 ${
                          !feature.included ? 'opacity-40' : ''
                        }`}
                      >
                        <div className={`h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          feature.included 
                            ? feature.highlight
                              ? 'bg-gradient-to-r from-primary to-accent'
                              : 'bg-primary/10'
                            : 'bg-muted'
                        }`}>
                          <Check className={`h-3 w-3 ${
                            feature.included 
                              ? feature.highlight
                                ? 'text-white'
                                : 'text-primary'
                              : 'text-muted-foreground'
                          }`} />
                        </div>
                        <span className={`text-sm ${
                          feature.highlight ? 'font-semibold' : ''
                        }`}>
                          {feature.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-6">
            All plans include basic features, secure cloud storage, and regular updates
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-500" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-500" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-500" />
              <span>Money-back guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
