import { supabaseUrl } from './supabase/info';
import { useAuthStore } from '../stores/auth';

// API Configuration
const API_BASE_URL = `${supabaseUrl}/functions/v1/server`;
const API_TIMEOUT = 10000; // 10 seconds

// Request types
interface RequestConfig extends RequestInit {
  timeout?: number;
}

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor(baseURL: string, timeout: number = API_TIMEOUT) {
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  private async request<T>(
    endpoint: string, 
    config: RequestConfig = {}
  ): Promise<T> {
    const { timeout = this.timeout, ...fetchConfig } = config;
    
    // Get auth token from store
    const { accessToken } = useAuthStore.getState();
    
    // Setup headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...fetchConfig.headers,
    };

    // Add auth header if token exists
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...fetchConfig,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        // Handle different error statuses
        switch (response.status) {
          case 401:
            // Unauthorized - clear auth and redirect to login
            useAuthStore.getState().logout();
            throw new Error('Authentication required. Please log in again.');
          case 403:
            throw new Error('You do not have permission to perform this action.');
          case 404:
            throw new Error('The requested resource was not found.');
          case 429:
            throw new Error('Too many requests. Please try again later.');
          case 500:
            throw new Error('Server error. Please try again later.');
          default:
            throw new Error(`Request failed with status ${response.status}`);
        }
      }

      const data = await response.json();
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timed out. Please try again.');
        }
        throw error;
      }
      
      throw new Error('An unexpected error occurred');
    }
  }

  // HTTP Methods
  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.get('/make-server-71b2722d/health');
  }
}

// Create singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export typed API methods for specific resources
export const api = {
  // Health
  health: () => apiClient.healthCheck(),

  // Auth
  auth: {
    signup: (data: { email: string; password: string; name: string; role?: string; department?: string }) =>
      apiClient.post('/make-server-71b2722d/auth/signup', data),
    signin: (data: { email: string; password: string }) =>
      apiClient.post('/make-server-71b2722d/auth/signin', data),
  },

  // Users
  users: {
    get: (id: string) => apiClient.get(`/make-server-71b2722d/users/${id}`),
    update: (id: string, data: any) => apiClient.put(`/make-server-71b2722d/users/${id}`, data),
  },

  // Tasks
  tasks: {
    list: () => apiClient.get('/make-server-71b2722d/tasks'),
    create: (data: any) => apiClient.post('/make-server-71b2722d/tasks', data),
    update: (id: string, data: any) => apiClient.put(`/make-server-71b2722d/tasks/${id}`, data),
    delete: (id: string) => apiClient.delete(`/make-server-71b2722d/tasks/${id}`),
  },

  // Teams
  teams: {
    list: () => apiClient.get('/make-server-71b2722d/teams'),
    create: (data: any) => apiClient.post('/make-server-71b2722d/teams', data),
    update: (id: string, data: any) => apiClient.put(`/make-server-71b2722d/teams/${id}`, data),
    delete: (id: string) => apiClient.delete(`/make-server-71b2722d/teams/${id}`),
    addMember: (teamId: string, userId: string) => 
      apiClient.post(`/make-server-71b2722d/teams/${teamId}/members`, { userId }),
    removeMember: (teamId: string, userId: string) => 
      apiClient.delete(`/make-server-71b2722d/teams/${teamId}/members/${userId}`),
  },

  // Recognitions
  recognitions: {
    list: () => apiClient.get('/make-server-71b2722d/recognitions'),
    create: (data: any) => apiClient.post('/make-server-71b2722d/recognitions', data),
  },

  // Analytics
  analytics: {
    get: () => apiClient.get('/make-server-71b2722d/analytics'),
    teamInsights: () => apiClient.get('/make-server-71b2722d/analytics/team-insights'),
    contributionHeatmap: (userId: string) => 
      apiClient.get(`/make-server-71b2722d/analytics/heatmap/${userId}`),
  },

  // Integrations
  integrations: {
    connect: (service: 'jira' | 'clickup') => 
      apiClient.post(`/make-server-71b2722d/integrations/${service}/connect`),
    disconnect: (service: 'jira' | 'clickup') => 
      apiClient.delete(`/make-server-71b2722d/integrations/${service}`),
    status: () => apiClient.get('/make-server-71b2722d/integrations'),
  },
};

export default apiClient;