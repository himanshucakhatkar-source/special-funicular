import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface UnsingHeroRequest {
  user_id: string;
  team_id?: string;
  date_from?: string;
  date_to?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { user_id, team_id, date_from, date_to }: UnsingHeroRequest = await req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Build the query with filters
    let query = supabase
      .from('tasks')
      .select(`
        id,
        title,
        status,
        priority,
        assignee_id,
        credits,
        tags,
        created_at,
        updated_at,
        users!tasks_assignee_id_fkey(id, name, email, role)
      `);

    if (team_id) {
      query = query.eq('team_id', team_id);
    }

    if (date_from) {
      query = query.gte('created_at', date_from);
    }

    if (date_to) {
      query = query.lte('created_at', date_to);
    }

    const { data: tasks, error: tasksError } = await query;

    if (tasksError) {
      throw new Error(`Failed to fetch tasks: ${tasksError.message}`);
    }

    // Process data to generate unsung hero insights
    const userStats = new Map();

    tasks?.forEach(task => {
      const userId = task.assignee_id;
      const user = task.users;

      if (!userStats.has(userId)) {
        userStats.set(userId, {
          user_id: userId,
          user_name: user?.name || 'Unknown User',
          total_tasks: 0,
          completed_tasks: 0,
          total_credits: 0,
          task_types: new Map(),
          recent_achievements: []
        });
      }

      const stats = userStats.get(userId);
      stats.total_tasks++;
      stats.total_credits += task.credits;

      if (task.status === 'completed') {
        stats.completed_tasks++;
        stats.recent_achievements.push({
          task_title: task.title,
          credits: task.credits,
          completed_at: task.updated_at
        });
      }

      // Process task tags
      task.tags?.forEach(tag => {
        if (!stats.task_types.has(tag)) {
          stats.task_types.set(tag, { count: 0, completed: 0 });
        }
        const tagStats = stats.task_types.get(tag);
        tagStats.count++;
        if (task.status === 'completed') {
          tagStats.completed++;
        }
      });
    });

    // Convert to final format and calculate metrics
    const report = Array.from(userStats.values()).map(stats => {
      // Sort recent achievements by date
      stats.recent_achievements.sort((a, b) => 
        new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
      );

      // Convert task types map to array
      const task_types = Array.from(stats.task_types.entries()).map(([tag, data]) => ({
        tag,
        count: data.count,
        completion_rate: data.count > 0 ? (data.completed / data.count) * 100 : 0
      }));

      return {
        user_id: stats.user_id,
        user_name: stats.user_name,
        total_tasks: stats.total_tasks,
        completed_tasks: stats.completed_tasks,
        completion_rate: stats.total_tasks > 0 ? (stats.completed_tasks / stats.total_tasks) * 100 : 0,
        total_credits: stats.total_credits,
        avg_task_credits: stats.total_tasks > 0 ? stats.total_credits / stats.total_tasks : 0,
        task_types: task_types.sort((a, b) => b.count - a.count).slice(0, 5), // Top 5 task types
        recent_achievements: stats.recent_achievements.slice(0, 5) // Most recent 5 achievements
      };
    });

    // Sort by a composite score that identifies "unsung heroes"
    // Higher completion rate + higher task volume + diverse task types = higher score
    report.sort((a, b) => {
      const scoreA = (a.completion_rate * 0.4) + (a.total_tasks * 0.3) + (a.task_types.length * 0.3);
      const scoreB = (b.completion_rate * 0.4) + (b.total_tasks * 0.3) + (b.task_types.length * 0.3);
      return scoreB - scoreA;
    });

    return new Response(
      JSON.stringify({ report }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in analytics-unsung-hero:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});