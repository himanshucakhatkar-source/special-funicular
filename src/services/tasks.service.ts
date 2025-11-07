import { supabase } from '../utils/supabase/client';
import { supabaseUrl, publicAnonKey } from '../utils/supabase/info';
import { useAppStore } from '../stores/app';
import { useAuthStore } from '../stores/auth';
import { Task } from '../types';

// Check if we're in demo mode (using placeholder credentials)
const isDemoMode = supabaseUrl.includes('your-project-id') || supabaseUrl.includes('connected-project') || publicAnonKey.includes('your-anon-key') || publicAnonKey.includes('connected-anon-key');

// Log demo mode status for debugging
console.log('🔧 Tasks Service - Demo mode:', isDemoMode, { supabaseUrl, publicAnonKey });

// Mock data for demo mode
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Implement User Authentication',
    description: 'Set up secure login and registration system with JWT tokens and password hashing',
    priority: 'high',
    type: 'feature',
    status: 'in-progress',
    assigneeId: 'demo-user-1',
    createdBy: 'demo-user-1',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    credits: 75,
    requiresProof: true,
    proofUploaded: false,
    tags: ['Backend', 'Security', 'Authentication'],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    title: 'Design Dashboard UI',
    description: 'Create modern and intuitive dashboard interface with data visualization',
    priority: 'medium',
    type: 'feature',
    status: 'completed',
    assigneeId: 'demo-user-1',
    createdBy: 'demo-user-1',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    credits: 50,
    requiresProof: false,
    proofUploaded: false,
    tags: ['Frontend', 'UI/UX', 'Design'],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: '3',
    title: 'Optimize Database Queries',
    description: 'Improve performance of critical database operations and add indexes',
    priority: 'high',
    type: 'improvement',
    status: 'todo',
    assigneeId: 'demo-user-1',
    createdBy: 'demo-user-1',
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    credits: 60,
    requiresProof: true,
    proofUploaded: false,
    tags: ['Backend', 'Performance', 'Database'],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: '4',
    title: 'Write API Documentation',
    description: 'Create comprehensive API documentation using OpenAPI specification',
    priority: 'medium',
    type: 'feature',
    status: 'in-review',
    assigneeId: 'demo-user-2',
    createdBy: 'demo-user-1',
    reviewerId: 'demo-user-1',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    credits: 40,
    requiresProof: true,
    proofUploaded: true,
    proofUrl: 'api-docs.pdf',
    tags: ['Documentation', 'API'],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000),
    submittedAt: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000),
  },
  {
    id: '5',
    title: 'Fix Login Bug',
    description: 'Resolve issue where users cannot login with special characters in password',
    priority: 'high',
    type: 'bug',
    status: 'rejected',
    assigneeId: 'demo-user-2',
    createdBy: 'demo-user-1',
    reviewerId: 'demo-user-1',
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Overdue
    credits: 35,
    requiresProof: true,
    proofUploaded: false,
    rejectionReason: 'The fix doesn\'t handle all edge cases. Please test with unicode characters and SQL injection attempts.',
    tags: ['Bug', 'Security', 'Frontend'],
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: '6',
    title: 'Setup CI/CD Pipeline',
    description: 'Configure automated testing and deployment pipeline using GitHub Actions',
    priority: 'medium',
    type: 'improvement',
    status: 'todo',
    assigneeId: 'demo-user-3',
    createdBy: 'demo-user-1',
    dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    credits: 80,
    requiresProof: true,
    proofUploaded: false,
    tags: ['DevOps', 'CI/CD', 'Automation'],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: '7',
    title: 'Brainstorm Gamification Features',
    description: 'Generate creative ideas for gamifying the employee recognition system with badges, leaderboards, and achievements',
    priority: 'medium',
    type: 'ideation',
    status: 'in-progress',
    assigneeId: 'demo-user-2',
    createdBy: 'demo-user-1',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    credits: 45,
    requiresProof: false,
    proofUploaded: false,
    tags: ['Ideation', 'Gamification', 'UX', 'Innovation'],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000),
  },
  {
    id: '8',
    title: 'Research AI Integration Opportunities',
    description: 'Investigate potential AI features for automated task assignment, performance insights, and recommendation systems',
    priority: 'low',
    type: 'research',
    status: 'todo',
    assigneeId: 'demo-user-3',
    createdBy: 'demo-user-1',
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    credits: 60,
    requiresProof: true,
    proofUploaded: false,
    tags: ['Research', 'AI', 'Innovation', 'Strategy'],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
];

