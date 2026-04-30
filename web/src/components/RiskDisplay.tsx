import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, ShieldAlert, Info } from 'lucide-react';
import { AnalysisResponse } from '@/lib/types';
import { cn } from '@/lib/utils';

interface RiskDisplayProps {
  result: AnalysisResponse;
}

export function RiskDisplay({ result }: RiskDisplayProps) {
  const isHighRisk = result.risk_score > 70;
  const isMediumRisk = result.risk_score > 30 && result.risk_score <= 70;
  const isLowRisk = result.risk_score <= 30;

  return (
    <Card className={cn(
      "w-full border-2",
      isHighRisk ? "border-red-500" : isMediumRisk ? "border-yellow-500" : "border-green-500"
    )}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl flex items-center gap-2">
            {isHighRisk ? (
              <ShieldAlert className="text-red-500 h-8 w-8" />
            ) : isMediumRisk ? (
              <AlertCircle className="text-yellow-500 h-8 w-8" />
            ) : (
              <CheckCircle className="text-green-500 h-8 w-8" />
            )}
            Analysis Result: {result.is_scam ? "Potential Scam Detected" : "Low Risk Detected"}
          </CardTitle>
          <Badge variant={isHighRisk ? "destructive" : isMediumRisk ? "secondary" : "default"} className="text-lg px-3 py-1">
            {result.risk_score}% Risk
          </Badge>
        </div>
        <CardDescription className="text-lg">
          Category: <strong>{result.category}</strong>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-muted rounded-lg border border-border">
          <h4 className="font-semibold flex items-center gap-2 mb-2">
            <Info className="h-4 w-4" />
            Summary
          </h4>
          <p className="text-muted-foreground">{result.summary}</p>
        </div>

        {result.red_flags.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-red-600 dark:text-red-400">🚩 Red Flags Identified</h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {result.red_flags.map((flag, index) => (
                <li key={index} className="flex items-start gap-2 text-sm p-2 bg-red-50 dark:bg-red-950/30 rounded border border-red-100 dark:border-red-900">
                  <span className="mt-1">•</span>
                  {flag}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg">
          <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-1">💡 What should you do?</h4>
          <p className="text-blue-700 dark:text-blue-400 text-sm font-medium">{result.recommendation}</p>
        </div>
      </CardContent>
    </Card>
  );
}
