import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Middleware
app.use('*', cors({
  origin: '*',
  allowHeaders: ['*'],
  allowMethods: ['*'],
}));

app.use('*', logger(console.log));

// Routes
app.get('/make-server-71b2722d/health', (c) => {
  return c.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// User Authentication
app.post('/make-server-71b2722d/auth/signup', async (c) => {
  try {
    const { email, password, name, role = 'member', department } = await c.req.json();

    if (!email || !password || !name) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        name, 
        role, 
        department,
        credits: 0 
      },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log(`Signup error: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    // Store additional user data in KV store
    await kv.set(`user_${data.user.id}`, {
      id: data.user.id,
      name,
      email,
      role,
      department,
      credits: 0,
      createdAt: new Date().toISOString()
    });

    return c.json({ user: data.user, message: 'User created successfully' });
  } catch (error) {
    console.log(`Signup error: ${error}`);
    return c.json({ error: 'Internal server error during signup' }, 500);
  }
});

app.post('/make-server-71b2722d/auth/signin', async (c) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: 'Email and password required' }, 400);
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log(`Signin error: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    // Get user data from KV store
    const userData = await kv.get(`user_${data.user.id}`);

    return c.json({ 
      user: data.user, 
      session: data.session,
      userData: userData || {
        id: data.user.id,
        name: data.user.user_metadata?.name || 'User',
        email: data.user.email,
        role: data.user.user_metadata?.role || 'member',
        department: data.user.user_metadata?.department,
        credits: data.user.user_metadata?.credits || 0
      }
    });
  } catch (error) {
    console.log(`Signin error: ${error}`);
    return c.json({ error: 'Internal server error during signin' }, 500);
  }
});

// Tasks Management
app.get('/make-server-71b2722d/tasks', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Authorization required' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user || error) {
      return c.json({ error: 'Invalid authorization' }, 401);
    }

    const tasks = await kv.getByPrefix('task_');
    return c.json({ tasks: tasks || [] });
  } catch (error) {
    console.log(`Get tasks error: ${error}`);
    return c.json({ error: 'Error fetching tasks' }, 500);
  }
});

app.post('/make-server-71b2722d/tasks', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Authorization required' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user || error) {
      return c.json({ error: 'Invalid authorization' }, 401);
    }

    const taskData = await c.req.json();
    const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const task = {
      id: taskId,
      ...taskData,
      createdBy: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      proofUploaded: false
    };

    await kv.set(taskId, task);

    return c.json({ task, message: 'Task created successfully' });
  } catch (error) {
    console.log(`Create task error: ${error}`);
    return c.json({ error: 'Error creating task' }, 500);
  }
});

app.put('/make-server-71b2722d/tasks/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Authorization required' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user || error) {
      return c.json({ error: 'Invalid authorization' }, 401);
    }

    const taskId = c.req.param('id');
    const updateData = await c.req.json();
    
    const existingTask = await kv.get(taskId);
    if (!existingTask) {
      return c.json({ error: 'Task not found' }, 404);
    }

    const updatedTask = {
      ...existingTask,
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    // Award credits if task is completed and requires proof (and proof is uploaded)
    if (updateData.status === 'completed' && existingTask.requiresProof && existingTask.proofUploaded) {
      const assigneeId = existingTask.assigneeId || user.id;
      const userData = await kv.get(`user_${assigneeId}`);
      if (userData) {
        userData.credits = (userData.credits || 0) + existingTask.credits;
        await kv.set(`user_${assigneeId}`, userData);
      }
    }

    await kv.set(taskId, updatedTask);

    return c.json({ task: updatedTask, message: 'Task updated successfully' });
  } catch (error) {
    console.log(`Update task error: ${error}`);
    return c.json({ error: 'Error updating task' }, 500);
  }
});

// Recognition System
app.get('/make-server-71b2722d/recognitions', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Authorization required' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user || error) {
      return c.json({ error: 'Invalid authorization' }, 401);
    }

    const recognitions = await kv.getByPrefix('recognition_');
    return c.json({ recognitions: recognitions || [] });
  } catch (error) {
    console.log(`Get recognitions error: ${error}`);
    return c.json({ error: 'Error fetching recognitions' }, 500);
  }
});

