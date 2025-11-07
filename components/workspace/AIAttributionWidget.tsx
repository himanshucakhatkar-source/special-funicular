import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { ScrollArea } from '../ui/scroll-area';
import { Sparkles, MessageSquare, ThumbsUp, ThumbsDown, ExternalLink, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AIAttribution {
  id: string;
  contributor: string;
  contribution: string;
  source: 'slack' | 'teams' | 'meet' | 'email';
  timestamp: string;
  confidence: number; // 0-100
  context?: string;
  suggestedCredits?: number;
  status: 'pending' | 'approved' | 'rejected';
}

interface AIAttributionWidgetProps {
  attributions: AIAttribution[];
  onReview?: (id: string, approved: boolean) => void;
  onViewDetails?: (id: string) => void;
}

export function AIAttributionWidget({
  attributions,
  onReview,
  onViewDetails
}: AIAttributionWidgetProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getSourceIcon = (source: AIAttribution['source']) => {
    const icons = {
      slack: '💬',
      teams: '👥',
      meet: '📹',
      email: '📧'
    };
    return icons[source] || '💬';
  };

  const getSourceColor = (source: AIAttribution['source']) => {
    const colors = {
      slack: 'from-purple-500 to-purple-700',
      teams: 'from-blue-500 to-blue-700',
      meet: 'from-green-500 to-green-700',
      email: 'from-orange-500 to-orange-700'
    };
    return colors[source] || 'from-gray-500 to-gray-700';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-emerald-600 dark:text-emerald-400';
    if (confidence >= 70) return 'text-blue-600 dark:text-blue-400';
    if (confidence >= 50) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  const pendingAttributions = attributions.filter(a => a.status === 'pending');

  return (
    <Card className="relative overflow-hidden">
      {/* Header with AI branding */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white animate-pulse" />
            </div>
            <div>
              <h3 className="font-semibold text-white">AI-Powered Attribution</h3>
              <p className="text-xs text-white/80">Real-time contribution detection</p>
            </div>
          </div>
          {pendingAttributions.length > 0 && (
            <Badge className="bg-white/20 text-white border-white/30">
              {pendingAttributions.length} Pending
            </Badge>
          )}
        </div>
      </div>

      {/* Attribution Feed */}
      <ScrollArea className="h-[400px]">
        <div className="p-4 space-y-3">
          {attributions.length === 0 ? (
            <div className="text-center py-12">
              <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-sm text-muted-foreground">
                No AI insights yet. Our AI is monitoring your communications...
              </p>
            </div>
          ) : (
            <AnimatePresence>
              {attributions.map((attribution, index) => (
                <motion.div
                  key={attribution.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`p-4 border-2 transition-all duration-300 ${
                    attribution.status === 'pending' 
                      ? 'border-primary/50 shadow-md shadow-primary/10' 
                      : attribution.status === 'approved'
                      ? 'border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20'
                      : 'border-red-500/30 bg-red-50/50 dark:bg-red-950/20 opacity-60'
                  }`}>
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Avatar className="h-9 w-9 ring-2 ring-primary/20">
                          <AvatarFallback className="text-xs bg-gradient-to-br from-primary to-accent text-primary-foreground">
                            {attribution.contributor.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{attribution.contributor}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Badge 
                              variant="outline" 
                              className={`text-xs bg-gradient-to-r ${getSourceColor(attribution.source)} text-white border-0`}
                            >
                              {getSourceIcon(attribution.source)} {attribution.source}
                            </Badge>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {attribution.timestamp}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Confidence Score */}
                      <div className="text-right">
                        <div className={`text-sm font-semibold ${getConfidenceColor(attribution.confidence)}`}>
                          {attribution.confidence}%
                        </div>
                        <p className="text-xs text-muted-foreground">confidence</p>
                      </div>
                    </div>

                    {/* Contribution Quote */}
                    <div className="mb-3">
                      <div className="bg-muted/50 rounded-lg p-3 border-l-4 border-primary">
                        <MessageSquare className="h-4 w-4 text-primary mb-2" />
                        <p className="text-sm italic text-foreground/90">
                          "{attribution.contribution}"
                        </p>
                      </div>
                    </div>

                    {/* Context (Expandable) */}
                    {attribution.context && (
                      <div className="mb-3">
                        <button
                          onClick={() => setExpandedId(expandedId === attribution.id ? null : attribution.id)}
                          className="text-xs text-primary hover:underline"
                        >
                          {expandedId === attribution.id ? 'Hide context' : 'Show context'}
                        </button>
                        <AnimatePresence>
                          {expandedId === attribution.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="mt-2 text-xs text-muted-foreground bg-background/50 rounded p-2 border"
                            >
                              {attribution.context}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    {/* Suggested Credits */}
                    {attribution.suggestedCredits && (
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="secondary" className="bg-accent/10 text-accent font-semibold">
                          +{attribution.suggestedCredits} Credits Suggested
                        </Badge>
                      </div>
                    )}

                    {/* Action Buttons */}
                    {attribution.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => onReview?.(attribution.id, true)}
                          className="flex-1 gap-1.5 bg-emerald-600 hover:bg-emerald-700"
                        >
                          <ThumbsUp className="h-3.5 w-3.5" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onReview?.(attribution.id, false)}
                          className="flex-1 gap-1.5 border-red-500/50 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                        >
                          <ThumbsDown className="h-3.5 w-3.5" />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onViewDetails?.(attribution.id)}
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )}

                    {/* Status Badge */}
                    {attribution.status !== 'pending' && (
                      <Badge 
                        variant={attribution.status === 'approved' ? 'default' : 'destructive'}
                        className="w-full justify-center"
                      >
                        {attribution.status === 'approved' ? '✓ Approved' : '✗ Rejected'}
                      </Badge>
                    )}
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </ScrollArea>

      {/* Footer Info */}
      <div className="border-t border-border p-3 bg-muted/30">
        <p className="text-xs text-muted-foreground text-center">
          <Sparkles className="h-3 w-3 inline mr-1" />
          AI scans communications across all integrated platforms in real-time
        </p>
      </div>
    </Card>
  );
}
