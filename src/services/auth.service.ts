import { supabase } from "../utils/supabase/client";
import {
  supabaseUrl,
  publicAnonKey,
} from "../utils/supabase/info";
import { useAuthStore } from "../stores/auth";
import { User } from "../types";

// Check if we're in demo mode (using placeholder credentials)
const isDemoMode =
  supabaseUrl.includes("your-project-id") ||
  supabaseUrl.includes("connected-project") ||
  publicAnonKey.includes("your-anon-key") ||
  publicAnonKey.includes("connected-anon-key");

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  role?: "admin" | "manager" | "member";
  department?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

class AuthService {
  async signUp(data: SignUpData) {
    try {
      // In demo mode or if supabase is null, create a mock user
      if (isDemoMode || !supabase) {
        const mockUser: User = {
          id: `demo-${Date.now()}`,
          email: data.email,
          name: data.name,
          role: data.role || "member",
          department: data.department,
          credits: 100, // Start with some demo credits
        };

        useAuthStore.getState().setUser(mockUser);
        useAuthStore.getState().setAccessToken("demo-token");

        return {
          user: { id: mockUser.id, email: mockUser.email },
          session: { access_token: "demo-token" },
        };
      }

      // Sign up with Supabase Auth
      const { data: authData, error: authError } =
        await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              name: data.name,
              role: data.role || "member",
              department: data.department,
            },
          },
        });

      if (authError) throw authError;

      if (authData.user) {
        // Create user profile in database
        const { error: profileError } = await supabase
          .from("users")
          .insert({
            id: authData.user.id,
            email: data.email,
            name: data.name,
            role: data.role || "member",
            department: data.department,
            credits: 0,
          });

        if (profileError) {
          console.error(
            "Error creating user profile:",
            profileError,
          );
          // Don't throw here as the auth user was created successfully
        }

        // Update auth store
        if (authData.session) {
          useAuthStore
            .getState()
            .setAccessToken(authData.session.access_token);
          useAuthStore.getState().setUser({
            id: authData.user.id,
            email: data.email,
            name: data.name,
            role: data.role || "member",
            department: data.department,
            credits: 0,
          });
        }
      }

      return { user: authData.user, session: authData.session };
    } catch (error) {
      console.error("Sign up error:", error);
      throw error;
    }
  }

  async signIn(data: SignInData) {
    try {
      // In demo mode or if supabase is null, create a mock user
      if (isDemoMode || !supabase) {
        const mockUser: User = {
          id: "demo-user-1",
          email: data.email,
          name: "Demo User",
          role: "manager", // Give demo user manager role for full features
          department: "Engineering",
          credits: 1250,
        };

        useAuthStore.getState().setUser(mockUser);
        useAuthStore.getState().setAccessToken("demo-token");

        return {
          user: { id: mockUser.id, email: mockUser.email },
          session: { access_token: "demo-token" },
        };
      }

      const { data: authData, error } =
        await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

      if (error) throw error;

      if (authData.user && authData.session) {
        // Fetch user profile from database
        const { data: profile, error: profileError } =
          await supabase
            .from("users")
            .select("*")
            .eq("id", authData.user.id)
            .single();

        if (profileError) {
          console.error(
            "Error fetching user profile:",
            profileError,
          );
          // Create a basic user object from auth data
          const user: User = {
            id: authData.user.id,
            email: authData.user.email || data.email,
            name: authData.user.user_metadata?.name || "User",
            role: authData.user.user_metadata?.role || "member",
            department: authData.user.user_metadata?.department,
            credits: 0,
          };
          useAuthStore.getState().setUser(user);
        } else {
          // Use profile data from database
          const user: User = {
            id: profile.id,
            email: profile.email,
            name: profile.name,
            role: profile.role,
            department: profile.department,
            credits: profile.credits,
            avatar: profile.avatar_url,
          };
          useAuthStore.getState().setUser(user);
        }

        useAuthStore
          .getState()
          .setAccessToken(authData.session.access_token);
      }

      return { user: authData.user, session: authData.session };
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  }

  async signOut() {
    try {
      // In demo mode or if supabase is null, just clear the store
      if (isDemoMode || !supabase) {
        useAuthStore.getState().logout();
        return;
      }

      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Clear auth store
      useAuthStore.getState().logout();
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  }

  async resetPassword(email: string) {
    try {
      // In demo mode or if supabase is null, throw helpful error
      if (isDemoMode || !supabase) {
        throw new Error("Password reset requires a connected Supabase backend.");
      }

      const { error } =
        await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
      if (error) throw error;
    } catch (error) {
      console.error("Reset password error:", error);
      throw error;
    }
  }

  async updateProfile(userId: string, updates: Partial<User>) {
    try {
      // In demo mode or if supabase is null, update local state only
      if (isDemoMode || !supabase) {
        const currentUser = useAuthStore.getState().user;
        if (currentUser) {
          useAuthStore.getState().setUser({
            ...currentUser,
            ...updates,
          });
          return currentUser;
        }
        return null;
      }

      // Update in database
      const { data, error } = await supabase
        .from("users")
        .update({
          name: updates.name,
          department: updates.department,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;

      // Update auth store
      const currentUser = useAuthStore.getState().user;
      if (currentUser && data) {
        useAuthStore.getState().setUser({
          ...currentUser,
          name: data.name,
          department: data.department,
        });
      }

      return data;
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      // In demo mode or if supabase is null, return current user from store or null if none exists
      if (isDemoMode || !supabase) {
        const currentUser = useAuthStore.getState().user;
        return currentUser;
      }

      // Create a timeout wrapper for Supabase calls
      const withTimeout = <T,>(promise: Promise<T>, ms: number = 5000): Promise<T> => {
        return Promise.race([
          promise,
          new Promise<T>((_, reject) => {
            setTimeout(() => reject(new Error(`Operation timed out after ${ms}ms`)), ms);
          })
        ]);
      };

      // Check if we have a valid session first with timeout
      const sessionResult = await withTimeout(
        supabase.auth.getSession(),
        3000
      ).catch((error) => {
        console.warn("Session check timed out or failed:", error);
        return { data: { session: null }, error: new Error("Session timeout") };
      });

      if (sessionResult.error || !sessionResult.data.session) {
        // No valid session, user is not authenticated
        return null;
      }

      // Get user with timeout
      const userResult = await withTimeout(
        supabase.auth.getUser(),
        3000
      ).catch((error) => {
        console.warn("Get user timed out or failed:", error);
        return { data: { user: null }, error: new Error("User fetch timeout") };
      });

      if (userResult.error || !userResult.data.user) {
        console.warn("Auth error:", userResult.error?.message);
        return null;
      }

      const user = userResult.data.user;

      if (user) {
        // Fetch full profile from database with timeout
        const profileResult = await withTimeout(
          supabase
            .from("users")
            .select("*")
            .eq("id", user.id)
            .single(),
          3000
        ).catch((error) => {
          console.warn("Profile fetch timed out or failed:", error);
          return { data: null, error: new Error("Profile fetch timeout") };
        });

        if (!profileResult.error && profileResult.data) {
          const userData: User = {
            id: profileResult.data.id,
            email: profileResult.data.email,
            name: profileResult.data.name,
            role: profileResult.data.role,
            department: profileResult.data.department,
            credits: profileResult.data.credits,
            avatar: profileResult.data.avatar_url,
          };
          useAuthStore.getState().setUser(userData);
          return userData;
        }
      }

      return null;
    } catch (error) {
      console.error("Get current user error:", error);
      return null;
    }
  }

  // Setup auth state listener
  setupAuthListener() {
    // Skip setting up listener in demo mode or if supabase is null
    if (isDemoMode || !supabase) {
      return;
    }

    try {
      supabase.auth.onAuthStateChange(async (event, session) => {
        try {
          if (event === "SIGNED_IN" && session) {
            useAuthStore
              .getState()
              .setAccessToken(session.access_token);
            // Get current user with timeout to prevent hanging
            const userPromise = this.getCurrentUser();
            const timeoutPromise = new Promise((_, reject) => {
              setTimeout(() => reject(new Error('getCurrentUser timeout')), 5000);
            });
            
            await Promise.race([userPromise, timeoutPromise]).catch(error => {
              console.warn('Auth state change getCurrentUser failed:', error);
            });
          } else if (event === "SIGNED_OUT") {
            useAuthStore.getState().logout();
          }
        } catch (error) {
          console.warn('Auth state change handler error:', error);
        }
      });
    } catch (error) {
      console.warn('Failed to setup auth listener:', error);
    }
  }
}

export const authService = new AuthService();