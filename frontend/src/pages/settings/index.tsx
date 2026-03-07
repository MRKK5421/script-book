import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/auth-context';
import { useBooks } from '../../contexts/books-context';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user } = useAuth();
  const { userSettings, updateUserSettings } = useBooks();
  const [isSaving, setIsSaving] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [settings, setSettings] = useState({
    darkMode: false,
    fontSize: 'medium' as 'small' | 'medium' | 'large',
    fontFamily: 'Inter',
    autoSave: true,
    writingStreak: 0
  });

  useEffect(() => {
    console.log('Settings page - userSettings:', userSettings);
    if (userSettings) {
      setSettings(userSettings);
      setIsInitialized(true);
    } else {
      // Initialize with default values if userSettings is not available
      setIsInitialized(true);
    }
  }, [userSettings]);

  // Apply theme changes
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark:bg-gray-900');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark:bg-gray-900');
    }
  }, [settings.darkMode]);

  // Apply font changes
  useEffect(() => {
    document.documentElement.style.fontSize = 
      settings.fontSize === 'small' ? '14px' : 
      settings.fontSize === 'large' ? '18px' : '16px';
    document.documentElement.style.fontFamily = settings.fontFamily;
  }, [settings.fontSize, settings.fontFamily]);

  const handleSettingChange = (key: keyof typeof settings, value: any) => {
    const newSettings = {
      ...settings,
      [key]: value
    };
    setSettings(newSettings);
    
    // Show immediate feedback for certain settings
    if (key === 'darkMode') {
      toast.success(value ? 'Dark mode enabled' : 'Light mode enabled');
    } else if (key === 'fontSize') {
      toast.success(`Font size changed to ${value}`);
    } else if (key === 'fontFamily') {
      toast.success(`Font changed to ${value}`);
    } else if (key === 'autoSave') {
      toast.success(value ? 'Auto-save enabled' : 'Auto-save disabled');
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      console.log('Saving settings:', settings);
      updateUserSettings(settings);
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
      console.error('Settings save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetSettings = () => {
    const defaultSettings = {
      darkMode: false,
      fontSize: 'medium' as const,
      fontFamily: 'Inter',
      autoSave: true,
      writingStreak: 0
    };
    setSettings(defaultSettings);
    updateUserSettings(defaultSettings);
    toast.success('Settings reset to defaults');
  };

  // Add keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSaveSettings();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        handleResetSettings();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        handleSettingChange('darkMode', !settings.darkMode);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [settings]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Please login to access settings</h2>
          <Link
            to="/login"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-all duration-300"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700 mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-white">Loading settings...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-200 text-lg">Customize your ScriptBook experience</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Appearance Settings */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card">
              <h2 className="text-2xl font-semibold text-white mb-6">Appearance</h2>
              
              {/* Dark Mode */}
              <div className="mb-6">
                <label className="flex items-center justify-between">
                  <span className="text-white font-medium">Dark Mode</span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={settings.darkMode}
                      onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                      settings.darkMode ? 'bg-blue-600' : 'bg-gray-400'
                    }`}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                        settings.darkMode ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </div>
                  </div>
                </label>
                <p className="text-sm text-gray-400 mt-2">Enable dark theme for the interface</p>
              </div>

              {/* Font Size */}
              <div className="mb-6">
                <label className="block text-white font-medium mb-3">Font Size</label>
                <select
                  value={settings.fontSize}
                  onChange={(e) => handleSettingChange('fontSize', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-gray-300/50 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="small" className="bg-gray-800">Small</option>
                  <option value="medium" className="bg-gray-800">Medium</option>
                  <option value="large" className="bg-gray-800">Large</option>
                </select>
                <p className="text-sm text-gray-400 mt-2">Adjust the text size throughout the app</p>
              </div>

              {/* Font Family */}
              <div className="mb-6">
                <label className="block text-white font-medium mb-3">Font Family</label>
                <select
                  value={settings.fontFamily}
                  onChange={(e) => handleSettingChange('fontFamily', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-gray-300/50 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Inter" className="bg-gray-800">Inter</option>
                  <option value="Georgia" className="bg-gray-800">Georgia</option>
                  <option value="Times New Roman" className="bg-gray-800">Times New Roman</option>
                  <option value="Arial" className="bg-gray-800">Arial</option>
                  <option value="Helvetica" className="bg-gray-800">Helvetica</option>
                </select>
                <p className="text-sm text-gray-400 mt-2">Choose your preferred font for reading and writing</p>
              </div>
            </div>

            {/* Keyboard Shortcuts */}
            <div className="glass-card">
              <h2 className="text-2xl font-semibold text-white mb-6">Keyboard Shortcuts</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-white">Save settings</span>
                  <kbd className="px-2 py-1 bg-amber-100 text-amber-900 rounded text-sm">Ctrl + S</kbd>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-white">Reset settings</span>
                  <kbd className="px-2 py-1 bg-amber-100 text-amber-900 rounded text-sm">Ctrl + R</kbd>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-white">Toggle dark mode</span>
                  <kbd className="px-2 py-1 bg-amber-100 text-amber-900 rounded text-sm">Ctrl + D</kbd>
                </div>
              </div>
            </div>

            {/* Writing Settings */}
            <div className="glass-card">
              <h2 className="text-2xl font-semibold text-white mb-6">Writing</h2>
              
              {/* Auto Save */}
              <div className="mb-6">
                <label className="flex items-center justify-between">
                  <span className="text-white font-medium">Auto Save</span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={settings.autoSave}
                      onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                      settings.autoSave ? 'bg-blue-600' : 'bg-gray-400'
                    }`}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                        settings.autoSave ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </div>
                  </div>
                </label>
                <p className="text-sm text-gray-400 mt-2">Automatically save your work while writing</p>
              </div>

              {/* Writing Streak */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white font-medium">Writing Streak</span>
                  <span className="text-2xl font-bold text-blue-400">{settings.writingStreak} days</span>
                </div>
                <div className="bg-blue-500/20 rounded-lg p-4">
                  <p className="text-sm text-blue-300">
                    Keep writing daily to maintain your streak! Write at least once every 24 hours to keep it going.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Live Preview */}
          <div className="space-y-6">
            <div className="glass-card">
              <h2 className="text-2xl font-semibold text-white mb-6">Live Preview</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Sample Text</h3>
                  <div 
                    className="p-4 bg-white/10 rounded-lg border border-white/20"
                    style={{
                      fontSize: settings.fontSize === 'small' ? '14px' : 
                               settings.fontSize === 'large' ? '18px' : '16px',
                      fontFamily: settings.fontFamily
                    }}
                  >
                    <p className="text-white mb-2">
                      This is how your text will appear with the current settings. 
                      The font size and family are applied in real-time.
                    </p>
                    <p className="text-gray-300">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                      Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Theme Status</h3>
                  <div className="flex items-center space-x-2">
                    <div className={`w-4 h-4 rounded-full ${settings.darkMode ? 'bg-gray-800' : 'bg-amber-200'}`}></div>
                    <span className="text-white">
                      {settings.darkMode ? 'Dark Mode Active' : 'Light Mode Active'}
                    </span>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Auto-Save Status</h3>
                  <div className="flex items-center space-x-2">
                    <div className={`w-4 h-4 rounded-full ${settings.autoSave ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                    <span className="text-white">
                      {settings.autoSave ? 'Auto-Save Enabled' : 'Auto-Save Disabled'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="space-y-6">
            <div className="glass-card">
              <h2 className="text-2xl font-semibold text-white mb-6">Account</h2>
              
              {/* User Info */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-white mb-3">User Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-400">Name</span>
                    <p className="text-white font-medium">{user.name}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-400">Email</span>
                    <p className="text-white font-medium">{user.email}</p>
                  </div>
                </div>
              </div>

              {/* Account Actions */}
              <div className="space-y-3">
                <Link
                  to="/profile"
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center block"
                >
                  Edit Profile
                </Link>
                
                <button
                  onClick={handleResetSettings}
                  className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Reset Settings
                </button>
                
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to log out?')) {
                      window.location.href = '/login';
                    }
                  }}
                  className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Debug Info */}
        <div className="mt-8 p-4 bg-amber-100 rounded-lg border border-amber-200">
          <h3 className="text-sm font-semibold text-amber-800 mb-2">Debug Information</h3>
          <div className="text-xs text-amber-700 space-y-1">
            <p>User: {user ? `${user.name} (${user.email})` : 'Not logged in'}</p>
            <p>Settings loaded: {isInitialized ? 'Yes' : 'No'}</p>
            <p>Current settings: {JSON.stringify(settings, null, 2)}</p>
            <p>UserSettings from context: {JSON.stringify(userSettings, null, 2)}</p>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="px-8 py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white font-medium rounded-xl hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}