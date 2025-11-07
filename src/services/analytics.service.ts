import { supabase } from '../utils/supabase/client';
import { supabaseUrl, publicAnonKey } from '../utils/supabase/info';
import { useAuthStore } from '../stores/auth';

// Check if we're in demo mode (using placeholder credentials)
const isDemoMode = supabaseUrl.includes('your-project-id') || supabaseUrl.includes('connected-project') || publicAnonKey.includes('your-anon-key') || publicAnonKey.includes('connected-anon-key');

// Log demo mode status for debugging
console.log('🔧 Analytics Service - Demo mode:', isDemoMode, { supabaseUrl, publicAnonKey });

export interface UnsingHeroData {
  user_id: string;
  user_name: string;
  total_tasks: number;
  completed_tasks: number;
  completion_rate: number;
  total_credits: number;
  avg_task_credits: number;
  task_types: Array<{
    tag: string;
    count: number;
    completion_rate: number;
  }>;
  recent_achievements: Array<{
    task_title: string;
    credits: number;
    completed_at: string;
  }>;
}

export interface ContributionHeatmapData {
  date: string;
  tasks_completed: number;
  credits_earned: number;
  intensity: number; // 0-4 scale for visualization
}

export interface TeamPerformanceData {
  team_id: string;
  team_name: string;
  total_members: number;
  active_members: number;
  total_tasks: number;
  completed_tasks: number;
  total_credits: number;
  avg_credits_per_member: number;
  top_performers: Array<{
    user_id: string;
    user_name: string;
    credits: number;
    tasks_completed: number;
  }>;
}

export interface CreditModifier {
  id: string;
  name: string;
  description: string;
  multiplier: number;
  conditions: {
    task_tags?: string[];
    priority_levels?: string[];
    completion_time?: 'early' | 'on-time' | 'late';
    team_ids?: string[];
  };
  is_active: boolean;
  created_by: string;
  created_at: string;
}

class AnalyticsService {
  // Get Unsung Hero Report - identifies key contributors
  async getUnsingHeroReport(
    teamId?: string,
    dateFrom?: Date,
    dateTo?: Date
  ): Promise<UnsingHeroData[]> {
    try {
      const user = useAuthStore.getState().user;
      if (!user) throw new Error('User not authenticated');

      // In demo mode, return empty array
      if (isDemoMode) {
        console.log('🔧 Demo mode: Unsung hero report not available');
        return [];
      }

      const { data, error } = await supabase.functions.invoke('analytics-unsung-hero', {
        body: {
          user_id: user.id,
          team_id: teamId,
          date_from: dateFrom?.toISOString(),
          date_to: dateTo?.toISOString()
        }
      });

      if (error) throw error;

      return data.report;
    } catch (error) {
      console.error('Error fetching unsung hero report:', error);
      // Return empty array on error
      return [];
    }
  }

  // Get Personal Contribution Heatmap
  async getContributionHeatmap(
    userId?: string,
    year?: number
  ): Promise<ContributionHeatmapData[]> {
    try {
      const user = useAuthStore.getState().user;
      if (!user) throw new Error('User not authenticated');

      const targetUserId = userId || user.id;
      const targetYear = year || new Date().getFullYear();

      // In demo mode, return empty array
      if (isDemoMode) {
        console.log('🔧 Demo mode: Contribution heatmap not available');
        return [];
      }

      const { data, error } = await supabase.functions.invoke('analytics-contribution-heatmap', {
        body: {
          user_id: targetUserId,
          year: targetYear,
          requester_id: user.id
        }
      });

      if (error) throw error;

      return data.heatmap;
    } catch (error) {
      console.error('Error fetching contribution heatmap:', error);
      // Return empty array on error
      return [];
    }
  }

  // Get Team Performance Overview
  async getTeamPerformance(
    teamId?: string,
    dateFrom?: Date,
    dateTo?: Date
  ): Promise<TeamPerformanceData[]> {
    try {
      const user = useAuthStore.getState().user;
      if (!user) throw new Error('User not authenticated');

      // In demo mode, return empty array
      if (isDemoMode) {
        console.log('🔧 Demo mode: Team performance not available');
        return [];
      }

      const { data, error } = await supabase.functions.invoke('analytics-team-performance', {
        body: {
          user_id: user.id,
          team_id: teamId,
          date_from: dateFrom?.toISOString(),
          date_to: dateTo?.toISOString()
        }
      });

      if (error) throw error;

      return data.teams;
    } catch (error) {
      console.error('Error fetching team performance:', error);
      // Return empty array on error
      return [];
    }
  }

