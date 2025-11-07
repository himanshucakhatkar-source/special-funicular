import React, { useEffect } from 'react';
import { useAuthStore } from '../../stores/auth';
import { useAppStore } from '../../stores/app';
import { authService } from '../../services/auth.service';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuthStore();
  const { setMode } = useAppStore();

  useEffect(() => {
    // If not authenticated and not loading, redirect to marketing
    if (!isAuthenticated && !isLoading) {
      setMode('marketing');
    }
  }, [isAuthenticated, isLoading, setMode]);

  // Show loading state while checking auth
  if (isLoading) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render children
  if (!isAuthenticated || !user) {
    return null;
  }

  // User is authenticated, render children
  return <>{children}</>;
}