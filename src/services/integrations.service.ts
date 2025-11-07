import { supabase } from '../utils/supabase/client';
import { supabaseUrl, publicAnonKey } from '../utils/supabase/info';
import { useAuthStore } from '../stores/auth';

// Check if we're in demo mode (using placeholder credentials)
const isDemoMode = supabaseUrl.includes('your-project-id') || supabaseUrl.includes('connected-project') || publicAnonKey.includes('your-anon-key') || publicAnonKey.includes('connected-anon-key');

// Log demo mode status for debugging
console.log('🔧 Integrations Service - Demo mode:', isDemoMode, { supabaseUrl, publicAnonKey });

export interface Integration {
  id: string;
  user_id: string;
  service: 'jira' | 'clickup';
  access_token: string;
  refresh_token?: string;
  workspace_id: string;
  workspace_name: string;
  is_active: boolean;
  settings: {
    status_mappings?: Record<string, string>;
    credit_rules?: Array<{
      statusFrom: string;
      statusTo: string;
      credits: number;
    }>;
    selected_projects?: string[];
  };
  created_at: string;
  updated_at: string;
}

export interface IntegrationConnection {
  service: 'jira' | 'clickup';
  connected: boolean;
  workspace?: string;
  projects?: string[];
  settings?: Integration['settings'];
}

class IntegrationsService {
  // Helper to get default empty connections
  private getDefaultConnections(): IntegrationConnection[] {
    return [
      {
        service: 'jira',
        connected: false,
        workspace: '',
        projects: [],
        settings: {}
      },
      {
        service: 'clickup',
        connected: false,
        workspace: '',
        projects: [],
        settings: {}
      }
    ];
  }

  // Get user's integrations
  async getUserIntegrations(): Promise<IntegrationConnection[]> {
    try {
      const user = useAuthStore.getState().user;
      if (!user) {
        console.log('🔧 No user authenticated, returning default connections');
        return this.getDefaultConnections();
      }

      // In demo mode, return default connections without attempting fetch
      if (isDemoMode) {
        console.log('🔧 Demo mode active, returning default connections');
        return this.getDefaultConnections();
      }

      const { data, error } = await supabase
        .from('integrations')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (error) throw error;

      // Convert to connection format
      const connections = this.getDefaultConnections();

      data?.forEach(integration => {
        const index = connections.findIndex(c => c.service === integration.service);
        if (index !== -1) {
          connections[index] = {
            service: integration.service,
            connected: true,
            workspace: integration.workspace_name,
            projects: integration.settings?.selected_projects || [],
            settings: integration.settings
          };
        }
      });

      return connections;
    } catch (error) {
      console.error('Error fetching integrations:', error);
      
      // Return empty connections on error (graceful fallback)
      return this.getDefaultConnections();
    }
  }

  // Initiate OAuth flow
  async initiateOAuthFlow(service: 'jira' | 'clickup'): Promise<{ authUrl: string }> {
    try {
      const user = useAuthStore.getState().user;
      if (!user) throw new Error('User not authenticated');

      // In demo mode, show helpful message
      if (isDemoMode) {
        throw new Error('Integration setup requires a connected Supabase backend. This feature is available in the full deployment.');
      }

      // Call Supabase Edge Function to generate OAuth URL
      const { data, error } = await supabase.functions.invoke('integrations-connect', {
        body: {
          service,
          user_id: user.id,
          redirect_uri: `${window.location.origin}/integrations/callback`
        }
      });

      if (error) throw error;

      return { authUrl: data.authUrl };
    } catch (error) {
      console.error('Error initiating OAuth flow:', error);
      
      // Return a demo message instead of throwing
      throw new Error('Integration setup requires a connected Supabase backend. This feature is available in the full deployment.');
    }
  }

  // Handle OAuth callback
  async handleOAuthCallback(
    service: 'jira' | 'clickup', 
    code: string, 
    state: string
  ): Promise<Integration> {
    try {
      const user = useAuthStore.getState().user;
      if (!user) throw new Error('User not authenticated');

      // Call Supabase Edge Function to exchange code for tokens
      const { data, error } = await supabase.functions.invoke('integrations-callback', {
        body: {
          service,
          code,
          state,
          user_id: user.id
        }
      });

      if (error) throw error;

      return data.integration;
    } catch (error) {
      console.error('Error handling OAuth callback:', error);
      throw error;
    }
  }

  // Update integration settings
  async updateIntegrationSettings(
    service: 'jira' | 'clickup',
    settings: Integration['settings']
  ): Promise<void> {
    try {
      const user = useAuthStore.getState().user;
      if (!user) throw new Error('User not authenticated');

      // In demo mode, silently succeed
      if (isDemoMode) {
        console.log('🔧 Demo mode: Settings update simulated for', service);
        return;
      }

      const { error } = await supabase
        .from('integrations')
        .update({
          settings,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('service', service)
        .eq('is_active', true);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating integration settings:', error);
      
      // In demo mode or connection error, don't throw
      if (isDemoMode) {
        return;
      }
      throw error;
    }
  }

  // Disconnect integration
  async disconnectIntegration(service: 'jira' | 'clickup'): Promise<void> {
    try {
      const user = useAuthStore.getState().user;
      if (!user) throw new Error('User not authenticated');

      // In demo mode, silently succeed
      if (isDemoMode) {
        console.log('🔧 Demo mode: Disconnect simulated for', service);
        return;
      }

      const { error } = await supabase
        .from('integrations')
        .update({
          is_active: false,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('service', service);

      if (error) throw error;
    } catch (error) {
      console.error('Error disconnecting integration:', error);
      
      // In demo mode, don't throw
      if (isDemoMode) {
        return;
      }
      throw error;
    }
  }

  // Sync tasks from external service
  async syncTasks(service: 'jira' | 'clickup'): Promise<void> {
    try {
      const user = useAuthStore.getState().user;
      if (!user) throw new Error('User not authenticated');

      // In demo mode, silently succeed
      if (isDemoMode) {
        console.log('🔧 Demo mode: Task sync simulated for', service);
        return;
      }

      // Call Edge Function to sync tasks
      const { error } = await supabase.functions.invoke('integrations-sync', {
        body: {
          service,
          user_id: user.id
        }
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error syncing tasks:', error);
      
      // In demo mode, don't throw
      if (isDemoMode) {
        return;
      }
      throw error;
    }
  }

  // Test integration connection
  async testConnection(service: 'jira' | 'clickup'): Promise<{ success: boolean; message: string }> {
    try {
      const user = useAuthStore.getState().user;
      if (!user) throw new Error('User not authenticated');

      // In demo mode, return mock response
      if (isDemoMode) {
        console.log('🔧 Demo mode: Connection test simulated for', service);
        return { 
          success: false, 
          message: 'Demo mode: Connect to Supabase to test real integrations' 
        };
      }

      const { data, error } = await supabase.functions.invoke('integrations-test', {
        body: {
          service,
          user_id: user.id
        }
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error testing connection:', error);
      return { success: false, message: 'Connection test failed' };
    }
  }
}

export const integrationsService = new IntegrationsService();