  // Get Credit Modifiers
  async getCreditModifiers(): Promise<CreditModifier[]> {
    try {
      const user = useAuthStore.getState().user;
      if (!user) throw new Error('User not authenticated');

      // In demo mode, return empty array
      if (isDemoMode) {
        console.log('🔧 Demo mode: Credit modifiers not available');
        return [];
      }

      const { data, error } = await supabase
        .from('credit_modifiers')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching credit modifiers:', error);
      // Return empty array on error
      return [];
    }
  }

  // Create Credit Modifier
  async createCreditModifier(modifier: Omit<CreditModifier, 'id' | 'created_at' | 'created_by'>): Promise<CreditModifier> {
    try {
      const user = useAuthStore.getState().user;
      if (!user) throw new Error('User not authenticated');

      // In demo mode, throw helpful error
      if (isDemoMode) {
        throw new Error('Creating credit modifiers requires a connected Supabase backend.');
      }

      const { data, error } = await supabase
        .from('credit_modifiers')
        .insert({
          ...modifier,
          created_by: user.id,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error creating credit modifier:', error);
      throw error;
    }
  }

  // Update Credit Modifier
  async updateCreditModifier(id: string, updates: Partial<CreditModifier>): Promise<CreditModifier> {
    try {
      // In demo mode, throw helpful error
      if (isDemoMode) {
        throw new Error('Updating credit modifiers requires a connected Supabase backend.');
      }

      const { data, error } = await supabase
        .from('credit_modifiers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error updating credit modifier:', error);
      throw error;
    }
  }

  // Delete Credit Modifier
  async deleteCreditModifier(id: string): Promise<void> {
    try {
      // In demo mode, silently succeed
      if (isDemoMode) {
        console.log('🔧 Demo mode: Delete credit modifier simulated');
        return;
      }

      const { error } = await supabase
        .from('credit_modifiers')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting credit modifier:', error);
      if (isDemoMode) return;
      throw error;
    }
  }

  // Get Task Analytics Summary
  async getTaskAnalyticsSummary(userId?: string): Promise<{
    total_tasks: number;
    completed_tasks: number;
    pending_tasks: number;
    total_credits_earned: number;
    avg_completion_time: number;
    completion_rate: number;
    most_productive_day: string;
    most_common_tags: string[];
  }> {
    try {
      const user = useAuthStore.getState().user;
      if (!user) throw new Error('User not authenticated');

      const targetUserId = userId || user.id;

      // In demo mode, return default values
      if (isDemoMode) {
        console.log('🔧 Demo mode: Task analytics summary not available');
        return {
          total_tasks: 0,
          completed_tasks: 0,
          pending_tasks: 0,
          total_credits_earned: 0,
          avg_completion_time: 0,
          completion_rate: 0,
          most_productive_day: '',
          most_common_tags: []
        };
      }

      const { data, error } = await supabase.functions.invoke('analytics-task-summary', {
        body: {
          user_id: targetUserId,
          requester_id: user.id
        }
      });

      if (error) throw error;

      return data.summary;
    } catch (error) {
      console.error('Error fetching task analytics summary:', error);
      // Return default values on error
      return {
        total_tasks: 0,
        completed_tasks: 0,
        pending_tasks: 0,
        total_credits_earned: 0,
        avg_completion_time: 0,
        completion_rate: 0,
        most_productive_day: '',
        most_common_tags: []
      };
    }
  }

  // Get Recognition Analytics
  async getRecognitionAnalytics(userId?: string): Promise<{
    given_count: number;
    received_count: number;
    total_credits_given: number;
    total_credits_received: number;
    most_recognized_for: string[];
    recognition_trend: Array<{
      date: string;
      given: number;
      received: number;
    }>;
  }> {
    try {
      const user = useAuthStore.getState().user;
      if (!user) throw new Error('User not authenticated');

      const targetUserId = userId || user.id;

      // In demo mode, return default values
      if (isDemoMode) {
        console.log('🔧 Demo mode: Recognition analytics not available');
        return {
          given_count: 0,
          received_count: 0,
          total_credits_given: 0,
          total_credits_received: 0,
          most_recognized_for: [],
          recognition_trend: []
        };
      }

      const { data, error } = await supabase.functions.invoke('analytics-recognition', {
        body: {
          user_id: targetUserId,
          requester_id: user.id
        }
      });

      if (error) throw error;

      return data.analytics;
    } catch (error) {
      console.error('Error fetching recognition analytics:', error);
      // Return default values on error
      return {
        given_count: 0,
        received_count: 0,
        total_credits_given: 0,
        total_credits_received: 0,
        most_recognized_for: [],
        recognition_trend: []
      };
    }
  }
}

export const analyticsService = new AnalyticsService();