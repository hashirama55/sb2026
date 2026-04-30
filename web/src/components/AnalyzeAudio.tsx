'use client';

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, Mic, Upload, FileAudio, X } from 'lucide-react';
import { AnalysisResponse } from '@/lib/types';

interface AnalyzeAudioProps {
  onAnalysisComplete: (result: AnalysisResponse) => void;
}

export function AnalyzeAudio({ onAnalysisComplete }: AnalyzeAudioProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleClearFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/analyze/audio`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Audio analysis failed');
      }

      onAnalysisComplete(data);
    } catch (error: any) {
      console.error('Error:', error);
      alert(error.message || 'Failed to analyze audio. Please ensure the backend is running and the file is a valid audio format.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Check Audio File</CardTitle>
        <CardDescription>
          Upload a voice note or recorded call to detect deepfakes or scam intent.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="audio-upload">Voice Note / Audio Clip</Label>
          
          {!file ? (
            <div 
              className="border-2 border-dashed rounded-lg p-12 text-center hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                MP3, WAV, or AAC (Max 10MB)
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg border border-border">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded">
                  <FileAudio className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium truncate max-w-[200px] md:max-w-xs">
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleClearFile}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          <input
            id="audio-upload"
            type="file"
            accept="audio/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </div>

        <Button 
          className="w-full" 
          onClick={handleAnalyze} 
          disabled={!mounted || loading || !file}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing Audio...
            </>
          ) : (
            <>
              <Mic className="mr-2 h-4 w-4" />
              Analyze Audio Reality
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
