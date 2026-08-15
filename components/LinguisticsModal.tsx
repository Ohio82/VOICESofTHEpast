/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useEffect, useState } from 'react';
import { HistoricalScenario, LinguisticAnalysis } from '../types';
import { fetchLinguisticAnalysis } from '../services/geminiService';
import { XIcon, BookOpenIcon, Loader2Icon } from 'lucide-react';

interface LinguisticsModalProps {
  scenario: HistoricalScenario;
  onClose: () => void;
}

export const LinguisticsModal: React.FC<LinguisticsModalProps> = ({ scenario, onClose }) => {
  const [analysis, setAnalysis] = useState<LinguisticAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLinguisticAnalysis(scenario)
      .then(data => {
        setAnalysis(data);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err.message || "Failed to load linguistic analysis.");
        setIsLoading(false);
      });
  }, [scenario]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl p-6 flex flex-col max-h-[85vh]">
        
        <div className="flex items-center justify-between border-b border-stone-200 dark:border-slate-800 pb-4 mb-4">
          <h3 className="font-serif-display font-bold text-xl text-stone-900 dark:text-slate-100 flex items-center gap-2">
            <BookOpenIcon size={20} className="text-amber-600 dark:text-amber-400" />
            AI Language & Dialect Etymology Analyzer
          </h3>
          <button onClick={onClose} className="p-2 rounded-lg text-stone-400 hover:bg-stone-200 dark:hover:bg-slate-800">
            <XIcon size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-6 pr-1">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-16 space-y-3">
              <Loader2Icon size={36} className="animate-spin text-amber-500" />
              <p className="text-sm text-stone-500">Analyzing linguistic roots and vernacular...</p>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-4 rounded-xl">{error}</p>
          )}

          {!isLoading && !error && analysis && (
            <>
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-500/30 p-4 rounded-xl space-y-1">
                <span className="text-xs uppercase font-bold tracking-wider text-amber-700 dark:text-amber-400">Language / Dialect Profile</span>
                <h4 className="font-serif-display text-xl font-bold text-stone-900 dark:text-slate-100">{analysis.languageName}</h4>
                <p className="text-sm text-stone-600 dark:text-slate-300 font-light">{analysis.dialectOrEra}</p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs uppercase tracking-wider text-stone-500 font-bold">Key Historical Vocabulary & Etymology</h4>
                <div className="grid grid-cols-1 gap-3">
                  {analysis.keyVocabulary?.map((item, idx) => (
                    <div key={idx} className="bg-stone-50 dark:bg-slate-800/50 border border-stone-200 dark:border-slate-700 p-4 rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                      <div>
                        <span className="font-serif-display font-bold text-amber-800 dark:text-amber-300 text-base">{item.term}</span>
                        <p className="text-xs text-stone-500 dark:text-slate-400 italic">Root: {item.root}</p>
                      </div>
                      <span className="text-sm bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-700 px-3 py-1.5 rounded-lg text-stone-700 dark:text-slate-300">
                        {item.meaning}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs uppercase tracking-wider text-stone-500 font-bold">Phonetic & Pronunciation Notes</h4>
                <p className="text-sm text-stone-700 dark:text-slate-300 leading-relaxed bg-stone-50 dark:bg-slate-800/50 p-4 rounded-xl border border-stone-200 dark:border-slate-700 font-light">
                  {analysis.phoneticNotes}
                </p>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
