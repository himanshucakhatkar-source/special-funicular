import React from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { TrendingUp, TrendingDown, Shield, Award, CheckCircle2, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface CreditTrend {
  value: number;
  date: string;
}

interface EnhancedContributionCardProps {
  userName: string;
  userAvatar?: string;
  totalCredits: number;
  recentActivity: string;
  timestamp: string;
  isVerified?: boolean;
  verificationSource?: 'blockchain' | 'trust-ledger' | 'ai-verified';
  creditTrend?: CreditTrend[];
  percentageChange?: number;
  reputationScore?: number;
}

export function EnhancedContributionCard({
  userName,
  userAvatar,
  totalCredits,
  recentActivity,
  timestamp,
  isVerified = false,
  verificationSource = 'trust-ledger',
  creditTrend = [],
  percentageChange,
  reputationScore
}: EnhancedContributionCardProps) {
  const getVerificationBadge = () => {
    switch (verificationSource) {
      case 'blockchain':
        return {
          label: 'Blockchain Verified',
          icon: Shield,
          className: 'bg-gradient-to-r from-emerald-500 to-emerald-700 text-white shadow-lg shadow-emerald-500/30',
        };
      case 'trust-ledger':
        return {
          label: 'Trust Ledger Certified',
          icon: CheckCircle2,
          className: 'bg-gradient-to-r from-amber-500 to-amber-700 text-white shadow-lg shadow-amber-500/30',
        };
      case 'ai-verified':
        return {
          label: 'AI Verified',
          icon: Sparkles,
          className: 'bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-lg shadow-purple-500/30',
        };
      default:
        return {
          label: 'Verified',
          icon: CheckCircle2,
          className: 'bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-500/30',
        };
    }
  };

  const verification = getVerificationBadge();
  const VerificationIcon = verification.icon;

  // Generate sparkline path for credit trend
  const generateSparkline = () => {
    if (creditTrend.length === 0) return '';
    
    const width = 100;
    const height = 30;
    const max = Math.max(...creditTrend.map(t => t.value));
    const min = Math.min(...creditTrend.map(t => t.value));
    const range = max - min || 1;
    
    const points = creditTrend.map((point, index) => {
      const x = (index / (creditTrend.length - 1)) * width;
      const y = height - ((point.value - min) / range) * height;
      return `${x},${y}`;
    });
    
    return `M ${points.join(' L ')}`;
  };

  const isPositiveTrend = percentageChange && percentageChange > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300">
        {/* Verification Seal - Top Right Corner */}
        {isVerified && (
          <div className="absolute top-3 right-3 z-10">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', duration: 0.6 }}
            >
              <Badge className={`${verification.className} px-3 py-1.5 gap-1.5 border-0`}>
                <VerificationIcon className="h-3.5 w-3.5" />
                <span className="text-xs font-semibold">{verification.label}</span>
              </Badge>
            </motion.div>
          </div>
        )}

        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="p-5 relative">
          {/* User Info Section */}
          <div className="flex items-start gap-4 mb-4">
            <Avatar className="h-12 w-12 ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-semibold">
                {userName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold truncate">{userName}</h3>
                {reputationScore && (
                  <Badge variant="secondary" className="gap-1">
                    <Award className="h-3 w-3" />
                    {reputationScore}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{recentActivity}</p>
              <p className="text-xs text-muted-foreground mt-1">{timestamp}</p>
            </div>
          </div>

          {/* Credits & Trend Section */}
          <div className="flex items-end justify-between mt-4 pt-4 border-t border-border/50">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total Credits</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {totalCredits.toLocaleString()}
                </span>
                {percentageChange !== undefined && (
                  <div className={`flex items-center gap-1 text-sm font-medium ${
                    isPositiveTrend ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {isPositiveTrend ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    <span>{Math.abs(percentageChange)}%</span>
                  </div>
                )}
              </div>
            </div>

            {/* Mini Sparkline Chart */}
            {creditTrend.length > 0 && (
              <div className="flex flex-col items-end">
                <p className="text-xs text-muted-foreground mb-2">Last 30 days</p>
                <svg width="100" height="30" className="overflow-visible">
                  {/* Gradient for sparkline */}
                  <defs>
                    <linearGradient id={`gradient-${userName}`} x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.8" />
                    </linearGradient>
                    <linearGradient id={`area-gradient-${userName}`} x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Area under the line */}
                  <path
                    d={`${generateSparkline()} L 100,30 L 0,30 Z`}
                    fill={`url(#area-gradient-${userName})`}
                  />
                  
                  {/* Sparkline path */}
                  <motion.path
                    d={generateSparkline()}
                    fill="none"
                    stroke={`url(#gradient-${userName})`}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, ease: 'easeInOut' }}
                  />
                </svg>
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
