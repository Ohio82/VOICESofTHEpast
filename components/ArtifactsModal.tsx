/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useEffect, useState } from 'react';
import { HistoricalScenario, Artifact } from '../types';
import { fetchHistoricalArtifacts } from '../services/geminiService';
import { XIcon, PackageIcon, Loader2Icon } from 'lucide-react';

interface ArtifactsModalProps {
  scenario: HistoricalScenario;
  onClose: () => void;
}

export const ArtifactsModal: React.FC<ArtifactsModalProps> = ({ scenario, onClose }) => {
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHistoricalArtifacts(scenario)
      .then(data => {
        setArtifacts(data);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err.message || "Failed to load artifacts.");
        setIsLoading(false);
      });
  }, [scenario]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl p-6 flex flex-col max-h-[85vh]">
        
        <div className="flex items-center justify-between border-b border-stone-200 dark:border-slate-800 pb-4 mb-4">
          <h3 className="font-serif-display font-bold text-xl text-stone-900 dark:text-slate-100 flex items-center gap-2">
            <PackageIcon size={20} className="text-amber-600 dark:text-amber-400" />
            AI Historical Relics & Artifacts Explorer
          </h3>
          <button onClick={onClose} className="p-2 rounded-lg text-stone-400 hover:bg-stone-200 dark:hover:bg-slate-800">
            <XIcon size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-16 space-y-3">
              <Loader2Icon size={36} className="animate-spin text-amber-500" />
              <p className="text-sm text-stone-500">Unearthing historical artifacts...</p>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-4 rounded-xl">{error}</p>
          )}

          {!isLoading && !error && artifacts.map((art, idx) => (
            <div key={idx} className="bg-stone-50 dark:bg-slate-800/50 border border-stone-200 dark:border-slate-700/80 rounded-xl p-5 space-y-2">
              <div className="flex justify-between items-start">
                <h4 className="font-serif-display font-bold text-lg text-amber-800 dark:text-amber-300">{art.name}</h4>
                <span className="text-xs font-mono uppercase bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2.5 py-1 rounded-full">
                  {art.origin}
                </span>
              </div>
              <p className="text-sm text-stone-700 dark:text-slate-300 leading-relaxed">{art.description}</p>
              <div className="pt-2 border-t border-stone-200 dark:border-slate-700/50">
                <span className="text-xs uppercase tracking-wider text-stone-400 font-bold block mb-1">Historical Significance</span>
                <p className="text-xs text-stone-600 dark:text-slate-400 font-light">{art.historicalSignificance}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
