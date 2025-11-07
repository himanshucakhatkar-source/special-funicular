import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CallbackRequest {
  service: 'jira' | 'clickup';
  code: string;
  state: string;
  user_id: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { service, code, state, user_id }: CallbackRequest = await req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify state
    const { data: oauthState, error: stateError } = await supabase
      .from('oauth_states')
      .select('*')
      .eq('state', state)
      .eq('user_id', user_id)
      .eq('service', service)
      .single();

    if (stateError || !oauthState) {
      throw new Error('Invalid state parameter');
    }

    // Check if state is expired
    if (new Date(oauthState.expires_at) < new Date()) {
      throw new Error('OAuth state has expired');
    }

    // Exchange code for tokens
    let tokenData: any;
    let workspaceInfo: any;

    if (service === 'jira') {
      const tokenResponse = await fetch('https://auth.atlassian.com/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grant_type: 'authorization_code',
          client_id: Deno.env.get('JIRA_CLIENT_ID'),
          client_secret: Deno.env.get('JIRA_CLIENT_SECRET'),
          code,
          redirect_uri: oauthState.redirect_uri,
        }),
      });

      tokenData = await tokenResponse.json();

      if (!tokenResponse.ok) {
        throw new Error(`Failed to exchange code for tokens: ${tokenData.error_description}`);
      }

      // Get accessible resources (sites)
      const resourcesResponse = await fetch('https://api.atlassian.com/oauth/token/accessible-resources', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
        },
      });

      const resources = await resourcesResponse.json();
      
      if (resources.length > 0) {
        workspaceInfo = {
          workspace_id: resources[0].id,
          workspace_name: resources[0].name,
          workspace_url: resources[0].url,
        };
      }
    } else if (service === 'clickup') {
      const tokenResponse = await fetch('https://api.clickup.com/api/v2/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: Deno.env.get('CLICKUP_CLIENT_ID'),
          client_secret: Deno.env.get('CLICKUP_CLIENT_SECRET'),
          code,
        }),
      });

      tokenData = await tokenResponse.json();

      if (!tokenResponse.ok) {
        throw new Error(`Failed to exchange code for tokens: ${tokenData.error}`);
      }

      // Get user info to get workspace details
      const userResponse = await fetch('https://api.clickup.com/api/v2/user', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
        },
      });

      const userData = await userResponse.json();
      
      if (userData.user && userData.user.teams && userData.user.teams.length > 0) {
        const firstTeam = userData.user.teams[0];
        workspaceInfo = {
          workspace_id: firstTeam.id,
          workspace_name: firstTeam.name,
          workspace_url: `https://app.clickup.com/${firstTeam.id}`,
        };
      }
    }

    // Store integration in database
    const { data: integration, error: integrationError } = await supabase
      .from('integrations')
      .upsert({
        user_id,
        service,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        workspace_id: workspaceInfo?.workspace_id || '',
        workspace_name: workspaceInfo?.workspace_name || '',
        is_active: true,
        settings: {
          status_mappings: {},
          credit_rules: [],
          selected_projects: [],
        },
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (integrationError) {
      throw new Error(`Failed to save integration: ${integrationError.message}`);
    }

    // Clean up OAuth state
    await supabase
      .from('oauth_states')
      .delete()
      .eq('state', state);

    return new Response(
      JSON.stringify({ integration }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in integrations-callback:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});