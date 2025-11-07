import React from 'react';
import { Badge } from '../ui/badge';
import { AlertCircle } from 'lucide-react';

export function DemoModeIndicator() {
  return (
    <div className="fixed top-4 right-4 z-50">
      <Badge variant="outline" className="gap-2 bg-background/80 backdrop-blur-sm border-amber-200 text-amber-700 dark:border-amber-800 dark:text-amber-300">
        <AlertCircle className="h-3 w-3" />
        Demo Mode
      </Badge>
    </div>
  );
}