import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { AppButton } from '../components/ui/AppButton';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Sparkles, Target, TrendingUp, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    <div className="min-h-screen bg-gradient-to-br from-[#F4F6F8] via-white to-[#F4F6F8] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Branding & Features */}
        <div className="space-y-8 text-center lg:text-left">
          <div className="space-y-4">
            <div className="flex items-center justify-center lg:justify-start space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-[#2BD192] to-[#05C2FF] rounded-xl flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#2BD192] to-[#05C2FF] bg-clip-text text-transparent">
                DreamMap
              </h1>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#374151] leading-tight">
              Turn Your Dreams Into
              <span className="block bg-gradient-to-r from-[#2BD192] to-[#05C2FF] bg-clip-text text-transparent">
                Achievable Reality
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-lg mx-auto lg:mx-0">
              The intelligent goal-setting platform that breaks down your biggest aspirations into daily actionable steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200">
                <div className="w-10 h-10 bg-gradient-to-r from-[#2BD192]/20 to-[#05C2FF]/20 rounded-lg flex items-center justify-center shrink-0">
                  <feature.icon className="h-5 w-5 text-[#2BD192]" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-[#374151] mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="flex justify-center">
          <Card className="w-full max-w-md border-0 shadow-2xl bg-white/80 backdrop-blur-md">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-[#374151]">
                {isLogin ? 'Welcome Back!' : 'Start Your Journey'}
              </CardTitle>
              <p className="text-gray-600">
                {isLogin ? 'Sign in to continue your goal journey' : 'Create your account to begin achieving your dreams'}
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#374151]">Full Name</label>
                    <Input
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required={!isLogin}
                      className="h-12 border-2 border-gray-200 rounded-xl focus:border-[#2BD192] transition-colors"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#374151]">Email Address</label>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                    className="h-12 border-2 border-gray-200 rounded-xl focus:border-[#2BD192] transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#374151]">Password</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      required
                      className="h-12 border-2 border-gray-200 rounded-xl focus:border-[#2BD192] transition-colors pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <AppButton
                  type="submit"
                  className="w-full h-12 text-lg font-semibold"
                  loading={loading}
                  disabled={loading}
                >
                  {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
                </AppButton>
              </form>

              <div className="text-center">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-[#2BD192] hover:text-[#25B885] font-medium transition-colors"
                >
                  {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                </button>
              </div>

              {/* Demo credentials hint */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                <p className="text-xs text-blue-800">
                  💡 Demo: Use any email & password to explore
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};