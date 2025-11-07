import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { supabaseUrl, publicAnonKey, projectId } from './info';

// Check if we're using placeholder values
const isUsingPlaceholders = 
  supabaseUrl.includes('your-project-id') || 
  supabaseUrl.includes('connected-project') ||
  publicAnonKey.includes('your-anon-key') ||
  publicAnonKey.includes('connected-anon-key');

// Create Supabase client only if we have real credentials
export const supabase: SupabaseClient | null = isUsingPlaceholders 
  ? null 
  : createClient(supabaseUrl, publicAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });

// Log connection status (only if not suppressed)
const suppressLogs = typeof window !== 'undefined' && localStorage.getItem('honourus-suppress-demo-logs') === 'true';

if (!suppressLogs) {
  if (isUsingPlaceholders) {
    // Use info-level logging with grouped console for cleaner output
    console.groupCollapsed('%c🎭 Honourus Demo Mode', 'color: #60a5fa; font-weight: bold; font-size: 12px;');
    console.info('%cDemo Mode Active', 'color: #93c5fd; font-size: 11px;');
    console.info('✓ All features work with local mock data');
    console.info('✓ Changes will not persist after page refresh');
    console.info('%cTo enable data persistence:', 'color: #fbbf24; font-size: 11px; margin-top: 8px;');
    console.info('  1. Create project at https://supabase.com');
    console.info('  2. Update credentials in utils/supabase/info.tsx');
    console.info('  3. Run database/schema.sql in Supabase SQL editor');
    console.info('%cTo suppress this message:', 'color: #94a3b8; font-size: 10px; margin-top: 8px;');
    console.info('  localStorage.setItem("honourus-suppress-demo-logs", "true")');
    console.groupEnd();
  } else {
    console.log('%c✅ Honourus Connected', 'color: #10b981; font-weight: bold; font-size: 12px;');
    console.log('%cProject: ' + projectId, 'color: #34d399; font-size: 11px;');
    console.log('%c🔄 Real-time sync enabled', 'color: #34d399; font-size: 11px;');
  }
}

// Types for our database
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: 'admin' | 'manager' | 'member';
          department: string | null;
          credits: number;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          role?: 'admin' | 'manager' | 'member';
          department?: string | null;
          credits?: number;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          role?: 'admin' | 'manager' | 'member';
          department?: string | null;
          credits?: number;
          avatar_url?: string | null;
          updated_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          status: 'todo' | 'in-progress' | 'in-review' | 'completed' | 'rejected';
          priority: 'low' | 'medium' | 'high' | 'critical';
          assignee_id: string;
          created_by: string;
          team_id: string | null;
          credits: number;
          due_date: string | null;
          requires_proof: boolean;
          proof_uploaded: boolean;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          status?: 'todo' | 'in-progress' | 'in-review' | 'completed' | 'rejected';
          priority?: 'low' | 'medium' | 'high' | 'critical';
          assignee_id: string;
          created_by: string;
          team_id?: string | null;
          credits?: number;
          due_date?: string | null;
          requires_proof?: boolean;
          proof_uploaded?: boolean;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          status?: 'todo' | 'in-progress' | 'in-review' | 'completed' | 'rejected';
          priority?: 'low' | 'medium' | 'high' | 'critical';
          assignee_id?: string;
          team_id?: string | null;
          credits?: number;
          due_date?: string | null;
          requires_proof?: boolean;
          proof_uploaded?: boolean;
          tags?: string[];
          updated_at?: string;
        };
      };
      teams: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          leader_id: string;
          member_ids: string[];
          channel_ids: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          leader_id: string;
          member_ids?: string[];
          channel_ids?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          leader_id?: string;
          member_ids?: string[];
          channel_ids?: string[];
          updated_at?: string;
        };
      };
      recognitions: {
        Row: {
          id: string;
          from_user_id: string;
          to_user_id: string;
          message: string;
          credits: number;
          type: 'peer' | 'manager' | 'achievement';
          created_at: string;
        };
        Insert: {
          id?: string;
          from_user_id: string;
          to_user_id: string;
          message: string;
          credits: number;
          type: 'peer' | 'manager' | 'achievement';
          created_at?: string;
        };
        Update: {
          id?: string;
          from_user_id?: string;
          to_user_id?: string;
          message?: string;
          credits?: number;
          type?: 'peer' | 'manager' | 'achievement';
        };
      };
    };
  };
}

export default supabase;