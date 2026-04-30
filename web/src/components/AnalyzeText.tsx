'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Search } from 'lucide-react';
import { AnalysisResponse } from '@/lib/types';

interface AnalyzeTextProps {
  onAnalysisComplete: (result: AnalysisResponse) => void;
}

export function AnalyzeText({ onAnalysisComplete }: AnalyzeTextProps) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleAnalyze = async () => {
    if (!text.trim()) return;

    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/analyze/text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Analysis failed');
      }

      onAnalysisComplete(data);
    } catch (error: any) {
      console.error('Error:', error);
      alert(error.message || 'Failed to analyze text. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Analyze Message</CardTitle>
        <CardDescription>
          Paste a suspicious message, email, or job offer below to check for potential scams.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="message">Suspicious Text</Label>
          <Textarea
            id="message"
            placeholder="Paste message here..."
            className="min-h-[150px]"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <Button 
          className="w-full" 
          onClick={handleAnalyze} 
          disabled={!mounted || loading || !text.trim()}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Check for Scams
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
