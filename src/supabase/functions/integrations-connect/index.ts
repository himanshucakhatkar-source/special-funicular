import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ConnectRequest {
  service: 'jira' | 'clickup';
  user_id: string;
  redirect_uri: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { service, user_id, redirect_uri }: ConnectRequest = await req.json();

    // Generate state for security
    const state = crypto.randomUUID();
    
    // Store state in database for verification
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    await supabase
      .from('oauth_states')
      .insert({
        state,
        user_id,
        service,
        redirect_uri,
        expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 minutes
      });

    let authUrl = '';

    if (service === 'jira') {
      const clientId = Deno.env.get('JIRA_CLIENT_ID');
      const scopes = 'read:jira-work read:jira-user offline_access';
      
      authUrl = `https://auth.atlassian.com/authorize?` +
        `audience=api.atlassian.com&` +
        `client_id=${clientId}&` +
        `scope=${encodeURIComponent(scopes)}&` +
        `redirect_uri=${encodeURIComponent(redirect_uri)}&` +
        `state=${state}&` +
        `response_type=code&` +
        `prompt=consent`;
    } else if (service === 'clickup') {
      const clientId = Deno.env.get('CLICKUP_CLIENT_ID');
      
      authUrl = `https://app.clickup.com/api?` +
        `client_id=${clientId}&` +
        `redirect_uri=${encodeURIComponent(redirect_uri)}&` +
        `state=${state}&` +
        `response_type=code`;
    }

    return new Response(
      JSON.stringify({ authUrl }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in integrations-connect:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});