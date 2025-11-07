import { supabase } from '../utils/supabase/client';
import { supabaseUrl, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner@2.0.3';
import { Database } from '../types';

// Check if we're in demo mode (using placeholder credentials)
const isDemoMode = supabaseUrl.includes('your-project-id') || supabaseUrl.includes('connected-project') || publicAnonKey.includes('your-anon-key') || publicAnonKey.includes('connected-anon-key');

type Notification = Database['public']['Tables']['notifications']['Row'];
type NotificationInsert = Database['public']['Tables']['notifications']['Insert'];

export interface NotificationData {
  id: string;
  type: 'recognition' | 'task_assigned' | 'task_completed' | 'team_invite' | 'credit_earned' | 'system';
  title: string;
  message: string;
  user_id: string;
  related_id?: string;
  read: boolean;
  created_at: string;
  metadata?: Record<string, any>;
}

class NotificationsService {
  private unsubscribeCallbacks: (() => void)[] = [];

  // Subscribe to real-time notifications for a user
  async subscribeToNotifications(userId: string, onNotification: (notification: NotificationData) => void) {
    // In demo mode, just return a no-op function
    if (isDemoMode) {
      return () => {};
    }

    const subscription = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const notification = payload.new as NotificationData;
          onNotification(notification);
          
          // Show toast notification
          this.showToastNotification(notification);
        }
      )
      .subscribe();

    const unsubscribe = () => {
      supabase.removeChannel(subscription);
    };

    this.unsubscribeCallbacks.push(unsubscribe);
    return unsubscribe;
  }

  // Create a new notification
  async createNotification(notification: Omit<NotificationInsert, 'id' | 'created_at'>) {
    try {
      // In demo mode, silently succeed
      if (isDemoMode) {
        console.log('🔧 Demo mode: Notification creation simulated');
        return null;
      }

      const { data, error } = await supabase
        .from('notifications')
        .insert([notification])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating notification:', error);
      if (isDemoMode) return null;
      throw error;
    }
  }

  // Fetch notifications for a user
  async fetchNotifications(userId: string, limit = 50) {
    try {
      // In demo mode, return empty array
      if (isDemoMode) {
        console.log('🔧 Demo mode: Returning empty notifications');
        return [];
      }

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as NotificationData[];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Return empty array on error
      return [];
    }
  }

  // Mark notification as read
  async markAsRead(notificationId: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  // Mark all notifications as read for a user
  async markAllAsRead(userId: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  // Get unread notification count
  async getUnreadCount(userId: string) {
    try {
      // In demo mode, return 0
      if (isDemoMode) {
        return 0;
      }

      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }

  // Delete notification
  async deleteNotification(notificationId: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  // Clear old notifications (older than 30 days)
  async clearOldNotifications(userId: string, daysOld = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', userId)
        .lt('created_at', cutoffDate.toISOString());

      if (error) throw error;
    } catch (error) {
      console.error('Error clearing old notifications:', error);
      throw error;
    }
  }

  // Show toast notification based on type
  private showToastNotification(notification: NotificationData) {
    const toastOptions = {
      duration: 5000,
      action: notification.related_id ? {
        label: 'View',
        onClick: () => this.handleNotificationAction(notification),
      } : undefined,
    };

    switch (notification.type) {
      case 'recognition':
        toast.success(notification.title, {
          description: notification.message,
          ...toastOptions,
        });
        break;
      case 'task_assigned':
        toast.info(notification.title, {
          description: notification.message,
          ...toastOptions,
        });
        break;
      case 'task_completed':
        toast.success(notification.title, {
          description: notification.message,
          ...toastOptions,
        });
        break;
      case 'credit_earned':
        toast.success(notification.title, {
          description: notification.message,
          ...toastOptions,
        });
        break;
      case 'team_invite':
        toast.info(notification.title, {
          description: notification.message,
          ...toastOptions,
        });
        break;
      case 'system':
        toast(notification.title, {
          description: notification.message,
          ...toastOptions,
        });
        break;
      default:
        toast(notification.title, {
          description: notification.message,
          ...toastOptions,
        });
    }
  }

  // Handle notification action (navigate to related content)
  private handleNotificationAction(notification: NotificationData) {
    // This would typically trigger navigation
    // Implementation depends on your routing solution
    console.log('Navigate to notification:', notification);
  }

  // Bulk notification operations
  async createBulkNotifications(notifications: Omit<NotificationInsert, 'id' | 'created_at'>[]) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert(notifications)
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating bulk notifications:', error);
      throw error;
    }
  }

  // Clean up subscriptions
  cleanup() {
    this.unsubscribeCallbacks.forEach(unsubscribe => unsubscribe());
    this.unsubscribeCallbacks = [];
  }

  // Notification templates for common scenarios
  static templates = {
    taskAssigned: (assigneeId: string, taskTitle: string, assignerName: string, taskId: string) => ({
      type: 'task_assigned' as const,
      title: 'New Task Assigned',
      message: `${assignerName} assigned you "${taskTitle}"`,
      user_id: assigneeId,
      related_id: taskId,
      read: false,
    }),

    taskCompleted: (userId: string, taskTitle: string, credits: number, taskId: string) => ({
      type: 'task_completed' as const,
      title: 'Task Completed!',
      message: `"${taskTitle}" completed. You earned ${credits} credits!`,
      user_id: userId,
      related_id: taskId,
      read: false,
      metadata: { credits },
    }),

    recognitionReceived: (userId: string, recognizerName: string, credits: number, recognitionId: string) => ({
      type: 'recognition' as const,
      title: 'Recognition Received!',
      message: `${recognizerName} recognized your excellent work! +${credits} credits`,
      user_id: userId,
      related_id: recognitionId,
      read: false,
      metadata: { credits },
    }),

    teamInvite: (userId: string, teamName: string, inviterName: string, teamId: string) => ({
      type: 'team_invite' as const,
      title: 'Team Invitation',
      message: `${inviterName} invited you to join "${teamName}"`,
      user_id: userId,
      related_id: teamId,
      read: false,
    }),

    creditEarned: (userId: string, amount: number, reason: string, relatedId?: string) => ({
      type: 'credit_earned' as const,
      title: 'Credits Earned!',
      message: `You earned ${amount} credits for ${reason}`,
      user_id: userId,
      related_id: relatedId,
      read: false,
      metadata: { credits: amount },
    }),
  };
}

export const notificationsService = new NotificationsService();