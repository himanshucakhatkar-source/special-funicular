import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  ChevronDown, 
  ChevronUp,
  Download,
  Filter,
  Activity,
  MessageSquare,
  Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface WebhookEvent {
  id: string;
  source: 'jira' | 'notion' | 'teams' | 'azure' | 'slack';
  timestamp: string;
  eventType: string;
  parseStatus: 'success' | 'failed' | 'pending';
  payload: object;
  processingTime?: number;
}

interface SyncLog {
  id: string;
  targetPlatform: 'jira' | 'notion' | 'teams' | 'azure';
  action: string;
  status: 'success' | 'failed' | 'pending';
  timestamp: string;
  errorMessage?: string;
  metadata?: object;
}

interface IntegrationHealthDashboardProps {
  webhookEvents: WebhookEvent[];
  syncLogs: SyncLog[];
}

export function IntegrationHealthDashboard({
  webhookEvents,
  syncLogs
}: IntegrationHealthDashboardProps) {
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'success' | 'failed'>('all');

  const platformLogos = {
    jira: '🔷',
    notion: '📝',
    teams: '👥',
    azure: '☁️',
    slack: '💬'
  };

  const platformColors = {
    jira: 'from-blue-500 to-blue-700',
    notion: 'from-gray-700 to-gray-900',
    teams: 'from-purple-500 to-purple-700',
    azure: 'from-cyan-500 to-cyan-700',
    slack: 'from-pink-500 to-pink-700'
  };

  const getStatusIcon = (status: 'success' | 'failed' | 'pending') => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-emerald-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-600 animate-pulse" />;
    }
  };

  const getStatusBadge = (status: 'success' | 'failed' | 'pending') => {
    const config = {
      success: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border-emerald-300',
      failed: 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 border-red-300',
      pending: 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-300'
    };
    return config[status];
  };

  const filteredEvents = filterStatus === 'all' 
    ? webhookEvents 
    : webhookEvents.filter(e => e.parseStatus === filterStatus);

  const successRate = webhookEvents.length > 0
    ? ((webhookEvents.filter(e => e.parseStatus === 'success').length / webhookEvents.length) * 100).toFixed(1)
    : '0';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            Integration Health Dashboard
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor webhook events and two-way sync operations
          </p>
        </div>
        <Badge className="bg-gradient-to-r from-primary to-accent text-white border-0 px-4 py-2 text-sm">
          {successRate}% Success Rate
        </Badge>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="webhooks" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="webhooks" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Webhook Payload Viewer
          </TabsTrigger>
          <TabsTrigger value="sync" className="gap-2">
            <Send className="h-4 w-4" />
            Two-Way Sync Log
          </TabsTrigger>
        </TabsList>

        {/* Panel A: Webhook Payload Viewer */}
        <TabsContent value="webhooks" className="space-y-4">
          <Card>
            {/* Filter Controls */}
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filter:</span>
                <div className="flex gap-2">
                  {['all', 'success', 'failed'].map((status) => (
                    <Button
                      key={status}
                      size="sm"
                      variant={filterStatus === status ? 'default' : 'outline'}
                      onClick={() => setFilterStatus(status as any)}
                      className="capitalize"
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>
              <Button size="sm" variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export Logs
              </Button>
            </div>

            {/* Events Table */}
            <ScrollArea className="h-[500px]">
              <div className="p-4 space-y-3">
                {filteredEvents.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-sm text-muted-foreground">No webhook events found</p>
                  </div>
                ) : (
                  filteredEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <Card className={`p-4 border-l-4 ${
                        event.parseStatus === 'success' 
                          ? 'border-l-emerald-500' 
                          : event.parseStatus === 'failed'
                          ? 'border-l-red-500'
                          : 'border-l-amber-500'
                      }`}>
                        <div className="flex items-start justify-between gap-4">
                          {/* Left: Platform & Info */}
                          <div className="flex items-start gap-3 flex-1">
                            <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${platformColors[event.source]} flex items-center justify-center text-xl flex-shrink-0`}>
                              {platformLogos[event.source]}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-sm capitalize">{event.source}</span>
                                <Badge variant="outline" className="text-xs">
                                  {event.eventType}
                                </Badge>
                                {event.processingTime && (
                                  <Badge variant="secondary" className="text-xs">
                                    {event.processingTime}ms
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">{event.timestamp}</p>
                            </div>
                          </div>

                          {/* Right: Status & Actions */}
                          <div className="flex items-center gap-3">
                            <Badge className={`${getStatusBadge(event.parseStatus)} gap-1`}>
                              {getStatusIcon(event.parseStatus)}
                              {event.parseStatus}
                            </Badge>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setExpandedEventId(
                                expandedEventId === event.id ? null : event.id
                              )}
                            >
                              {expandedEventId === event.id ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        {/* Expandable Payload */}
                        <AnimatePresence>
                          {expandedEventId === event.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="mt-4 pt-4 border-t border-border overflow-hidden"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold text-muted-foreground">
                                  RAW JSON PAYLOAD
                                </span>
                                <Button size="sm" variant="ghost" className="h-6 text-xs">
                                  Copy
                                </Button>
                              </div>
                              <pre className="text-xs bg-muted/50 rounded-lg p-3 overflow-x-auto border">
                                <code className="text-foreground">
                                  {JSON.stringify(event.payload, null, 2)}
                                </code>
                              </pre>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Card>
                    </motion.div>
                  ))
                )}
              </div>
            </ScrollArea>
          </Card>
        </TabsContent>

        {/* Panel B: Two-Way Sync Log */}
        <TabsContent value="sync" className="space-y-4">
          <Card>
            <ScrollArea className="h-[500px]">
              <div className="p-4 space-y-3">
                {syncLogs.length === 0 ? (
                  <div className="text-center py-12">
                    <Send className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-sm text-muted-foreground">No sync operations yet</p>
                  </div>
                ) : (
                  syncLogs.map((log, index) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <Card className="p-4 hover:shadow-md transition-all">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${platformColors[log.targetPlatform]} flex items-center justify-center text-xl flex-shrink-0`}>
                              {platformLogos[log.targetPlatform]}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm">{log.action}</span>
                                <Badge className={`${getStatusBadge(log.status)} gap-1 text-xs`}>
                                  {getStatusIcon(log.status)}
                                  {log.status}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mb-2">
                                Target: <span className="capitalize font-medium">{log.targetPlatform}</span> • {log.timestamp}
                              </p>
                              {log.errorMessage && (
                                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded p-2 mt-2">
                                  <p className="text-xs text-red-700 dark:text-red-400">
                                    {log.errorMessage}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))
                )}
              </div>
            </ScrollArea>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
