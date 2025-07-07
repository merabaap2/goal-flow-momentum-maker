import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppButton } from './ui/AppButton';
import { Settings, Bell, Shield, Database, Palette, HelpCircle } from 'lucide-react';

export const SettingsTab: React.FC = () => {
  const settingsGroups = [
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        { label: 'Daily Habit Reminders', description: 'Get reminded to complete your daily habits', enabled: true },
        { label: 'Goal Milestones', description: 'Celebrate when you reach important milestones', enabled: true },
        { label: 'Weekly Progress', description: 'Receive weekly progress summaries', enabled: false },
      ]
    },
    {
      title: 'Privacy & Security',
      icon: Shield,
      items: [
        { label: 'Data Backup', description: 'Automatically backup your goals and progress', enabled: true },
        { label: 'Analytics', description: 'Help improve the app with anonymous usage data', enabled: false },
      ]
    },
    {
      title: 'Appearance',
      icon: Palette,
      items: [
        { label: 'Dark Mode', description: 'Toggle between light and dark themes', enabled: false },
        { label: 'Compact View', description: 'Show more content in less space', enabled: false },
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-[#374151]">Settings</h2>
        <p className="text-gray-600">Customize your DreamMap experience</p>
      </div>

      {settingsGroups.map((group, groupIndex) => (
        <Card key={groupIndex} className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-[#374151] flex items-center space-x-2">
              <group.icon className="h-5 w-5" />
              <span>{group.title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {group.items.map((item, itemIndex) => (
              <div key={itemIndex} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex-1">
                  <p className="font-medium text-[#374151] mb-1">{item.label}</p>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
                <div className="ml-4">
                  <button
                    className={`w-12 h-6 rounded-full transition-colors duration-200 relative ${
                      item.enabled 
                        ? 'bg-gradient-to-r from-[#2BD192] to-[#05C2FF]' 
                        : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 absolute top-0.5 ${
                        item.enabled ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {/* Data Management */}
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl text-[#374151] flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Data Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AppButton variant="outline" className="h-12">
              Export Data
            </AppButton>
            <AppButton variant="outline" className="h-12">
              Import Data
            </AppButton>
          </div>
          <AppButton variant="danger" className="w-full h-12">
            Clear All Data
          </AppButton>
        </CardContent>
      </Card>

      {/* Help & Support */}
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl text-[#374151] flex items-center space-x-2">
            <HelpCircle className="h-5 w-5" />
            <span>Help & Support</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AppButton variant="outline" className="h-12">
              User Guide
            </AppButton>
            <AppButton variant="outline" className="h-12">
              Contact Support
            </AppButton>
          </div>
          <div className="text-center text-sm text-gray-500 pt-4">
            DreamMap v1.0.0
          </div>
        </CardContent>
      </Card>
    </div>
  );
};