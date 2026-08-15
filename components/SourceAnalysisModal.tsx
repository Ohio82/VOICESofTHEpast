/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useEffect, useState } from 'react';
import { HistoricalScenario, SourceAnalysis } from '../types';
import { fetchSourceAnalysis } from '../services/geminiService';
import { XIcon, ShieldCheckIcon, Loader2Icon } from 'lucide-react';

interface SourceAnalysisModalProps {
  scenario: HistoricalScenario;
  onClose: () => void;
}

export const SourceAnalysisModal: React.FC<SourceAnalysisModalProps> = ({ scenario, onClose }) => {
  const [analysis, setAnalysis] = useState<SourceAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSourceAnalysis(scenario)
      .then(data => {
        setAnalysis(data);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err.message || "Failed to load source analysis.");
        setIsLoading(false);
      });
  }, [scenario]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 w-full max-w-xl rounded-2xl shadow-2xl p-6 flex flex-col max-h-[85vh]">
        
        <div className="flex items-center justify-between border-b border-stone-200 dark:border-slate-800 pb-4 mb-4">
          <h3 className="font-serif-display font-bold text-xl text-stone-900 dark:text-slate-100 flex items-center gap-2">
            <ShieldCheckIcon size={20} className="text-amber-600 dark:text-amber-400" />
            AI Primary Source & Credibility Inspector
          </h3>
          <button onClick={onClose} className="p-2 rounded-lg text-stone-400 hover:bg-stone-200 dark:hover:bg-slate-800">
            <XIcon size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-6 pr-1">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-16 space-y-3">
              <Loader2Icon size={36} className="animate-spin text-amber-500" />
              <p className="text-sm text-stone-500">Evaluating historical citations & primary sources...</p>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-4 rounded-xl">{error}</p>
          )}

          {!isLoading && !error && analysis && (
            <>
              <div className="bg-stone-50 dark:bg-slate-800/50 border border-stone-200 dark:border-slate-700 p-6 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase font-bold tracking-wider text-stone-500 block mb-1">Grounding Credibility Index</span>
                  <h4 className="font-serif-display text-2xl font-bold text-stone-900 dark:text-slate-100">Verified Historical Match</h4>
                </div>
                <div className="w-16 h-16 rounded-full bg-amber-500/10 dark:bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center text-amber-700 dark:text-amber-300 font-bold text-xl font-mono">
                  {analysis.credibilityScore}%
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs uppercase tracking-wider text-stone-500 font-bold">Primary Sources & Evidence Summary</h4>
                <p className="text-sm text-stone-700 dark:text-slate-300 leading-relaxed bg-stone-50 dark:bg-slate-800/50 p-4 rounded-xl border border-stone-200 dark:border-slate-700 font-light">
                  {analysis.primarySourcesSummary}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs uppercase tracking-wider text-stone-500 font-bold">Historical Context Nuance & Historiography</h4>
                <p className="text-sm text-stone-700 dark:text-slate-300 leading-relaxed bg-stone-50 dark:bg-slate-800/50 p-4 rounded-xl border border-stone-200 dark:border-slate-700 font-light">
                  {analysis.historicalContextNuance}
                </p>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
