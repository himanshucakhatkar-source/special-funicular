import { X, Info, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Button } from '../ui/button';

export function DemoModeNotice() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if we're in demo mode
    const supabaseUrl = 'https://your-project-id.supabase.co'; // This will be replaced by actual config
    const isDemoMode = supabaseUrl.includes('your-project-id');

    // Check if user has dismissed this notice before
    const wasDismissed = localStorage.getItem('demo-mode-notice-dismissed');

    if (isDemoMode && !wasDismissed) {
      // Show after a short delay
      setTimeout(() => setShow(true), 1000);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    setShow(false);
    localStorage.setItem('demo-mode-notice-dismissed', 'true');
    // Also suppress console logs
    localStorage.setItem('honourus-suppress-demo-logs', 'true');
  };

  const handleDismissSession = () => {
    setShow(false);
  };

  if (!show || dismissed) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <Alert className="border-blue-500/50 bg-blue-950/90 backdrop-blur-sm shadow-lg">
        <Info className="h-4 w-4 text-blue-400" />
        <AlertTitle className="text-blue-300 flex items-center justify-between">
          <span>Demo Mode Active</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismissSession}
            className="h-6 w-6 p-0 hover:bg-blue-900"
          >
            <X className="h-3 w-3" />
          </Button>
        </AlertTitle>
        <AlertDescription className="text-blue-200 text-sm space-y-2">
          <p>
            You're running Honourus in demo mode. All features work, but data won't persist.
          </p>
          <div className="space-y-1 text-xs">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-3 w-3 mt-0.5 flex-shrink-0 text-green-400" />
              <span>Full UI & task management</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-3 w-3 mt-0.5 flex-shrink-0 text-green-400" />
              <span>Recognition & team features</span>
            </div>
            <div className="flex items-start gap-2">
              <Info className="h-3 w-3 mt-0.5 flex-shrink-0 text-blue-400" />
              <span>Changes lost on refresh</span>
            </div>
          </div>
          <div className="pt-2 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDismiss}
              className="text-xs border-blue-500/50 text-blue-300 hover:bg-blue-900 hover:text-blue-100"
            >
              Got it!
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="text-xs text-blue-400 hover:bg-blue-900 hover:text-blue-100"
            >
              Don't show again
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}
