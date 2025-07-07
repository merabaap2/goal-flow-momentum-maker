import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppButton } from './ui/AppButton';
import { User, Mail, Calendar, Target, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export const ProfileTab: React.FC = () => {
  const { logout, store } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const totalDreams = store.dreams.length;
  const totalGoals = store.dreams.reduce((acc, dream) => 
    acc + dream.enablers.reduce((eAcc, enabler) => 
      eAcc + enabler.shortGoals.length, 0), 0);
  const totalHabits = store.dreams.reduce((acc, dream) => 
    acc + dream.enablers.reduce((eAcc, enabler) => 
      eAcc + enabler.dailyHabits.length, 0), 0);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-[#374151]">Your Profile</h2>
        <p className="text-gray-600">Manage your account and preferences</p>
      </div>

      {/* Profile Header */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-[#2BD192]/10 via-white to-[#05C2FF]/10">
        <CardContent className="p-8 text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-[#2BD192] to-[#05C2FF] rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-12 w-12 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-[#374151] mb-2">Dream Achiever</h3>
          <p className="text-gray-600 mb-4">Member since today</p>
          
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            <div className="text-center p-3 bg-white/80 rounded-xl">
              <div className="text-xl font-bold text-[#374151]">{totalDreams}</div>
              <div className="text-xs text-gray-600">Dreams</div>
            </div>
            <div className="text-center p-3 bg-white/80 rounded-xl">
              <div className="text-xl font-bold text-[#374151]">{totalGoals}</div>
              <div className="text-xs text-gray-600">Goals</div>
            </div>
            <div className="text-center p-3 bg-white/80 rounded-xl">
              <div className="text-xl font-bold text-[#374151]">{totalHabits}</div>
              <div className="text-xs text-gray-600">Habits</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Settings */}
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl text-[#374151] flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Account Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-500" />
              <div>
                <p className="font-medium text-[#374151]">Email</p>
                <p className="text-sm text-gray-600">user@example.com</p>
              </div>
            </div>
            <AppButton variant="outline" size="sm">Edit</AppButton>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-500" />
              <div>
                <p className="font-medium text-[#374151]">Timeline</p>
                <p className="text-sm text-gray-600">{store.overallETA} years</p>
              </div>
            </div>
            <AppButton variant="outline" size="sm">Edit</AppButton>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center space-x-3">
              <Target className="h-5 w-5 text-gray-500" />
              <div>
                <p className="font-medium text-[#374151]">Notifications</p>
                <p className="text-sm text-gray-600">Daily reminders enabled</p>
              </div>
            </div>
            <AppButton variant="outline" size="sm">Edit</AppButton>
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <AppButton 
            variant="danger" 
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </AppButton>
        </CardContent>
      </Card>
    </div>
  );
};