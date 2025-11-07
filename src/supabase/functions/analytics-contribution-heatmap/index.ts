import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface HeatmapRequest {
  user_id: string;
  year: number;
  requester_id: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { user_id, year, requester_id }: HeatmapRequest = await req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get date range for the year
    const startDate = new Date(year, 0, 1).toISOString();
    const endDate = new Date(year + 1, 0, 1).toISOString();

    // Fetch completed tasks for the user in the specified year
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('credits, updated_at')
      .eq('assignee_id', user_id)
      .eq('status', 'completed')
      .gte('updated_at', startDate)
      .lt('updated_at', endDate);

    if (tasksError) {
      throw new Error(`Failed to fetch tasks: ${tasksError.message}`);
    }

    // Fetch recognitions received for the user in the specified year
    const { data: recognitions, error: recognitionsError } = await supabase
      .from('recognitions')
      .select('credits, created_at')
      .eq('to_user_id', user_id)
      .gte('created_at', startDate)
      .lt('created_at', endDate);

    if (recognitionsError) {
      throw new Error(`Failed to fetch recognitions: ${recognitionsError.message}`);
    }

    // Create a map to aggregate data by date
    const contributionMap = new Map();

    // Initialize all dates in the year with zero values
    const currentDate = new Date(year, 0, 1);
    const endOfYear = new Date(year + 1, 0, 1);

    while (currentDate < endOfYear) {
      const dateStr = currentDate.toISOString().split('T')[0];
      contributionMap.set(dateStr, {
        date: dateStr,
        tasks_completed: 0,
        credits_earned: 0,
        intensity: 0
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Process completed tasks
    tasks?.forEach(task => {
      const date = new Date(task.updated_at).toISOString().split('T')[0];
      if (contributionMap.has(date)) {
        const dayData = contributionMap.get(date);
        dayData.tasks_completed++;
        dayData.credits_earned += task.credits;
      }
    });

    // Process recognitions
    recognitions?.forEach(recognition => {
      const date = new Date(recognition.created_at).toISOString().split('T')[0];
      if (contributionMap.has(date)) {
        const dayData = contributionMap.get(date);
        dayData.credits_earned += recognition.credits;
      }
    });

    // Calculate intensity levels (0-4 scale)
    const contributionData = Array.from(contributionMap.values());
    const maxCredits = Math.max(...contributionData.map(d => d.credits_earned));
    const maxTasks = Math.max(...contributionData.map(d => d.tasks_completed));

    // Normalize and calculate intensity
    contributionData.forEach(dayData => {
      const creditScore = maxCredits > 0 ? (dayData.credits_earned / maxCredits) : 0;
      const taskScore = maxTasks > 0 ? (dayData.tasks_completed / maxTasks) : 0;
      
      // Combine scores and map to 0-4 intensity scale
      const combinedScore = (creditScore * 0.7) + (taskScore * 0.3);
      
      if (combinedScore === 0) {
        dayData.intensity = 0;
      } else if (combinedScore <= 0.25) {
        dayData.intensity = 1;
      } else if (combinedScore <= 0.5) {
        dayData.intensity = 2;
      } else if (combinedScore <= 0.75) {
        dayData.intensity = 3;
      } else {
        dayData.intensity = 4;
      }
    });

    return new Response(
      JSON.stringify({ heatmap: contributionData }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in analytics-contribution-heatmap:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});