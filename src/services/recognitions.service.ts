import { supabase } from '../utils/supabase/client';
import { supabaseUrl, publicAnonKey } from '../utils/supabase/info';
import { useAppStore } from '../stores/app';
import { useAuthStore } from '../stores/auth';
import { Recognition } from '../types';

// Check if we're in demo mode (using placeholder credentials)
const isDemoMode = supabaseUrl.includes('your-project-id') || supabaseUrl.includes('connected-project') || publicAnonKey.includes('your-anon-key') || publicAnonKey.includes('connected-anon-key');

// Mock data for demo mode
const mockRecognitions: Recognition[] = [
  {
    id: '1',
    fromUserId: 'demo-user-1',
    toUserId: 'demo-user-2',
    message: 'Outstanding work on the authentication system! Your attention to security details was exceptional.',
    credits: 75,
    type: 'leadership',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    fromUserId: 'demo-user-2',
    toUserId: 'demo-user-1',
    message: 'Thank you for the excellent code review feedback. It really helped improve the quality of our codebase.',
    credits: 50,
    type: 'collaboration',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: '3',
    fromUserId: 'demo-user-1',
    toUserId: 'demo-user-3',
    message: 'Innovative solution to the performance issue! Your optimization reduced load times by 40%.',
    credits: 100,
    type: 'innovation',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
];

export interface CreateRecognitionData {
  toUserId: string;
  message: string;
  credits: number;
  type: 'peer' | 'manager' | 'achievement';
}

class RecognitionsService {
  async fetchRecognitions() {
    try {
      // In demo mode, return mock data
      if (isDemoMode) {
        useAppStore.getState().setRecognitions(mockRecognitions);
        return mockRecognitions;
      }

      const { data, error } = await supabase
        .from('recognitions')
        .select(`
          *,
          from_user:users!recognitions_from_user_id_fkey(id, name, email, avatar_url),
          to_user:users!recognitions_to_user_id_fkey(id, name, email, avatar_url)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const recognitions: Recognition[] = data.map(recognition => ({
        id: recognition.id,
        fromUserId: recognition.from_user_id,
        toUserId: recognition.to_user_id,
        message: recognition.message,
        credits: recognition.credits,
        type: recognition.type,
        createdAt: new Date(recognition.created_at),
        fromUser: recognition.from_user ? {
          id: recognition.from_user.id,
          name: recognition.from_user.name,
          email: recognition.from_user.email,
          avatar: recognition.from_user.avatar_url,
        } : undefined,
        toUser: recognition.to_user ? {
          id: recognition.to_user.id,
          name: recognition.to_user.name,
          email: recognition.to_user.email,
          avatar: recognition.to_user.avatar_url,
        } : undefined,
      }));

      useAppStore.getState().setRecognitions(recognitions);
      return recognitions;
    } catch (error) {
      console.error('Error fetching recognitions:', error);
      throw error;
    }
  }

  async createRecognition(recognitionData: CreateRecognitionData) {
    try {
      const currentUser = useAuthStore.getState().user;
      if (!currentUser) throw new Error('User not authenticated');

      // In demo mode or if API fails, create mock recognition
      if (isDemoMode) {
        const newRecognition: Recognition = {
          id: `mock-${Date.now()}`,
          fromUserId: currentUser.id,
          toUserId: recognitionData.toUserId,
          message: recognitionData.message,
          credits: recognitionData.credits,
          type: recognitionData.type as any,
          createdAt: new Date(),
        };

        useAppStore.getState().addRecognition(newRecognition);
        return newRecognition;
      }

      // Start transaction-like operations
      const { data, error } = await supabase
        .from('recognitions')
        .insert({
          from_user_id: currentUser.id,
          to_user_id: recognitionData.toUserId,
          message: recognitionData.message,
          credits: recognitionData.credits,
          type: recognitionData.type,
        })
        .select()
        .single();

      if (error) throw error;

      // Award credits to the recipient
      await this.awardCredits(recognitionData.toUserId, recognitionData.credits);

      const newRecognition: Recognition = {
        id: data.id,
        fromUserId: data.from_user_id,
        toUserId: data.to_user_id,
        message: data.message,
        credits: data.credits,
        type: data.type,
        createdAt: new Date(data.created_at),
      };

      useAppStore.getState().addRecognition(newRecognition);
      return newRecognition;
    } catch (error) {
      console.error('Error creating recognition:', error);
      
      // Fallback to mock mode on error
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        const newRecognition: Recognition = {
          id: `mock-${Date.now()}`,
          fromUserId: currentUser.id,
          toUserId: recognitionData.toUserId,
          message: recognitionData.message,
          credits: recognitionData.credits,
          type: recognitionData.type as any,
          createdAt: new Date(),
        };

        useAppStore.getState().addRecognition(newRecognition);
        return newRecognition;
      }
      
      throw error;
    }
  }

  private async awardCredits(userId: string, credits: number) {
    try {
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
      throw error;
    }
  }

  async getUserRecognitions(userId?: string) {
    try {
      const currentUser = useAuthStore.getState().user;
      if (!currentUser) throw new Error('User not authenticated');

      const targetUserId = userId || currentUser.id;

      const { data, error } = await supabase
        .from('recognitions')
        .select(`
          *,
          from_user:users!recognitions_from_user_id_fkey(id, name, email, avatar_url),
          to_user:users!recognitions_to_user_id_fkey(id, name, email, avatar_url)
        `)
        .or(`from_user_id.eq.${targetUserId},to_user_id.eq.${targetUserId}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(recognition => ({
        id: recognition.id,
        fromUserId: recognition.from_user_id,
        toUserId: recognition.to_user_id,
        message: recognition.message,
        credits: recognition.credits,
        type: recognition.type,
        createdAt: new Date(recognition.created_at),
        fromUser: recognition.from_user ? {
          id: recognition.from_user.id,
          name: recognition.from_user.name,
          email: recognition.from_user.email,
          avatar: recognition.from_user.avatar_url,
        } : undefined,
        toUser: recognition.to_user ? {
          id: recognition.to_user.id,
          name: recognition.to_user.name,
          email: recognition.to_user.email,
          avatar: recognition.to_user.avatar_url,
        } : undefined,
      }));
    } catch (error) {
      console.error('Error fetching user recognitions:', error);
      throw error;
    }
  }

  async getRecognitionsReceived(userId?: string) {
    try {
      const currentUser = useAuthStore.getState().user;
      if (!currentUser) throw new Error('User not authenticated');

      const targetUserId = userId || currentUser.id;

      const { data, error } = await supabase
        .from('recognitions')
        .select(`
          *,
          from_user:users!recognitions_from_user_id_fkey(id, name, email, avatar_url)
        `)
        .eq('to_user_id', targetUserId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(recognition => ({
        id: recognition.id,
        fromUserId: recognition.from_user_id,
        toUserId: recognition.to_user_id,
        message: recognition.message,
        credits: recognition.credits,
        type: recognition.type,
        createdAt: new Date(recognition.created_at),
        fromUser: recognition.from_user ? {
          id: recognition.from_user.id,
          name: recognition.from_user.name,
          email: recognition.from_user.email,
          avatar: recognition.from_user.avatar_url,
        } : undefined,
      }));
    } catch (error) {
      console.error('Error fetching received recognitions:', error);
      throw error;
    }
  }
}

export const recognitionsService = new RecognitionsService();