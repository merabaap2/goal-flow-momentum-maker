
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AppProvider, useApp } from '../context/AppContext';
import { SplashLoader } from '../components/SplashLoader';
import { Dashboard } from '../components/Dashboard';
import { CheckinsTab } from '../components/CheckinsTab';
import { BottomNav } from '../components/ui/BottomNav';
import { ProgressTab } from '../components/ProgressTab';
import { ProfileTab } from '../components/ProfileTab';
import { SettingsTab } from '../components/SettingsTab';

const HomeTabs: React.FC = () => {
  const { loading } = useApp();
  const location = useLocation();

  const getCurrentTab = () => {
    const params = new URLSearchParams(location.search);
    return params.get('tab') || 'dashboard';
  };

  const currentTab = getCurrentTab();

  if (loading) {
    return <SplashLoader />;
  }

  const renderTabContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'checkins':
        return <CheckinsTab />;
      case 'progress':
        return <ProgressTab />;
      case 'profile':
        return <ProfileTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F6F8] via-white to-[#F4F6F8] pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-xl border-b border-gray-200/50 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-[#2BD192] to-[#05C2FF] rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#374151]">DreamMap</h1>
                <p className="text-xs text-gray-500 capitalize">{currentTab.replace('-', ' ')}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-[#2BD192] to-[#05C2FF] rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">U</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {renderTabContent()}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <AppProvider>
      <HomeTabs />
    </AppProvider>
  );
};

export default Index;
