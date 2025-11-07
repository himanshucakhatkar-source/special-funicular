import { supabase } from '../utils/supabase/client';
import { supabaseUrl, publicAnonKey } from '../utils/supabase/info';
import { useAppStore } from '../stores/app';
import { useAuthStore } from '../stores/auth';
import { Team } from '../types';

// Check if we're in demo mode (using placeholder credentials)
const isDemoMode = supabaseUrl.includes('your-project-id') || supabaseUrl.includes('connected-project') || publicAnonKey.includes('your-anon-key') || publicAnonKey.includes('connected-anon-key');

// Mock data for demo mode
const mockTeams: Team[] = [
  {
    id: '1',
    name: 'Engineering',
    description: 'Core development team building amazing products',
    leaderId: 'demo-user-1',
    memberIds: ['demo-user-1', 'demo-user-2', 'demo-user-3'],
    channelIds: ['general', 'code-reviews', 'architecture'],
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    name: 'Design',
    description: 'Creating beautiful and intuitive user experiences',
    leaderId: 'demo-user-1',
    memberIds: ['demo-user-1', 'demo-user-4'],
    channelIds: ['design-reviews', 'user-research'],
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
  },
];

export interface CreateTeamData {
  name: string;
  description?: string;
  memberIds?: string[];
}

