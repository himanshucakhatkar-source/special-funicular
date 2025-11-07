import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Activity, 
  Zap, 
  Clock, 
  TrendingUp,
  Wifi,
  Database,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';

interface PerformanceMetrics {
  responseTime: number;
  loadTime: number;
  memoryUsage: number;
  apiCalls: number;
  cacheHitRate: number;
  databaseConnections: number;
  lastUpdated: string;
}

interface SystemStatus {
  database: 'connected' | 'disconnected' | 'slow';
  api: 'healthy' | 'degraded' | 'down';
  cache: 'active' | 'inactive';
  notifications: 'enabled' | 'disabled';
}

export function PerformanceMonitor() {
  const [isOpen, setIsOpen] = useState(false);
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    responseTime: 0,
    loadTime: 0,
    memoryUsage: 0,
    apiCalls: 0,
    cacheHitRate: 0,
    databaseConnections: 0,
    lastUpdated: new Date().toISOString(),
  });
  const [status, setStatus] = useState<SystemStatus>({
    database: 'connected',
    api: 'healthy',
    cache: 'active',
    notifications: 'enabled',
  });

  useEffect(() => {
    // Start monitoring
    const interval = setInterval(() => {
      updateMetrics();
    }, 5000); // Update every 5 seconds

    // Initial load
    updateMetrics();

    return () => clearInterval(interval);
  }, []);

  const updateMetrics = () => {
    // Simulate real metrics (in production, these would come from actual monitoring)
    const now = performance.now();
    
    setMetrics({
      responseTime: Math.random() * 100 + 50, // 50-150ms
      loadTime: Math.random() * 1000 + 500, // 500-1500ms
      memoryUsage: Math.random() * 30 + 40, // 40-70%
      apiCalls: Math.floor(Math.random() * 50) + 20, // 20-70 calls
      cacheHitRate: Math.random() * 20 + 80, // 80-100%
      databaseConnections: Math.floor(Math.random() * 10) + 5, // 5-15 connections
      lastUpdated: new Date().toISOString(),
    });

    // Update system status based on metrics
    setStatus(prev => ({
      ...prev,
      database: metrics.responseTime > 200 ? 'slow' : 'connected',
      api: metrics.responseTime > 300 ? 'degraded' : 'healthy',
      cache: metrics.cacheHitRate < 70 ? 'inactive' : 'active',
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
      case 'healthy':
      case 'active':
      case 'enabled':
        return 'text-green-500';
      case 'slow':
      case 'degraded':
        return 'text-yellow-500';
      case 'disconnected':
      case 'down':
      case 'inactive':
      case 'disabled':
        return 'text-red-500';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (service: string, serviceStatus: string) => {
    const iconClass = `h-4 w-4 ${getStatusColor(serviceStatus)}`;
    
    if (serviceStatus === 'connected' || serviceStatus === 'healthy' || serviceStatus === 'active' || serviceStatus === 'enabled') {
      return <CheckCircle className={iconClass} />;
    } else if (serviceStatus === 'slow' || serviceStatus === 'degraded') {
      return <AlertTriangle className={iconClass} />;
    } else {
      return <AlertTriangle className={iconClass} />;
    }
  };

  const overallHealth = Object.values(status).every(s => 
    ['connected', 'healthy', 'active', 'enabled'].includes(s)
  ) ? 'healthy' : 'degraded';

  return (
    <div className="fixed bottom-4 right-4 z-30">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={`gap-2 ${
              overallHealth === 'healthy' 
                ? 'border-green-500/50 bg-green-500/10' 
                : 'border-yellow-500/50 bg-yellow-500/10'
            }`}
          >
            <Activity className={`h-4 w-4 ${
              overallHealth === 'healthy' ? 'text-green-500' : 'text-yellow-500'
            }`} />
            <span className="hidden sm:inline">Performance</span>
            <Badge 
              variant={overallHealth === 'healthy' ? 'default' : 'destructive'} 
              className="ml-1 h-5 px-1.5 text-xs"
            >
              {overallHealth === 'healthy' ? '✓' : '!'}
            </Badge>
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mt-2"
          >
            <Card className="w-80 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Activity className="h-5 w-5" />
                  System Performance
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* System Status */}
                <div>
                  <h4 className="text-sm font-medium mb-2">System Status</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        <span className="text-sm">Database</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {getStatusIcon('database', status.database)}
                        <span className={`text-xs ${getStatusColor(status.database)}`}>
                          {status.database}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        <span className="text-sm">API</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {getStatusIcon('api', status.api)}
                        <span className={`text-xs ${getStatusColor(status.api)}`}>
                          {status.api}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-sm">Cache</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {getStatusIcon('cache', status.cache)}
                        <span className={`text-xs ${getStatusColor(status.cache)}`}>
                          {status.cache}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Performance Metrics</h4>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Response Time</span>
                        <span>{Math.round(metrics.responseTime)}ms</span>
                      </div>
                      <Progress 
                        value={Math.min(metrics.responseTime / 3, 100)} 
                        className="h-2"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Memory Usage</span>
                        <span>{Math.round(metrics.memoryUsage)}%</span>
                      </div>
                      <Progress 
                        value={metrics.memoryUsage} 
                        className="h-2"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Cache Hit Rate</span>
                        <span>{Math.round(metrics.cacheHitRate)}%</span>
                      </div>
                      <Progress 
                        value={metrics.cacheHitRate} 
                        className="h-2"
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                  <div className="text-center">
                    <p className="text-lg font-semibold">{metrics.apiCalls}</p>
                    <p className="text-xs text-muted-foreground">API Calls</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold">{metrics.databaseConnections}</p>
                    <p className="text-xs text-muted-foreground">DB Connections</p>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground text-center pt-2 border-t">
                  Last updated: {new Date(metrics.lastUpdated).toLocaleTimeString()}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}