export interface CreateTaskData {
  title: string;
  description?: string;
  assigneeId: string;
  teamId?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  type?: 'feature' | 'bug' | 'improvement' | 'research' | 'ideation';
  credits?: number;
  dueDate?: Date;
  requiresProof?: boolean;
  tags?: string[];
}

export interface UpdateTaskData extends Partial<CreateTaskData> {
  status?: 'todo' | 'in-progress' | 'in-review' | 'completed' | 'rejected';
  proofUploaded?: boolean;
  proofUrl?: string;
  reviewerId?: string;
  reviewNotes?: string;
  rejectionReason?: string;
  completedAt?: Date;
  submittedAt?: Date;
}

class TasksService {
  async fetchTasks() {
    try {
      // In demo mode or if supabase is null, return mock data
      if (isDemoMode || !supabase) {
        useAppStore.getState().setTasks(mockTasks);
        return mockTasks;
      }

      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          assignee:users!tasks_assignee_id_fkey(id, name, email, avatar_url),
          creator:users!tasks_created_by_fkey(id, name, email),
          team:teams(id, name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const tasks: Task[] = data.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        assigneeId: task.assignee_id,
        createdBy: task.created_by,
        teamId: task.team_id,
        credits: task.credits,
        dueDate: task.due_date ? new Date(task.due_date) : undefined,
        requiresProof: task.requires_proof,
        proofUploaded: task.proof_uploaded,
        tags: task.tags || [],
        createdAt: new Date(task.created_at),
        updatedAt: new Date(task.updated_at),
        assignee: task.assignee ? {
          id: task.assignee.id,
          name: task.assignee.name,
          email: task.assignee.email,
          avatar: task.assignee.avatar_url,
        } : undefined,
        creator: task.creator ? {
          id: task.creator.id,
          name: task.creator.name,
          email: task.creator.email,
        } : undefined,
        team: task.team ? {
          id: task.team.id,
          name: task.team.name,
        } : undefined,
      }));

