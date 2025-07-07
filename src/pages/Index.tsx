
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from '../context/AppContext';
import { SplashLoader } from '../components/SplashLoader';
import { Dashboard } from '../components/Dashboard';
import { CheckinsTab } from '../components/CheckinsTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Home, CheckSquare, Settings } from 'lucide-react';

const AppRoutes: React.FC = () => {
  const { loading } = useApp();

  if (loading) {
    return <SplashLoader />;
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/splash" element={<SplashLoader />} />
      <Route path="/home" element={<HomeTabs />} />
      <Route path="/wizard" element={<div className="p-8 text-center">Wizard coming soon...</div>} />
    </Routes>
  );
};

const HomeTabs: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F6F8] via-white to-[#F4F6F8]">
      <Tabs defaultValue="dashboard" className="w-full">
        <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b z-10">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="checkins" className="flex items-center space-x-2">
              <CheckSquare className="h-4 w-4" />
              <span>Check-ins</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="dashboard" className="mt-0">
          <Dashboard />
        </TabsContent>
        
        <TabsContent value="checkins" className="mt-0">
          <CheckinsTab />
        </TabsContent>
        
        <TabsContent value="settings" className="mt-0">
          <div className="p-4 text-center">
            <h2 className="text-2xl font-bold text-[#374151] mb-4">Settings</h2>
            <p className="text-gray-600">Settings panel coming soon...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
};

export default Index;
