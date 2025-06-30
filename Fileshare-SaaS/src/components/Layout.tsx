
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

interface LayoutProps {
  children: React.ReactNode;
  showAuth?: boolean;
}

const Layout = ({ children, showAuth = true }: LayoutProps) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          setUser(session?.user ?? null);
          if (session?.user) {
            await fetchUserProfile(session.user.id);
          }
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (mounted) {
          setUser(session?.user ?? null);
          if (session?.user) {
            setTimeout(() => {
              fetchUserProfile(session.user.id);
            }, 0);
          } else {
            setUserProfile(null);
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      setUserProfile(profile);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setUserProfile(null);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getUserDisplayName = () => {
    if (userProfile?.full_name) {
      return userProfile.full_name.split(' ')[0]; // Get first name
    }
    if (user?.email) {
      return user.email.split('@')[0]; // Get email username part
    }
    return 'User';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <nav className="bg-white/70 backdrop-blur-md border-b border-blue-100/50 sticky top-0 z-50 shadow-lg animate-fade-in">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link to="/" className="flex items-center space-x-2 hover:scale-105 transition-transform duration-300 animate-fade-in">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <Upload className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  FileShare
                </span>
              </Link>
              <div className="flex items-center space-x-4">
                <div className="animate-pulse bg-gray-200 rounded px-4 py-2 w-20 h-10"></div>
              </div>
            </div>
          </div>
        </nav>
        <main className="relative">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <nav className="bg-white/70 backdrop-blur-md border-b border-blue-100/50 sticky top-0 z-50 shadow-lg animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2 hover:scale-105 transition-all duration-300 animate-fade-in group">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 group-hover:rotate-12">
                <Upload className="w-5 h-5 text-white transition-transform duration-300 group-hover:scale-110" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                FileShare
              </span>
            </Link>
            
            {showAuth && (
              <div className="flex items-center space-x-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
                {user ? (
                  <>
                    <span className="text-gray-700 font-medium animate-fade-in hover:text-blue-600 transition-colors duration-300" style={{ animationDelay: '400ms' }}>
                      Hi, {getUserDisplayName()}!
                    </span>
                    <Link to="/dashboard">
                      <Button variant="ghost" className="hover:bg-blue-50/70 transition-all duration-300 backdrop-blur-sm hover:scale-105 hover:shadow-md">
                        Dashboard
                      </Button>
                    </Link>
                    <Link to="/subscription">
                      <Button variant="ghost" className="hover:bg-blue-50/70 transition-all duration-300 backdrop-blur-sm hover:scale-105 hover:shadow-md">
                        Subscription
                      </Button>
                    </Link>
                    <Button 
                      onClick={handleSignOut} 
                      variant="outline"
                      className="hover:bg-red-50/70 hover:border-red-200 transition-all duration-300 backdrop-blur-sm border-white/50 bg-white/70 hover:scale-105 hover:shadow-md"
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/auth">
                      <Button variant="ghost" className="hover:bg-blue-50/70 transition-all duration-300 backdrop-blur-sm hover:scale-105 hover:shadow-md">
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/auth">
                      <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
      
      <main className="relative animate-fade-in" style={{ animationDelay: '300ms' }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
