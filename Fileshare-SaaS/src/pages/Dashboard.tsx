import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import FileUpload from '@/components/FileUpload';
import AnimatedBackground from '@/components/AnimatedBackground';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Copy, Download, Trash2, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import type { User } from '@supabase/supabase-js';

interface FileData {
  id: string;
  original_filename: string;
  file_size: number;
  created_at: string;
  share_id: string;
  download_count: number;
  filename: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [files, setFiles] = useState<FileData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [subscriber, setSubscriber] = useState<any>(null);

  useEffect(() => {
    let mounted = true;

    const initializeDashboard = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/auth');
          return;
        }

        if (mounted) {
          setUser(session.user);
          
          // Fetch data sequentially to avoid race conditions
          await Promise.all([
            fetchUserProfile(session.user.id),
            fetchUserFiles(session.user.id),
            fetchSubscriberData()
          ]);
          
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error initializing dashboard:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeDashboard();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        if (event === 'SIGNED_OUT' || !session) {
          navigate('/auth');
        } else if (event === 'SIGNED_IN' && session) {
          setUser(session.user);
          // Use setTimeout to prevent potential deadlocks
          setTimeout(async () => {
            try {
              await Promise.all([
                fetchUserProfile(session.user.id),
                fetchUserFiles(session.user.id),
                fetchSubscriberData()
              ]);
              setIsLoading(false);
            } catch (error) {
              console.error('Error fetching data after auth change:', error);
              setIsLoading(false);
            }
          }, 0);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

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

  const fetchSubscriberData = async () => {
    try {
      console.log('Fetching subscription data...');
      const { data, error } = await supabase.functions.invoke('check-subscription');
      if (error) {
        console.error('Subscription check error:', error);
        // Set default subscriber data if check fails
        setSubscriber({
          subscription_tier: 'Base',
          file_upload_count: 0,
          file_upload_limit: 10,
          subscribed: false
        });
      } else {
        console.log('Subscription data received:', data);
        setSubscriber(data);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
      // Set default subscriber data if function fails
      setSubscriber({
        subscription_tier: 'Base',
        file_upload_count: 0,
        file_upload_limit: 10,
        subscribed: false
      });
    }
  };

  const fetchUserFiles = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching files:', error);
        setFiles([]);
      } else {
        setFiles(data || []);
      }
    } catch (error) {
      console.error('Error fetching files:', error);
      setFiles([]);
    }
  };

  const refreshFiles = async () => {
    if (!user) return;
    setIsRefreshing(true);
    try {
      console.log('Refreshing files and subscription data...');
      await Promise.all([
        fetchUserFiles(user.id),
        fetchSubscriberData()
      ]);
      toast({
        title: "Files refreshed",
        description: "Your file list has been updated.",
      });
    } catch (error) {
      console.error('Error refreshing files:', error);
      toast({
        title: "Error",
        description: "Failed to refresh files.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const copyShareLink = (shareId: string) => {
    const url = `${window.location.origin}/download/${shareId}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied!",
      description: "Share link has been copied to clipboard.",
    });
  };

  const deleteFile = async (fileId: string, filename: string) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('files')
        .remove([filename]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('files')
        .delete()
        .eq('id', fileId);

      if (dbError) throw dbError;

      // Refresh files list and subscriber data
      if (user) {
        await fetchUserFiles(user.id);
        await fetchSubscriberData();
      }

      toast({
        title: "File deleted",
        description: "File has been successfully deleted.",
      });
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: "Error",
        description: "Failed to delete file.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="relative min-h-screen">
        <AnimatedBackground />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Welcome Section */}
          <div className="mb-8 animate-fade-in">
            <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-8 border border-white/30 shadow-2xl">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2 drop-shadow-sm">
                Welcome back, {userProfile?.full_name || user.email}!
              </h1>
              <p className="text-xl text-gray-700 drop-shadow-sm mb-4">
                Upload files and share them with anyone using unique links.
              </p>
              
              {/* Subscription Status */}
              {subscriber && (
                <div className="bg-white/30 backdrop-blur-md rounded-lg p-4 border border-white/40">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Current Plan: <span className="font-semibold">{subscriber.subscription_tier || 'Base'}</span></p>
                      <p className="text-sm text-gray-600">
                        Uploads: {subscriber.file_upload_count || 0} / {subscriber.file_upload_limit || 10}
                      </p>
                    </div>
                    <div className="w-full max-w-48 bg-white/20 rounded-full h-2 ml-4">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((subscriber.file_upload_count || 0) / (subscriber.file_upload_limit || 10)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* File Upload Section */}
          <div className="animate-fade-in mb-12" style={{ animationDelay: '200ms' }}>
            <FileUpload onUploadComplete={refreshFiles} subscriber={subscriber} />
          </div>

          {/* File History Section */}
          <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
            <Card className="bg-white/20 backdrop-blur-lg border border-white/30 shadow-2xl">
              <div className="p-6 border-b border-white/20">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm">
                    Your Shared Files
                  </h2>
                  <Button
                    onClick={refreshFiles}
                    disabled={isRefreshing}
                    variant="outline"
                    size="sm"
                    className="bg-white/20 backdrop-blur-lg border-white/40 hover:bg-white/30"
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
                <p className="text-gray-700 mt-2 drop-shadow-sm">
                  {files.length} file{files.length !== 1 ? 's' : ''} uploaded
                </p>
              </div>

              {files.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-gray-700 text-lg drop-shadow-sm">No files uploaded yet.</p>
                  <p className="text-gray-600 mt-2 drop-shadow-sm">Upload your first file to get started!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/20">
                        <TableHead className="font-semibold text-gray-800">File Name</TableHead>
                        <TableHead className="font-semibold text-gray-800">Size</TableHead>
                        <TableHead className="font-semibold text-gray-800">Uploaded</TableHead>
                        <TableHead className="font-semibold text-gray-800">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {files.map((file) => (
                        <TableRow key={file.id} className="border-white/20 hover:bg-white/10 transition-colors">
                          <TableCell className="font-medium text-gray-800">{file.original_filename}</TableCell>
                          <TableCell className="text-gray-700">{formatFileSize(file.file_size)}</TableCell>
                          <TableCell className="text-gray-700">{new Date(file.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                onClick={() => copyShareLink(file.share_id)}
                                size="sm"
                                variant="outline"
                                className="bg-white/20 backdrop-blur-lg border-white/40 hover:bg-white/30"
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                              <Button
                                onClick={() => window.open(`/download/${file.share_id}`, '_blank')}
                                size="sm"
                                variant="outline"
                                className="bg-white/20 backdrop-blur-lg border-white/40 hover:bg-white/30"
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button
                                onClick={() => deleteFile(file.id, file.filename)}
                                size="sm"
                                variant="outline"
                                className="bg-white/20 backdrop-blur-lg border-white/40 hover:bg-red-100/30 text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
