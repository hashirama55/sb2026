'use client';

import React, { useState } from 'react';
import { AnalyzeText } from '@/components/AnalyzeText';
import { AnalyzeAudio } from '@/components/AnalyzeAudio';
import { RiskDisplay } from '@/components/RiskDisplay';
import { AnalysisResponse } from '@/lib/types';
import { ShieldCheck, ShieldAlert, History, MessageSquare, Mic } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Home() {
  const [result, setResult] = useState<AnalysisResponse | null>(null);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-6">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <ShieldCheck className="text-white h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">ScamGuard AI</h1>
          </div>
          <p className="text-sm text-muted-foreground hidden md:block">
            Protecting you from deceptive messages and deepfake audio.
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold mb-4 text-slate-900 dark:text-white">
            Is it real or a scam?
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Our AI analyzes patterns, intent, and audio signatures to help you stay safe online.
          </p>
        </div>

        <Tabs defaultValue="text" className="space-y-8">
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="text" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Analyze Text
              </TabsTrigger>
              <TabsTrigger value="audio" className="flex items-center gap-2">
                <Mic className="h-4 w-4" />
                Check Audio
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="text" className="space-y-8">
            <AnalyzeText onAnalysisComplete={setResult} />
          </TabsContent>

          <TabsContent value="audio" className="space-y-8">
            <AnalyzeAudio onAnalysisComplete={setResult} />
          </TabsContent>
        </Tabs>

        {result && (
          <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-2 mb-4">
              <History className="h-5 w-5 text-slate-400" />
              <h3 className="text-lg font-medium text-slate-500">Analysis Result</h3>
            </div>
            <RiskDisplay result={result} />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 dark:border-slate-800 mt-12 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© 2026 ScamGuard AI Prototype. Developed for social safety and awareness.</p>
        </div>
      </footer>
    </main>
  );
}
