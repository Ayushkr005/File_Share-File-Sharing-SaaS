
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Layout from '@/components/Layout';
import AnimatedBackground from '@/components/AnimatedBackground';
import { Download as DownloadIcon, File, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface FileData {
  id: string;
  original_filename: string;
  filename: string;
  file_size: number;
  created_at: string;
  storage_path: string;
}

const Download = () => {
  const { fileId } = useParams();
  const [file, setFile] = useState<FileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const loadFile = async () => {
      if (!fileId) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('files')
          .select('*')
          .eq('share_id', fileId)
          .single();

        if (error || !data) {
          console.error('File not found:', error);
          setFile(null);
        } else {
          setFile(data);
        }
      } catch (error) {
        console.error('Error loading file:', error);
        setFile(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadFile();
  }, [fileId]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownload = async () => {
    if (!file) return;

    setIsDownloading(true);
    
    try {
      // Get the signed URL for download
      const { data, error } = await supabase.storage
        .from('files')
        .createSignedUrl(file.storage_path, 3600); // 1 hour expiry

      if (error) {
        throw error;
      }

      // Create download link
      const link = document.createElement('a');
      link.href = data.signedUrl;
      link.download = file.original_filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Update download count
      await supabase
        .from('files')
        .update({ download_count: (file as any).download_count + 1 || 1 })
        .eq('id', file.id);
      
      toast({
        title: "Download started!",
        description: `${file.original_filename} is being downloaded.`,
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download failed",
        description: "There was an error downloading the file.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="relative min-h-screen flex items-center justify-center">
          <AnimatedBackground />
          <Card className="p-8 text-center bg-white/80 backdrop-blur-md animate-pulse border border-white/50 shadow-xl">
            <div className="w-16 h-16 bg-gray-200/70 rounded-full mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200/70 rounded w-48 mx-auto mb-2"></div>
            <div className="h-3 bg-gray-200/70 rounded w-32 mx-auto"></div>
          </Card>
        </div>
      </Layout>
    );
  }

  if (!file) {
    return (
      <Layout>
        <div className="relative min-h-screen flex items-center justify-center">
          <AnimatedBackground />
          <Card className="p-8 text-center bg-white/80 backdrop-blur-md animate-scale-in max-w-md border border-white/50 shadow-xl">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">File Not Found</h1>
            <p className="text-gray-600 mb-6">
              The file you're looking for doesn't exist or may have been removed.
            </p>
            <Button 
              onClick={() => window.location.href = '/'}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg"
            >
              Go Home
            </Button>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="relative min-h-screen flex items-center justify-center py-12 px-4">
        <AnimatedBackground />
        
        <Card className="p-8 text-center bg-white/80 backdrop-blur-md animate-scale-in max-w-md w-full border border-white/50 shadow-xl">
          <div className="mb-6">
            <File className="w-20 h-20 text-blue-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Download File
            </h1>
          </div>

          <div className="bg-gray-50/70 backdrop-blur-sm rounded-lg p-4 mb-6 text-left border border-white/30">
            <h3 className="font-semibold text-gray-900 mb-2">File Details</h3>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">Name:</span> {file.original_filename}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">Size:</span> {formatFileSize(file.file_size)}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Uploaded:</span> {new Date(file.created_at).toLocaleDateString()}
            </p>
          </div>

          <Button
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 hover:scale-105 shadow-lg"
            size="lg"
          >
            <DownloadIcon className="w-5 h-5 mr-2" />
            {isDownloading ? 'Downloading...' : 'Download File'}
          </Button>

          <p className="text-xs text-gray-500 mt-4">
            No account required • Safe & secure download
          </p>
        </Card>
      </div>
    </Layout>
  );
};

export default Download;