      useAppStore.getState().setTasks(tasks);
      return tasks;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  }

  async createTask(taskData: CreateTaskData) {
    try {
      const currentUser = useAuthStore.getState().user;
      if (!currentUser) throw new Error('User not authenticated');

      // In demo mode or if supabase is null, create mock task
      if (isDemoMode || !supabase) {
        const newTask: Task = {
          id: `demo-task-${Date.now()}`,
          title: taskData.title,
          description: taskData.description || '',
          priority: taskData.priority || 'medium',
          type: taskData.type || 'feature',
          status: 'todo',
          assigneeId: taskData.assigneeId,
          createdBy: currentUser.id,
          teamId: taskData.teamId,
          credits: taskData.credits || 25,
          dueDate: taskData.dueDate,
          requiresProof: taskData.requiresProof || false,
          proofUploaded: false,
          tags: taskData.tags || [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        useAppStore.getState().addTask(newTask);
        return newTask;
      }

      const { data, error} = await supabase
        .from('tasks')
        .insert({
          title: taskData.title,
          description: taskData.description,
          assignee_id: taskData.assigneeId,
          created_by: currentUser.id,
          team_id: taskData.teamId,
          priority: taskData.priority || 'medium',
          credits: taskData.credits || 25,
          due_date: taskData.dueDate?.toISOString(),
          requires_proof: taskData.requiresProof || false,
          tags: taskData.tags || [],
          status: 'todo',
          proof_uploaded: false,
        })
        .select()
        .single();

      if (error) throw error;

      const newTask: Task = {
        id: data.id,
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        assigneeId: data.assignee_id,
        createdBy: data.created_by,
        teamId: data.team_id,
        credits: data.credits,
        dueDate: data.due_date ? new Date(data.due_date) : undefined,
        requiresProof: data.requires_proof,
        proofUploaded: data.proof_uploaded,
        tags: data.tags || [],
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };

      useAppStore.getState().addTask(newTask);
      return newTask;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  async updateTask(taskId: string, updates: UpdateTaskData) {
    try {
      // In demo mode or if supabase is null, update locally
      if (isDemoMode || !supabase) {
        const currentTasks = useAppStore.getState().tasks;
        const taskToUpdate = currentTasks.find(task => task.id === taskId);
        
        if (!taskToUpdate) {
          throw new Error('Task not found');
        }

        const updatedTask: Task = {
          ...taskToUpdate,
          ...updates,
          updatedAt: new Date(),
        };

        useAppStore.getState().updateTask(taskId, updatedTask);

        // Award demo credits if task completed
        if (updates.status === 'completed' && taskToUpdate.requiresProof) {
          const currentUser = useAuthStore.getState().user;
          if (currentUser && currentUser.id === taskToUpdate.assigneeId) {
            useAuthStore.getState().setUser({
              ...currentUser,
              credits: currentUser.credits + taskToUpdate.credits,
            });
          }
        }

        return updatedTask;
      }

      const { data, error } = await supabase
        .from('tasks')
        .update({
          title: updates.title,
          description: updates.description,
          status: updates.status,
          priority: updates.priority,
          assignee_id: updates.assigneeId,
          team_id: updates.teamId,
          credits: updates.credits,
          due_date: updates.dueDate?.toISOString(),
          requires_proof: updates.requiresProof,
          proof_uploaded: updates.proofUploaded,
          tags: updates.tags,
          updated_at: new Date().toISOString(),
        })
        .eq('id', taskId)
        .select()
        .single();

      if (error) throw error;

      const updatedTask = {
        id: data.id,
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        assigneeId: data.assignee_id,
        createdBy: data.created_by,
        teamId: data.team_id,
        credits: data.credits,
        dueDate: data.due_date ? new Date(data.due_date) : undefined,
        requiresProof: data.requires_proof,
        proofUploaded: data.proof_uploaded,
        tags: data.tags || [],
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };

      useAppStore.getState().updateTask(taskId, updatedTask);

      // If task was completed and requires proof, award credits
      if (updates.status === 'completed' && data.requires_proof && data.proof_uploaded) {
        await this.awardCredits(data.assignee_id, data.credits);
      }

      return updatedTask;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  async deleteTask(taskId: string) {
    try {
      // In demo mode or if supabase is null, delete locally
      if (isDemoMode || !supabase) {
        useAppStore.getState().deleteTask(taskId);
        return;
      }

      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      useAppStore.getState().deleteTask(taskId);
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }

  async updateTaskStatus(taskId: string, status: 'todo' | 'in-progress' | 'in-review' | 'completed' | 'rejected') {
    try {
      const updateData: any = { status };
      
      // Add timestamps for specific status changes
      if (status === 'completed') {
        updateData.completedAt = new Date();
      } else if (status === 'in-review') {
        updateData.submittedAt = new Date();
      }
      
      return await this.updateTask(taskId, updateData);
    } catch (error) {
      console.error('Error updating task status:', error);
      throw error;
    }
  }

  private async awardCredits(userId: string, credits: number) {
    try {
      // In demo mode or if supabase is null, update locally only
      if (isDemoMode || !supabase) {
        const currentUser = useAuthStore.getState().user;
        if (currentUser && currentUser.id === userId) {
          useAuthStore.getState().setUser({
            ...currentUser,
            credits: currentUser.credits + credits,
          });
        }
        return;
      }

      // Update user credits
      const { error } = await supabase.rpc('increment_user_credits', {
        user_id: userId,
        credit_amount: credits,
      });

      if (error) throw error;

      // Update local user state if it's the current user
      const currentUser = useAuthStore.getState().user;
      if (currentUser && currentUser.id === userId) {
        useAuthStore.getState().setUser({
          ...currentUser,
          credits: currentUser.credits + credits,
        });
      }
    } catch (error) {
      console.error('Error awarding credits:', error);
      // Don't throw here as the task update was successful
    }
  }

  // Get tasks for current user
  async getUserTasks() {
    try {
      const currentUser = useAuthStore.getState().user;
      if (!currentUser) throw new Error('User not authenticated');

      // In demo mode or if supabase is null, filter from current tasks
      if (isDemoMode || !supabase) {
        const allTasks = useAppStore.getState().tasks;
        return allTasks.filter(task => 
          task.assigneeId === currentUser.id || task.createdBy === currentUser.id
        );
      }

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .or(`assignee_id.eq.${currentUser.id},created_by.eq.${currentUser.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        assigneeId: task.assignee_id,
        createdBy: task.created_by,
        teamId: task.team_id,
        credits: task.credits,
        dueDate: task.due_date ? new Date(task.due_date) : undefined,
        requiresProof: task.requires_proof,
        proofUploaded: task.proof_uploaded,
        tags: task.tags || [],
        createdAt: new Date(task.created_at),
        updatedAt: new Date(task.updated_at),
      }));
    } catch (error) {
      console.error('Error fetching user tasks:', error);
      throw error;
    }
  }
}

export const tasksService = new TasksService();