import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wifi, WifiOff, CloudOff, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { toast } from 'sonner@2.0.3';

interface OfflineState {
  isOnline: boolean;
  lastSyncTime: Date | null;
  pendingActions: number;
  syncStatus: 'synced' | 'syncing' | 'pending' | 'error';
}

export function OfflineIndicator() {
  const [offlineState, setOfflineState] = useState<OfflineState>({
    isOnline: navigator.onLine,
    lastSyncTime: null,
    pendingActions: 0,
    syncStatus: 'synced',
  });

  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setOfflineState(prev => ({ ...prev, isOnline: true }));
      toast.success('Connection restored', {
        description: 'Syncing pending changes...',
      });
      syncPendingActions();
    };

    const handleOffline = () => {
      setOfflineState(prev => ({ ...prev, isOnline: false }));
      toast.warning('You are offline', {
        description: 'Changes will be saved locally and synced when online.',
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initialize sync time
    const lastSync = localStorage.getItem('lastSyncTime');
    if (lastSync) {
      setOfflineState(prev => ({
        ...prev,
        lastSyncTime: new Date(lastSync),
      }));
    }

    // Check for pending actions
    checkPendingActions();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const checkPendingActions = () => {
    // In a real app, this would check for queued actions in IndexedDB
    const pendingTasks = JSON.parse(localStorage.getItem('pendingTasks') || '[]');
    const pendingRecognitions = JSON.parse(localStorage.getItem('pendingRecognitions') || '[]');
    
    const totalPending = pendingTasks.length + pendingRecognitions.length;
    
    setOfflineState(prev => ({
      ...prev,
      pendingActions: totalPending,
      syncStatus: totalPending > 0 ? 'pending' : 'synced',
    }));
  };

  const syncPendingActions = async () => {
    if (!offlineState.isOnline) return;

    setOfflineState(prev => ({ ...prev, syncStatus: 'syncing' }));

    try {
      // Simulate sync delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In a real app, this would sync with the backend
      localStorage.removeItem('pendingTasks');
      localStorage.removeItem('pendingRecognitions');
      localStorage.setItem('lastSyncTime', new Date().toISOString());

      setOfflineState(prev => ({
        ...prev,
        syncStatus: 'synced',
        pendingActions: 0,
        lastSyncTime: new Date(),
      }));

      toast.success('Sync completed', {
        description: 'All changes have been saved to the server.',
      });
    } catch (error) {
      setOfflineState(prev => ({ ...prev, syncStatus: 'error' }));
      toast.error('Sync failed', {
        description: 'Will retry automatically when connection improves.',
      });
    }
  };

  const getStatusColor = () => {
    if (!offlineState.isOnline) return 'bg-red-500';
    if (offlineState.syncStatus === 'syncing') return 'bg-yellow-500';
    if (offlineState.syncStatus === 'pending') return 'bg-orange-500';
    if (offlineState.syncStatus === 'error') return 'bg-red-500';
    return 'bg-green-500';
  };

  const getStatusIcon = () => {
    if (!offlineState.isOnline) return <WifiOff className="h-4 w-4" />;
    if (offlineState.syncStatus === 'syncing') return <CloudOff className="h-4 w-4 animate-pulse" />;
    if (offlineState.syncStatus === 'pending') return <AlertTriangle className="h-4 w-4" />;
    if (offlineState.syncStatus === 'error') return <AlertTriangle className="h-4 w-4" />;
    return <CheckCircle className="h-4 w-4" />;
  };

  const getStatusText = () => {
    if (!offlineState.isOnline) return 'Offline';
    if (offlineState.syncStatus === 'syncing') return 'Syncing...';
    if (offlineState.syncStatus === 'pending') return 'Pending sync';
    if (offlineState.syncStatus === 'error') return 'Sync error';
    return 'Online';
  };

  const formatLastSync = () => {
    if (!offlineState.lastSyncTime) return 'Never';
    
    const now = new Date();
    const diff = now.getTime() - offlineState.lastSyncTime.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return offlineState.lastSyncTime.toLocaleDateString();
  };

  if (offlineState.isOnline && offlineState.syncStatus === 'synced' && offlineState.pendingActions === 0) {
    return null; // Don't show when everything is fine
  }

  return (
    <div className="fixed bottom-4 left-4 z-30">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
      >
        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setShowDetails(!showDetails)}
        >
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${getStatusColor()}`} />
              {getStatusIcon()}
              <span className="text-sm font-medium">{getStatusText()}</span>
              {offlineState.pendingActions > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {offlineState.pendingActions}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-2"
            >
              <Card className="w-64">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Connection Status</span>
                    <div className="flex items-center gap-1">
                      {offlineState.isOnline ? (
                        <Wifi className="h-4 w-4 text-green-500" />
                      ) : (
                        <WifiOff className="h-4 w-4 text-red-500" />
                      )}
                      <span className="text-sm">
                        {offlineState.isOnline ? 'Online' : 'Offline'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Last Sync</span>
                    <span className="text-sm">{formatLastSync()}</span>
                  </div>

                  {offlineState.pendingActions > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Pending Actions</span>
                      <Badge variant="secondary">{offlineState.pendingActions}</Badge>
                    </div>
                  )}

                  {offlineState.isOnline && offlineState.pendingActions > 0 && (
                    <Button 
                      size="sm" 
                      onClick={syncPendingActions}
                      disabled={offlineState.syncStatus === 'syncing'}
                      className="w-full"
                    >
                      {offlineState.syncStatus === 'syncing' ? 'Syncing...' : 'Sync Now'}
                    </Button>
                  )}

                  {!offlineState.isOnline && (
                    <div className="p-2 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground">
                        Working offline. Changes will sync automatically when connection is restored.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}