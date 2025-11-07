// DEPRECATED: This file is replaced by /utils/api-client.ts and services/
// Keeping for legacy compatibility only
// 
// WARNING: This service is no longer functional and should not be used.
// Please use the individual services in /services/ directory instead.

import { supabaseUrl, publicAnonKey } from './supabase/info';
import { useAuthStore } from '../stores/auth';
import { Task, Recognition, Team, Analytics } from '../types';

// Safe API base URL that doesn't rely on process.env
const API_BASE = supabaseUrl ? `${supabaseUrl}/functions/v1/server` : 'https://placeholder.supabase.co/functions/v1/server';

class ApiService {
  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const token = useAuthStore.getState().accessToken;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token || publicAnonKey}`,
      ...options.headers,
    };

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      // Only log detailed errors in development
      console.warn(`API request to ${endpoint} failed:`, error.message);
      throw error;
    }
  }

  // Local storage fallback for teams
  private getLocalTeams(): Team[] {
    try {
      const stored = localStorage.getItem('honourus-teams');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading local teams:', error);
      return [];
    }
  }

  private saveLocalTeams(teams: Team[]): void {
    try {
      localStorage.setItem('honourus-teams', JSON.stringify(teams));
    } catch (error) {
      console.error('Error saving local teams:', error);
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Tasks API
  async getTasks(): Promise<Task[]> {
    const data = await this.makeRequest('/make-server-71b2722d/tasks');
    return data.tasks || [];
  }

  async createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'proofUploaded'>): Promise<Task> {
    const data = await this.makeRequest('/make-server-71b2722d/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    });
    return data.task;
  }

  async updateTask(taskId: string, updates: Partial<Task>): Promise<Task> {
    const data = await this.makeRequest(`/make-server-71b2722d/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return data.task;
  }

  async updateTaskStatus(taskId: string, status: Task['status']): Promise<Task> {
    return this.updateTask(taskId, { status });
  }

  // Recognition API
  async getRecognitions(): Promise<Recognition[]> {
    const data = await this.makeRequest('/make-server-71b2722d/recognitions');
    return data.recognitions || [];
  }

  async sendRecognition(recognition: {
    toUserId: string;
    message: string;
    credits: number;
    type: Recognition['type'];
  }): Promise<Recognition> {
    const data = await this.makeRequest('/make-server-71b2722d/recognitions', {
      method: 'POST',
      body: JSON.stringify(recognition),
    });
    return data.recognition;
  }

  // Teams API with local fallback
  async getTeams(): Promise<Team[]> {
    try {
      const data = await this.makeRequest('/make-server-71b2722d/teams');
      return data.teams || [];
    } catch (error) {
      console.warn('API request failed, using local storage:', error);
      return this.getLocalTeams();
    }
  }

  async createTeam(team: { 
    name: string; 
    description?: string;
    memberIds?: string[];
    channelIds?: string[];
  }): Promise<Team> {
    try {
      const data = await this.makeRequest('/make-server-71b2722d/teams', {
        method: 'POST',
        body: JSON.stringify(team),
      });
      return data.team;
    } catch (error) {
      console.warn('API request failed, creating team locally:', error);
      
      // Fallback to local creation
      const currentUser = useAuthStore.getState().user;
      const newTeam: Team = {
        id: this.generateId(),
        name: team.name,
        description: team.description || '',
        memberIds: team.memberIds || [currentUser?.id || '1'],
        channelIds: team.channelIds || ['general'],
        leaderId: currentUser?.id || '1',
        createdAt: new Date(),
      };

      // Save to local storage
      const localTeams = this.getLocalTeams();
      const updatedTeams = [...localTeams, newTeam];
      this.saveLocalTeams(updatedTeams);

      return newTeam;
    }
  }

  async updateTeam(teamId: string, updates: Partial<Team>): Promise<Team> {
    try {
      const data = await this.makeRequest(`/make-server-71b2722d/teams/${teamId}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      return data.team;
    } catch (error) {
      console.warn('API request failed, updating team locally:', error);
      
      // Fallback to local update
      const localTeams = this.getLocalTeams();
      const updatedTeams = localTeams.map(team => 
        team.id === teamId ? { ...team, ...updates } : team
      );
      this.saveLocalTeams(updatedTeams);
      
      const updatedTeam = updatedTeams.find(team => team.id === teamId);
      if (!updatedTeam) {
        throw new Error('Team not found');
      }
      return updatedTeam;
    }
  }

  async addTeamMember(teamId: string, userId: string): Promise<Team> {
    try {
      const data = await this.makeRequest(`/make-server-71b2722d/teams/${teamId}/members`, {
        method: 'POST',
        body: JSON.stringify({ userId }),
      });
      return data.team;
    } catch (error) {
      console.warn('API request failed, adding member locally:', error);
      
      // Fallback to local update
      const localTeams = this.getLocalTeams();
      const updatedTeams = localTeams.map(team => {
        if (team.id === teamId && !team.memberIds.includes(userId)) {
          return { ...team, memberIds: [...team.memberIds, userId] };
        }
        return team;
      });
      this.saveLocalTeams(updatedTeams);
      
      const updatedTeam = updatedTeams.find(team => team.id === teamId);
      if (!updatedTeam) {
        throw new Error('Team not found');
      }
      return updatedTeam;
    }
  }

  async removeTeamMember(teamId: string, userId: string): Promise<Team> {
    try {
      const data = await this.makeRequest(`/make-server-71b2722d/teams/${teamId}/members/${userId}`, {
        method: 'DELETE',
      });
      return data.team;
    } catch (error) {
      console.warn('API request failed, removing member locally:', error);
      
      // Fallback to local update
      const localTeams = this.getLocalTeams();
      const updatedTeams = localTeams.map(team => {
        if (team.id === teamId) {
          return { ...team, memberIds: team.memberIds.filter(id => id !== userId) };
        }
        return team;
      });
      this.saveLocalTeams(updatedTeams);
      
      const updatedTeam = updatedTeams.find(team => team.id === teamId);
      if (!updatedTeam) {
        throw new Error('Team not found');
      }
      return updatedTeam;
    }
  }

  // Analytics API
  async getAnalytics(): Promise<Analytics> {
    const data = await this.makeRequest('/make-server-71b2722d/analytics');
    return data.analytics;
  }

  // User API
  async getUser(userId: string): Promise<any> {
    const data = await this.makeRequest(`/make-server-71b2722d/users/${userId}`);
    return data.user;
  }

  async updateUser(userId: string, updates: any): Promise<any> {
    const data = await this.makeRequest(`/make-server-71b2722d/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return data.user;
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const data = await this.makeRequest('/make-server-71b2722d/health');
    return data;
  }
}

// Export with deprecation warning
const apiServiceInstance = new ApiService();

// Override methods to show deprecation warnings
const deprecatedApiService = new Proxy(apiServiceInstance, {
  get(target, prop) {
    if (typeof target[prop] === 'function') {
      console.warn(`⚠️ apiService.${String(prop)}() is deprecated. Use services/ directory instead.`);
    }
    return target[prop];
  }
});

export const apiService = deprecatedApiService;