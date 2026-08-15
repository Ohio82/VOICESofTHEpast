/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { HistoricalScenario } from '../types';
import { generateBranchingScenario } from '../services/geminiService';
import { XIcon, SparklesIcon, Loader2Icon, GitForkIcon } from 'lucide-react';

interface BranchingModalProps {
  scenario: HistoricalScenario;
  onSelectBranch: (newScenario: HistoricalScenario) => void;
  onClose: () => void;
}

const PRESET_BRANCHES = [
  "What if an unexpected storm struck at this exact moment?",
  "What if trade routes were abruptly closed by local authorities?",
  "What if a foreign diplomat arrived unexpectedly with urgent news?",
  "What if a festival was canceled due to a royal decree?"
];

export const BranchingModal: React.FC<BranchingModalProps> = ({ scenario, onSelectBranch, onClose }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBranch = async (customQuery?: string) => {
    const q = customQuery || query;
    if (!q.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const newScenario = await generateBranchingScenario(scenario, q);
      onSelectBranch(newScenario);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to generate branching scenario.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl p-6 space-y-6">
        
        <div className="flex items-center justify-between border-b border-stone-200 dark:border-slate-800 pb-4">
          <h3 className="font-serif-display font-bold text-xl text-stone-900 dark:text-slate-100 flex items-center gap-2">
            <GitForkIcon size={20} className="text-amber-600 dark:text-amber-400" />
            AI Counterfactual "What-If" Branch
          </h3>
          <button onClick={onClose} className="p-2 rounded-lg text-stone-400 hover:bg-stone-200 dark:hover:bg-slate-800">
            <XIcon size={20} />
          </button>
        </div>

        <p className="text-sm text-stone-600 dark:text-slate-400">
          Prompt AI to alter the historical conditions and generate a new dialogue and snapshot reflecting the counterfactual shift.
        </p>

        <div className="space-y-3">
          <label className="block text-xs uppercase tracking-wider text-stone-500 font-semibold">Suggested What-If Prompts</label>
          <div className="grid grid-cols-1 gap-2">
            {PRESET_BRANCHES.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleBranch(preset)}
                disabled={isLoading}
                className="text-left text-xs p-3 rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800/50 hover:border-amber-500 dark:hover:border-amber-500 hover:bg-amber-50/50 dark:hover:bg-amber-900/10 transition-all text-stone-700 dark:text-slate-300"
              >
                ✨ {preset}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs uppercase tracking-wider text-stone-500 font-semibold">Custom What-If Alteration</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., What if gold prices plummeted overnight?"
              className="flex-1 bg-stone-50 dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-stone-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              onClick={() => handleBranch()}
              disabled={isLoading || !query.trim()}
              className="bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center shadow-md"
            >
              {isLoading ? <Loader2Icon size={18} className="animate-spin" /> : <SparklesIcon size={18} />}
            </button>
          </div>
        </div>

        {error && (
          <p className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">{error}</p>
        )}

      </div>
    </div>
  );
};
