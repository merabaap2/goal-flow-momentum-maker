import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { AppButton } from '../components/ui/AppButton';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Sparkles } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const { login, signup } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let success = false;
      if (isLogin) {
        success = await login(formData.email, formData.password);
      } else {
        success = await signup(formData.email, formData.password, formData.name);
      }

      if (success) {
        navigate('/splash');
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen max-w-[360px] max-h-[800px] mx-auto bg-gradient-to-br from-[#F4F6F8] via-white to-[#F4F6F8] flex flex-col overflow-hidden">
      {/* Header Section - 300px */}
      <div className="h-[300px] flex flex-col justify-center items-center px-6 pt-8">
        {/* App Logo */}
        <div className="w-16 h-16 bg-gradient-to-r from-[#2BD192] to-[#05C2FF] rounded-2xl flex items-center justify-center mb-4 shadow-lg">
          <Sparkles className="h-8 w-8 text-white" />
        </div>
        
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#2BD192] to-[#05C2FF] bg-clip-text text-transparent mb-2">
          RDM
        </h1>
        
        <h2 className="text-lg font-semibold text-[#374151] mb-1">
          Turn Your Dreams Into
        </h2>
        <h3 className="text-lg font-semibold bg-gradient-to-r from-[#2BD192] to-[#05C2FF] bg-clip-text text-transparent mb-3">
          Achievable Reality
        </h3>
        
        <p className="text-sm text-gray-600 text-center px-4 leading-tight">
          Break down your biggest aspirations into daily actionable steps
        </p>
      </div>

      {/* Auth Form Section - 500px */}
      <div className="flex-1 bg-white rounded-t-3xl shadow-2xl px-6 py-6 flex flex-col">
        <div className="flex-1 flex flex-col justify-between">
          {/* Form Header */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-[#374151] mb-1">
              {isLogin ? 'Welcome Back!' : 'Start Your Journey'}
            </h2>
            <p className="text-sm text-gray-600">
              {isLogin ? 'Sign in to continue' : 'Create your account'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 flex-1">
            {!isLogin && (
              <Input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required={!isLogin}
                className="h-11 border-2 border-gray-200 rounded-xl focus:border-[#2BD192] transition-colors text-base"
              />
            )}

            <Input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
              className="h-11 border-2 border-gray-200 rounded-xl focus:border-[#2BD192] transition-colors text-base"
            />

            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                required
                className="h-11 border-2 border-gray-200 rounded-xl focus:border-[#2BD192] transition-colors pr-12 text-base"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <AppButton
              type="submit"
              className="w-full h-11 text-base font-semibold mt-6"
              loading={loading}
              disabled={loading}
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </AppButton>
          </form>

          {/* Bottom Section */}
          <div className="space-y-4 mt-4">
            <div className="text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-[#2BD192] hover:text-[#25B885] font-medium transition-colors text-sm"
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </button>
            </div>

            {/* Demo hint */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
              <p className="text-xs text-blue-800">
                💡 Demo: Use any email & password to explore
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};