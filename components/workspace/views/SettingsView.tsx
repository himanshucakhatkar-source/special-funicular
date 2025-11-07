import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Label } from '../../ui/label';
import { Switch } from '../../ui/switch';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Avatar, AvatarFallback } from '../../ui/avatar';
import { Input } from '../../ui/input';
import { useHonourus } from '../../../hooks/useHonourus';
import { authService } from '../../../services/auth.service';
import { integrationsService, IntegrationConnection } from '../../../services/integrations.service';
import { useTheme, themes } from '../../../contexts/ThemeContext';
import { IntegrationSetupModal } from '../IntegrationSetupModal';
import { BackendStatusCard } from '../BackendStatusCard';
import { ImplementationStatus } from '../ImplementationStatus';
import { 
  User, 
  Bell, 
  Palette, 
  LogOut,
  Save,
  Link,
  Settings2,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function SettingsView() {
  const { user, setMode } = useHonourus();
  const { theme, setTheme } = useTheme();
  
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: false,
    soundEffects: true,
    darkMode: theme === 'dark',
    suppressDemoLogs: typeof window !== 'undefined' ? localStorage.getItem('honourus-suppress-demo-logs') === 'true' : false,
  });

  const [integrations, setIntegrations] = useState<IntegrationConnection[]>([]);
  const [integrationsLoading, setIntegrationsLoading] = useState(true);

  const [integrationSetup, setIntegrationSetup] = useState<{
    isOpen: boolean;
    type: 'jira' | 'clickup' | null;
  }>({
    isOpen: false,
    type: null
  });

  const [showImplementationStatus, setShowImplementationStatus] = useState(false);

  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    department: user?.department || '',
  });

  const handleLogout = async () => {
    try {
      await authService.signOut();
      setMode('marketing');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out. Please try again.');
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      await authService.updateProfile(user.id, {
        name: profile.name,
        department: profile.department,
      });
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    }
  };

  // Load integrations on component mount
  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = async () => {
    try {
      setIntegrationsLoading(true);
      const userIntegrations = await integrationsService.getUserIntegrations();
      setIntegrations(userIntegrations);
    } catch (error) {
      console.error('Error loading integrations:', error);
      toast.error('Failed to load integrations');
    } finally {
      setIntegrationsLoading(false);
    }
  };

  const handleConnectIntegration = async (service: 'jira' | 'clickup') => {
    try {
      const { authUrl } = await integrationsService.initiateOAuthFlow(service);
      window.location.href = authUrl;
    } catch (error) {
      console.error('Error connecting integration:', error);
      toast.error(`Failed to connect to ${service}. Please try again.`);
    }
  };

  const handleDisconnectIntegration = async (service: 'jira' | 'clickup') => {
    try {
      await integrationsService.disconnectIntegration(service);
      await loadIntegrations(); // Refresh integrations list
      toast.success(`${service} disconnected successfully`);
    } catch (error) {
      console.error('Error disconnecting integration:', error);
      toast.error(`Failed to disconnect ${service}. Please try again.`);
    }
  };

  const handleSaveSettings = () => {
    // Save suppress demo logs setting
    if (settings.suppressDemoLogs) {
      localStorage.setItem('honourus-suppress-demo-logs', 'true');
    } else {
      localStorage.removeItem('honourus-suppress-demo-logs');
    }
    toast.success('Settings updated successfully');
  };

  // Get integration by service type
  const getIntegration = (service: 'jira' | 'clickup') => {
    return integrations.find(integration => integration.service === service);
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-4xl pb-6">
      {/* Header */}
      <div className="px-1">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Manage your account and application preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <User className="h-4 w-4 sm:h-5 sm:w-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 pb-4 border-b sm:border-0 sm:pb-0 sm:mb-2">
                <Avatar className="h-14 w-14 sm:h-16 sm:w-16">
                  <AvatarFallback className="text-base sm:text-lg">
                    {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 w-full sm:w-auto">
                  <h3 className="font-semibold text-base sm:text-lg">{user?.name}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">{user?.role}</p>
                  <div className="flex items-center flex-wrap gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs">{user?.credits || 0} credits</Badge>
                    <Badge variant="outline" className="text-xs">{user?.department}</Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs sm:text-sm">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    placeholder="Your full name"
                    className="h-9 sm:h-10 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs sm:text-sm">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    placeholder="your@email.com"
                    className="h-9 sm:h-10 text-sm"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="department" className="text-xs sm:text-sm">Department</Label>
                  <Input
                    id="department"
                    value={profile.department}
                    onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                    placeholder="Engineering"
                    className="h-9 sm:h-10 text-sm"
                  />
                </div>
              </div>

              <Button onClick={handleSaveProfile} className="gap-2 w-full sm:w-auto h-9 sm:h-10 text-sm">
                <Save className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Save Profile
              </Button>
            </CardContent>
          </Card>

          {/* Integrations */}
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Link className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="leading-tight">Integrations</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              {/* Jira Integration */}
              <div className="space-y-2 sm:space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-600 rounded flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-xs sm:text-sm">J</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <Label className="text-sm sm:text-base">Jira</Label>
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">Connect workspace</p>
                    </div>
                  </div>
                  {integrationsLoading ? (
                    <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-primary border-t-transparent rounded-full animate-spin ml-auto sm:ml-0" />
                  ) : getIntegration('jira')?.connected ? (
                    <Badge variant="default" className="gap-1 text-xs w-fit ml-auto sm:ml-0">
                      <CheckCircle className="h-3 w-3" />
                      Connected
                    </Badge>
                  ) : (
                    <Button 
                      variant="outline" 
                      className="gap-1.5 h-8 sm:h-9 text-xs sm:text-sm w-full sm:w-auto"
                      onClick={() => handleConnectIntegration('jira')}
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span className="sm:inline">Connect</span>
                    </Button>
                  )}
                </div>
                {getIntegration('jira')?.connected && (
                  <div className="ml-0 sm:ml-12 p-2.5 sm:p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs sm:text-sm mb-2">Connected: {getIntegration('jira')?.workspace || 'Jira Workspace'}</p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="gap-1 h-8 text-xs justify-start sm:justify-center"
                        onClick={() => setIntegrationSetup({ isOpen: true, type: 'jira' })}
                      >
                        <Settings2 className="h-3 w-3" />
                        Manage Settings
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive hover:text-destructive h-8 text-xs justify-start sm:justify-center"
                        onClick={() => handleDisconnectIntegration('jira')}
                      >
                        Disconnect
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* ClickUp Integration */}
              <div className="space-y-2 sm:space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-purple-600 rounded flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-xs sm:text-sm">C</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <Label className="text-sm sm:text-base">ClickUp</Label>
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">Connect workspace</p>
                    </div>
                  </div>
                  {integrationsLoading ? (
                    <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-primary border-t-transparent rounded-full animate-spin ml-auto sm:ml-0" />
                  ) : getIntegration('clickup')?.connected ? (
                    <Badge variant="default" className="gap-1 text-xs w-fit ml-auto sm:ml-0">
                      <CheckCircle className="h-3 w-3" />
                      Connected
                    </Badge>
                  ) : (
                    <Button 
                      variant="outline" 
                      className="gap-1.5 h-8 sm:h-9 text-xs sm:text-sm w-full sm:w-auto"
                      onClick={() => handleConnectIntegration('clickup')}
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span className="sm:inline">Connect</span>
                    </Button>
                  )}
                </div>
                {getIntegration('clickup')?.connected && (
                  <div className="ml-0 sm:ml-12 p-2.5 sm:p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs sm:text-sm mb-2">Connected: {getIntegration('clickup')?.workspace || 'ClickUp Workspace'}</p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="gap-1 h-8 text-xs justify-start sm:justify-center"
                        onClick={() => setIntegrationSetup({ isOpen: true, type: 'clickup' })}
                      >
                        <Settings2 className="h-3 w-3" />
                        Manage Settings
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive hover:text-destructive h-8 text-xs justify-start sm:justify-center"
                        onClick={() => handleDisconnectIntegration('clickup')}
                      >
                        Disconnect
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-2.5 sm:p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex gap-2">
                  <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300">
                    Connecting external tools allows automatic credit allocation when tasks are completed. 
                    Configure status mappings and credit rules after connecting.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="flex items-start sm:items-center justify-between gap-3 py-2 sm:py-0">
                <div className="flex-1 min-w-0">
                  <Label htmlFor="notifications" className="text-sm sm:text-base">Push Notifications</Label>
                  <p className="text-xs sm:text-sm text-muted-foreground">Get task & recognition alerts</p>
                </div>
                <Switch
                  id="notifications"
                  checked={settings.notifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, notifications: checked })}
                  className="flex-shrink-0"
                />
              </div>

              <div className="flex items-start sm:items-center justify-between gap-3 py-2 sm:py-0">
                <div className="flex-1 min-w-0">
                  <Label htmlFor="email-updates" className="text-sm sm:text-base">Email Updates</Label>
                  <p className="text-xs sm:text-sm text-muted-foreground">Weekly summary emails</p>
                </div>
                <Switch
                  id="email-updates"
                  checked={settings.emailUpdates}
                  onCheckedChange={(checked) => setSettings({ ...settings, emailUpdates: checked })}
                  className="flex-shrink-0"
                />
              </div>

              <div className="flex items-start sm:items-center justify-between gap-3 py-2 sm:py-0">
                <div className="flex-1 min-w-0">
                  <Label htmlFor="sound-effects" className="text-sm sm:text-base">Sound Effects</Label>
                  <p className="text-xs sm:text-sm text-muted-foreground">Audio for actions & alerts</p>
                </div>
                <Switch
                  id="sound-effects"
                  checked={settings.soundEffects}
                  onCheckedChange={(checked) => setSettings({ ...settings, soundEffects: checked })}
                  className="flex-shrink-0"
                />
              </div>

              <div className="flex items-start sm:items-center justify-between gap-3 py-2 sm:py-0">
                <div className="flex-1 min-w-0">
                  <Label htmlFor="suppress-demo-logs" className="text-sm sm:text-base">Suppress Demo Logs</Label>
                  <p className="text-xs sm:text-sm text-muted-foreground">Hide demo mode console messages</p>
                </div>
                <Switch
                  id="suppress-demo-logs"
                  checked={settings.suppressDemoLogs}
                  onCheckedChange={(checked) => setSettings({ ...settings, suppressDemoLogs: checked })}
                  className="flex-shrink-0"
                />
              </div>

              <Button onClick={handleSaveSettings} className="gap-2 w-full sm:w-auto h-9 sm:h-10 text-sm mt-2">
                <Save className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          {/* Backend Status */}
          <BackendStatusCard />
          
          {/* Theme Selector */}
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Palette className="h-4 w-4 sm:h-5 sm:w-5" />
                Theme
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 sm:grid-cols-1 gap-2">
                {themes.map((t) => (
                  <motion.div
                    key={t.id}
                    className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border cursor-pointer transition-colors ${
                      theme === t.id ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'
                    }`}
                    onClick={() => setTheme(t.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex gap-0.5 sm:gap-1 flex-shrink-0">
                      <div 
                        className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border" 
                        style={{ backgroundColor: t.primary }}
                      />
                      <div 
                        className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border" 
                        style={{ backgroundColor: t.accent }}
                      />
                    </div>
                    <span className="font-medium text-xs sm:text-sm truncate flex-1">{t.name}</span>
                    {theme === t.id && <span className="ml-auto text-xs flex-shrink-0">✓</span>}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Developer Tools */}
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-base sm:text-lg">Developer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2 h-9 sm:h-10 text-xs sm:text-sm"
                onClick={() => setShowImplementationStatus(true)}
              >
                <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Implementation Status
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-base sm:text-lg">Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2 h-9 sm:h-10 text-xs sm:text-sm">
                <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Edit Profile
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2 text-destructive hover:text-destructive h-9 sm:h-10 text-xs sm:text-sm" onClick={handleLogout}>
                <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Integration Setup Modal */}
      {integrationSetup.type && (
        <IntegrationSetupModal
          isOpen={integrationSetup.isOpen}
          onClose={() => setIntegrationSetup({ isOpen: false, type: null })}
          integrationType={integrationSetup.type}
        />
      )}

      {/* Implementation Status Modal */}
      {showImplementationStatus && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 overflow-auto">
          <div className="min-h-screen py-8">
            <div className="container max-w-7xl mx-auto px-4">
              <div className="flex justify-end mb-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowImplementationStatus(false)}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Close
                </Button>
              </div>
              <ImplementationStatus />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}