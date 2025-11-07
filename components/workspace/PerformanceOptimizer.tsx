import React, { useEffect } from 'react';

/**
 * Performance optimization utility component
 * Handles cleanup and optimization for better performance
 */
export const PerformanceOptimizer = React.memo(function PerformanceOptimizer() {
  useEffect(() => {
    // Cleanup function to prevent memory leaks
    return () => {
      // Clear any timers, intervals, or subscriptions
      if (typeof window !== 'undefined') {
        // Clear any pending timeouts
        const timeoutIds = (window as any).__honourus_timeouts || [];
        timeoutIds.forEach((id: number) => clearTimeout(id));
        (window as any).__honourus_timeouts = [];

        // Clear any pending intervals
        const intervalIds = (window as any).__honourus_intervals || [];
        intervalIds.forEach((id: number) => clearInterval(id));
        (window as any).__honourus_intervals = [];
      }
    };
  }, []);

  // Performance monitoring in development (simplified)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
      try {
        // Only enable if PerformanceObserver is available and not causing issues
        if (typeof PerformanceObserver !== 'undefined') {
          const observer = new PerformanceObserver((list) => {
            try {
              const entries = list.getEntries();
              entries.forEach((entry) => {
                if (entry.duration > 200) { // Only flag very slow operations
                  console.info(`Performance: ${entry.name} took ${entry.duration.toFixed(2)}ms`);
                }
              });
            } catch (error) {
              // Silently ignore observer errors
            }
          });

          observer.observe({ entryTypes: ['measure'] });
          return () => {
            try {
              observer.disconnect();
            } catch (error) {
              // Silently ignore disconnect errors
            }
          };
        }
      } catch (error) {
        // PerformanceObserver not supported or causing issues
      }
    }
  }, []);

  return null; // This component doesn't render anything
});

// Utility functions for performance tracking
export const trackOperation = (name: string, fn: () => void) => {
  if (process.env.NODE_ENV === 'development') {
    performance.mark(`${name}-start`);
    fn();
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
  } else {
    fn();
  }
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
    
    // Track timeout for cleanup
    if (typeof window !== 'undefined') {
      (window as any).__honourus_timeouts = (window as any).__honourus_timeouts || [];
      (window as any).__honourus_timeouts.push(timeoutId);
    }
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;
  
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
};