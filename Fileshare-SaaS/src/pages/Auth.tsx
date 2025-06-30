
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Layout from '@/components/Layout';
import AnimatedBackground from '@/components/AnimatedBackground';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Eye, EyeOff } from 'lucide-react';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        // Sign up with Supabase
        if (!name.trim() || !email.trim() || !password.trim()) {
          toast({
            title: "Please fill in all fields",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            },
            emailRedirectTo: `${window.location.origin}/`
          }
        });

        if (error) {
          toast({
            title: "Sign up failed",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Account created successfully!",
            description: "Please check your email to verify your account.",
          });
          navigate('/dashboard');
        }
      } else {
        // Sign in with Supabase
        if (!email.trim() || !password.trim()) {
          toast({
            title: "Please fill in all fields",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          toast({
            title: "Sign in failed",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Signed in successfully!",
            description: "Welcome back!",
          });
          navigate('/dashboard');
        }
      }
    } catch (error: any) {
      toast({
        title: "An error occurred",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  return (
    <Layout showAuth={false}>
      <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <AnimatedBackground />
        
        <Card className="w-full max-w-md p-8 bg-white/90 backdrop-blur-md shadow-xl animate-scale-in hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
          <div className="text-center mb-8 animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-900 mb-2 animate-fade-in" style={{ animationDelay: '200ms' }}>
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-gray-600 animate-fade-in" style={{ animationDelay: '400ms' }}>
              {isSignUp ? 'Join FileShare and start sharing files instantly' : 'Sign in to your FileShare account'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <div className="space-y-2 animate-fade-in" style={{ animationDelay: '600ms' }}>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:scale-105 hover:shadow-md"
                />
              </div>
            )}
            
            <div className="space-y-2 animate-fade-in" style={{ animationDelay: isSignUp ? '800ms' : '600ms' }}>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:scale-105 hover:shadow-md"
              />
            </div>
            
            <div className="space-y-2 animate-fade-in" style={{ animationDelay: isSignUp ? '1000ms' : '800ms' }}>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:scale-105 hover:shadow-md pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-all duration-200 hover:scale-110"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 hover:scale-105 hover:shadow-lg animate-fade-in transform hover:-translate-y-1"
              style={{ animationDelay: isSignUp ? '1200ms' : '1000ms' }}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Please wait...</span>
                </div>
              ) : (
                isSignUp ? 'Create Account' : 'Sign In'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center animate-fade-in" style={{ animationDelay: isSignUp ? '1400ms' : '1200ms' }}>
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-blue-600 hover:text-blue-700 transition-all duration-300 hover:scale-105 relative overflow-hidden group"
            >
              <span className="relative z-10">
                {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
              </span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </button>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Auth;
