import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  AlertCircle, 
  CheckCircle, 
  RefreshCw, 
  ExternalLink,
  Server,
  Database
} from 'lucide-react';
import { supabase } from '../../utils/supabase/client';
import { supabaseUrl } from '../../utils/supabase/info';

export const BackendStatusCard = React.memo(function BackendStatusCard() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkBackendStatus = async () => {
    setStatus('checking');
    try {
      // Check if Supabase is properly configured
      if (supabaseUrl.includes('your-project-id') || supabaseUrl.includes('connected-project')) {
        setStatus('disconnected');
        setLastChecked(new Date());
        return;
      }

      // Try to get session (lightweight check)
      const { data, error } = await supabase.auth.getSession();
      if (error && error.message.includes('Failed to fetch')) {
        setStatus('disconnected');
      } else {
        setStatus('connected');
      }
    } catch (error) {
      setStatus('disconnected');
    }
    setLastChecked(new Date());
  };

  useEffect(() => {
    checkBackendStatus();
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'connected': return 'text-green-600';
      case 'disconnected': return 'text-red-600';
      default: return 'text-amber-600';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'connected': return CheckCircle;
      case 'disconnected': return AlertCircle;
      default: return RefreshCw;
    }
  };

  const StatusIcon = getStatusIcon();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Server className="h-4 w-4" />
          Backend Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StatusIcon className={`h-4 w-4 ${getStatusColor()} ${status === 'checking' ? 'animate-spin' : ''}`} />
            <span className="font-medium">
              {status === 'connected' && 'Connected'}
              {status === 'disconnected' && 'Disconnected'}
              {status === 'checking' && 'Checking...'}
            </span>
          </div>
          <Badge variant={status === 'connected' ? 'default' : status === 'disconnected' ? 'destructive' : 'secondary'}>
            {status === 'connected' && 'Online'}
            {status === 'disconnected' && 'Offline'}
            {status === 'checking' && 'Testing'}
          </Badge>
        </div>

        {lastChecked && (
          <p className="text-xs text-muted-foreground">
            Last checked: {lastChecked.toLocaleTimeString()}
          </p>
        )}

        <div className="space-y-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={checkBackendStatus}
            disabled={status === 'checking'}
            className="w-full gap-2"
          >
            <RefreshCw className={`h-3 w-3 ${status === 'checking' ? 'animate-spin' : ''}`} />
            Test Connection
          </Button>

          {status === 'disconnected' && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <div className="flex gap-2">
                <Database className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-amber-700 dark:text-amber-300 mb-1">
                    Backend Unavailable
                  </p>
                  <p className="text-xs text-amber-600 dark:text-amber-400">
                    The app is running in demo mode with mock data. All Manager's Co-Pilot features are fully functional.
                  </p>
                </div>
              </div>
            </div>
          )}

          {status === 'connected' && (
            <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">
                    Backend Connected
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    Real-time data synchronization is available.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});