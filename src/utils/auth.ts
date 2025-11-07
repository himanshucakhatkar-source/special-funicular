import { projectId, publicAnonKey } from './supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/server`;

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'member';
  credits: number;
  department?: string;
  avatar?: string;
}

export interface AuthResponse {
  user: any;
  session?: any;
  userData?: User;
  message?: string;
}

class AuthService {
  private token: string | null = null;
  private user: User | null = null;

  constructor() {
    // Load stored auth data on initialization
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('honourus-token');
      const storedUser = localStorage.getItem('honourus-user');
      if (storedUser) {
        try {
          this.user = JSON.parse(storedUser);
        } catch (error) {
          console.error('Error parsing stored user:', error);
          this.clearAuth();
        }
      }
    }
  }

  async signup(email: string, password: string, name: string, role: string = 'member', department?: string): Promise<AuthResponse> {
    try {
      const url = `${API_BASE}/make-server-71b2722d/auth/signup`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ email, password, name, role, department }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Registration failed: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Backend not available - using offline mode');
      }
      throw error;
    }
  }

  async signin(email: string, password: string): Promise<AuthResponse> {
    try {
      const url = `${API_BASE}/make-server-71b2722d/auth/signin`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Authentication failed: ${response.status}`);
      }

      const data = await response.json();

      // Store auth data
      if (data.session?.access_token) {
        this.token = data.session.access_token;
        localStorage.setItem('honourus-token', this.token);
      }

      if (data.userData) {
        this.user = data.userData;
        localStorage.setItem('honourus-user', JSON.stringify(this.user));
      }

      return data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Backend not available - using offline mode');
      }
      throw error;
    }
  }

  signout(): void {
    this.token = null;
    this.user = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('honourus-token');
      localStorage.removeItem('honourus-user');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  getUser(): User | null {
    return this.user;
  }

  isAuthenticated(): boolean {
    return this.token !== null && this.user !== null;
  }

  async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    if (!this.token) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await fetch(`${API_BASE}/make-server-71b2722d/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Profile update failed');
      }

      // Update local user data
      if (data.user && this.user?.id === userId) {
        this.user = { ...this.user, ...data.user };
        localStorage.setItem('honourus-user', JSON.stringify(this.user));
      }

      return data.user;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  }

  private clearAuth(): void {
    this.token = null;
    this.user = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('honourus-token');
      localStorage.removeItem('honourus-user');
    }
  }
}

export const authService = new AuthService();