// Supabase configuration - Demo Mode
// Replace these with your actual Supabase credentials to enable backend features

// Check if running in browser environment and use appropriate env access
const getEnvVar = (key: string, fallback: string) => {
  if (typeof window !== 'undefined') {
    // Browser environment - use fallback values (credentials managed by connection flow)
    return fallback;
  }
  // Server environment - check for environment variables
  return (globalThis as any).process?.env?.[key] || fallback;
};

export const supabaseUrl = getEnvVar('VITE_SUPABASE_URL', 'https://your-project-id.supabase.co');
export const publicAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY', 'your-anon-key');

// Extract project ID from URL for legacy compatibility
export const projectId = supabaseUrl.split('//')[1]?.split('.')[0] || 'your-project-id';

// Demo mode - no real backend connection
// To connect to Supabase: Replace the values above with your project credentials