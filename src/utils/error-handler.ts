/**
 * Centralized error handling utilities for Honourus platform
 * 
 * Provides consistent error handling, logging, and user-friendly messages
 * across the application with support for demo mode.
 */

export type ErrorSeverity = 'info' | 'warning' | 'error' | 'critical';

interface ErrorLog {
  message: string;
  severity: ErrorSeverity;
  timestamp: Date;
  context?: string;
  error?: Error;
}

class ErrorHandler {
  private logs: ErrorLog[] = [];
  private maxLogs = 100;

  /**
   * Handle errors gracefully with appropriate logging
   */
  handle(
    error: unknown,
    context: string = 'Unknown',
    severity: ErrorSeverity = 'error'
  ): void {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    const log: ErrorLog = {
      message: errorMessage,
      severity,
      timestamp: new Date(),
      context,
      error: error instanceof Error ? error : undefined,
    };

    this.logs.push(log);
    
    // Keep logs under maxLogs
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Log based on severity
    switch (severity) {
      case 'critical':
      case 'error':
        console.error(`[${context}]`, errorMessage);
        break;
      case 'warning':
        console.warn(`[${context}]`, errorMessage);
        break;
      case 'info':
        console.info(`[${context}]`, errorMessage);
        break;
    }
  }

  /**
   * Handle async operations with automatic error catching
   */
  async handleAsync<T>(
    operation: () => Promise<T>,
    context: string,
    fallback?: T
  ): Promise<T | undefined> {
    try {
      return await operation();
    } catch (error) {
      this.handle(error, context, 'error');
      return fallback;
    }
  }

  /**
   * Check if running in demo mode (no backend connection)
   */
  isDemoMode(): boolean {
    // Check if we've had recent connection errors
    const recentErrors = this.logs.filter(
      log => 
        log.timestamp > new Date(Date.now() - 60000) && // Last minute
        (log.message.includes('fetch') || log.message.includes('connection'))
    );
    return recentErrors.length > 2;
  }

  /**
   * Get user-friendly error message
   */
  getUserMessage(error: unknown): string {
    const errorMessage = error instanceof Error ? error.message : String(error);

    // Map common errors to user-friendly messages
    if (errorMessage.includes('fetch')) {
      return 'Unable to connect. Running in demo mode.';
    }
    if (errorMessage.includes('auth')) {
      return 'Please sign in to access this feature.';
    }
    if (errorMessage.includes('permission')) {
      return 'You don\'t have permission to perform this action.';
    }
    if (errorMessage.includes('not found')) {
      return 'The requested item could not be found.';
    }

    return 'Something went wrong. Please try again.';
  }

  /**
   * Get recent error logs
   */
  getRecentLogs(count: number = 10): ErrorLog[] {
    return this.logs.slice(-count);
  }

  /**
   * Clear error logs
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * Get error statistics
   */
  getStats() {
    const now = Date.now();
    const last5min = this.logs.filter(log => log.timestamp.getTime() > now - 300000);
    
    return {
      total: this.logs.length,
      recent: last5min.length,
      bySeverity: {
        critical: this.logs.filter(l => l.severity === 'critical').length,
        error: this.logs.filter(l => l.severity === 'error').length,
        warning: this.logs.filter(l => l.severity === 'warning').length,
        info: this.logs.filter(l => l.severity === 'info').length,
      }
    };
  }
}

// Singleton instance
export const errorHandler = new ErrorHandler();

/**
 * Wrapper for graceful API calls with automatic error handling
 */
export async function safeApiCall<T>(
  apiCall: () => Promise<T>,
  context: string,
  fallback?: T
): Promise<T | undefined> {
  return errorHandler.handleAsync(apiCall, context, fallback);
}

/**
 * Check if app is in demo mode
 */
export function isDemoMode(): boolean {
  return errorHandler.isDemoMode();
}

/**
 * Get user-friendly error message
 */
export function getUserErrorMessage(error: unknown): string {
  return errorHandler.getUserMessage(error);
}