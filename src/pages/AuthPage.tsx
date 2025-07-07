import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { AppButton } from '../components/ui/AppButton';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Sparkles, Target, TrendingUp, Users } from 'lucide-react';

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

  const features = [
    {
      icon: Target,
      title: 'Smart Goal Tracking',
      description: 'AI-powered goal breakdown from dreams to daily habits'
    },
    {
      icon: TrendingUp,
      title: 'Progress Analytics',
      description: 'Visual insights and personalized recommendations'
    },
    {
      icon: Users,
      title: 'Community Support',
      description: 'Connect with like-minded goal achievers'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F6F8] via-white to-[#F4F6F8] flex flex-col">
      {/* Header Section */}
      <div className="flex-1 flex flex-col justify-center px-6 pt-12 pb-8">
        {/* App Logo & Branding */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-[#2BD192] to-[#05C2FF] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#2BD192] to-[#05C2FF] bg-clip-text text-transparent mb-2">
            RDM
          </h1>
          <p className="text-xl font-semibold text-[#374151] mb-2">
            Turn Your Dreams Into
          </p>
          <p className="text-xl font-semibold bg-gradient-to-r from-[#2BD192] to-[#05C2FF] bg-clip-text text-transparent">
            Achievable Reality
          </p>
          <p className="text-gray-600 mt-4 max-w-sm mx-auto">
            The intelligent goal-setting platform that breaks down your biggest aspirations into daily actionable steps.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-4 mb-8 max-w-sm mx-auto w-full">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-sm">
              <div className="w-10 h-10 bg-gradient-to-r from-[#2BD192]/20 to-[#05C2FF]/20 rounded-xl flex items-center justify-center shrink-0">
                <feature.icon className="h-5 w-5 text-[#2BD192]" />
              </div>
              <div className="text-left flex-1">
                <h3 className="font-semibold text-[#374151] text-sm mb-1">{feature.title}</h3>
                <p className="text-xs text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Auth Form Section */}
      <div className="bg-white rounded-t-3xl shadow-2xl px-6 py-8">
        <div className="max-w-sm mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-[#374151] mb-2">
              {isLogin ? 'Welcome Back!' : 'Start Your Journey'}
            </h2>
            <p className="text-gray-600 text-sm">
              {isLogin ? 'Sign in to continue your goal journey' : 'Create your account to begin achieving your dreams'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required={!isLogin}
                  className="h-12 border-2 border-gray-200 rounded-xl focus:border-[#2BD192] transition-colors text-base"
                />
              </div>
            )}

            <div>
              <Input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
                className="h-12 border-2 border-gray-200 rounded-xl focus:border-[#2BD192] transition-colors text-base"
              />
            </div>

            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                required
                className="h-12 border-2 border-gray-200 rounded-xl focus:border-[#2BD192] transition-colors pr-12 text-base"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <AppButton
              type="submit"
              className="w-full h-12 text-lg font-semibold mt-6"
              loading={loading}
              disabled={loading}
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </AppButton>
          </form>

          <div className="text-center mt-6">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#2BD192] hover:text-[#25B885] font-medium transition-colors text-sm"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>

          {/* Demo hint */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center mt-4">
            <p className="text-xs text-blue-800">
              💡 Demo: Use any email & password to explore
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};