app.post('/make-server-71b2722d/recognitions', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Authorization required' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user || error) {
      return c.json({ error: 'Invalid authorization' }, 401);
    }

    const { toUserId, message, credits, type } = await c.req.json();

    if (!toUserId || !message || !credits || !type) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const recognitionId = `recognition_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const recognition = {
      id: recognitionId,
      fromUserId: user.id,
      toUserId,
      message,
      credits: parseInt(credits),
      type,
      createdAt: new Date().toISOString()
    };

    await kv.set(recognitionId, recognition);

    // Award credits to the recipient
    const recipientData = await kv.get(`user_${toUserId}`);
    if (recipientData) {
      recipientData.credits = (recipientData.credits || 0) + parseInt(credits);
      await kv.set(`user_${toUserId}`, recipientData);
    }

    return c.json({ recognition, message: 'Recognition sent successfully' });
  } catch (error) {
    console.log(`Send recognition error: ${error}`);
    return c.json({ error: 'Error sending recognition' }, 500);
  }
});

// User Profile
app.get('/make-server-71b2722d/users/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Authorization required' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user || error) {
      return c.json({ error: 'Invalid authorization' }, 401);
    }

    const userId = c.req.param('id');
    const userData = await kv.get(`user_${userId}`);
    
    if (!userData) {
      return c.json({ error: 'User not found' }, 404);
    }

    return c.json({ user: userData });
  } catch (error) {
    console.log(`Get user error: ${error}`);
    return c.json({ error: 'Error fetching user' }, 500);
  }
});

app.put('/make-server-71b2722d/users/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Authorization required' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user || error) {
      return c.json({ error: 'Invalid authorization' }, 401);
    }

    const userId = c.req.param('id');
    const updateData = await c.req.json();
    
    // Only allow users to update their own profile or admins to update any profile
    const currentUserData = await kv.get(`user_${user.id}`);
    if (user.id !== userId && currentUserData?.role !== 'admin') {
      return c.json({ error: 'Unauthorized to update this profile' }, 403);
    }

    const existingUserData = await kv.get(`user_${userId}`);
    if (!existingUserData) {
      return c.json({ error: 'User not found' }, 404);
    }

    const updatedUserData = {
      ...existingUserData,
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    await kv.set(`user_${userId}`, updatedUserData);

    return c.json({ user: updatedUserData, message: 'Profile updated successfully' });
  } catch (error) {
    console.log(`Update user error: ${error}`);
    return c.json({ error: 'Error updating user profile' }, 500);
  }
});

// Teams Management
app.get('/make-server-71b2722d/teams', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Authorization required' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user || error) {
      return c.json({ error: 'Invalid authorization' }, 401);
    }

    const teams = await kv.getByPrefix('team_');
    return c.json({ teams: teams || [] });
  } catch (error) {
    console.log(`Get teams error: ${error}`);
    return c.json({ error: 'Error fetching teams' }, 500);
  }
});

app.post('/make-server-71b2722d/teams', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Authorization required' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user || error) {
      return c.json({ error: 'Invalid authorization' }, 401);
    }

    const { name, description } = await c.req.json();

    if (!name) {
      return c.json({ error: 'Team name is required' }, 400);
    }

    const teamId = `team_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const team = {
      id: teamId,
      name,
      description: description || '',
      leaderId: user.id,
      memberIds: [user.id],
      channelIds: [],
      createdAt: new Date().toISOString()
    };

    await kv.set(teamId, team);

    return c.json({ team, message: 'Team created successfully' });
  } catch (error) {
    console.log(`Create team error: ${error}`);
    return c.json({ error: 'Error creating team' }, 500);
  }
});

// Analytics
app.get('/make-server-71b2722d/analytics', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Authorization required' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user || error) {
      return c.json({ error: 'Invalid authorization' }, 401);
    }

    // Get all data for analytics
    const tasks = await kv.getByPrefix('task_');
    const recognitions = await kv.getByPrefix('recognition_');
    const users = await kv.getByPrefix('user_');

    // Calculate analytics
    const userTasks = tasks.filter(task => task.assigneeId === user.id || task.createdBy === user.id);
    const completedTasks = userTasks.filter(task => task.status === 'completed');
    const totalCredits = users.find(u => u.id === user.id)?.credits || 0;
    const receivedRecognitions = recognitions.filter(r => r.toUserId === user.id);

    const analytics = {
      tasksCompleted: completedTasks.length,
      creditsEarned: totalCredits,
      recognitionsReceived: receivedRecognitions.length,
      teamPerformance: Math.round((completedTasks.length / Math.max(userTasks.length, 1)) * 100),
      productivityScore: Math.round(((completedTasks.length * 0.6) + (receivedRecognitions.length * 0.4)) * 10)
    };

    return c.json({ analytics });
  } catch (error) {
    console.log(`Get analytics error: ${error}`);
    return c.json({ error: 'Error fetching analytics' }, 500);
  }
});

// Error handling
app.onError((err, c) => {
  console.error('Server error:', err);
  return c.json({ error: 'Internal server error' }, 500);
});

// Start server
serve(app.fetch);
