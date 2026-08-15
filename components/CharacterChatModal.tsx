/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { Character, HistoricalScenario, ChatMessage } from '../types';
import { chatWithCharacterResponse } from '../services/geminiService';
import { XIcon, SendIcon, Loader2Icon, MessageSquareIcon } from 'lucide-react';

interface CharacterChatModalProps {
  character: Character;
  scenario: HistoricalScenario;
  onClose: () => void;
}

export const CharacterChatModal: React.FC<CharacterChatModalProps> = ({ character, scenario, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: character.name,
      text: `Greetings, traveler. I am ${character.name}. What would you know of our world here in ${scenario.context.substring(0, 40)}...?`,
      isUser: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    const newMessages: ChatMessage[] = [
      ...messages,
      { sender: 'You', text: userMsg, isUser: true, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await chatWithCharacterResponse(character.name, userMsg, scenario);
      setMessages([
        ...newMessages,
        {
          sender: character.name,
          text: response.text,
          translation: response.translation,
          isUser: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err: any) {
      setMessages([
        ...newMessages,
        {
          sender: character.name,
          text: `[The traveler's words seem lost in time: ${err.message || 'Error communicating'}]`,
          isUser: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl flex flex-col h-[600px] overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-stone-200 dark:border-slate-800 flex items-center justify-between bg-stone-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            {character.avatarUrl ? (
              <img src={character.avatarUrl} alt={character.name} className="w-10 h-10 rounded-full object-cover border border-amber-500/40" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold">
                {character.name[0]}
              </div>
            )}
            <div>
              <h3 className="font-serif-display font-bold text-stone-900 dark:text-slate-100 flex items-center gap-2">
                <MessageSquareIcon size={16} className="text-amber-600 dark:text-amber-400" />
                Chat with {character.name}
              </h3>
              <p className="text-xs text-stone-500 dark:text-slate-400">AI Historical Persona</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-stone-400 hover:bg-stone-200 dark:hover:bg-slate-800 transition-colors">
            <XIcon size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 font-serif-display">
          {messages.map((msg, i) => (
            <div key={i} className={`flex flex-col ${msg.isUser ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
                msg.isUser 
                  ? 'bg-amber-600 text-white rounded-br-none' 
                  : 'bg-stone-100 dark:bg-slate-800 text-stone-800 dark:text-slate-200 rounded-bl-none border border-stone-200/50 dark:border-slate-700/50'
              }`}>
                <div className="text-[10px] uppercase font-bold tracking-wider opacity-75 mb-1">{msg.sender} • {msg.timestamp}</div>
                <p className="text-base leading-relaxed">"{msg.text}"</p>
                {msg.translation && (
                  <p className="text-xs opacity-80 italic mt-2 font-sans border-l border-current pl-2">"{msg.translation}"</p>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 text-stone-400 dark:text-slate-500 text-sm py-2">
              <Loader2Icon size={16} className="animate-spin text-amber-500" /> {character.name} is reflecting...
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-4 border-t border-stone-200 dark:border-slate-800 bg-stone-50/50 dark:bg-slate-900/80 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask ${character.name} a question...`}
            className="flex-1 bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-stone-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center shadow-md"
          >
            <SendIcon size={18} />
          </button>
        </form>

      </div>
    </div>
  );
};
