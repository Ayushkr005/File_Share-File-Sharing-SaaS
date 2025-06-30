
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, File, Copy, CheckCircle, AlertCircle, Crown } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface FileUploadProps {
  onUploadComplete?: () => void;
  subscriber?: any;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadComplete, subscriber }) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    shareUrl: string;
  } | null>(null);

  const generateShareId = () => {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  };

  const canUpload = () => {
    if (!subscriber) {
      console.log('No subscriber data available');
      return false;
    }
    const canUploadFile = (subscriber.file_upload_count || 0) < (subscriber.file_upload_limit || 10);
    console.log('Upload check:', { 
      current: subscriber.file_upload_count, 
      limit: subscriber.file_upload_limit, 
      canUpload: canUploadFile 
    });
    return canUploadFile;
  };

  const getUpgradeMessage = () => {
    if (!subscriber?.subscription_tier || subscriber.subscription_tier === 'Base') {
      return "Please upgrade to Lite plan to continue uploading files.";
    } else if (subscriber.subscription_tier === 'Lite') {
      return "Please upgrade to Pro plan to continue uploading files.";
    }
    return "Upload limit reached for this month.";
  };

  const uploadFile = async (file: File) => {
    try {
      console.log('Starting file upload process...');
      setIsUploading(true);
      setUploadProgress(0);
      setUploadedFile(null);

      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to upload files.",
          variant: "destructive",
        });
        return;
      }

      console.log('User authenticated, checking upload limit...');

      // Double-check upload limit right before upload
      if (!canUpload()) {
        console.log('Upload limit reached');
        toast({
          title: "Upload limit reached",
          description: getUpgradeMessage(),
          variant: "destructive",
        });
        return;
      }

      console.log('Upload limit check passed, proceeding with upload...');

      const shareId = generateShareId();
      const fileName = `${session.user.id}/${shareId}_${file.name}`;
      
      console.log('Generated file path:', fileName);

      // Create storage bucket if it doesn't exist
      try {
        await supabase.storage.createBucket('files', { public: true });
      } catch (bucketError) {
        console.log('Bucket might already exist:', bucketError);
      }

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 20;
        });
      }, 300);

      console.log('Uploading file to storage...');
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('files')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      clearInterval(progressInterval);
      setUploadProgress(95);

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw uploadError;
      }

      console.log('File uploaded to storage successfully, saving metadata...');

      // Save file metadata to database
      const { data: fileData, error: dbError } = await supabase
        .from('files')
        .insert({
          user_id: session.user.id,
          original_filename: file.name,
          filename: fileName,
          file_size: file.size,
          storage_path: uploadData.path,
          share_id: shareId,
          mime_type: file.type,
        })
        .select()
        .single();

      if (dbError) {
        console.error('Database insert error:', dbError);
        throw dbError;
      }

      console.log('File metadata saved, updating subscriber count...');

      // Update subscriber upload count - this is the critical fix
      const newUploadCount = (subscriber.file_upload_count || 0) + 1;
      const { error: subscriberError } = await supabase
        .from('subscribers')
        .update({ 
          file_upload_count: newUploadCount,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', session.user.id);

      if (subscriberError) {
        console.error('Subscriber update error:', subscriberError);
        // Don't throw here as the file is already uploaded, just log the error
      } else {
        console.log('Subscriber upload count updated successfully to:', newUploadCount);
      }

      setUploadProgress(100);
      const shareUrl = `${window.location.origin}/download/${shareId}`;
      
      setUploadedFile({
        name: file.name,
        shareUrl: shareUrl,
      });

      console.log('Upload process completed successfully');

      toast({
        title: "Upload successful!",
        description: `${file.name} has been uploaded and is ready to share.`,
      });

      // Call the callback to refresh the files list and subscriber data
      // Add a small delay to ensure database operations are complete
      setTimeout(() => {
        if (onUploadComplete) {
          onUploadComplete();
        }
      }, 500);

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message || "There was an error uploading your file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log('Files dropped:', acceptedFiles);
    if (acceptedFiles.length > 0) {
      // Check upload limit again when files are dropped
      if (!canUpload()) {
        toast({
          title: "Upload limit reached",
          description: getUpgradeMessage(),
          variant: "destructive",
        });
        return;
      }
      uploadFile(acceptedFiles[0]);
    }
  }, [subscriber]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    maxSize: 100 * 1024 * 1024, // 100MB limit
    disabled: isUploading || !canUpload(),
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Share link copied to clipboard.",
    });
  };

  const resetUpload = () => {
    setUploadedFile(null);
    setUploadProgress(0);
  };

  const remainingUploads = subscriber ? (subscriber.file_upload_limit || 10) - (subscriber.file_upload_count || 0) : 0;
  const uploadPercentage = subscriber ? ((subscriber.file_upload_count || 0) / (subscriber.file_upload_limit || 10)) * 100 : 0;

  // Show loading state if no subscriber data
  if (!subscriber) {
    return (
      <Card className="bg-white/20 backdrop-blur-lg border border-white/30 shadow-2xl">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading subscription info...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-white/20 backdrop-blur-lg border border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:bg-white/25">
      <div className="p-8">
        {/* Upload Progress Bar */}
        <div className="mb-6 p-4 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Monthly Upload Limit ({subscriber.subscription_tier || 'Base'})
            </span>
            <span className="text-sm text-gray-600">
              {subscriber.file_upload_count || 0} / {subscriber.file_upload_limit || 10}
            </span>
          </div>
          <Progress 
            value={uploadPercentage} 
            className="h-2 bg-white/30" 
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-600">
              {remainingUploads} uploads remaining
            </span>
            {remainingUploads === 0 && (
              <Button
                onClick={() => window.location.href = '/subscription'}
                size="sm"
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              >
                <Crown className="w-4 h-4 mr-1" />
                Upgrade
              </Button>
            )}
          </div>
        </div>

        {!uploadedFile ? (
          <>
            {!canUpload() ? (
              <div className="text-center p-8 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
                <AlertCircle className="w-16 h-16 mx-auto mb-4 text-orange-500" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Upload Limit Reached</h3>
                <p className="text-gray-600 mb-4">{getUpgradeMessage()}</p>
                <Button
                  onClick={() => window.location.href = '/subscription'}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  View Plans
                </Button>
              </div>
            ) : (
              <div
                {...getRootProps()}
                className={`
                  border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
                  transition-all duration-500 hover:scale-[1.02]
                  backdrop-blur-md bg-white/10
                  ${isDragActive 
                    ? 'border-blue-400 bg-blue-50/30 backdrop-blur-lg shadow-xl' 
                    : 'border-white/40 hover:border-blue-300 hover:bg-blue-50/20'
                  }
                  ${isUploading ? 'pointer-events-none opacity-70' : ''}
                `}
              >
                <input {...getInputProps()} />
                <div className="space-y-4">
                  <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-400/80 to-indigo-500/80 rounded-full flex items-center justify-center shadow-2xl backdrop-blur-sm border border-white/30">
                    <Upload className="w-10 h-10 text-white drop-shadow-lg" />
                  </div>
                  
                  {isUploading ? (
                    <div className="space-y-4">
                      <p className="text-lg font-semibold text-gray-800 drop-shadow-sm">
                        Uploading your file...
                      </p>
                      <div className="max-w-xs mx-auto">
                        <Progress value={uploadProgress} className="h-3 bg-white/30 backdrop-blur-sm" />
                        <p className="text-sm text-gray-600 mt-2 drop-shadow-sm">
                          {Math.round(uploadProgress)}% completed
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <p className="text-xl font-semibold text-gray-800 mb-2 drop-shadow-sm">
                          {isDragActive 
                            ? 'Drop your file here!' 
                            : 'Drag & drop a file here'
                          }
                        </p>
                        <p className="text-gray-600 mb-4 drop-shadow-sm">
                          or click to browse your files
                        </p>
                      </div>
                      
                      <Button 
                        size="lg"
                        className="bg-gradient-to-r from-blue-500/90 to-indigo-600/90 hover:from-blue-600/90 hover:to-indigo-700/90 transition-all duration-300 hover:scale-105 shadow-2xl backdrop-blur-sm border border-white/30"
                      >
                        Choose File
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-700 drop-shadow-sm">
                Maximum file size: 100MB • All file types supported
              </p>
            </div>
          </>
        ) : (
          <div className="text-center space-y-6 animate-fade-in">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-400/80 to-emerald-500/80 rounded-full flex items-center justify-center shadow-2xl backdrop-blur-sm border border-white/30">
              <CheckCircle className="w-10 h-10 text-white drop-shadow-lg" />
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2 drop-shadow-sm">
                Upload Successful! 🎉
              </h3>
              <p className="text-gray-700 mb-4 drop-shadow-sm">
                Your file <span className="font-semibold">{uploadedFile.name}</span> is ready to share
              </p>
            </div>

            <div className="bg-white/20 backdrop-blur-lg rounded-lg p-4 border border-white/30 shadow-xl">
              <p className="text-sm text-gray-700 mb-2 drop-shadow-sm">Share this link:</p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={uploadedFile.shareUrl}
                  readOnly
                  className="flex-1 px-3 py-2 bg-white/30 backdrop-blur-md border border-white/40 rounded-md text-sm shadow-inner"
                />
                <Button
                  onClick={() => copyToClipboard(uploadedFile.shareUrl)}
                  size="sm"
                  className="bg-gradient-to-r from-blue-500/90 to-indigo-600/90 hover:from-blue-600/90 hover:to-indigo-700/90 shadow-lg backdrop-blur-sm border border-white/30"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button
                onClick={resetUpload}
                variant="outline"
                className="bg-white/20 backdrop-blur-lg border-white/40 hover:bg-white/30 shadow-lg"
              >
                Upload Another File
              </Button>
              <Button
                onClick={() => window.open(uploadedFile.shareUrl, '_blank')}
                className="bg-gradient-to-r from-green-500/90 to-emerald-600/90 hover:from-green-600/90 hover:to-emerald-700/90 transition-all duration-300 shadow-lg backdrop-blur-sm border border-white/30"
              >
                Test Download
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default FileUpload;