class TeamsService {
  async fetchTeams() {
    try {
      // In demo mode, return mock data
      if (isDemoMode) {
        useAppStore.getState().setTeams(mockTeams);
        return mockTeams;
      }

      const { data, error } = await supabase
        .from('teams')
        .select(`
          *,
          leader:users!teams_leader_id_fkey(id, name, email, avatar_url)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const teams: Team[] = data.map(team => ({
        id: team.id,
        name: team.name,
        description: team.description,
        leaderId: team.leader_id,
        memberIds: team.member_ids || [],
        channelIds: team.channel_ids || [],
        createdAt: new Date(team.created_at),
        leader: team.leader ? {
          id: team.leader.id,
          name: team.leader.name,
          email: team.leader.email,
          avatar: team.leader.avatar_url,
        } : undefined,
      }));

      useAppStore.getState().setTeams(teams);
      return teams;
    } catch (error) {
      console.error('Error fetching teams:', error);
      throw error;
    }
  }

  async createTeam(teamData: CreateTeamData) {
    try {
      const currentUser = useAuthStore.getState().user;
      if (!currentUser) throw new Error('User not authenticated');

      const memberIds = teamData.memberIds || [];
      // Ensure the creator is in the team
      if (!memberIds.includes(currentUser.id)) {
        memberIds.push(currentUser.id);
      }

      const { data, error } = await supabase
        .from('teams')
        .insert({
          name: teamData.name,
          description: teamData.description,
          leader_id: currentUser.id,
          member_ids: memberIds,
          channel_ids: ['general'], // Default channel
        })
        .select()
        .single();

      if (error) throw error;

      const newTeam: Team = {
        id: data.id,
        name: data.name,
        description: data.description,
        leaderId: data.leader_id,
        memberIds: data.member_ids || [],
        channelIds: data.channel_ids || [],
        createdAt: new Date(data.created_at),
      };

      useAppStore.getState().addTeam(newTeam);
      return newTeam;
    } catch (error) {
      console.error('Error creating team:', error);
      throw error;
    }
  }

  async updateTeam(teamId: string, updates: Partial<CreateTeamData>) {
    try {
      const { data, error } = await supabase
        .from('teams')
        .update({
          name: updates.name,
          description: updates.description,
          member_ids: updates.memberIds,
          updated_at: new Date().toISOString(),
        })
        .eq('id', teamId)
        .select()
        .single();

      if (error) throw error;

      const updatedTeam = {
        id: data.id,
        name: data.name,
        description: data.description,
        leaderId: data.leader_id,
        memberIds: data.member_ids || [],
        channelIds: data.channel_ids || [],
        createdAt: new Date(data.created_at),
      };

      useAppStore.getState().updateTeam(teamId, updatedTeam);
      return updatedTeam;
    } catch (error) {
      console.error('Error updating team:', error);
      throw error;
    }
  }

  async deleteTeam(teamId: string) {
    try {
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', teamId);

      if (error) throw error;

      useAppStore.getState().deleteTeam(teamId);
    } catch (error) {
      console.error('Error deleting team:', error);
      throw error;
    }
  }

  async addMember(teamId: string, userId: string) {
    try {
      // First get the current team data
      const { data: team, error: fetchError } = await supabase
        .from('teams')
        .select('member_ids')
        .eq('id', teamId)
        .single();

      if (fetchError) throw fetchError;

      const currentMemberIds = team.member_ids || [];
      if (currentMemberIds.includes(userId)) {
        throw new Error('User is already a member of this team');
      }

      const newMemberIds = [...currentMemberIds, userId];

      const { data, error } = await supabase
        .from('teams')
        .update({
          member_ids: newMemberIds,
          updated_at: new Date().toISOString(),
        })
        .eq('id', teamId)
        .select()
        .single();

      if (error) throw error;

      useAppStore.getState().updateTeam(teamId, {
        memberIds: newMemberIds,
      });

      return data;
    } catch (error) {
      console.error('Error adding team member:', error);
      throw error;
    }
  }

  async removeMember(teamId: string, userId: string) {
    try {
      // First get the current team data
      const { data: team, error: fetchError } = await supabase
        .from('teams')
        .select('member_ids, leader_id')
        .eq('id', teamId)
        .single();

      if (fetchError) throw fetchError;

      // Don't allow removing the team leader
      if (team.leader_id === userId) {
        throw new Error('Cannot remove the team leader');
      }

      const currentMemberIds = team.member_ids || [];
      const newMemberIds = currentMemberIds.filter(id => id !== userId);

      const { data, error } = await supabase
        .from('teams')
        .update({
          member_ids: newMemberIds,
          updated_at: new Date().toISOString(),
        })
        .eq('id', teamId)
        .select()
        .single();

      if (error) throw error;

      useAppStore.getState().updateTeam(teamId, {
        memberIds: newMemberIds,
      });

      return data;
    } catch (error) {
      console.error('Error removing team member:', error);
      throw error;
    }
  }

  async getUserTeams() {
    try {
      const currentUser = useAuthStore.getState().user;
      if (!currentUser) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .contains('member_ids', [currentUser.id])
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(team => ({
        id: team.id,
        name: team.name,
        description: team.description,
        leaderId: team.leader_id,
        memberIds: team.member_ids || [],
        channelIds: team.channel_ids || [],
        createdAt: new Date(team.created_at),
      }));
    } catch (error) {
      console.error('Error fetching user teams:', error);
      throw error;
    }
  }

  async getTeamMembers(teamId: string) {
    try {
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .select('member_ids')
        .eq('id', teamId)
        .single();

      if (teamError) throw teamError;

      if (!team.member_ids || team.member_ids.length === 0) {
        return [];
      }

      const { data: members, error: membersError } = await supabase
        .from('users')
        .select('id, name, email, role, department, credits, avatar_url')
        .in('id', team.member_ids);

      if (membersError) throw membersError;

      return members.map(member => ({
        id: member.id,
        name: member.name,
        email: member.email,
        role: member.role,
        department: member.department,
        credits: member.credits,
        avatar: member.avatar_url,
      }));
    } catch (error) {
      console.error('Error fetching team members:', error);
      throw error;
    }
  }

  async getTeamTasks(teamId: string) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          assignee:users!tasks_assignee_id_fkey(id, name, email, avatar_url)
        `)
        .eq('team_id', teamId)
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
        assignee: task.assignee ? {
          id: task.assignee.id,
          name: task.assignee.name,
          email: task.assignee.email,
          avatar: task.assignee.avatar_url,
        } : undefined,
      }));
    } catch (error) {
      console.error('Error fetching team tasks:', error);
      throw error;
    }
  }
}

export const teamsService = new TeamsService();